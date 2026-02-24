import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 86400;

export default function robots() {
  const raw = (getSiteUrl() || "").trim();

  const siteUrl = (() => {
    const withScheme = raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;
    try {
      const u = new URL(withScheme);
      return `${u.protocol}//${u.host}`; // no trailing slash
    } catch {
      return "https://myad-dev.com";
    }
  })();

  const host = (() => {
    try {
      return new URL(siteUrl).host;
    } catch {
      return "myad-dev.com";
    }
  })();

  const disallowCommon = [
    "/admin/",
    "/api/",
    "/private/",
    "/login",
    "/logout",
  ];

  const allowCommon = [
    "/",         // allow everything by default
    "/_next/",   // IMPORTANT for Next.js render
    "/images/",
    "/img/",
    "/public/",
    "/static/",
  ];

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: allowCommon,
        disallow: disallowCommon,
      },
      {
        userAgent: "Googlebot-Image",
        allow: allowCommon,
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: allowCommon,
        disallow: disallowCommon,
      },
      {
        userAgent: "*",
        allow: allowCommon,
        disallow: disallowCommon,
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/video-sitemap.xml`],
    host,
  };
}
