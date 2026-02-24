import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import { BRAND } from "@/app/seo.config";
import { getSiteUrl } from "@/lib/site-url";
import { getAllPosts } from "@/lib/postsStore";
import { getAllVideos } from "@/lib/videosStore";
import { getAllReviews } from "@/lib/reviewsStore";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateMetadata() {
  const site = getSiteUrl();
  const url = `${site}/sitemap`;
  return {
    metadataBase: new URL(site),
    title: `แผนผังเว็บไซต์ (Sitemap) | ${BRAND}`,
    description: `รวมลิงก์สำคัญทั้งหมดของเว็บไซต์ ${BRAND} เพื่อให้ค้นหาข้อมูลได้ง่าย และช่วยให้บอทค้นพบหน้าได้ครบถ้วน`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `แผนผังเว็บไซต์ (Sitemap) | ${BRAND}`,
      description: `รวมลิงก์สำคัญทั้งหมดของเว็บไซต์ ${BRAND}`,
      siteName: BRAND,
      locale: "th_TH",
      images: [{ url: `${site}/images/og-default.jpg`, width: 1200, height: 630, alt: `${BRAND} Sitemap` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `แผนผังเว็บไซต์ (Sitemap) | ${BRAND}`,
      description: `รวมลิงก์สำคัญทั้งหมดของเว็บไซต์ ${BRAND}`,
      images: [`${site}/images/og-default.jpg`],
    },
  };
}

export default async function SitemapPage() {
  const site = getSiteUrl();
  const url = `${site}/sitemap`;

  const [posts, videos, reviews] = await Promise.all([
    getAllPosts().catch(() => []),
    getAllVideos().catch(() => []),
    getAllReviews().catch(() => []),
  ]);

  const staticLinks = [
    { name: "หน้าแรก", href: "/" },
    { name: "บริการ", href: "/services" },
    { name: "บริการ Google Ads", href: "/services/google-ads" },
    { name: "บริการ Facebook Ads", href: "/services/facebook-ads" },
    { name: "บทความ", href: "/blog" },
    { name: "วิดีโอ", href: "/videos" },
    { name: "รีวิวลูกค้า", href: "/reviews" },
    { name: "คำถามที่พบบ่อย", href: "/faq" },
    { name: "เกี่ยวกับเรา", href: "/about" },
    { name: "ติดต่อเรา", href: "/contact" },
    { name: "ความเป็นส่วนตัว", href: "/privacy" },
    { name: "ข้อกำหนดการใช้งาน", href: "/terms" },
    { name: "นโยบายคืนเงิน", href: "/refund" },
    { name: "แนวทางความปลอดภัย", href: "/safety" },
  ];

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${site}/#organization` },
      { "@type": "WebSite", "@id": `${site}/#website` },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": `แผนผังเว็บไซต์ (Sitemap) | ${BRAND}`,
        "isPartOf": { "@id": `${site}/#website` },
        "about": { "@id": `${site}/#organization` },
        "inLanguage": "th-TH",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": site },
          { "@type": "ListItem", "position": 2, "name": "แผนผังเว็บไซต์", "item": url },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd json={graphSchema} />

      <header className="py-4">
        <h1 className="fw-bold mb-2">แผนผังเว็บไซต์ (Sitemap)</h1>
        <p className="text-muted mb-0">
          รวมลิงก์สำคัญทั้งหมดของเว็บไซต์เพื่อให้ค้นหาข้อมูลได้ง่าย และช่วยให้บอทค้นพบหน้าได้ครบถ้วน
        </p>
      </header>

      <section className="mb-4" aria-label="ลิงก์หลัก">
        <h2 className="h4 fw-bold mb-3">ลิงก์หลัก</h2>
        <ul className="row row-cols-1 row-cols-md-2 g-2 list-unstyled">
          {staticLinks.map((x) => (
            <li key={x.href} className="col">
              <Link className="text-decoration-none" href={x.href}>
                {x.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4" aria-label="บทความทั้งหมด">
        <h2 className="h4 fw-bold mb-3">บทความ</h2>
        <ul className="list-unstyled">
          {(Array.isArray(posts) ? posts : []).slice(0, 200).map((p) => (
            <li key={p.slug} className="mb-1">
              <Link className="text-decoration-none" href={`/blog/${p.slug}`}>
                {p.title || p.slug}
              </Link>
            </li>
          ))}
        </ul>
        {Array.isArray(posts) && posts.length > 200 && (
          <p className="text-muted">แสดง 200 รายการล่าสุด (ดูทั้งหมดได้ที่หน้า “บทความ”)</p>
        )}
      </section>

      <section className="mb-4" aria-label="วิดีโอทั้งหมด">
        <h2 className="h4 fw-bold mb-3">วิดีโอ</h2>
        <ul className="list-unstyled">
          {(Array.isArray(videos) ? videos : []).slice(0, 200).map((v) => (
            <li key={v.slug} className="mb-1">
              <Link className="text-decoration-none" href={`/videos/${v.slug}`}>
                {v.title || v.slug}
              </Link>
            </li>
          ))}
        </ul>
        {Array.isArray(videos) && videos.length > 200 && (
          <p className="text-muted">แสดง 200 รายการล่าสุด (ดูทั้งหมดได้ที่หน้า “วิดีโอ”)</p>
        )}
      </section>

      <section className="mb-5" aria-label="รีวิวทั้งหมด">
        <h2 className="h4 fw-bold mb-3">รีวิวลูกค้า</h2>
        <ul className="list-unstyled">
          {(Array.isArray(reviews) ? reviews : []).slice(0, 200).map((r) => (
            <li key={r.slug} className="mb-1">
              <Link className="text-decoration-none" href={`/reviews/${r.slug}`}>
                {r.title || r.slug}
              </Link>
            </li>
          ))}
        </ul>
        {Array.isArray(reviews) && reviews.length > 200 && (
          <p className="text-muted">แสดง 200 รายการล่าสุด (ดูทั้งหมดได้ที่หน้า “รีวิวลูกค้า”)</p>
        )}
      </section>
    </>
  );
}
