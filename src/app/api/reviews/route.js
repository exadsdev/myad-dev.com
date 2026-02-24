import { NextResponse } from "next/server";
import { getAllReviews } from "@/lib/reviewsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const items = await getAllReviews();
  return NextResponse.json({ ok: true, items });
}
