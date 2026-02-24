import { NextResponse } from "next/server";
import { TOKEN_COOKIE, signToken, makeCookie } from "@/lib/simpleAuth";

export const runtime = "edge"; // use Web Crypto

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body || {};

  const USER = process.env.ADMIN_USER || "admin";
  const PASS = process.env.ADMIN_PASS || "1122";
  const SECRET = process.env.AUTH_SECRET || "change_me_now";

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  if (username !== USER || password !== PASS) {
    return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = { u: username, iat: now, exp: now + 7 * 24 * 60 * 60 };
  const token = await signToken(payload, SECRET);

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", makeCookie(TOKEN_COOKIE, token, 7 * 24 * 60 * 60));
  return res;
}
