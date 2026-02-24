// src/app/videos/[slug]/page.jsx
// YouTube-style layout: main video (col-lg-8) + related videos sidebar (col-lg-4)

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getVideoBySlug, getAllVideos, extractYoutubeId } from "@/lib/videosStore";
import JsonLd from "@/app/components/JsonLd";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";
import "../videos.css";

export const revalidate = 60;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE).toString().trim().replace(/\/+$/, "");
const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;

const POLICY_TERM = "สายเทา";

function sanitizePolicySensitiveText(input = "") {
  const s = String(input || "");
  return s.replaceAll(POLICY_TERM, "ธุรกิจที่มีข้อจำกัด").replace(/\s+/g, " ").trim();
}

function absUrl(input) {
  const s = String(input || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const p = s.startsWith("/") ? s : `/${s}`;
  return `${SITE_URL}${p}`;
}

function stripHtmlToText(html = "") {
  const s = String(html || "");
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildWordSummary(text, { maxWords = 250 } = {}) {
  const tokens = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return "";
  const clipped = tokens.slice(0, Math.min(tokens.length, maxWords));
  const out = clipped.join(" ");
  return tokens.length > maxWords ? out + "…" : out;
}

function buildSummaryFromVideo(v) {
  const excerptText = stripHtmlToText(v?.excerpt || "");
  const contentText = stripHtmlToText(v?.contentHtml || "");
  const source = excerptText.length >= 50 ? excerptText : `${excerptText} ${contentText}`.trim();
  return buildWordSummary(source);
}

function toIsoUploadDate(v) {
  const raw = v?.publishDate || v?.date || v?.createdAt;
  if (!raw) return new Date("2026-01-01").toISOString();
  try {
    const date = new Date(raw);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function durationToISO(duration) {
  if (!duration) return "PT5M";
  if (duration.startsWith("PT")) return duration;
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) return `PT${parts[0]}M${parts[1]}S`;
  if (parts.length === 3) return `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
  return "PT5M";
}

/** Safe image src for next/image — local paths stay relative */
function safeThumbSrc(input, fallback = "/images/og-default.jpg") {
  const s = String(input || "").trim();
  if (!s) return fallback;
  if (/^https?:\/\//i.test(s)) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

/** Get related videos sorted by tag relevance then recency */
function getRelatedVideos(currentVideo, allVideos, max = 10) {
  const currentTags = new Set((currentVideo.tags || []).map((t) => String(t).toLowerCase()));
  const others = allVideos.filter((vv) => vv.slug !== currentVideo.slug);

  const scored = others.map((vv) => {
    const vTags = (vv.tags || []).map((t) => String(t).toLowerCase());
    const matchCount = vTags.filter((t) => currentTags.has(t)).length;
    return { video: vv, matchCount };
  });

  scored.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    return (b.video.createdAt || 0) - (a.video.createdAt || 0);
  });

  return scored.slice(0, max).map((s) => s.video);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = await getVideoBySlug(slug);

  if (!v) return { title: `ไม่พบวิดีโอ | ${BRAND}`, robots: { index: false } };

  const canonical = `${SITE_URL}/videos/${encodeURIComponent(v.slug)}`;
  const safeTitle = sanitizePolicySensitiveText(v.title || "");
  const title = `${safeTitle} | ${BRAND}`;
  const description = sanitizePolicySensitiveText(v.description || v.excerpt || "").slice(0, 160);

  const ytId = extractYoutubeId(v.youtube || v.youtubeUrl || v.contentUrl || "");
  const rawOg = v.thumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "/images/og-default.jpg");
  const ogImage = absUrl(rawOg);

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: { "max-video-preview": -1, "max-image-preview": "large" },
    },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1280, height: 720 }],
      type: "video.other",
      url: canonical,
      siteName: BRAND,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function VideoDetailPage({ params }) {
  const { slug } = await params;
  const v = await getVideoBySlug(slug);
  if (!v) return notFound();

  const canonical = `${SITE_URL}/videos/${encodeURIComponent(v.slug)}`;

  const allVideos = await getAllVideos();
  const relatedVideos = getRelatedVideos(v, allVideos, 10);

  const ytId = extractYoutubeId(v.youtube || v.youtubeUrl || v.contentUrl || "");
  const watchUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : "";
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : "";
  const rawThumb = v.thumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "/images/og-default.jpg");
  const thumbnailAbs = absUrl(rawThumb);

  const videoLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${canonical}#video`,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },

    name: sanitizePolicySensitiveText(v.title),
    description: sanitizePolicySensitiveText(v.description || v.excerpt || v.title),

    thumbnailUrl: [thumbnailAbs],
    uploadDate: toIsoUploadDate(v),
    duration: durationToISO(v.duration),

    embedUrl: embedUrl || undefined,
    contentUrl: watchUrl || undefined,

    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      logo: { "@type": "ImageObject", url: LOGO_FULL },
    },

    potentialAction: watchUrl
      ? {
          "@type": "WatchAction",
          target: [watchUrl],
        }
      : undefined,

    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: 0,
    },
  };

  Object.keys(videoLd).forEach((k) => videoLd[k] === undefined && delete videoLd[k]);

  const faqLd =
    v.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: v.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <JsonLd json={videoLd} />
      {faqLd && <JsonLd json={faqLd} />}

      <main className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <article>
              <header className="mb-4">
                <h1 className="h2 mb-2">{v.title}</h1>
                <div className="text-muted small">
                  {v.publishDate || v.date} • {v.author || "ทีมบทความ"} • {v.duration}
                </div>

                <div className="mt-3 d-flex flex-wrap gap-2">
                  {v.tags?.map((tag, idx) => (
                    <Link
                      key={idx}
                      href={`/videos/tag/${encodeURIComponent(tag)}`}
                      className="badge rounded-pill bg-light text-primary border text-decoration-none"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </header>

              <div className="ratio ratio-16x9 mb-4 shadow-sm rounded overflow-hidden bg-black">
                {ytId ? (
                  <iframe
                    loading="lazy"
                    src={embedUrl}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={thumbnailAbs}
                    alt={v.title}
                    className="w-100 object-fit-cover"
                    loading="lazy"
                    width="1280"
                    height="720"
                    decoding="async"
                  />
                )}
              </div>

              {v.description && (
                <section className="mb-4" aria-label="คำอธิบายวิดีโอ">
                  <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                    {sanitizePolicySensitiveText(v.description)}
                  </p>
                </section>
              )}

              {v.highlights?.length > 0 && (
                <section
                  className="mb-5 p-4 border rounded-4"
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                    borderColor: "#bbf7d0",
                  }}
                  aria-label="จุดเด่นของวิดีโอนี้"
                >
                  <h2 className="h5 fw-bold mb-3">✨ จุดเด่นของวิดีโอนี้</h2>
                  <ul className="list-unstyled mb-0">
                    {v.highlights.map((h, idx) => (
                      <li key={idx} className="mb-2 d-flex align-items-start">
                        <span className="text-success fw-bold me-2 mt-1" style={{ fontSize: "1.1em" }}>
                          ✓
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="mb-5 p-4 border rounded-4 bg-light" aria-label="สรุปเนื้อหาวิดีโอ">
                <h2 className="h5 fw-bold mb-3">📝 สรุปเนื้อหาวิดีโอ (Transcript Summary)</h2>
                <p className="text-muted mb-0">
                  {buildSummaryFromVideo(v) ||
                    `วิดีโอ "${sanitizePolicySensitiveText(v.title)}" โดย ${BRAND} — ครอบคลุมแนวทางวางโครงสร้างบัญชี การตั้งค่า Conversion Tracking และการปรับแคมเปญให้วัดผล ROI ได้จริง`}
                </p>
              </section>

              {v.transcriptHtml && (
                <section className="mb-5" aria-label="Transcript ฉบับเต็ม">
                  <details className="border rounded-4 overflow-hidden">
                    <summary className="p-3 bg-light fw-bold" style={{ cursor: "pointer" }}>
                      📄 Transcript ฉบับเต็ม (คลิกเพื่อดู)
                    </summary>
                    <div className="p-4 content-area" dangerouslySetInnerHTML={{ __html: v.transcriptHtml }} />
                  </details>
                </section>
              )}

              {v.chapters?.length > 0 && (
                <section className="mb-5 p-4 bg-light rounded">
                  <h2 className="h5 mb-3 fw-bold">ประเด็นสำคัญในวิดีโอ</h2>
                  <ul className="list-unstyled mb-0">
                    {v.chapters.map((c, idx) => (
                      <li key={idx} className="mb-2 d-flex">
                        <span className="text-primary fw-bold me-3">{c.t}</span>
                        <span>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {v.faqs?.length > 0 && (
                <section className="mb-5">
                  <h2 className="h5 mb-3 fw-bold">คำถามที่พบบ่อย (FAQ)</h2>
                  <div className="accordion" id="videoFaq">
                    {v.faqs.map((faq, i) => (
                      <div className="accordion-item" key={i}>
                        <h3 className="accordion-header">
                          <button
                            className={`accordion-button ${i === 0 ? "" : "collapsed"}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#faq${i}`}
                          >
                            {faq.q}
                          </button>
                        </h3>
                        <div
                          id={`faq${i}`}
                          className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                          data-bs-parent="#videoFaq"
                        >
                          <div className="accordion-body">{faq.a}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {v.contentHtml && (
                <section className="mt-5 pt-4 border-top">
                  <div className="content-area" dangerouslySetInnerHTML={{ __html: v.contentHtml }} />
                </section>
              )}

              <footer className="mt-5 pt-4 border-top d-flex justify-content-between align-items-center">
                <Link href="/videos" className="btn btn-outline-primary">
                  ← กลับไปหน้าวิดีโอ
                </Link>
                <div className="text-muted small">แชร์วิดีโอนี้เพื่อเป็นประโยชน์ต่อผู้อื่น</div>
              </footer>
            </article>
          </div>

          <aside className="col-lg-4">
            <div className="related-sidebar">
              <h2 className="h6 fw-bold mb-3 text-uppercase text-muted ls-wide">วิดีโอที่เกี่ยวข้อง</h2>

              <div className="d-flex flex-column gap-3">
                {relatedVideos.map((rv) => {
                  const rvYtId = extractYoutubeId(rv.youtube || rv.youtubeUrl || rv.contentUrl || "");
                  const rvThumb = safeThumbSrc(
                    rv.thumbnail || (rvYtId ? `https://img.youtube.com/vi/${rvYtId}/hqdefault.jpg` : "")
                  );
                  const rvHref = `/videos/${encodeURIComponent(rv.slug)}`;

                  return (
                    <Link key={rv.slug} href={rvHref} className="related-card text-decoration-none">
                      <div className="d-flex gap-2">
                        <div className="related-thumb flex-shrink-0">
                          <Image
                            src={rvThumb}
                            alt={`${rv.title || "วิดีโอ"} | ${BRAND}`}
                            width={168}
                            height={94}
                            className="rounded object-fit-cover"
                            sizes="168px"
                            unoptimized={/^https?:\/\//i.test(rvThumb)}
                          />
                          {rv.duration && <span className="related-duration">{rv.duration}</span>}
                        </div>

                        <div className="related-info flex-grow-1 min-w-0">
                          <h3 className="related-title mb-1">{rv.title || "ไม่มีชื่อ"}</h3>
                          <p className="related-meta mb-0">{BRAND}</p>
                          {rv.publishDate || rv.date ? <p className="related-meta mb-0">{rv.publishDate || rv.date}</p> : null}
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {relatedVideos.length === 0 && <p className="text-muted small">ยังไม่มีวิดีโอที่เกี่ยวข้อง</p>}
              </div>

              <div className="mt-4 text-center">
                <Link href="/videos" className="btn btn-outline-primary btn-sm rounded-pill px-4">
                  ดูวิดีโอทั้งหมด →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}