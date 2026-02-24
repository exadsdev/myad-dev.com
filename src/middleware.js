import { NextResponse } from "next/server";
import { TOKEN_COOKIE, verifyToken } from "@/lib/simpleAuth";
import { getCanonicalHostname, getSiteUrl } from "@/lib/site-url";

export const config = {
  // Run for all pages/routes (skip static assets via runtime checks below)
  matcher: ["/:path*"],
};

export async function middleware(request) {
  const url = new URL(request.url);

  // Canonical host enforcement (www/non-www only). Skip localhost/dev.
  const host = url.hostname;
  const isLocalhost = host === "localhost" || host === "127.0.0.1" || host === "::1";
  const pathname = url.pathname || "/";
  const isAsset = pathname.startsWith("/_next") || /\.[a-zA-Z0-9]+$/.test(pathname);
  if (!isLocalhost && !isAsset) {
    const canonicalHost = getCanonicalHostname();
    const isWwwVariant = host === `www.${canonicalHost}` || canonicalHost === `www.${host}`;
    if (isWwwVariant && host !== canonicalHost) {
      const canonicalBase = new URL(getSiteUrl());
      const redirectUrl = new URL(request.url);
      redirectUrl.hostname = canonicalHost;
      redirectUrl.protocol = canonicalBase.protocol;
      return NextResponse.redirect(redirectUrl, 308);
    }
  }

  // Admin auth gate
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const cookie = getCookie(request.headers.get("cookie") || "", TOKEN_COOKIE);
  const SECRET = process.env.AUTH_SECRET || "change_me_now";

  if (!cookie) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(url.pathname + url.search)}`, url.origin));
  }

  const ok = await verifyToken(cookie, SECRET);
  if (!ok) {
    const res = NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(url.pathname + url.search)}`, url.origin));
    res.headers.append("Set-Cookie", `${TOKEN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
    return res;
  }

  return NextResponse.next();
}

function getCookie(cookieHeader, name) {
  const m = cookieHeader.match(new RegExp(`(?:^|;)\\s*${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}
