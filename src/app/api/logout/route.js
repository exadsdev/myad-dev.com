import { NextResponse } from "next/server";
import { TOKEN_COOKIE, expireCookie } from "@/lib/simpleAuth";

export const runtime = "edge";

export async function GET(req) {
  const url = new URL("/login", req.url);
  const res = NextResponse.redirect(url);
  res.headers.set("Set-Cookie", expireCookie(TOKEN_COOKIE));
  return res;
}
