import { NextResponse } from "next/server";
import {
  getAllPosts,
  addPostFullFirstWrite,
  deletePostBySlug,
  getStorageInfo,
} from "@/lib/postsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(data, init = {}) {
  return NextResponse.json(
    data,
    {
      status: init.status || 200,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Content-Type": "application/json; charset=utf-8",
        ...init.headers,
      },
    },
  );
}

async function parseBody(req) {
  const ct = (req.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) { try { return await req.json(); } catch { } }
  if (ct.includes("application/x-www-form-urlencoded")) {
    const txt = await req.text();
    return Object.fromEntries(new URLSearchParams(txt));
  }
  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    const obj = {};
    for (const [k, v] of fd.entries()) obj[k] = typeof v === "string" ? v : (v?.name || "");
    return obj;
  }
  try { return await req.json(); } catch { }
  const txt = await req.text().catch(() => "");
  if (txt) {
    try { return JSON.parse(txt); } catch { }
    return {};
  }
  return {};
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const debug = searchParams.get("debug");
    const items = await getAllPosts();
    if (debug) {
      const info = await getStorageInfo();
      return json({ ok: true, items, debug: info });
    }
    return json({ ok: true, items });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const b = await parseBody(req);

    const tags =
      Array.isArray(b.tags)
        ? b.tags
        : typeof b.tags === "string"
          ? b.tags.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

    const keywords =
      Array.isArray(b.keywords)
        ? b.keywords
        : typeof b.keywords === "string"
          ? b.keywords.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

    const payload = {
      slug: b.slug,
      title: b.title,
      date: b.date,
      excerpt: b.excerpt,
      tags,
      author: b.author,
      thumbnail: b.thumbnail,
      contentHtml: b.contentHtml,
      keywords,
      faqs: b.faqs || [],
    };

    if (!payload.slug) {
      return json({ ok: false, error: "Missing 'slug'." }, { status: 400 });
    }

    const { existed, item } = await addPostFullFirstWrite(payload);
    return json({ ok: true, existed, item }, { status: existed ? 200 : 201 });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return json({ ok: false, error: "Missing 'slug'." }, { status: 400 });
    const res = await deletePostBySlug(slug);
    return json({ ok: true, ...res });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
