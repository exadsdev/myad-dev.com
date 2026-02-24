// src/app/blog/[slug]/page.jsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import JsonLd from "@/app/components/JsonLd";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";
import { getPostBySlug, getAllPosts } from "@/lib/postsStore";
import "./app.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;

// --- Helper Functions ---
function resolveThumbnailUrl(thumbnail) {
  if (!thumbnail) return "/images/og-default.jpg";
  const s = String(thumbnail).trim();
  if (/^https?:\/\//i.test(s)) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

// Logic คำนวณบทความเกี่ยวข้อง (Server-Side)
async function getRelatedPosts(currentSlug, tags = []) {
  if (!tags.length) return [];
  const allPosts = await getAllPosts();
  const set = new Set(tags.map((t) => String(t).toLowerCase()));

  return allPosts
    .filter((x) => x.slug !== currentSlug)
    .map((x) => ({
      ...x,
      score: (x.tags || []).reduce(
        (acc, t) => acc + (set.has(String(t).toLowerCase()) ? 1 : 0),
        0
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
    .slice(0, 5);
}

function sanitizeContentHtml(html = "", title = "") {
  const s = String(html || "");
  if (!s.trim()) return "";
  // Remove a leading H1 (often duplicated from editor) to ensure ONE H1 per page.
  let out = s.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");
  // Also remove a leading H2 that exactly matches the title (some editors use H2 as title)
  const t = String(title || "").trim();
  if (t) {
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reH2 = new RegExp(`^\\s*<h2[^>]*>\\s*${esc}\\s*<\\/h2>\\s*`, "i");
    out = out.replace(reH2, "");
  }
  return out;
}

/** ✅ sanitize สำหรับ FAQ HTML (กัน script/iframe/event handlers/javascript: ) */
function sanitizeFaqHtml(html = "") {
  let out = String(html || "");
  if (!out.trim()) return "";
  out = out
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe loading="lazy"[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
  return out.trim();
}

/** ✅ แปลง HTML เป็นข้อความสำหรับ Schema FAQPage (ดีที่สุดให้เป็น text) */
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

// --- 1. Metadata Generation ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Article Not Found" };

  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const ogImage = resolveThumbnailUrl(post.thumbnail);
  const title = `${post.title} | ${BRAND}`;
  const desc = (post.excerpt || post.title || "").substring(0, 160);

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: desc,
      siteName: BRAND,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      locale: "th_TH",
      publishedTime: post.date || post.createdAt,
      authors: [post.author || BRAND],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

// --- 2. Main Page Component (Server Side) ---
export default async function PostDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  // Prepare Data
  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const thumbUrl = resolveThumbnailUrl(post.thumbnail);
  const relatedPosts = await getRelatedPosts(post.slug, post.tags);

  const faqs = Array.isArray(post.faqs) ? post.faqs : [];
  const validFaqs = faqs
    .map((f) => ({
      q: String(f?.q || "").trim(),
      a: sanitizeFaqHtml(String(f?.a || "").trim()),
    }))
    .filter((x) => x.q && x.a);

  // ✅ FAQPage Schema (ล็อกลำดับด้วย position)
  const faqSchema =
    validFaqs.length >= 3
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          "isPartOf": { "@id": url },
          "mainEntity": validFaqs.map((f, i) => ({
            "@type": "Question",
            "position": i + 1,
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": stripHtmlToText(f.a),
            },
          })),
        }
      : null;

  // --- 3. Advanced Schema Graph (E-E-A-T Optimized) ---
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      // Reference to main entities (defined in Layout)
      { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      { "@type": "Person", "@id": `${SITE_URL}/#person` },

      // Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${url}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "บทความ", "item": `${SITE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": url },
        ],
      },

      // Article Node (Main Entity)
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        "mainEntityOfPage": { "@type": "WebPage", "@id": url },
        "headline": post.title,
        "description": post.excerpt || post.title,
        "image": [thumbUrl],
        "datePublished": post.date || post.createdAt,
        "dateModified": post.updatedAt || post.date || post.createdAt,
        "author": {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          "name": post.author || "กองบรรณาธิการ",
        },
        "publisher": { "@id": `${SITE_URL}/#organization` },
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "keywords": Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
        "articleSection": "บทความ",
        "inLanguage": "th-TH",
      },

      // ✅ เชื่อม FAQ เข้า Graph (ถ้ามี)
      ...(faqSchema
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              "isPartOf": { "@id": url },
              "mainEntity": faqSchema.mainEntity,
              "inLanguage": "th-TH",
            },
          ]
        : []),
    ],
  };

  return (
    <Fragment>
      <JsonLd json={graphSchema} />
      {/* ✅ ใส่ FAQPage แบบแยกอีกชั้น (ปลอดภัย/ชัด) */}
      {faqSchema ? <JsonLd json={faqSchema} /> : null}

      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small mb-0">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none">
                หน้าแรก
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/blog" className="text-decoration-none">
                บทความ
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Main Content Column */}
          <article className="col-lg-8">
            <header className="mb-4">
              {/* Tags */}
              <div className="mb-3 d-flex gap-2 flex-wrap">
                {post.tags?.map((tag, i) => (
                  <Link
                    key={i}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="badge bg-light text-primary text-decoration-none border px-3 py-2"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <h1 className="fw-bold display-5 mb-3">{post.title}</h1>

              <div className="d-flex align-items-center text-muted mb-4 border-bottom pb-4">
                <span className="me-3">
                  📅 {post.date ? new Date(post.date).toLocaleDateString("th-TH") : "ไม่ระบุวันที่"}
                </span>
                <span className="me-3">•</span>
                <span>✍️ {post.author || "กองบรรณาธิการ"}</span>
              </div>
            </header>

            {/* Featured Image */}
            <div
              className="position-relative w-100 rounded-4 overflow-hidden shadow-sm mb-5"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={thumbUrl}
                alt={post.title}
                fill
                priority={true}
                className="object-fit-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
              />
            </div>

            {/* Article Body */}
            <div
              className="article-content fs-5 lh-lg text-dark"
              dangerouslySetInnerHTML={{ __html: sanitizeContentHtml(post.contentHtml, post.title) }}
            />

            {/* ✅ FAQ Section (Semantic HTML + ลำดับเป๊ะ) */}
            {validFaqs.length >= 3 && (
              <section className="mt-5 pt-4 border-top" aria-label="คำถามที่พบบ่อย">
                <h2 className="h4 fw-bold mb-3">คำถามที่พบบ่อย</h2>
                <div className="accordion" id="faqAccordion">
                  {validFaqs.map((f, i) => {
                    const hid = `faqH-${i}`;
                    const cid = `faqC-${i}`;
                    return (
                      <div className="accordion-item" key={`faq-${i}`}>
                        <h3 className="accordion-header" id={hid}>
                          <button
                            className={`accordion-button ${i === 0 ? "" : "collapsed"}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${cid}`}
                            aria-expanded={i === 0 ? "true" : "false"}
                            aria-controls={cid}
                          >
                            {i + 1}. {f.q}
                          </button>
                        </h3>
                        <div
                          id={cid}
                          className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                          aria-labelledby={hid}
                          data-bs-parent="#faqAccordion"
                        >
                          <div
                            className="accordion-body"
                            dangerouslySetInnerHTML={{ __html: f.a }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Share / Tags Footer */}
            <div className="mt-5 pt-4 border-top">
              <h2 className="h6 fw-bold mb-3">แท็กที่เกี่ยวข้อง:</h2>
              <div className="d-flex flex-wrap gap-2">
                {post.tags?.map((tag, i) => (
                  <Link
                    key={i}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="col-lg-4">
            <div className="position-sticky" style={{ top: "2rem" }}>
              {/* CTA */}
              <div className="p-4 bg-primary bg-opacity-10 rounded-4 mb-4 border border-primary border-opacity-25">
                <h2 className="h5 fw-bold text-primary mb-2">ปรึกษายิงแอดสายเทา?</h2>
                <p className="small text-muted mb-3">
                  อย่าปล่อยให้บัญชีโดนแบนซ้ำซาก ให้ผู้เชี่ยวชาญช่วยวางโครงสร้างที่ปลอดภัย
                </p>
                <Link href="/contact" className="btn btn-primary w-100">
                  ขอคำปรึกษาฟรี
                </Link>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="p-4 bg-light rounded-4 border">
                  <h2 className="h5 fw-bold mb-3">บทความที่น่าสนใจ</h2>
                  <div className="d-flex flex-column gap-3">
                    {relatedPosts.map((rp, i) => (
                      <Link
                        key={i}
                        href={`/blog/${rp.slug}`}
                        className="group d-flex align-items-start text-decoration-none mb-3"
                      >
                        <div
                          className="flex-shrink-0 position-relative rounded overflow-hidden"
                          style={{ width: "80px", height: "60px" }}
                        >
                          <Image
                            src={resolveThumbnailUrl(rp.thumbnail)}
                            alt={rp.title}
                            fill
                            className="object-fit-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="ms-3" style={{ minWidth: 0 }}>
                          <h3 className="h6 fw-bold text-dark mb-1 line-clamp-2" style={{ fontSize: "0.95rem" }}>
                            {rp.title}
                          </h3>
                          <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                            {rp.date ? new Date(rp.date).toLocaleDateString("th-TH") : ""}
                          </small>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </Fragment>
  );
}
