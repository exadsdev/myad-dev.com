const FALLBACK_SITE_URL = "https://myad-dev.com";

function normalizeOrigin(input) {
  const raw = String(input || "").trim();
  const candidate = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;

  try {
    const url = new URL(candidate);
    return url.origin.replace(/\/+$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrl() {
  return normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL);
}

export function getCanonicalHostname() {
  return new URL(getSiteUrl()).hostname;
}

export function withSiteUrl(pathname = "") {
  const origin = getSiteUrl();
  if (!pathname) return origin;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${path}`;
}
