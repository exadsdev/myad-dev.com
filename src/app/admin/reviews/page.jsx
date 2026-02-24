"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import Nav from "../Nav";

const RAW_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_ORIGIN ||
  "https://myad-dev.com";
const BASE_PUBLIC_URL = RAW_SITE.replace(/\/+$/, "");

const emptyReview = {
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  category: "google", // google | facebook
  author: "ทีมรีวิว",
  thumbnail: "", // เก็บเป็น path เช่น /reviews/xxx.jpg
  contentHtml: "<p>รายละเอียดรีวิว…</p>",
  keywords: [],
};

function formatShortThai(dateStr = "") {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  const yy = String(y).slice(-2);
  return `${d}/${m}/${yy}`;
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

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyReview);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");

  const [thumbMode, setThumbMode] = useState("url");
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbUploading, setThumbUploading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/reviews", {
          cache: "no-store",
        });
        const j = await res.json();
        if (!active) return;
        startTransition(() => setItems(j?.items || []));
      } catch {
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function reload() {
    const r = await fetch("/api/admin/reviews", { cache: "no-store" });
    const j = await r.json();
    startTransition(() => setItems(j?.items || []));
  }

  async function handleUploadThumbnail() {
    if (!thumbFile) {
      alert("กรุณาเลือกไฟล์รูปก่อน");
      return;
    }
    setThumbUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", thumbFile);
      fd.append("folder", "reviews"); // optional subfolder hint

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const j = await res.json().catch(() => ({}));
      setThumbUploading(false);

      if (!res.ok) {
        alert(j?.error || "อัปโหลดไม่สำเร็จ");
        return;
      }
      if (j?.url) {
        let thumbValue = j.url;
        if (thumbValue.startsWith(BASE_PUBLIC_URL)) {
          thumbValue = thumbValue.slice(BASE_PUBLIC_URL.length);
        }
        setForm((prev) => ({ ...prev, thumbnail: thumbValue }));
        setThumbFile(null);
        alert("อัปโหลดรูปเสร็จแล้ว");
      }
    } catch (e) {
      setThumbUploading(false);
      alert("เกิดข้อผิดพลาดระหว่างอัปโหลด");
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMode && originalSlug) {
        await fetch(
          `/api/admin/reviews?slug=${encodeURIComponent(originalSlug)}`,
          { method: "DELETE" }
        );
      }
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaving(false);
      if (res.ok) {
        setForm(emptyReview);
        setEditMode(false);
        setOriginalSlug("");
        await reload();
        alert(
          editMode
            ? "แก้ไขแล้ว (ลบเดิมและบันทึกใหม่)"
            : "บันทึกแล้ว"
        );
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
    if (!confirm(`ลบรีวิว "${slug}"?`)) return;
    const res = await fetch(
      `/api/admin/reviews?slug=${encodeURIComponent(slug)}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      await reload();
      alert("ลบแล้ว");
      if (editMode && originalSlug === slug) {
        setForm(emptyReview);
        setEditMode(false);
        setOriginalSlug("");
      }
    } else {
      alert("ลบไม่สำเร็จ");
    }
  };

  const onEdit = (rev) => {
    setForm({
      slug: rev.slug || "",
      title: rev.title || "",
      date: rev.date || new Date().toISOString().slice(0, 10),
      excerpt: rev.excerpt || "",
      category: rev.category || "google",
      author: rev.author || "ทีมรีวิว",
      thumbnail: normalizeThumbnail(rev.thumbnail || ""),
      contentHtml: rev.contentHtml || "<p>รายละเอียดรีวิว…</p>",
      keywords: Array.isArray(rev.keywords) ? rev.keywords : [],
    });
    setEditMode(true);
    setOriginalSlug(rev.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return items.filter(
      (v) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.slug || "").toLowerCase().includes(q) ||
        (v.category || "").toLowerCase().includes(q) ||
        (Array.isArray(v.keywords)
          ? v.keywords.join(" ").toLowerCase()
          : ""
        ).includes(q)
    );
  }, [items, filter]);

  const p = form;

  return (
    <div className="container-fluid py-4">
      {}
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h1 className="h5 fw-bold mb-0">Admin — รีวิว</h1>
        <div className="d-flex gap-2">
          <Nav />
        </div>
      </div>

      <div className="row g-4">
        {}
        <div className="col-12 col-lg-6">
          <form
            className="card p-3 border-0 shadow-sm"
            onSubmit={onSubmit}
          >
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h6 fw-bold mb-3">
                {editMode ? "แก้ไขรีวิว" : "สร้างรีวิวใหม่"}
              </h2>
              {editMode && (
                <span className="badge text-bg-warning">
                  โหมดแก้ไข (จะลบของเดิมแล้วบันทึกใหม่)
                </span>
              )}
            </div>

            <label className="form-label">Slug</label>
            <input
              className="form-control mb-2"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value.trim(),
                })
              }
              required
            />

            <label className="form-label">Title</label>
            <input
              className="form-control mb-2"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <div className="row">
              <div className="col-6">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select mb-2"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
            </div>

            <label className="form-label">Author</label>
            <input
              className="form-control mb-2"
              value={form.author}
              onChange={(e) =>
                setForm({ ...form, author: e.target.value })
              }
            />

            <label className="form-label">Excerpt</label>
            <textarea
              className="form-control mb-2"
              rows={2}
              value={form.excerpt}
              onChange={(e) =>
                setForm({ ...form, excerpt: e.target.value })
              }
            />

            {}
            <div className="mb-3">
              <label className="form-label d-block">Thumbnail</label>

              <div className="small text-muted mb-1">
                Base URL: <code>{BASE_PUBLIC_URL}</code>
              </div>

              <div className="btn-group mb-2" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="thumbMode"
                  id="thumb-url"
                  autoComplete="off"
                  checked={thumbMode === "url"}
                  onChange={() => setThumbMode("url")}
                />
                <label
                  className="btn btn-outline-secondary"
                  htmlFor="thumb-url"
                >
                  ใช้ Path เอง
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="thumbMode"
                  id="thumb-file"
                  autoComplete="off"
                  checked={thumbMode === "file"}
                  onChange={() => setThumbMode("file")}
                />
                <label
                  className="btn btn-outline-secondary"
                  htmlFor="thumb-file"
                >
                  อัปโหลดไฟล์
                </label>
              </div>

              {thumbMode === "url" && (
                <>
                  <input
                    className="form-control"
                    placeholder="/reviews/xxx.jpg หรือ URL เต็ม"
                    value={form.thumbnail}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        thumbnail: e.target.value.trim(),
                      })
                    }
                  />
                  <div className="form-text">
                    - ถ้าเป็น path ภายใน ให้กรอกเช่น{" "}
                    <code>/reviews/xxx.jpg</code>
                    <br />
                    - ถ้าเป็น URL นอก ให้กรอก URL เต็มได้เลย
                  </div>
                </>
              )}

                            {thumbMode === "file" && (
                <div
                  className="border rounded p-3 text-center"
                  onDragOver={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                  }}
                  onDrop={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    const f = ev.dataTransfer?.files?.[0];
                    if (f) setThumbFile(f);
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setThumbFile(f);
                    }}
                  />
                  <div className="small text-muted">ลากไฟล์มาวาง หรือกดเลือกไฟล์</div>
                  <div className="d-flex justify-content-center gap-2 mt-2 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      disabled={!thumbFile || thumbUploading}
                      onClick={handleUploadThumbnail}
                    >
                      {thumbUploading ? "กำลังอัปโหลด…" : "อัปโหลดรูป"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      disabled={!thumbFile || thumbUploading}
                      onClick={() => setThumbFile(null)}
                    >
                      ล้างไฟล์
                    </button>
                  </div>
                </div>
              )}

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

            <label className="form-label">รายละเอียด (HTML)</label>
            <textarea
              className="form-control mb-3"
              rows={8}
              value={form.contentHtml}
              onChange={(e) =>
                setForm({
                  ...form,
                  contentHtml: e.target.value,
                })
              }
            />

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled={saving} type="submit">
                {saving ? "กำลังบันทึก…" : editMode ? "บันทึกการแก้ไข" : "บันทึก"}
              </button>

              {editMode && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setForm(emptyReview);
                    setEditMode(false);
                    setOriginalSlug("");
                  }}
                >
                  ยกเลิกแก้ไข
                </button>
              )}
            </div>
            </div>
          </form>
        </div>

        {}
        <div className="col-12 col-lg-6">
          {}
          <div className="card p-3 border-0 shadow-sm mb-4">
            <h2 className="h6 fw-bold mb-3">พรีวิว</h2>
            <div className="border rounded p-3">
              <h3 className="h6">
                {p.title || "หัวข้อรีวิว"}
              </h3>
              <div className="small text-muted mb-2">
                {formatShortThai(p.date)} •{" "}
                {p.author || "ทีมรีวิว"} •{" "}
                {String(p.category).toUpperCase()}
              </div>

              {}
              {p.thumbnail && (
                <img
                  src={resolveThumbnailUrl(p.thumbnail)}
                  alt={p.title || "thumbnail"}
                  width={640}
                  height={360}
                  className="img-fluid rounded mb-2"
                  style={{
                    height: "auto",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              {p.excerpt && (
                <p className="small text-muted">
                  {p.excerpt}
                </p>
              )}

              {p.contentHtml && (
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: p.contentHtml,
                  }}
                />
              )}
            </div>
          </div>

          {}
          <div className="card p-3 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 fw-bold mb-0">
                รายการรีวิว
              </h2>
              <input
                className="form-control form-control-sm"
                style={{ maxWidth: 260 }}
                placeholder="ค้นหา… (title/slug/category/keywords)"
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
                    <th>หมวด</th>
                    <th style={{ width: 220 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, idx) => (
                    <tr key={`${v.slug}-${idx}`}>
                      <td>
                        {}
                        <img
                          src={resolveThumbnailUrl(
                            v.thumbnail || ""
                          )}
                          alt=""
                          width={120}
                          height={68}
                          style={{
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </td>
                     
                      <td className="small text-muted">
                        {v.slug}
                      </td>
                      <td className="small">
                        {String(v.category || "").toUpperCase()}
                      </td>
                      <td className="text-end">
                        <a
                          className="btn btn-outline-secondary btn-sm me-2"
                          href={`/reviews/${v.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          ดู
                        </a>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => onEdit(v)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDelete(v.slug)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-muted small"
                      >
                        ยังไม่มีรีวิว
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
