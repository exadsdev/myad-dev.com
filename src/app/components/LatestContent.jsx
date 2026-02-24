// src/app/components/LatestContent.jsx
// FIX: next/image error จาก thumbnail ที่เป็น http://localhost:3000/... หรือโดเมนที่ไม่ได้ whitelist
// แนวทาง: ถ้าเป็นรูปในเว็บเราเอง (/uploads, /images, /static) ให้ใช้ "relative path" เสมอ
// ถ้าเป็น external จริง (youtube/img), ค่อยปล่อยเป็น absolute และไป whitelist ใน next.config.js

import Link from "next/link";
import Image from "next/image";
import { getAllVideos } from "@/lib/videosStore";
import { getAllPosts } from "@/lib/postsStore";
import { getAllReviews } from "@/lib/reviewsStore";
import "./latest-content.css";

function normalizeText(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function isLocalAssetPath(pathname) {
  return (
    pathname.startsWith("/uploads/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/static/")
  );
}

/**
 * ✅ Safe src สำหรับ next/image
 * - ถ้าเป็น absolute url แล้วเป็น localhost หรือโดเมนเดียวกับเว็บ → แปลงเป็น pathname (relative)
 * - ถ้าเป็น absolute url ภายนอกจริง → คืน full url (ต้อง whitelist remotePatterns)
 * - ถ้าเป็น relative → ให้ขึ้นต้นด้วย /
 */
function safeImgSrc(v, fallback = "/images/og-default.jpg") {
  const s = normalizeText(v);
  if (!s) return fallback;

  // absolute url
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);

      // localhost หรือ ip local
      const isLocalHost =
        u.hostname === "localhost" ||
        u.hostname === "127.0.0.1" ||
        u.hostname === "::1";

      // ถ้าเป็น asset path ในเว็บเราเอง ให้คืนเป็น relative path เพื่อตัดปัญหา whitelist host
      if ((isLocalHost || true) && isLocalAssetPath(u.pathname)) {
        return u.pathname;
      }

      // external จริง → คืน full url (ต้องตั้ง remotePatterns)
      return u.toString();
    } catch {
      return fallback;
    }
  }

  // relative path
  if (s.startsWith("/")) return s;

  // no leading slash
  if (s.startsWith("uploads/") || s.startsWith("images/") || s.startsWith("static/")) {
    return `/${s}`;
  }

  // ถ้าเป็นชื่อไฟล์ลอย ๆ ให้ fallback (กันพัง)
  return fallback;
}

function safeExcerpt(v, fallback = "") {
  const s = normalizeText(v);
  return s || fallback;
}

function safeSlug(v) {
  const s = normalizeText(v);
  return encodeURIComponent(s || "");
}

function toTimeValue(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const s = String(value).trim();
  if (!s) return 0;
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function sortByLatest(items = []) {
  return [...items].sort((a, b) => {
    const ta = Math.max(
      toTimeValue(a?.updatedAt),
      toTimeValue(a?.createdAt),
      toTimeValue(a?.uploadDate),
      toTimeValue(a?.date)
    );
    const tb = Math.max(
      toTimeValue(b?.updatedAt),
      toTimeValue(b?.createdAt),
      toTimeValue(b?.uploadDate),
      toTimeValue(b?.date)
    );
    return tb - ta;
  });
}

function ContentItem({ slug, thumbnail, title, excerpt, basePath, btnText }) {
  const displayTitle = normalizeText(title) || "ไม่มีชื่อ";
  const displayThumb = safeImgSrc(thumbnail);
  const linkHref = `${basePath}/${safeSlug(slug)}`;

  return (
    <article className="latest-card">
      <div className="position-relative overflow-hidden rounded mb-3" style={{ aspectRatio: "16/9" }}>
        <Image
          src={displayThumb || "/images/og-default.jpg"}
          alt={`${displayTitle} | MyAdsDev`}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="latest-img object-fit-cover"
          // ป้องกัน warning ให้ next/image ไม่พยายาม optimize external ที่ไม่ได้ whitelist (กรณีหลุดมา)
          // แต่ยังคง optimize ได้ถ้าเป็น local path
          unoptimized={/^https?:\/\//i.test(displayThumb)}
        />
      </div>

      <h4 className="latest-title">{displayTitle}</h4>
      <p className="latest-text">{safeExcerpt(excerpt, displayTitle)}</p>
      <Link href={linkHref} className="latest-btn">
        {btnText}
      </Link>
    </article>
  );
}

export default async function LatestContent() {
  const limit = 3;
  let videos = [];
  let posts = [];
  let reviews = [];

  try {
    videos = sortByLatest((await getAllVideos()) || []).slice(0, limit);
  } catch (e) {
    console.error("Videos Error", e);
  }

  try {
    posts = sortByLatest((await getAllPosts()) || []).slice(0, limit);
  } catch (e) {
    console.error("Posts Error", e);
  }

  try {
    reviews = sortByLatest((await getAllReviews()) || []).slice(0, limit);
  } catch (e) {
    console.error("Reviews Error", e);
  }

  return (
    <section className="latest-wrapper">
      {/* 1. Videos */}
      <div className="latest-block">
        <div className="latest-head">
          <h3>🎞️ วิดีโอล่าสุด</h3>
          <Link href="/videos">ดูทั้งหมด →</Link>
        </div>
        <div className="latest-horizontal">
          {videos.map((v, i) => (
            <ContentItem
              key={v.slug || i}
              slug={v.slug}
              thumbnail={v.thumbnail}
              title={v.title}
              excerpt={v.excerpt || v.title}
              basePath="/videos"
              btnText="ดูวิดีโอ"
            />
          ))}
        </div>
      </div>

      {/* 2. Reviews */}
      <div className="latest-block">
        <div className="latest-head">
          <h3>⭐ รีวิวล่าสุด</h3>
          <Link href="/reviews">ดูทั้งหมด →</Link>
        </div>
        <hr />
        <div className="latest-horizontal">
          {reviews.map((r, i) => (
            <ContentItem
              key={r.slug || i}
              slug={r.slug}
              thumbnail={r.thumbnail}
              title={r.title}
              excerpt={r.excerpt || r.title}
              basePath="/reviews"
              btnText="อ่านรีวิว"
            />
          ))}
        </div>
      </div>

      {/* 3. Posts */}
      <div className="latest-block">
        <div className="latest-head">
          <h3>📝 บทความล่าสุด</h3>
          <Link href="/blog">ดูทั้งหมด →</Link>
        </div>
        <div className="latest-horizontal">
          {posts.map((p, i) => (
            <ContentItem
              key={p.slug || i}
              slug={p.slug}
              thumbnail={p.thumbnail}
              title={p.title}
              excerpt={p.excerpt || p.title}
              basePath="/blog"
              btnText="อ่านบทความ"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
