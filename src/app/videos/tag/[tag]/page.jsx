// src/app/videos/tag/[tag]/page.jsx

import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import { getAllVideos, extractYoutubeId } from "@/lib/videosStore";
import { SITE, BRAND, DEFAULT_OG, generateOgImage } from "@/app/seo.config";

export const runtime = "nodejs";
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const OG_IMAGE = generateOgImage(DEFAULT_OG);

function normalizeTagValue(v) {
  return String(v || "").trim().toLowerCase();
}

function safeDecodeTag(raw) {
  try {
    return decodeURIComponent(String(raw || ""));
  } catch {
    return String(raw || "");
  }
}

function sanitizeForTitle(input = "") {
  return String(input || "").replace(/\s+/g, " ").trim();
}

function youtubeThumbFromId(id) {
  if (!id) return "";
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function pickVideoThumb(v) {
  if (!v) return `${SITE_URL}${OG_IMAGE}`;

  // ตรวจสอบฟิลด์ thumbnail จากระบบ Admin
  const thumbPath = v.thumbnail || v.thumbnailUrl;
  if (thumbPath && String(thumbPath).startsWith("http")) return thumbPath;
  if (thumbPath) return `${SITE_URL}${thumbPath}`;

  const ytId = extractYoutubeId?.(v.youtube || v.youtubeUrl || v.url || "");
  const ytThumb = youtubeThumbFromId(ytId);
  if (ytThumb) return ytThumb;

  return `${SITE_URL}${OG_IMAGE}`;
}

function canonicalFor(tag) {
  return `${SITE_URL}/videos/tag/${encodeURIComponent(tag)}`;
}

function matchVideoByTag(video, tagNorm) {
  const tags = Array.isArray(video?.tags) ? video.tags : [];
  return tags.some((t) => normalizeTagValue(t) === tagNorm);
}

export async function generateMetadata({ params }) {
  const raw = (await params)?.tag;
  const tag = sanitizeForTitle(safeDecodeTag(raw));
  const tagNorm = normalizeTagValue(tag);

  if (!tagNorm) {
    return {
      title: `ไม่พบแท็ก | ${BRAND}`,
      description: "ไม่พบแท็กที่ต้องการ",
      robots: { index: false, follow: false },
    };
  }

  const all = await getAllVideos().catch(() => []);
  const count = (Array.isArray(all) ? all : []).filter((v) => matchVideoByTag(v, tagNorm)).length;

  const titleText = `วิดีโอแท็ก: ${tag}`;
  const title = `${titleText} | ${BRAND}`;
  const description =
    count > 0
      ? `รวมวิดีโอทั้งหมดในแท็ก “${tag}” อัปเดตสม่ำเสมอ พร้อมลิงก์ไปยังวิดีโอที่เกี่ยวข้อง`
      : `ไม่พบวิดีโอในแท็ก “${tag}”`;

  const url = canonicalFor(tag);

  return {
    title,
    description,
    alternates: { canonical: url },
    // ป้องกันหน้าแท็กว่างติด Index
    robots: count > 0 ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND,
      type: "website",
      images: [
        {
          url: `${SITE_URL}${OG_IMAGE}`,
          width: 1200,
          height: 630,
          alt: titleText,
        },
      ],
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}${OG_IMAGE}`],
    },
  };
}

export async function generateStaticParams() {
  const all = await getAllVideos().catch(() => []);
  const set = new Set();

  for (const v of Array.isArray(all) ? all : []) {
    const tags = Array.isArray(v?.tags) ? v.tags : [];
    for (const t of tags) {
      const s = String(t || "").trim();
      if (!s) continue;
      set.add(s);
    }
  }

  return Array.from(set).map((tag) => ({ tag }));
}

export default async function VideoTagPage({ params }) {
  const raw = (await params)?.tag;
  const tag = sanitizeForTitle(safeDecodeTag(raw));
  const tagNorm = normalizeTagValue(tag);

  if (!tagNorm) return notFound();

  const all = await getAllVideos().catch(() => []);
  const videos = (Array.isArray(all) ? all : [])
    .filter((v) => matchVideoByTag(v, tagNorm))
    .sort((a, b) => {
      const da = new Date(a?.updatedAt || a?.createdAt || a?.uploadDate || a?.date || 0).getTime();
      const db = new Date(b?.updatedAt || b?.createdAt || b?.uploadDate || b?.date || 0).getTime();
      return db - da;
    });

  if (!videos.length) return notFound();

  const url = canonicalFor(tag);

  // Schema: Breadcrumb
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "วิดีโอ", item: `${SITE_URL}/videos` },
      { "@type": "ListItem", position: 3, name: `แท็ก: ${tag}`, item: url },
    ],
  };

  // Schema: ItemList สำหรับรายการวิดีโอ
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `วิดีโอแท็ก: ${tag}`,
    itemListOrder: "http://schema.org/ItemListOrderDescending",
    numberOfItems: videos.length,
    itemListElement: videos.slice(0, 100).map((v, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/videos/${encodeURIComponent(v.slug)}`,
      name: String(v.title || "Video").trim(),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={itemListLd} />

      <main className="container py-4">
        <section className="mx-auto" style={{ maxWidth: 1100 }}>
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><Link href="/">หน้าแรก</Link></li>
              <li className="breadcrumb-item"><Link href="/videos">วิดีโอ</Link></li>
              <li className="breadcrumb-item active" aria-current="page">แท็ก: {tag}</li>
            </ol>
          </nav>

          <header className="mb-4">
            <h1 className="h3 mb-2">วิดีโอแท็ก: {tag}</h1>
            <p className="text-muted">
              พบวิดีโอที่เกี่ยวข้องทั้งหมด {videos.length} รายการ
            </p>
          </header>

          <div className="row g-4">
            {videos.map((v) => {
              const thumb = pickVideoThumb(v);
              const videoUrl = `/videos/${encodeURIComponent(v.slug)}`;

              return (
                <div className="col-12 col-md-6 col-lg-4" key={v.slug}>
                  <article className="card h-100 border-0 shadow-sm overflow-hidden">
                    <Link href={videoUrl} className="position-relative d-block">
                      <img
                        src={thumb}
                        alt={v.title || "video"}
                        className="card-img-top"
                        loading="lazy"
                        style={{ aspectRatio: "16/9", objectFit: "cover" }}
                      />
                      {v.duration && (
                        <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark opacity-75">
                          {v.duration}
                        </span>
                      )}
                    </Link>

                    <div className="card-body">
                      <h2 className="h6 card-title mb-2">
                        <Link href={videoUrl} className="text-dark text-decoration-none">
                          {v.title || "วิดีโอ"}
                        </Link>
                      </h2>

                      <div className="small text-muted mb-3">
                        {v.date && <span>{v.date}</span>}
                      </div>

                      {Array.isArray(v?.tags) && (
                        <div className="d-flex flex-wrap gap-1">
                          {v.tags.slice(0, 5).map((t, i) => (
                            <Link
                              key={i}
                              href={`/videos/tag/${encodeURIComponent(t)}`}
                              className={`badge rounded-pill text-decoration-none ${
                                normalizeTagValue(t) === tagNorm
                                  ? "bg-primary"
                                  : "bg-light text-secondary border"
                              }`}
                              style={{ fontSize: '0.7rem' }}
                            >
                              #{t}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-4 bg-light rounded text-center">
            <p className="mb-0 text-muted small">
              อัปเดตข้อมูลล่าสุดเมื่อ: {new Date().toLocaleDateString('th-TH')}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}