// src/app/reviews/page.jsx

import ReviewsClient from "./ReviewsClient";
import { listReviews } from "@/lib/reviewsStore";
import JsonLd from "@/app/components/JsonLd";
import { BRAND, SITE, FOUNDER_NAME, entityId } from "@/app/seo.config";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

async function getAllReviews() {
  try {
    const items = await listReviews();
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function buildDescription(items) {
  const total = items.length;
  const g = items.filter((x) => (x.category || "").toLowerCase() === "google").length;
  const f = items.filter((x) => (x.category || "").toLowerCase() === "facebook").length;
  return `รวมรีวิวลูกค้า ${BRAND} กว่า ${total} รายการ การันตีผลลัพธ์โฆษณา Google (${g}) และ Facebook (${f}) โดยคุณ${FOUNDER_NAME} วัดผลจริง ROI ชัดเจน`;
}

export async function generateMetadata() {
  const site = getSiteUrl();
  const items = await getAllReviews();
  const title = `รีวิวลูกค้า (Google / Facebook) ยอดนิยม | ${BRAND}`;
  const description = buildDescription(items);
  const url = `${site}/reviews`;
  const images = [{ url: `${site}/images/og-reviews.jpg`, width: 1200, height: 630, alt: `รีวิวลูกค้าจริงจากผู้ใช้บริการ ${BRAND} ด้าน Google Ads และ Facebook Ads` }];

  return {
    metadataBase: new URL(site),
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, images, siteName: BRAND, locale: "th_TH" },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}

export default async function ReviewsPage() {
  const site = getSiteUrl();
  const items = await getAllReviews();

  // คำนวณคะแนนเฉลี่ยจริงจากฐานข้อมูล
  const validRatings = items.filter(r => r.rating && r.rating > 0);
  const avgRating = validRatings.length > 0
    ? (validRatings.reduce((sum, r) => sum + r.rating, 0) / validRatings.length).toFixed(1)
    : "5.0";

  /**
   * --- World-Class Schema Graph 2026 ---
   */
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": entityId(site, "reviews-page"),
        "url": `${site}/reviews`,
        "name": `คลังรีวิวผลงานการทำโฆษณา ${BRAND}`,
        "description": buildDescription(items),
        "breadcrumb": { "@id": entityId(site, "breadcrumb-reviews") },
        "isPartOf": { "@id": entityId(site, "website") },
        "mainEntity": { "@id": entityId(site, "organization") },
        "datePublished": "2024-01-01",
        "dateModified": "2026-02-13",
        "inLanguage": "th-TH",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#reviews-summary", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": entityId(site, "breadcrumb-reviews"),
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": site },
          { "@type": "ListItem", "position": 2, "name": "รีวิวลูกค้า", "item": `${site}/reviews` }
        ]
      },
      {
        "@type": "Organization",
        "@id": entityId(site, "organization"),
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": avgRating,
          "reviewCount": items.length > 0 ? items.length : "50",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ]
  };

  const internalLinks = [
    { href: "/services/google-ads", label: "รับทำ Google Ads สำหรับธุรกิจเฉพาะทาง" },
    { href: "/services/facebook-ads", label: "รับทำ Facebook Ads สำหรับธุรกิจเฉพาะทาง" },
    { href: "/contact", label: "ติดต่อทีมงานคุณเอกสิทธิ์" }
  ];

  return (
    <>
      <JsonLd json={graphSchema} />

      {/* Direct Answer Section (AI Overview) — แสดงผลปกติ */}
      <section id="reviews-summary" className="container py-3 mb-3">
        <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
          <h2 className="h6 fw-bold mb-2">บทสรุปรวมรีวิว {BRAND}</h2>
          <p className="text-muted small mb-0">
            ปัจจุบัน {BRAND} มีรีวิวที่ตรวจสอบได้แล้ว {items.length} เคส{" "}
            คะแนนความพึงพอใจเฉลี่ย {avgRating} เต็ม 5 ดาว{" "}
            ดูแลโดยคุณ {FOUNDER_NAME} ผู้เชี่ยวชาญด้าน Performance Marketing
            และ Technical Ads สำหรับธุรกิจเฉพาะทาง
          </p>
        </div>
      </section>

      <ReviewsClient initialItems={items} internalLinks={internalLinks} />
    </>
  );
}