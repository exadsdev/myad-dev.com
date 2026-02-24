import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/postsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const items = await getAllPosts();
  return NextResponse.json({ ok: true, items });
}
