// src/app/reviews/[slug]/page.jsx

import { notFound } from "next/navigation";
import ReviewDetailClient from "./ReviewDetailClient";
import { getReviewBySlug, getAllReviews } from "@/lib/reviewsStore";
import JsonLd from "@/app/components/JsonLd";
import { BRAND, SITE, entityId } from "@/app/seo.config";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

function buildDescription(v) {
  const raw = (v?.excerpt || v?.title || "").trim().replace(/\s+/g, " ");
  const max = 160;
  return raw.length > max ? raw.slice(0, max - 1) + "…" : raw;
}

export async function generateStaticParams() {
  try {
    const items = await getAllReviews();
    return (Array.isArray(items) ? items : [])
      .map((x) => x?.slug)
      .filter(Boolean)
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const site = getSiteUrl();
  const { slug } = await params;
  const v = await getReviewBySlug(slug);

  if (!v) {
    return {
      title: `ไม่พบรีวิว | ${BRAND}`,
      robots: { index: false, follow: false },
    };
  }

  const title = `${v.title} | ${BRAND}`;
  const description = buildDescription(v);
  const url = `${site}/reviews/${v.slug}`;
  const ogImage = v.thumbnail?.startsWith("http") ? v.thumbnail : `${site}${v.thumbnail || "/images/og-default.jpg"}`;

  return {
    metadataBase: new URL(site),
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: BRAND, images: [{ url: ogImage }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ReviewDetailPage({ params }) {
  const site = getSiteUrl();
  const { slug } = await params;
  const item = await getReviewBySlug(slug);
  if (!item) return notFound();

  const currentUrl = `${site}/reviews/${item.slug}`;

  /**
   * --- World-Class Schema Graph Synergy ---
   * เชื่อมโยง Review นี้เข้ากับโครงสร้างหลักของเว็บไซต์ผ่าน @id Graph
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Review",
        "@id": entityId(currentUrl, "review"),
        "name": item.title,
        "author": { "@type": "Person", "name": item.author || "ลูกค้า MyAdsDev" },
        "datePublished": item.date,
        "reviewBody": item.excerpt || item.title,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": String(item?.rating && Number(item.rating) > 0 ? item.rating : 5),
          "bestRating": "5",
          "worstRating": "1"
        },
        "itemReviewed": {
          "@type": "Service",
          "name": String(item.category || "").toLowerCase() === "google" ? "Google Ads Technical Service" : "Facebook Ads Technical Service",
          "provider": { "@id": entityId(site, "organization") }
        },
        "publisher": { "@id": entityId(site, "organization") }
      },
      {
        "@type": "BreadcrumbList",
        "@id": entityId(currentUrl, "breadcrumb"),
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": site },
          { "@type": "ListItem", "position": 2, "name": "รีวิวลูกค้า", "item": `${site}/reviews` },
          { "@type": "ListItem", "position": 3, "name": item.title, "item": currentUrl }
        ]
      }
    ]
  };

  const internalLinks = [
    { href: "/services/google-ads", label: "รับยิงแอด Google Ads สายเทา" },
    { href: "/services/facebook-ads", label: "รับยิงแอด Facebook Ads สายเทา" },
    { href: "/packages", label: "ราคาและแพ็กเกจ" },
    { href: "/contact", label: "ติดต่อคุณเอกสิทธิ์" }
  ];

  return (
    <>
      <JsonLd json={jsonLd} />
      <ReviewDetailClient review={item} internalLinks={internalLinks} />
    </>
  );
}
