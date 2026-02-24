// src/app/admin/videos/page.jsx

"use client";

import React, { useEffect, useMemo, useState, startTransition } from "react";
import Nav from "../Nav";
import JsonLdVideo from "../../../components/JsonLdVideo";

const RAW_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_ORIGIN ||
  "https://myad-dev.com";
const BASE_PUBLIC_URL = RAW_SITE.replace(/\/+$/, "");

const emptyVideo = {
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  description: "",
  highlights: [],
  youtube: "",
  tags: [],
  author: "ทีมวิดีโอ",
  duration: "PT5M",
  thumbnail: "",
  contentHtml: "<p>สรุป/ไฮไลท์วิดีโอ…</p>",
  keywords: [],
  transcriptHtml: "",
  faqs: [],
  chapters: [],
};

function extractYoutubeId(input = "") {
  const s = String(input).trim();
  if (!s) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      const parts = u.pathname.split("/");
      const last = parts[parts.length - 1];
      if (/^[a-zA-Z0-9_-]{11}$/.test(last)) return last;
    }
    if (u.hostname === "youtu.be") {
      const last = u.pathname.replace("/", "");
      if (/^[a-zA-Z0-9_-]{11}$/.test(last)) return last;
    }
  } catch { }
  return "";
}

// ✅ PATCH: รองรับทั้ง string/array + ตัดซ้ำ + normalize ช่องว่าง
function normalizeCsv(input) {
  // ✅ รับได้ทั้ง string และ array และตัดซ้ำแบบ case-insensitive
  const arr = Array.isArray(input) ? input : String(input ?? "").split(",");

  const out = [];
  const seen = new Set();

  for (const t of arr) {
    const s = String(t ?? "").trim().replace(/\s+/g, " ");
    if (!s) continue;

    const key = s.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    out.push(s);
  }

  return out;
}

function safeStr(v, fallback = "") {
  const s = String(v ?? "").trim();
  return s || fallback;
}

function isValidIso8601Duration(s = "") {
  return /^P(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)$/.test(String(s).trim());
}

function normalizeThumbnail(thumbnail) {
  if (!thumbnail) return "";
  if (thumbnail.startsWith(BASE_PUBLIC_URL)) {
    return thumbnail.slice(BASE_PUBLIC_URL.length) || "";
  }
  return thumbnail;
}

function resolveThumbnailUrl(thumbnail) {
  if (!thumbnail) return "";
  if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
    return thumbnail;
  }
  return `${BASE_PUBLIC_URL}${thumbnail.startsWith("/") ? "" : "/"}${thumbnail}`;
}

async function uploadImageFile(file, opts = {}) {
  if (!file) return null;
  const { folder = "videos", slug = "" } = opts;

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
  } catch { }

  if (!res.ok) {
    throw new Error(j?.error || j?.message || "อัปโหลดไม่สำเร็จ");
  }

  return j?.url || j?.path || null;
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseTranscriptRaw(raw = "") {
  const lines = String(raw || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items = [];
  for (const line of lines) {
    const m = line.match(/^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*(.*)$/);
    if (m) items.push({ tc: m[1], text: (m[2] || "").trim() });
    else items.push({ tc: "", text: line });
  }
  return items;
}

function buildTranscriptHtmlFromRaw(raw = "") {
  const items = parseTranscriptRaw(raw);
  if (!items.length) return "";

  const html = items
    .map(({ tc, text }) => {
      const safeText = escapeHtml(text);
      if (tc) {
        const safeTc = escapeHtml(tc);
        return `<p class="mb-2"><span class="badge text-bg-secondary me-2">${safeTc}</span>${safeText}</p>`;
      }
      return `<p class="mb-2">${safeText}</p>`;
    })
    .join("");

  return `<div class="transcript">${html}</div>`;
}

function guessLabel(text = "") {
  const s = String(text || "").trim();
  if (!s) return "";
  const words = s.split(/\s+/).filter(Boolean);
  const take = words.slice(0, 10).join(" ");
  if (take.length <= 60) return take;
  return take.slice(0, 60).trim() + "…";
}

function buildChaptersFromRawTranscript(raw = "") {
  const items = parseTranscriptRaw(raw);
  const chapters = [];

  for (const it of items) {
    if (!it.tc) continue;
    const label = guessLabel(it.text);
    if (!label) continue;
    chapters.push({ t: it.tc, label });
  }

  const seen = new Set();
  const out = [];
  for (const c of chapters) {
    const key = String(c.t || "").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ t: key, label: c.label });
  }

  return out;
}

function parseFaqRaw(raw = "") {
  const lines = String(raw || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
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

function buildFaqsFromTranscript(raw = "", max = 8) {
  const items = parseTranscriptRaw(raw);
  if (!items.length) return [];

  const textOnly = items.map((x) => x.text).filter(Boolean).join("\n");
  const faqs = parseFaqRaw(textOnly);

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

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export default function AdminVideos() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyVideo);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");

  const [rawTranscript, setRawTranscript] = useState("");
  const [autoTranscript, setAutoTranscript] = useState(true);
  const [autoChapters, setAutoChapters] = useState(true);

  const [rawFaq, setRawFaq] = useState("");
  const [autoFaqs, setAutoFaqs] = useState(false);
  const [maxFaqs, setMaxFaqs] = useState(8);

  const [thumbTab, setThumbTab] = useState("url"); // "url" | "upload"
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbUploading, setThumbUploading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/videos", { cache: "no-store" });
        const j = await readJsonSafe(res);
        if (!active) return;
        startTransition(() => setItems(j?.items || []));
      } catch { }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function reload() {
    const r = await fetch("/api/admin/videos", { cache: "no-store" });
    const j = await readJsonSafe(r);
    startTransition(() => setItems(j?.items || []));
  }

  const onDelete = (slug) => {
    if (!confirm(`ต้องการลบวิดีโอ "${slug}" ใช่หรือไม่?`)) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/videos/${encodeURIComponent(slug)}`, {
          method: "DELETE",
        });

        const j = await readJsonSafe(res);

        if (!res.ok) {
          const msg =
            (j?.errors && Array.isArray(j.errors) && j.errors.join("\n")) ||
            j?.error ||
            j?.message ||
            "ลบไม่สำเร็จ";
          alert(msg);
          return;
        }

        setItems((prev) => (Array.isArray(prev) ? prev.filter((v) => v.slug !== slug) : []));
        alert("ลบแล้ว");
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการลบวิดีโอ");
        console.error(err);
      }
    });
  };

  const handleUploadThumbnail = async () => {
    if (!thumbFile) return;
    if (!safeStr(form.slug)) return alert("กรอก Slug ก่อน เพื่อใช้ตั้งชื่อไฟล์");

    setThumbUploading(true);
    try {
      const urlOrPath = await uploadImageFile(thumbFile, { folder: "videos", slug: form.slug });

      let thumbValue = urlOrPath || "";
      if (thumbValue.startsWith(BASE_PUBLIC_URL)) {
        thumbValue = thumbValue.slice(BASE_PUBLIC_URL.length);
      }

      setForm((p) => ({ ...p, thumbnail: thumbValue }));
      setThumbFile(null);
      setThumbTab("url");
      alert("อัปโหลดรูปเรียบร้อยแล้ว");
    } catch (e) {
      alert(e?.message || "อัปโหลดไม่สำเร็จ");
    } finally {
      setThumbUploading(false);
    }
  };

  function validateForm(v) {
    const errors = [];

    if (!safeStr(v.slug)) errors.push("กรุณากรอก Slug");
    if (!safeStr(v.title)) errors.push("กรุณากรอก Title");
    if (!safeStr(v.date)) errors.push("กรุณาเลือก Date");
    if (!safeStr(v.youtube)) errors.push("กรุณาใส่ YouTube URL/ID");
    if (!extractYoutubeId(v.youtube)) errors.push("YouTube URL/ID ไม่ถูกต้อง");
    if (v.duration && !isValidIso8601Duration(v.duration)) errors.push("Duration ต้องเป็น ISO 8601 เช่น PT5M30S");

    if (!safeStr(v.transcriptHtml)) errors.push("กรุณาใส่ Transcript (HTML) หรือใช้ Auto Transcript");

    const countFaq = Array.isArray(v.faqs) ? v.faqs.filter((x) => safeStr(x.q) && safeStr(x.a)).length : 0;
    if (countFaq < 3) errors.push("FAQ ควรมีอย่างน้อย 3 ข้อ (คำถาม+คำตอบ)");

    return errors;
  }

  const transcriptPreviewHtml = useMemo(() => {
    if (!autoTranscript) return safeStr(form.transcriptHtml);
    if (!safeStr(rawTranscript)) return safeStr(form.transcriptHtml);
    return buildTranscriptHtmlFromRaw(rawTranscript);
  }, [autoTranscript, rawTranscript, form.transcriptHtml]);

  const chaptersPreview = useMemo(() => {
    if (!autoChapters) return Array.isArray(form.chapters) ? form.chapters : [];
    if (!safeStr(rawTranscript)) return Array.isArray(form.chapters) ? form.chapters : [];
    const gen = buildChaptersFromRawTranscript(rawTranscript);
    return gen.length ? gen : Array.isArray(form.chapters) ? form.chapters : [];
  }, [autoChapters, rawTranscript, form.chapters]);

  const faqsPreview = useMemo(() => {
    if (autoFaqs && safeStr(rawFaq)) return buildFaqsFromTranscript(rawFaq, maxFaqs);
    if (autoFaqs && safeStr(rawTranscript)) return buildFaqsFromTranscript(rawTranscript, maxFaqs);
    return Array.isArray(form.faqs) ? form.faqs : [];
  }, [autoFaqs, rawFaq, rawTranscript, maxFaqs, form.faqs]);

  function applyAutoIntoForm(current) {
    const next = { ...current };

    if (autoTranscript && safeStr(rawTranscript)) {
      next.transcriptHtml = buildTranscriptHtmlFromRaw(rawTranscript);
    }

    if (autoChapters && safeStr(rawTranscript)) {
      const gen = buildChaptersFromRawTranscript(rawTranscript);
      if (gen.length) next.chapters = gen;
    }

    if (autoFaqs) {
      const src = safeStr(rawFaq) ? rawFaq : rawTranscript;
      const genFaqs = buildFaqsFromTranscript(src, maxFaqs);
      if (genFaqs.length) next.faqs = genFaqs;
    }

    return next;
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const prepared = applyAutoIntoForm(form);
    prepared.tags = normalizeCsv(form.tags);
    prepared.keywords = normalizeCsv(form.keywords);
    const errors = validateForm(prepared);
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    setSaving(true);
    try {
      if (editMode && originalSlug && originalSlug !== prepared.slug) {
        const del = await fetch(`/api/admin/videos?slug=${encodeURIComponent(originalSlug)}`, { method: "DELETE" });
        if (!del.ok) {
          const dj = await readJsonSafe(del);
          setSaving(false);
          alert((dj?.errors && dj.errors.join("\n")) || dj?.error || "ลบของเดิมไม่สำเร็จ (เปลี่ยน slug)");
          return;
        }
      }

      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prepared),
      });

      const j = await readJsonSafe(res);
      setSaving(false);

      if (res.ok) {
        setForm(emptyVideo);
        setRawTranscript("");
        setRawFaq("");
        setAutoFaqs(false);
        setEditMode(false);
        setOriginalSlug("");
        setThumbFile(null);
        setThumbTab("url");
        await reload();
        alert(editMode ? "แก้ไขแล้ว" : "บันทึกแล้ว");
      } else {
        if (j?.errors && Array.isArray(j.errors)) alert(j.errors.join("\n"));
        else alert(j?.error || j?.message || "ผิดพลาด");
      }
    } catch {
      setSaving(false);
      alert("ผิดพลาดระหว่างบันทึก");
    }
  };

  const onEdit = (video) => {
    setForm({
      slug: video.slug || "",
      title: video.title || "",
      date: video.date || new Date().toISOString().slice(0, 10),
      excerpt: video.excerpt || "",
      description: video.description || "",
      highlights: Array.isArray(video.highlights) ? video.highlights : [],
      youtube: video.youtube || "",
      tags: Array.isArray(video.tags) ? video.tags : [],
      author: video.author || "ทีมวิดีโอ",
      duration: video.duration || "PT5M",
      thumbnail: normalizeThumbnail(video.thumbnail || ""),
      contentHtml: video.contentHtml || "<p>สรุป/ไฮไลท์วิดีโอ…</p>",
      keywords: Array.isArray(video.keywords) ? video.keywords : [],
      transcriptHtml: video.transcriptHtml || "",
      faqs: Array.isArray(video.faqs) ? video.faqs : [],
      chapters: Array.isArray(video.chapters) ? video.chapters : [],
    });

    setRawTranscript("");
    setRawFaq("");
    setAutoFaqs(false);

    setThumbFile(null);
    setThumbTab("url");

    setEditMode(true);
    setOriginalSlug(video.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return items.filter((v) => {
      const kw = Array.isArray(v.keywords) ? v.keywords.join(" ").toLowerCase() : "";
      const tg = Array.isArray(v.tags) ? v.tags.join(" ").toLowerCase() : "";
      return (v.title || "").toLowerCase().includes(q) || (v.slug || "").toLowerCase().includes(q) || kw.includes(q) || tg.includes(q);
    });
  }, [items, filter]);

  const ytId = extractYoutubeId(form.youtube);

  const thumbSrc = safeStr(form.thumbnail)
    ? resolveThumbnailUrl(form.thumbnail)
    : ytId
      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
      : "";

  function addHighlight() {
    setForm((p) => ({ ...p, highlights: [...(p.highlights || []), ""] }));
  }
  function updateHighlight(i, value) {
    setForm((p) => {
      const highlights = Array.isArray(p.highlights) ? [...p.highlights] : [];
      highlights[i] = value;
      return { ...p, highlights };
    });
  }
  function removeHighlight(i) {
    setForm((p) => {
      const highlights = Array.isArray(p.highlights) ? [...p.highlights] : [];
      highlights.splice(i, 1);
      return { ...p, highlights };
    });
  }

  function addFaq() {
    setForm((p) => ({ ...p, faqs: [...(p.faqs || []), { q: "", a: "" }] }));
  }
  function updateFaq(i, key, value) {
    setForm((p) => {
      const faqs = Array.isArray(p.faqs) ? [...p.faqs] : [];
      faqs[i] = { ...(faqs[i] || { q: "", a: "" }), [key]: value };
      return { ...p, faqs };
    });
  }
  function removeFaq(i) {
    setForm((p) => {
      const faqs = Array.isArray(p.faqs) ? [...p.faqs] : [];
      faqs.splice(i, 1);
      return { ...p, faqs };
    });
  }

  function addChapter() {
    setForm((p) => ({ ...p, chapters: [...(p.chapters || []), { t: "00:00", label: "" }] }));
  }
  function updateChapter(i, key, value) {
    setForm((p) => {
      const chapters = Array.isArray(p.chapters) ? [...p.chapters] : [];
      chapters[i] = { ...(chapters[i] || { t: "00:00", label: "" }), [key]: value };
      return { ...p, chapters };
    });
  }
  function removeChapter(i) {
    setForm((p) => {
      const chapters = Array.isArray(p.chapters) ? [...p.chapters] : [];
      chapters.splice(i, 1);
      return { ...p, chapters };
    });
  }

  return (
    <div className="container-fluid py-5">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h1 className="h5 fw-bold mb-0">Admin — วิดีโอ YouTube</h1>
        <div className="d-flex gap-2">
          <Nav />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <form className="card p-3 border-0 shadow-sm" onSubmit={onSubmit}>
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h6 fw-bold mb-3">{editMode ? "แก้ไขวิดีโอ" : "สร้างวิดีโอใหม่"}</h2>
              {editMode && <span className="badge text-bg-warning">โหมดแก้ไข</span>}
            </div>

            <label className="form-label">Slug</label>
            <input className="form-control mb-2" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />

            <label className="form-label">Title</label>
            <input className="form-control mb-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

            <div className="row">
              <div className="col-6">
                <label className="form-label">Date</label>
                <input type="date" className="form-control mb-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="col-6">
                <label className="form-label">Duration (ISO 8601)</label>
                <input className="form-control mb-2" placeholder="เช่น PT5M30S" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                <div className="form-text">แนะนำ: PT4M22S</div>
              </div>
            </div>

            <label className="form-label">YouTube URL/ID</label>
            <input
              className="form-control mb-2"
              placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX หรือ ID 11 ตัว"
              value={form.youtube}
              onChange={(e) => setForm({ ...form, youtube: e.target.value })}
              required
            />

            <label className="form-label">Excerpt (คำอธิบายสั้น ๆ สำหรับแสดงผลในรายการ)</label>
            <textarea className="form-control mb-2" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />

            <label className="form-label">Description (คำอธิบายละเอียด สำหรับ SEO)</label>
            <textarea className="form-control mb-2" rows={4} placeholder="อธิบายเนื้อหาวิดีโอแบบละเอียด ช่วยให้ SEO และ AI Overviews เข้าใจเนื้อหาได้ดีขึ้น" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-0">Highlights (จุดเด่นของวิดีโอ)</label>
              <button type="button" className="btn btn-sm btn-outline-success" onClick={addHighlight}>
                + เพิ่ม Highlight
              </button>
            </div>
            <div className="border rounded p-2 mb-3">
              {(form.highlights || []).length === 0 ? (
                <div className="text-muted small">ยังไม่มี Highlights — กดปุ่ม "+เพิ่ม" เพื่อเพิ่มจุดเด่น</div>
              ) : (
                (form.highlights || []).map((h, i) => (
                  <div className="d-flex gap-2 align-items-center mb-2" key={`hl-${i}`}>
                    <span className="text-success fw-bold">✓</span>
                    <input className="form-control form-control-sm" value={h || ""} onChange={(e) => updateHighlight(i, e.target.value)} placeholder={`Highlight #${i + 1}`} />
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeHighlight(i)}>ลบ</button>
                  </div>
                ))
              )}
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <label className="form-label">Tags (คั่นด้วย ,)</label>
                <input
                  className="form-control mb-2 text-primary fw-bold"
                  placeholder="Google Ads, สายเทา, SEO"
                  value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags || ""}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Keywords (คั่นด้วย ,)</label>
                <input
                  className="form-control mb-2 text-primary fw-bold"
                  placeholder="marketing, sem, optimization"
                  value={Array.isArray(form.keywords) ? form.keywords.join(", ") : form.keywords || ""}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                />
              </div>
            </div>

            <label className="form-label mb-1">
              Thumbnail (เก็บ path เฉพาะหลัง <code>{BASE_PUBLIC_URL}</code>)
            </label>
            <div className="small text-muted mb-2">
              Base URL: <code>{BASE_PUBLIC_URL}</code>
            </div>

            <div className="btn-group mb-2" role="group">
              <button type="button" className={`btn btn-sm ${thumbTab === "url" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setThumbTab("url")}>
                ใส่ Path เอง
              </button>
              <button type="button" className={`btn btn-sm ${thumbTab === "upload" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setThumbTab("upload")}>
                อัปโหลด
              </button>
            </div>

            {thumbTab === "url" ? (
              <input
                className="form-control mb-3"
                placeholder="/uploads/videos/xxx.webp"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value.trim() })}
              />
            ) : (
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setThumbFile(f);
                  }}
                />

                <div className="d-flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    disabled={!thumbFile || thumbUploading}
                    onClick={handleUploadThumbnail}
                  >
                    {thumbUploading ? "กำลังอัปโหลด…" : "อัปโหลดรูป"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={!thumbFile || thumbUploading}
                    onClick={() => setThumbFile(null)}
                  >
                    ล้างไฟล์
                  </button>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-0">Transcript (Real-time Generator)</label>
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoTranscript"
                    checked={autoTranscript}
                    onChange={(e) => setAutoTranscript(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="autoTranscript">
                    Auto Transcript
                  </label>
                </div>

                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoChapters"
                    checked={autoChapters}
                    onChange={(e) => setAutoChapters(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="autoChapters">
                    Auto Chapters
                  </label>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    if (!safeStr(rawTranscript)) return alert("กรุณาวาง Raw Transcript ก่อน");
                    const html = buildTranscriptHtmlFromRaw(rawTranscript);
                    setForm((p) => ({ ...p, transcriptHtml: html }));
                    alert("Generate transcriptHtml ใส่ช่อง transcriptHtml แล้ว");
                  }}
                >
                  Generate transcriptHtml
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    if (!safeStr(rawTranscript)) return alert("กรุณาวาง Raw Transcript ก่อน");
                    const ch = buildChaptersFromRawTranscript(rawTranscript);
                    setForm((p) => ({ ...p, chapters: ch }));
                    alert(`Generate chapters แล้ว (${ch.length} รายการ)`);
                  }}
                >
                  Generate chapters
                </button>
              </div>
            </div>

            <div className="form-text mb-2">
              รูปแบบแนะนำ: <code>00:00 ข้อความ</code> / <code>00:15 ข้อความ</code>
            </div>

            <label className="form-label">Raw Transcript (วางสคริปต์แบบมี timecode)</label>
            <textarea className="form-control mb-3" rows={8} value={rawTranscript} onChange={(e) => setRawTranscript(e.target.value)} />

            <label className="form-label">Transcript (HTML + Bootstrap) — ใช้ทำ SEO</label>
            <textarea className="form-control mb-3" rows={6} value={form.transcriptHtml} onChange={(e) => setForm({ ...form, transcriptHtml: e.target.value })} />

            <div className="border rounded p-2 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label mb-0">FAQ Generator (จาก Raw Transcript)</label>

                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" id="autoFaqs" checked={autoFaqs} onChange={(e) => setAutoFaqs(e.target.checked)} />
                    <label className="form-check-label" htmlFor="autoFaqs">
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
                      const src = safeStr(rawFaq) ? rawFaq : rawTranscript;
                      if (!safeStr(src)) return alert("กรุณาวาง Raw Transcript หรือ Raw FAQ ก่อน");
                      const gen = buildFaqsFromTranscript(src, maxFaqs);
                      if (!gen.length) return alert("ไม่สามารถแปลง FAQ ได้ (ลองใช้รูปแบบ Q:/A: หรือคำถามลงท้าย ?)");
                      setForm((p) => ({ ...p, faqs: gen }));
                      alert(`แปลง FAQ สำเร็จ (${gen.length} ข้อ) และใส่ลงในช่อง FAQ แล้ว`);
                    }}
                  >
                    Generate FAQ → ใส่ในรายการ FAQ
                  </button>
                </div>
              </div>

              <label className="form-label mt-2">Raw FAQ (ออปชัน) — ถ้าใส่ ระบบจะใช้ช่องนี้ก่อน</label>
              <textarea className="form-control" rows={6} value={rawFaq} onChange={(e) => setRawFaq(e.target.value)} />
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-0">Chapters / Timecode</label>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={addChapter}>
                + เพิ่ม Chapter
              </button>
            </div>

            <div className="border rounded p-2 mb-3">
              {(form.chapters || []).length === 0 ? (
                <div className="text-muted small">ยังไม่มี Chapters</div>
              ) : (
                (form.chapters || []).map((c, i) => (
                  <div className="row g-2 align-items-center mb-2" key={`ch-${i}`}>
                    <div className="col-3">
                      <input className="form-control form-control-sm" value={c.t || "00:00"} onChange={(e) => updateChapter(i, "t", e.target.value)} />
                    </div>
                    <div className="col-7">
                      <input className="form-control form-control-sm" value={c.label || ""} onChange={(e) => updateChapter(i, "label", e.target.value)} placeholder="หัวข้อ Chapter" />
                    </div>
                    <div className="col-2 text-end">
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeChapter(i)}>
                        ลบ
                      </button>
                    </div>
                  </div>
                ))
              )}
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
                    <input className="form-control form-control-sm mb-1" value={f.q || ""} onChange={(e) => updateFaq(i, "q", e.target.value)} placeholder="คำถาม" />
                    <textarea className="form-control form-control-sm" rows={2} value={f.a || ""} onChange={(e) => updateFaq(i, "a", e.target.value)} placeholder="คำตอบ" />
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
                    setForm(emptyVideo);
                    setRawTranscript("");
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
          <div className="card p-3 border-0 shadow-sm mb-4">
            <h2 className="h6 fw-bold mb-3">พรีวิว</h2>
            <div className="border rounded p-3">
              <h3 className="h6">{form.title || "หัวข้อวิดีโอ"}</h3>
              <div className="small text-muted mb-2">{form.date}</div>

              {thumbSrc ? (
                <div className="mb-2">
                  <img
                    src={thumbSrc}
                    alt={form.title || "thumbnail"}
                    width={640}
                    height={360}
                    className="img-fluid rounded"
                    style={{ height: "auto", width: "100%" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : null}

              <p className="small text-muted">{form.excerpt}</p>

              {safeStr(form.description) && (
                <div className="mb-2">
                  <div className="fw-semibold mb-1 small">Description</div>
                  <p className="small text-muted">{form.description}</p>
                </div>
              )}

              {(form.highlights || []).filter(Boolean).length > 0 && (
                <div className="mb-2">
                  <div className="fw-semibold mb-1 small">Highlights</div>
                  <ul className="small mb-0">
                    {form.highlights.filter(Boolean).map((h, i) => (
                      <li key={`pv-hl-${i}`}>✓ {h}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="ratio ratio-16x9 mb-3">
                {ytId ? (
                  <iframe loading="lazy"
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title="YouTube preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light rounded">
                    <span className="text-muted small p-3">ใส่ YouTube URL/ID เพื่อพรีวิววิดีโอ</span>
                  </div>
                )}
              </div>

              {safeStr(transcriptPreviewHtml) ? (
                <div className="mb-3">
                  <div className="fw-semibold mb-2">Transcript Preview</div>
                  <div
                    className="border rounded p-2 small"
                    style={{ maxHeight: 220, overflow: "auto" }}
                    dangerouslySetInnerHTML={{ __html: transcriptPreviewHtml }}
                  />
                </div>
              ) : (
                <div className="text-muted small mb-3">ยังไม่มี Transcript</div>
              )}

              <div className="fw-semibold mb-2">FAQ Preview (Auto/Manual)</div>
              {(faqsPreview || []).filter((x) => safeStr(x.q) && safeStr(x.a)).length ? (
                <ul className="small mb-0">
                  {(faqsPreview || [])
                    .filter((x) => safeStr(x.q) && safeStr(x.a))
                    .slice(0, 6)
                    .map((x, i) => (
                      <li key={`pv-faq-${i}`}>
                        <span className="fw-semibold">{x.q}</span> — {x.a}
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="text-muted small">ยังไม่มี FAQ</div>
              )}
            </div>
          </div>

          {/* ✅ PATCH: ส่งข้อมูล keywords/tags ที่ผ่านการ normalize เป็น Array เสมอ */}
          <JsonLdVideo
            video={{
              ...form,
              tags: normalizeCsv(form.tags),
              keywords: normalizeCsv(form.keywords),
              transcriptHtml: transcriptPreviewHtml || form.transcriptHtml,
              chapters: chaptersPreview || form.chapters,
              faqs: faqsPreview || form.faqs,
            }}
          />

          <div className="card p-3 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 fw-bold mb-0">รายการวิดีโอ</h2>
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
                    <th style={{ width: 180 }}>พรีวิว</th>
                    <th>Slug</th>
                    <th style={{ width: 220 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => {
                    const vid = extractYoutubeId(v.youtube);
                    const mini =
                      safeStr(v.thumbnail) ? resolveThumbnailUrl(v.thumbnail) : vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : "";
                    return (
                      <tr key={v.slug}>
                        <td>
                          {mini ? (
                            <img
                              src={mini}
                              alt=""
                              width={160}
                              height={90}
                              style={{ objectFit: "cover", borderRadius: 8 }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="bg-light text-muted small d-flex align-items-center justify-content-center" style={{ width: 160, height: 90, borderRadius: 8 }}>
                              ไม่มีพรีวิว
                            </div>
                          )}
                        </td>
                        <td className="small text-muted">{v.slug}</td>
                        <td className="text-end">
                          <a className="btn btn-outline-secondary btn-sm me-2" href={`/videos/${v.slug}`} target="_blank" rel="noreferrer">
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
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted small">
                        ยังไม่มีวิดีโอ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="alert alert-info mt-3 mb-0 small">
              Thumbnail ในหน้านี้ใช้ API เดียวกับหน้าโพสต์: <code>/api/admin/uploads</code>
              (ส่ง <code>folder=videos</code>)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}