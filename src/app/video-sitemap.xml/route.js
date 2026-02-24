// app/api/video-sitemap/route.js
import { NextResponse } from "next/server";
import { getAllVideos, extractYoutubeId } from "@/lib/videosStore";
import { getSiteUrl, withSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * ป้องกันอักขระพิเศษทำลายโครงสร้าง XML
 */
function escapeXml(input = "") {
  return String(input || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * แปลงวันที่ให้เป็น ISO 8601 (YYYY-MM-DDThh:mm:ss+TZD)
 */
function toISODate(value) {
  if (!value) return new Date().toISOString();
  const dt = new Date(value);
  return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
}

/**
 * แปลง Duration จาก PT4M15S เป็นวินาที (Google แนะนำให้ใช้เลขวินาที)
 */
function parseDurationToSeconds(durationStr) {
  if (!durationStr) return 0;
  const match = durationStr.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const minutes = parseInt(match[1] || 0);
  const seconds = parseInt(match[2] || 0);
  return (minutes * 60) + seconds;
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const videos = await Promise.resolve().then(() => getAllVideos()).catch(() => []);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

  for (const v of videos) {
    const loc = withSiteUrl(`/videos/${encodeURIComponent(v.slug)}`);
    const lastmod = toISODate(v.uploadDate || v.updatedAt || v.date);

    // 1. ตรวจสอบ YouTube ID
    const youtubeId = extractYoutubeId?.(v.youtube || "");

    if (!youtubeId) {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(loc)}</loc>\n`;
      xml += `    <lastmod>${escapeXml(lastmod)}</lastmod>\n`;
      xml += `  </url>\n`;
      continue;
    }

    // 2. จัดการ Thumbnail URL ให้เป็น Absolute URL เสมอ (แก้ไขตามปัญหาในภาพ)
    const rawThumbnail = v.thumbnail || "";
    let thumbnail = "";

    if (rawThumbnail.startsWith('http')) {
      thumbnail = rawThumbnail; // เป็นลิงก์เต็มอยู่แล้ว
    } else if (rawThumbnail.startsWith('/')) {
      thumbnail = withSiteUrl(rawThumbnail); // เป็น Path ภายใน ให้เติม Domain
    } else {
      thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`; // ใช้รูปจาก YouTube เป็นตัวสำรอง
    }

    const title = v.title || "Video";
    const description = v.excerpt || v.description || "Video description";
    const playerLoc = `https://www.youtube.com/embed/${youtubeId}`;
    const durationSec = parseDurationToSeconds(v.duration);

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${escapeXml(lastmod)}</lastmod>\n`;
    xml += `    <video:video>\n`;
    xml += `      <video:thumbnail_loc>${escapeXml(thumbnail)}</video:thumbnail_loc>\n`;
    xml += `      <video:title>${escapeXml(title)}</video:title>\n`;
    xml += `      <video:description>${escapeXml(description)}</video:description>\n`;
    xml += `      <video:player_loc>${escapeXml(playerLoc)}</video:player_loc>\n`;
    xml += `      <video:publication_date>${escapeXml(lastmod)}</video:publication_date>\n`;
    if (durationSec > 0) {
      xml += `      <video:duration>${durationSec}</video:duration>\n`;
    }
    xml += `      <video:family_friendly>yes</video:family_friendly>\n`;
    xml += `    </video:video>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}