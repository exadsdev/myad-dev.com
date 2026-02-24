// src/app/admin/page.jsx
"use client";

import React, { useEffect, useMemo, useState, startTransition } from "react";
import Nav from "./Nav";

const RAW_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_ORIGIN ||
  "https://myad-dev.com";
const BASE_PUBLIC_URL = RAW_SITE.replace(/\/+$/, "");

const emptyPost = {
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  tags: [],
  author: "ทีมบทความ",
  thumbnail: "",
  contentHtml: "<p>เนื้อหาบทความ…</p>",
  keywords: [],
  faqs: [],
};

function safeStr(v) {
  return String(v ?? "").replace(/\u0000/g, "").trim();
}

function stripHtmlToText(html = "") {
  const s = String(html || "");
  return s
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function parseFaqRaw(raw = "") {
  const lines = safeStr(raw)
    .split("\n")
    .map((s) => safeStr(s))
    .filter(Boolean);

  const faqs = [];

  let currentQ = "";
  let currentA = [];

  const pushQA = () => {
    const q = safeStr(currentQ);
    const a = safeStr(currentA.join("\n"));
    if (q && a) faqs.push({ q, a });
    currentQ = "";
    currentA = [];
  };

  let usedQAStyle = false;

  for (const line of lines) {
    const mQ = line.match(/^(Q|คำถาม)\s*[:：]\s*(.+)$/i);
    const mA = line.match(/^(A|คำตอบ)\s*[:：]\s*(.+)$/i);

    if (mQ) {
      usedQAStyle = true;
      pushQA();
      currentQ = mQ[2].trim();
      continue;
    }
    if (mA) {
      usedQAStyle = true;
      currentA.push(mA[2].trim());
      continue;
    }

    if (usedQAStyle) {
      if (safeStr(currentQ)) currentA.push(line);
      continue;
    }
  }

  if (usedQAStyle) {
    pushQA();
    return faqs;
  }

  // fallback: ประโยคลงท้าย ? ถือเป็นคำถาม
  let q = "";
  let a = [];

  const pushB = () => {
    const qq = safeStr(q);
    const aa = safeStr(a.join("\n"));
    if (qq && aa) faqs.push({ q: qq, a: aa });
    q = "";
    a = [];
  };

  for (const line of lines) {
    const isQuestion = /[?？]$/.test(line) || /^-\s*\S+.*[?？]$/.test(line);
    if (isQuestion) {
      pushB();
      q = line.replace(/^-+\s*/, "").trim();
      continue;
    }
    if (safeStr(q)) a.push(line);
  }
  pushB();

  return faqs;
}

function buildFaqsFromSource(raw = "", max = 8) {
  const faqs = parseFaqRaw(raw);
  const seen = new Set();
  const out = [];
  for (const f of faqs) {
    const key = safeStr(f.q).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ q: safeStr(f.q), a: safeStr(f.a) });
    if (out.length >= max) break;
  }
  return out;
}

function normalizeThumbnail(thumbnail) {
  if (!thumbnail) return "";
  if (thumbnail.startsWith(BASE_PUBLIC_URL)) {
    return thumbnail.slice(BASE_PUBLIC_URL.length) || "";
  }
  return thumbnail;
}

function resolveThumbnailUrl(thumbnail) {
  if (!thumbnail) return "/images/og-default.jpg";
  if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
    return thumbnail;
  }
  return `${BASE_PUBLIC_URL}${thumbnail.startsWith("/") ? "" : "/"}${thumbnail}`;
}

async function uploadImageFile(file, opts = {}) {
  if (!file) return null;
  const { folder = "blog", slug = "" } = opts;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  if (slug) fd.append("slug", slug);

  const res = await fetch("/api/admin/uploads", {
    method: "POST",
    body: fd,
  });

  let j = {};
  try {
    j = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(j?.error || j?.message || "อัปโหลดไม่สำเร็จ");
  }

  return j?.url || j?.path || null;
}

export default function AdminPosts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyPost);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");

  const [thumbTab, setThumbTab] = useState("url");
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbUploading, setThumbUploading] = useState(false);

  // FAQ แบบใน Admin Video
  const [rawFaq, setRawFaq] = useState("");
  const [autoFaqs, setAutoFaqs] = useState(false);
  const [maxFaqs, setMaxFaqs] = useState(8);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/posts", { cache: "no-store" });
        const j = await res.json();
        if (!active) return;
        startTransition(() => setItems(j?.items || []));
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  async function reload() {
    const r = await fetch("/api/admin/posts", { cache: "no-store" });
    const j = await r.json();
    startTransition(() => setItems(j?.items || []));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMode && originalSlug) {
        await fetch(`/api/admin/posts?slug=${encodeURIComponent(originalSlug)}`, {
          method: "DELETE",
        });
      }

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setSaving(false);
      if (res.ok) {
        setForm(emptyPost);
        setRawFaq("");
        setAutoFaqs(false);
        setEditMode(false);
        setOriginalSlug("");
        await reload();
        alert(editMode ? "แก้ไขแล้ว (ลบเดิมและบันทึกใหม่)" : "บันทึกแล้ว");
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j?.error || j?.message || "ผิดพลาด");
      }
    } catch {
      setSaving(false);
      alert("ผิดพลาดระหว่างบันทึก");
    }
  };

  const onDelete = async (slug) => {
    if (!confirm(`ลบบทความ "${slug}"?`)) return;
    const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await reload();
      alert("ลบแล้ว");
      if (editMode && originalSlug === slug) {
        setForm(emptyPost);
        setRawFaq("");
        setAutoFaqs(false);
        setEditMode(false);
        setOriginalSlug("");
      }
    } else {
      alert("ลบไม่สำเร็จ");
    }
  };

  const onEdit = (post) => {
    const faqs = Array.isArray(post.faqs) ? post.faqs : [];
    setForm({
      slug: post.slug || "",
      title: post.title || "",
      date: post.date || new Date().toISOString().slice(0, 10),
      excerpt: post.excerpt || "",
      tags: Array.isArray(post.tags) ? post.tags : [],
      author: post.author || "ทีมบทความ",
      thumbnail: normalizeThumbnail(post.thumbnail || ""),
      contentHtml: post.contentHtml || "<p>เนื้อหาบทความ…</p>",
      keywords: Array.isArray(post.keywords) ? post.keywords : [],
      faqs,
    });

    // ถ้าเปิด Auto FAQ แล้ว อยากให้เอา FAQ เดิมมาทำ Raw FAQ ได้
    if (autoFaqs && faqs.length) {
      const raw = faqs.map((x) => `Q: ${safeStr(x.q)}\nA: ${safeStr(x.a)}\n`).join("\n");
      setRawFaq(raw.trim());
    } else {
      setRawFaq("");
    }

    setEditMode(true);
    setOriginalSlug(post.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return items.filter(
      (v) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.slug || "").toLowerCase().includes(q) ||
        (Array.isArray(v.keywords) ? v.keywords.join(" ").toLowerCase() : "").includes(q)
    );
  }, [items, filter]);

  const handleUploadThumbnail = async () => {
    if (!thumbFile) return;
    setThumbUploading(true);
    try {
      const urlOrPath = await uploadImageFile(thumbFile, { folder: "blog", slug: form.slug || form.title || "" });
      let thumbValue = urlOrPath || "";
      if (thumbValue.startsWith(BASE_PUBLIC_URL)) {
        thumbValue = thumbValue.slice(BASE_PUBLIC_URL.length);
      }
      setForm({ ...form, thumbnail: thumbValue });
      setThumbFile(null);
      setThumbTab("url");
      alert("อัปโหลดรูปเรียบร้อยแล้ว");
    } catch (e) {
      alert(e?.message || "อัปโหลดไม่สำเร็จ");
    } finally {
      setThumbUploading(false);
    }
  };

  const addFaq = () => {
    const next = [...(Array.isArray(form.faqs) ? form.faqs : []), { q: "", a: "" }];
    setForm({ ...form, faqs: next });
  };

  const updateFaq = (index, key, value) => {
    const arr = Array.isArray(form.faqs) ? [...form.faqs] : [];
    arr[index] = { ...(arr[index] || {}), [key]: value };
    setForm({ ...form, faqs: arr });
  };

  const removeFaq = (index) => {
    const arr = Array.isArray(form.faqs) ? [...form.faqs] : [];
    arr.splice(index, 1);
    setForm({ ...form, faqs: arr });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h1 className="h5 fw-bold mb-0">Admin — บทความ</h1>
        <Nav />
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <form className="card p-3 border-0 shadow-sm" onSubmit={onSubmit}>
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h6 fw-bold mb-3">{editMode ? "แก้ไขบทความ" : "สร้างบทความใหม่"}</h2>
              {editMode && <span className="badge text-bg-warning">โหมดแก้ไข (จะลบของเดิมแล้วบันทึกใหม่)</span>}
            </div>

            <label className="form-label">Slug</label>
            <input
              className="form-control mb-2"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.trim() })}
              required
            />

            <label className="form-label">Title</label>
            <input
              className="form-control mb-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <div className="row">
              <div className="col-6">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label">Author</label>
                <input
                  className="form-control mb-2"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
            </div>

            <label className="form-label">Excerpt</label>
            <textarea
              className="form-control mb-2"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />

            <label className="form-label mb-1">
              Thumbnail (เก็บ path เฉพาะหลัง <code>https://myad-dev.com</code>)
            </label>

            <div className="btn-group mb-2" role="group">
              <button
                type="button"
                className={`btn btn-sm ${thumbTab === "url" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setThumbTab("url")}
              >
                ใส่ Path เอง
              </button>
              <button
                type="button"
                className={`btn btn-sm ${thumbTab === "upload" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setThumbTab("upload")}
              >
                อัปโหลด
              </button>
            </div>

            {thumbTab === "url" ? (
              <input
                className="form-control mb-3"
                placeholder="/blog/thumb1.jpg"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value.trim() })}
              />
            ) : (
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                />
                <div className="d-flex gap-2 align-items-center mb-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleUploadThumbnail}
                    disabled={!thumbFile || thumbUploading}
                  >
                    {thumbUploading ? "กำลังอัปโหลด…" : "อัปโหลดขึ้นเซิร์ฟเวอร์"}
                  </button>
                  <span className="small text-muted">
                    โฟลเดอร์: <code>/uploads/blog/</code>
                  </span>
                </div>

                <img
                  src={resolveThumbnailUrl(form.thumbnail)}
                  alt="preview"
                  style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
                />
              </div>
            )}

            <label className="form-label">Tags (คั่นด้วย ,)</label>
            <input
              className="form-control mb-3"
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />

            <label className="form-label">Keywords (คั่นด้วย ,)</label>
            <input
              className="form-control mb-3"
              value={form.keywords.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  keywords: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />

            <label className="form-label">เนื้อหา (HTML)</label>
            <textarea
              className="form-control mb-3"
              rows={8}
              value={form.contentHtml}
              onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
            />

            {/* ✅ FAQ Generator แบบเดียวกับ Admin Video */}
            <div className="border rounded p-2 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label mb-0">FAQ Generator (จาก Raw FAQ / เนื้อหา)</label>

                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="autoFaqsPosts"
                      checked={autoFaqs}
                      onChange={(e) => setAutoFaqs(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="autoFaqsPosts">
                      Auto FAQ
                    </label>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-muted">จำนวน</span>
                    <input
                      className="form-control form-control-sm"
                      style={{ width: 90 }}
                      type="number"
                      min={3}
                      max={20}
                      value={maxFaqs}
                      onChange={(e) => setMaxFaqs(Number(e.target.value || 8))}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      const src = safeStr(rawFaq)
                        ? rawFaq
                        : stripHtmlToText(form.contentHtml || "");
                      if (!safeStr(src)) return alert("กรุณาใส่ Raw FAQ หรือมีเนื้อหาในบทความก่อน");
                      const gen = buildFaqsFromSource(src, maxFaqs);
                      if (!gen.length) return alert("ไม่สามารถแปลง FAQ ได้ (ลองใช้รูปแบบ Q:/A: หรือคำถามลงท้าย ?)");
                      setForm((p) => ({ ...p, faqs: gen }));
                      alert(`แปลง FAQ สำเร็จ (${gen.length} ข้อ) และใส่ลงในรายการ FAQ แล้ว`);
                    }}
                  >
                    Generate FAQ → ใส่ในรายการ FAQ
                  </button>
                </div>
              </div>

              <label className="form-label mt-2">Raw FAQ (ออปชัน) — ถ้าใส่ ระบบจะใช้ช่องนี้ก่อน</label>
              <textarea
                className="form-control"
                rows={6}
                value={rawFaq}
                onChange={(e) => setRawFaq(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-0">FAQ (อย่างน้อย 3 ข้อ)</label>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={addFaq}>
                + เพิ่ม FAQ
              </button>
            </div>

            <div className="border rounded p-2 mb-3">
              {(form.faqs || []).length === 0 ? (
                <div className="text-muted small">ยังไม่มี FAQ</div>
              ) : (
                (form.faqs || []).map((f, i) => (
                  <div className="mb-2" key={`faq-${i}`}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-semibold small">ข้อที่ {i + 1}</div>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeFaq(i)}>
                        ลบ
                      </button>
                    </div>

                    <input
                      className="form-control form-control-sm mb-1"
                      value={f.q || ""}
                      onChange={(e) => updateFaq(i, "q", e.target.value)}
                      placeholder="คำถาม"
                    />

                    <textarea
                      className="form-control form-control-sm"
                      rows={2}
                      value={f.a || ""}
                      onChange={(e) => updateFaq(i, "a", e.target.value)}
                      placeholder="คำตอบ (รองรับ HTML)"
                    />

                    <div className="small text-muted mt-1">
                      <div
                        className="border rounded p-2 bg-light"
                        dangerouslySetInnerHTML={{ __html: String(f.a || "") }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled={saving} type="submit">
                {saving ? "กำลังบันทึก…" : editMode ? "บันทึกการแก้ไข" : "บันทึก"}
              </button>

              {editMode && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setForm(emptyPost);
                    setRawFaq("");
                    setAutoFaqs(false);
                    setEditMode(false);
                    setOriginalSlug("");
                    setThumbFile(null);
                    setThumbTab("url");
                  }}
                >
                  ยกเลิกแก้ไข
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card p-3 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 fw-bold mb-0">รายการบทความ</h2>
              <input
                className="form-control form-control-sm"
                style={{ maxWidth: 260 }}
                placeholder="ค้นหา… (title/slug/keywords)"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>รูป</th>
                    <th>Slug</th>
                    <th style={{ width: 220 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, idx) => (
                    <tr key={`${v.slug}-${idx}`}>
                      <td>
                        <img
                          src={resolveThumbnailUrl(v.thumbnail)}
                          alt=""
                          width={120}
                          height={68}
                          style={{ objectFit: "cover", borderRadius: 8 }}
                        />
                      </td>

                      <td className="small text-muted">{v.slug}</td>

                      <td className="text-end">
                        <a
                          className="btn btn-outline-secondary btn-sm me-2"
                          href={`/blog/${v.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          ดู
                        </a>
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => onEdit(v)}>
                          แก้ไข
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(v.slug)}>
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted small">
                        ยังไม่มีบทความ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
