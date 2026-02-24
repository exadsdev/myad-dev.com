import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/postsStore";
import { getAllVideos } from "@/lib/videosStore";
import { listReviews } from "@/lib/reviewsStore";
import { getSiteUrl, withSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

// ✅ เปลี่ยนจาก force-static -> force-dynamic เพื่อให้ sitemap อัปเดตทันทีหลังเพิ่มโพสต์/วิดีโอ
export const dynamic = "force-dynamic";
export const revalidate = 0;

function toISODate(value) {
  if (!value) return null;
  try {
    const dt = typeof value === "number" ? new Date(value) : new Date(String(value));
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toISOString();
  } catch {
    return null;
  }
}

function uniqLower(arr = []) {
  const set = new Set();
  for (const x of Array.isArray(arr) ? arr : []) {
    const s = String(x || "").trim();
    if (!s) continue;
    set.add(s.toLowerCase());
  }
  return Array.from(set);
}

function escapeXml(input = "") {
  return String(input || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const nowIso = new Date().toISOString();

  const [posts, videos, reviews] = await Promise.all([
    Promise.resolve().then(() => getAllPosts()).catch(() => []),
    Promise.resolve().then(() => getAllVideos()).catch(() => []),
    Promise.resolve().then(() => listReviews()).catch(() => []),
  ]);

  const postTags = uniqLower(
    (Array.isArray(posts) ? posts : []).flatMap((p) => (Array.isArray(p?.tags) ? p.tags : []))
  );

  const staticUrls = [
    { loc: siteUrl, lastmod: nowIso, changefreq: "weekly", priority: "1.0" },
    { loc: withSiteUrl("/about"), lastmod: nowIso, changefreq: "monthly", priority: "0.7" },
    { loc: withSiteUrl("/services"), lastmod: nowIso, changefreq: "weekly", priority: "0.9" },
    { loc: withSiteUrl("/services/google-ads"), lastmod: nowIso, changefreq: "weekly", priority: "0.9" },
    { loc: withSiteUrl("/services/facebook-ads"), lastmod: nowIso, changefreq: "weekly", priority: "0.9" },
    { loc: withSiteUrl("/reviews"), lastmod: nowIso, changefreq: "weekly", priority: "0.8" },
    { loc: withSiteUrl("/blog"), lastmod: nowIso, changefreq: "weekly", priority: "0.8" },
    { loc: withSiteUrl("/videos"), lastmod: nowIso, changefreq: "weekly", priority: "0.8" },
    { loc: withSiteUrl("/faq"), lastmod: nowIso, changefreq: "monthly", priority: "0.7" },
    { loc: withSiteUrl("/contact"), lastmod: nowIso, changefreq: "yearly", priority: "0.6" },
    { loc: withSiteUrl("/terms"), lastmod: nowIso, changefreq: "yearly", priority: "0.3" },
    { loc: withSiteUrl("/privacy"), lastmod: nowIso, changefreq: "yearly", priority: "0.3" },
    { loc: withSiteUrl("/privacy-policy"), lastmod: nowIso, changefreq: "yearly", priority: "0.3" },
    { loc: withSiteUrl("/refund"), lastmod: nowIso, changefreq: "yearly", priority: "0.3" },
    { loc: withSiteUrl("/safety"), lastmod: nowIso, changefreq: "yearly", priority: "0.3" },
  ];

  const postUrls = (Array.isArray(posts) ? posts : []).map((post) => ({
    loc: withSiteUrl(`/blog/${encodeURIComponent(post.slug)}`),
    lastmod: toISODate(post.updatedAt || post.createdAt || post.date) || nowIso,
    changefreq: "monthly",
    priority: "0.6",
  }));

  const tagUrls = postTags.map((tag) => ({
    loc: withSiteUrl(`/blog?tag=${encodeURIComponent(tag)}`),
    lastmod: nowIso,
    changefreq: "monthly",
    priority: "0.4",
  }));

  const videoUrls = (Array.isArray(videos) ? videos : []).map((v) => ({
    loc: withSiteUrl(`/videos/${encodeURIComponent(v.slug)}`),
    lastmod: toISODate(v.updatedAt || v.createdAt || v.uploadDate || v.date) || nowIso,
    changefreq: "monthly",
    priority: "0.6",
  }));

  const reviewUrls = (Array.isArray(reviews) ? reviews : []).map((r) => ({
    loc: withSiteUrl(`/reviews/${encodeURIComponent(r.slug)}`),
    lastmod: toISODate(r.updatedAt || r.createdAt || r.date) || nowIso,
    changefreq: "monthly",
    priority: "0.5",
  }));

  const urls = [...staticUrls, ...postUrls, ...tagUrls, ...videoUrls, ...reviewUrls];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const u of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(u.loc)}</loc>\n`;
    xml += `    <lastmod>${escapeXml(u.lastmod || nowIso)}</lastmod>\n`;
    if (u.changefreq) xml += `    <changefreq>${escapeXml(u.changefreq)}</changefreq>\n`;
    if (u.priority) xml += `    <priority>${escapeXml(u.priority)}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // ✅ กันแคชค้าง (CDN/Proxy/Browser) เพื่อให้เห็น URL ใหม่ทันทีหลังเพิ่มโพสต์
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
