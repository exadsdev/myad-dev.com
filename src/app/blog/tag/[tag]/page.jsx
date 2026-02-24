import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { getAllPosts } from "@/lib/postsStore";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";
import { SITE, BRAND } from "@/app/seo.config";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;

async function getAll() {
  const items = await getAllPosts();
  const arr = Array.isArray(items) ? items : [];
  arr.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return arr;
}

export async function generateMetadata({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag || "");
  const url = `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`;

  const title = `แท็ก #${tag} | บทความการตลาดออนไลน์ - ${BRAND}`;
  const desc = `รวมบทความเทคนิค กลยุทธ์ และแนวทางการทำโฆษณาที่เกี่ยวข้องกับ #${tag} จากทีมผู้เชี่ยวชาญ ${BRAND}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: "website",
      siteName: BRAND,
      locale: "th_TH",
    },
    twitter: {
      card: "summary",
      title,
      description: desc,
    },
  };
}

export default async function TagPage({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag || "");
  const all = await getAll();
  const url = `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`;

  const items = all.filter((a) =>
    (a.tags || []).some(
      (t) => String(t).trim().toLowerCase() === tag.trim().toLowerCase()
    )
  );

  // FAQ Items with more valuable content for AI Overview
  const faqItems = [
    {
      q: `แท็ก #${tag} เกี่ยวข้องกับเนื้อหาอะไร?`,
      a: `บทความในกลุ่มนี้จะเน้นเรื่อง ${tag} เป็นหลัก โดยครอบคลุมทั้งเทคนิคการตั้งค่า กลยุทธ์การตลาด และแนวทางการวัดผลที่เกี่ยวข้อง เขียนโดยทีมผู้เชี่ยวชาญ ${BRAND} ที่มีประสบการณ์กว่า 10 ปี`,
    },
    {
      q: "บทความมีการอัปเดตบ่อยแค่ไหน?",
      a: `เรามีการอัปเดตบทความใหม่ๆ เป็นประจำตามการเปลี่ยนแปลงของแพลตฟอร์มโฆษณาเพื่อให้เนื้อหามีความทันสมัยอยู่เสมอ ทีมงาน ${BRAND} ติดตามนโยบายล่าสุดจาก Google และ Meta อย่างต่อเนื่อง`,
    },
    {
      q: `ใครเขียนบทความในหมวด ${tag}?`,
      a: `บทความทั้งหมดเขียนและตรวจสอบโดยทีม ${BRAND} ซึ่งเป็นผู้เชี่ยวชาญด้าน Technical Marketing ที่ได้รับ Google Ads Certification และ Meta Blueprint Certification`,
    },
  ];

  // Advanced Schema Graph for E-E-A-T & AI Overview
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      // Reference to main entities (defined in Layout)
      { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      { "@type": "Person", "@id": `${SITE_URL}/#person` },
      // CollectionPage for this tag
      {
        "@type": "CollectionPage",
        "@id": `${url}/#webpage`,
        "url": url,
        "name": `แท็ก #${tag} | บทความการตลาดออนไลน์`,
        "description": `รวมบทความเกี่ยวกับ ${tag} จาก ${BRAND}`,
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "about": { "@id": `${SITE_URL}/#organization` },
        "breadcrumb": { "@id": `${url}/#breadcrumb` },
        "inLanguage": "th-TH",
        "dateModified": new Date().toISOString().split('T')[0]
      },
      // Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${url}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "บล็อก", "item": `${SITE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": `#${tag}`, "item": url },
        ]
      },
      // ItemList for articles
      {
        "@type": "ItemList",
        "@id": `${url}/#itemlist`,
        "name": `บทความเกี่ยวกับ ${tag}`,
        "numberOfItems": items.length,
        "itemListElement": items.slice(0, 10).map((a, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "BlogPosting",
            "headline": a.title,
            "url": `${SITE_URL}/blog/${a.slug}`,
            "datePublished": a.date || a.createdAt,
            "author": { "@id": `${SITE_URL}/#person` },
            "publisher": { "@id": `${SITE_URL}/#organization` }
          }
        }))
      },
      // FAQPage Schema
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  return (
    <Fragment>
      {/* Inject Advanced Schema Graph */}
      <JsonLd json={graphSchema} />

      {/* Direct Answer Summary for AI Overview */}
      <p className="visually-hidden" aria-hidden="false">
        {`หน้ารวมบทความแท็ก #${tag} จาก ${BRAND} - คลังความรู้การตลาดออนไลน์และ Google Ads สายเทา 
        พบ ${items.length} บทความ เขียนโดยผู้เชี่ยวชาญที่ได้รับ Google Ads Certification`}
      </p>

      {/* Note: ไม่ใช้ <main> ซ้อนเพราะ Layout มี <main> อยู่แล้ว */}
      <div className="container-fluid py-5">
        {/* Breadcrumb Visual */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted">หน้าแรก</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/blog" className="text-decoration-none text-muted">บล็อก</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">#{tag}</li>
          </ol>
        </nav>

        <header className="mb-5">
          <h1 className="fw-bold mb-2">
            บทความภายใต้แท็ก: <span className="text-primary">#{tag}</span>
          </h1>
          <p className="text-muted lead">
            พบ <strong>{items.length}</strong> บทความที่พร้อมให้ความรู้และแนวทางเกี่ยวกับ {tag}
          </p>
        </header>

        <div className="row g-4">
          {items.map((a, idx) => (
            <div key={`${a.slug}-${idx}`} className="col-md-6 col-lg-4">
              <article
                className="card shadow-sm h-100 border-0 overflow-hidden hover-lift"
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                {a.thumbnail && (
                  <Link href={`/blog/${a.slug}`} className="d-block overflow-hidden">
                    <div className="ratio ratio-16x9">
                      <Image
                        src={a.thumbnail.startsWith('/') ? a.thumbnail : `/${a.thumbnail}`}
                        alt={a.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-fit-cover hover-scale"
                        loading={idx < 3 ? "eager" : "lazy"}
                        priority={idx < 2}
                      />
                    </div>
                  </Link>
                )}

                <div className="card-body d-flex flex-column p-4">
                  <h2 className="h5 fw-bold mb-3">
                    <Link
                      href={`/blog/${a.slug}`}
                      className="link-dark text-decoration-none hover-primary"
                      itemProp="headline"
                    >
                      {a.title}
                    </Link>
                  </h2>

                  <div className="text-muted small mb-3 d-flex align-items-center gap-2">
                    <time itemProp="datePublished" dateTime={a.date || a.createdAt}>
                      📅 {a.date || new Date(a.createdAt).toLocaleDateString('th-TH')}
                    </time>
                    {a.author && (
                      <span itemProp="author" itemScope itemType="https://schema.org/Person">
                        • <span itemProp="name">{a.author}</span>
                      </span>
                    )}
                  </div>

                  <p
                    className="card-text text-muted mb-4 flex-grow-1"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 3,
                      minHeight: "4.5em",
                    }}
                    itemProp="description"
                  >
                    {a.excerpt || ""}
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={`/blog/${a.slug}`}
                      className="btn btn-outline-primary w-100 rounded-pill"
                      itemProp="url"
                    >
                      อ่านต่อเพิ่มเติม →
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-12 text-center py-5 bg-light rounded-3">
              <div className="display-1 mb-3">📭</div>
              <h3 className="h5 text-muted mb-3">ยังไม่มีบทความในแท็กนี้ในระบบ</h3>
              <Link href="/blog" className="btn btn-primary">
                ดูบทความทั้งหมด
              </Link>
            </div>
          )}
        </div>

        {/* FAQ Section - withSchema=false เพราะมี FAQPage schema ใน graphSchema แล้ว */}
        <section className="mt-5 pt-4 border-top" aria-labelledby="tag-faq-title">
          <h2 id="tag-faq-title" className="h4 fw-bold mb-4">
            คำถามที่พบบ่อยเกี่ยวกับ #{tag}
          </h2>
          <FAQ items={faqItems} withSchema={false} withTitle={false} pageUrl={url} accordionId={`faq-tag-${tag.replace(/\s+/g, '-')}`} />
        </section>
      </div>
    </Fragment>
  );
}
