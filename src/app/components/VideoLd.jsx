import React from "react";
import JsonLd from "@/app/components/JsonLd";
import { SITE, BRAND, LOGO_URL, entityId } from "@/app/seo.config";

/**
 * VideoObject JSON-LD
 * - Connects to global Knowledge Graph via @id (Organization/WebSite).
 * - Avoids localhost fallbacks (SEO critical).
 * - Produces stable absolute URLs for Google Video indexing.
 */
export default function VideoLd({ video }) {
  if (!video) return null;

  const site = process.env.NEXT_PUBLIC_SITE_URL || SITE;
  const origin = String(site || SITE).replace(/\/+$/, "");

  const orgId = entityId(origin, "organization");
  const websiteId = entityId(origin, "website");

  const pageUrl = `${origin}/videos/${encodeURIComponent(video.slug || "")}`;

  const resolveAbs = (p) => {
    const s = String(p || "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    const rel = s.startsWith("/") ? s : `/${s}`;
    return `${origin}${rel}`;
  };

  const thumbAbs = resolveAbs(video.thumbnail || "/images/og-default.jpg");

  const embedUrl = (() => {
    const y = String(video.youtube || "").trim();
    if (!y) return "";
    if (/^https?:\/\//i.test(y)) return y;
    // treat as youtube id
    return `https://www.youtube.com/watch?v=${encodeURIComponent(y)}`;
  })();

  const formatDuration = (seconds) => {
    const n = Number(seconds);
    if (!Number.isFinite(n) || n <= 0) return undefined;
    const h = Math.floor(n / 3600);
    const m = Math.floor((n % 3600) / 60);
    const s = Math.floor(n % 60);
    return `PT${h > 0 ? `${h}H` : ""}${m > 0 ? `${m}M` : ""}${s > 0 ? `${s}S` : ""}`;
  };

  const toIsoDateTime = (dateStr) => {
    if (!dateStr) return undefined;
    const d = new Date(String(dateStr));
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString();
  };

  const title = String(video.title || "").trim();
  const description = String(video.excerpt || video.description || title || "").trim();

  const keywords = Array.isArray(video.keywords) ? video.keywords.filter(Boolean).join(", ") : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${pageUrl}#video`,
    name: title,
    description,
    thumbnailUrl: thumbAbs ? [thumbAbs] : undefined,
    uploadDate: toIsoDateTime(video.uploadDate || video.date || video.createdAt),
    duration: formatDuration(video.duration),
    contentUrl: pageUrl,
    embedUrl: embedUrl || undefined,
    inLanguage: "th-TH",
    keywords,
    transcript: video.transcript || undefined,
    isPartOf: { "@id": websiteId },
    publisher: { "@id": orgId },
  };

  // Optional: link author to global Person when possible
  if (video.author) {
    jsonLd.author = {
      "@type": "Person",
      name: String(video.author),
      worksFor: { "@id": orgId },
    };
  }

  // Optional: engagement (do not fabricate)
  const views = Number(video.views);
  if (Number.isFinite(views) && views > 0) {
    jsonLd.interactionStatistic = {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: Math.floor(views),
    };
  }

  // Provide a publisher logo only if it can be resolved
  const logoAbs = resolveAbs(LOGO_URL || "/images/logo.png");
  if (logoAbs) {
    jsonLd.publisher = {
      "@id": orgId,
      logo: {
        "@type": "ImageObject",
        url: logoAbs,
        width: 512,
        height: 512,
      },
      name: typeof BRAND === "string" ? BRAND : "MyAdsDev",
    };
  }

  return <JsonLd json={jsonLd} />;
}
