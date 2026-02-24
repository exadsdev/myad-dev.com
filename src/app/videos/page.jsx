// src/app/videos/page.jsx

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import JsonLd from "@/app/components/JsonLd";
import { getAllVideos, extractYoutubeId } from "@/lib/videosStore";
import {
  SITE,
  BRAND,
  DEFAULT_OG,
  LOGO_URL,
  ORG_LEGAL_NAME_TH,
  ORG_TAX_ID,
  ORG_ADDRESS,
  generateTitle,
  generateDescription,
} from "@/app/seo.config";
import "./videos.css";

// ISR: keep list fresh for bots/users
export const revalidate = 60;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE).replace(/\/+$/, "");
const PAGE_URL = `${SITE_URL}/videos`;
const OG_IMAGE = `${SITE_URL}${DEFAULT_OG}`;

// Schema ต้อง absolute แต่ next/image ไม่จำเป็นต้อง absolute (และไม่ควรเป็น localhost)
const LOGO_ABS = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;

// --- Helpers (safe + strict for Rich Results) ---
function absUrl(input) {
  const s = String(input || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const p = s.startsWith("/") ? s : `/${s}`;
  return `${SITE_URL}${p}`;
}

/**
 * ✅ สำหรับ next/image: ถ้าเป็นรูปที่อยู่ในเว็บ (uploads/images/static)
 * ให้คืนค่าเป็น relative path (/uploads/xxx.png) เพื่อไม่ชน localhost host config
 * ถ้าเป็น URL ภายนอก (https://img.youtube.com/...) คืน URL เดิม
 */
function imageSrcForNextImage(input, fallback = "/images/og-default.jpg") {
  const s = String(input || "").trim();
  if (!s) return fallback;

  // absolute url
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);

      const isSameHost =
        u.hostname === "localhost" ||
        u.hostname === "127.0.0.1" ||
        u.hostname === "::1" ||
        u.hostname === new URL(SITE_URL).hostname;

      if (
        isSameHost &&
        (u.pathname.startsWith("/uploads/") ||
          u.pathname.startsWith("/images/") ||
          u.pathname.startsWith("/static/"))
      ) {
        return u.pathname; // ✅ relative
      }

      return u.toString();
    } catch {
      return fallback;
    }
  }

  // relative path
  if (s.startsWith("/")) return s;

  if (s.startsWith("uploads/")) return `/${s}`;
  if (s.startsWith("images/")) return `/${s}`;
  if (s.startsWith("static/")) return `/${s}`;

  return fallback;
}

function safeText(input) {
  return String(input || "").replace(/\s+/g, " ").trim();
}

function stripHtmlToText(html) {
  return String(html || "")
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

function buildTranscriptSnippet(html, maxWords = 80) {
  const text = stripHtmlToText(html);
  if (!text) return "";
  const tokens = text.split(/\s+/).filter(Boolean);
  const clipped = tokens.slice(0, maxWords).join(" ");
  return tokens.length > maxWords ? `${clipped}…` : clipped;
}

// --- Metadata (SEO baseline) ---
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: generateTitle("videos"),
  description: generateDescription("videos"),
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: generateTitle("videos"),
    description: generateDescription("videos"),
    url: PAGE_URL,
    siteName: BRAND,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${BRAND} Videos`,
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: generateTitle("videos"),
    description: generateDescription("videos"),
    images: [OG_IMAGE],
  },
};

export default async function VideosPage() {
  const videos = (await getAllVideos()).filter((v) => v?.published !== false);

  const directAnswer = `รวมวิดีโอความรู้ด้านโฆษณา Google Ads, Facebook Ads และการวางระบบ Tracking/Conversion โดย ${BRAND} เน้นคำตอบตรงประเด็น พร้อมขั้นตอนทำตามได้จริง`;

  /**
   * ✅ สำคัญ: หน้า /videos เป็น "หน้า list/collection"
   * ไม่ควรประกาศ VideoObject รายตัว เพราะหน้าไม่มี player/iframe จริง
   * ให้ประกาศแค่ ItemList ที่ลิงก์ไปหน้ารายละเอียด /videos/[slug]
   */
  const itemListLd = {
    "@type": "ItemList",
    "@id": `${PAGE_URL}#itemlist`,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: videos.length,
    itemListElement: videos.map((v, i) => {
      const slug = String(v.slug || "").trim();
      const pageUrl = `${SITE_URL}/videos/${encodeURIComponent(slug)}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        url: pageUrl,
      };
    }),
  };

  const faqData = [
    {
      question: "วิดีโอของ MyAdsDev เหมาะกับใคร?",
      answer:
        "เหมาะกับเจ้าของธุรกิจและทีมการตลาดที่ต้องการทำโฆษณาให้มีความเสถียร วัดผลได้จริง และต้องการแนวทางที่ทำตามได้ทันที",
    },
    {
      question: "มีเนื้อหาเกี่ยวกับอะไรบ้าง?",
      answer:
        "Google Ads, Facebook Ads, การวางระบบ Tracking/Conversion, การแก้ปัญหาแอดไม่ผ่าน และแนวทางทำคอนเทนต์ที่ช่วยเพิ่มคุณภาพโฆษณา",
    },
    {
      question: "ต้องเริ่มดูจากวิดีโอไหนก่อน?",
      answer:
        "แนะนำเริ่มจากวิดีโอที่สอนพื้นฐานการตั้งค่า Conversion/Tracking แล้วค่อยไปดูวิดีโอเรื่องโครงสร้างแคมเปญและการ Optimize",
    },
  ];

  const trustSignalsLd = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG_LEGAL_NAME_TH || BRAND,
    url: SITE_URL,
    taxID: ORG_TAX_ID || undefined,
    address: ORG_ADDRESS || undefined,
  };
  Object.keys(trustSignalsLd).forEach((k) => trustSignalsLd[k] === undefined && delete trustSignalsLd[k]);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: metadata.title,
        description: metadata.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        primaryImageOfPage: { "@id": `${PAGE_URL}#primaryimage` },
        mainEntity: { "@id": `${PAGE_URL}#itemlist` },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        datePublished: "2024-01-01",
        dateModified: "2026-02-14",
        inLanguage: "th-TH",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#direct-answer-videos", "h1", "h2"],
        },
      },
      {
        "@type": "ImageObject",
        "@id": `${PAGE_URL}#primaryimage`,
        url: OG_IMAGE,
        width: 1200,
        height: 630,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "วิดีโอ", item: PAGE_URL },
        ],
      },
      itemListLd,
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      trustSignalsLd,
    ],
  };

  return (
    <Fragment>
      <JsonLd json={schema} />

      <div
        id="direct-answer-videos"
        className="alert alert-info border-start border-4 border-primary mx-auto mb-4"
        style={{ maxWidth: 800 }}
      >
        <p className="mb-0 small">
          <strong>สรุป:</strong> {directAnswer}
        </p>
      </div>

      <div className="container-fluid videos-page py-4">
        <div className="container">
          <header className="mb-4">
            <h1 className="display-6 fw-bold mb-2">{generateTitle("videos")}</h1>
            <p className="text-muted mb-0">{generateDescription("videos")}</p>
          </header>

          <section className="row g-3">
            {videos.map((v) => {
              const slug = String(v.slug || "").trim();
              const href = `/videos/${encodeURIComponent(slug)}`;
              const id = extractYoutubeId(v.youtube || v.contentUrl || "");
              const transcriptSnippet = buildTranscriptSnippet(v.transcriptHtml);

              const thumb = imageSrcForNextImage(
                v.thumbnail ||
                  (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "") ||
                  "/images/og-default.jpg",
                "/images/og-default.jpg"
              );

              return (
                <div key={slug} className="col-12 col-md-6 col-lg-4">
                  <article className="video-card h-100">
                    <Link href={href} className="video-thumb d-block" aria-label={safeText(v.title)}>
                      <Image
                        src={thumb}
                        alt={safeText(v.title) || "Video thumbnail"}
                        width={1200}
                        height={675}
                        className="img-fluid rounded-4"
                        priority={false}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </Link>

                    <div className="p-3">
                      <h2 className="h6 fw-bold mb-2">
                        <Link href={href} className="text-decoration-none">
                          {safeText(v.title)}
                        </Link>
                      </h2>
                      <p className="text-muted small mb-0">
                        {safeText(v.description || v.excerpt).slice(0, 120) || "ดูรายละเอียดวิดีโอ"}
                        {(v.description || v.excerpt || "").length > 120 ? "…" : ""}
                      </p>
                      {transcriptSnippet && (
                        <details className="mt-3">
                          <summary className="small text-primary">อ่าน Transcript แบบย่อ</summary>
                          <div className="small text-muted mt-2">{transcriptSnippet}</div>
                        </details>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </section>

          <section className="mt-5">
            <h2 className="h4 fw-bold mb-3">คำถามที่พบบ่อย</h2>
            <div className="accordion" id="faq-videos">
              {faqData.map((f, idx) => {
                const hid = `faq-videos-${idx}`;
                const cid = `faq-videos-collapse-${idx}`;
                return (
                  <div key={hid} className="accordion-item">
                    <h3 className="accordion-header" id={hid}>
                      <button
                        className={`accordion-button ${idx === 0 ? "" : "collapsed"}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${cid}`}
                        aria-expanded={idx === 0 ? "true" : "false"}
                        aria-controls={cid}
                      >
                        {f.question}
                      </button>
                    </h3>
                    <div
                      id={cid}
                      className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
                      aria-labelledby={hid}
                      data-bs-parent="#faq-videos"
                    >
                      <div className="accordion-body text-muted">{f.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
}