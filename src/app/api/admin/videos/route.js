import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR = process.env.VIDEOS_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE =
  process.env.VIDEOS_DATA_FILE || path.join(DATA_DIR, "videos.json");

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAll() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function writeAll(items) {
  await ensureDir();
  const tmp = DATA_FILE + ".tmp";
  const payload = JSON.stringify(items, null, 2);
  await fs.writeFile(tmp, payload, "utf8");
  await fs.rename(tmp, DATA_FILE);
}

function safeStr(v, fallback = "") {
  const s = String(v ?? "").trim();
  return s || fallback;
}

function normalizeArr(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
}

function isValidIsoDate(s = "") {
  const v = String(s || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + "T00:00:00.000Z");
  return !Number.isNaN(d.getTime());
}

function isValidIsoDateTime(s = "") {
  const v = String(s || "").trim();
  if (!v) return false;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(v)) return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
}

function isValidIso8601Duration(s = "") {
  return /^P(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)$/.test(String(s).trim());
}

function extractYoutubeId(input = "") {
  const s = String(input).trim();
  if (!s) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      const parts = u.pathname.split("/");
      const last = parts[parts.length - 1];
      if (/^[a-zA-Z0-9_-]{11}$/.test(last)) return last;
    }
    if (u.hostname === "youtu.be") {
      const last = u.pathname.replace("/", "");
      if (/^[a-zA-Z0-9_-]{11}$/.test(last)) return last;
    }
  } catch { }
  return "";
}

function normalizeFaqs(v) {
  const arr = Array.isArray(v) ? v : [];
  return arr
    .map((x) => ({
      q: safeStr(x?.q),
      a: safeStr(x?.a),
    }))
    .filter((x) => x.q && x.a);
}

function normalizeChapters(v) {
  const arr = Array.isArray(v) ? v : [];
  return arr
    .map((x) => ({
      t: safeStr(x?.t, "00:00"),
      label: safeStr(x?.label),
    }))
    .filter((x) => safeStr(x.t) && safeStr(x.label));
}

function normalizeSlug(slug = "") {
  let s = safeStr(slug)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");

  s = s.replace(/[^a-zA-Z0-9ก-๙\-_\/]/g, "");

  return s;
}

function normalizeVideo(input) {
  const slug = normalizeSlug(input?.slug);

  return {
    slug,
    title: safeStr(input?.title),
    date: safeStr(input?.date),
    excerpt: safeStr(input?.excerpt),
    youtube: safeStr(input?.youtube),
    tags: normalizeArr(input?.tags),
    author: safeStr(input?.author, "ทีมวิดีโอ"),
    duration: safeStr(input?.duration, "PT5M"),
    thumbnail: safeStr(input?.thumbnail),
    contentHtml: safeStr(input?.contentHtml, "<p>สรุป/ไฮไลท์วิดีโอ…</p>"),
    keywords: normalizeArr(input?.keywords),

    transcriptHtml: safeStr(input?.transcriptHtml),
    faqs: normalizeFaqs(input?.faqs),
    chapters: normalizeChapters(input?.chapters),

    contentUrl: safeStr(input?.contentUrl),
    uploadDate: safeStr(input?.uploadDate),

    highlights: normalizeArr(input?.highlights),
    description: safeStr(input?.description),
  };
}

function validateVideo(video) {
  const errors = [];

  if (!safeStr(video.slug)) errors.push("กรุณากรอก Slug");
  if (!safeStr(video.title)) errors.push("กรุณากรอก Title");
  if (!safeStr(video.date)) errors.push("กรุณาเลือก Date");
  if (video.date && !isValidIsoDate(video.date)) errors.push("Date ไม่ถูกต้อง (ต้องเป็น YYYY-MM-DD)");

  if (!safeStr(video.youtube)) errors.push("กรุณาใส่ YouTube URL/ID");
  if (safeStr(video.youtube) && !extractYoutubeId(video.youtube))
    errors.push("YouTube URL/ID ไม่ถูกต้อง");

  if (safeStr(video.duration) && !isValidIso8601Duration(video.duration))
    errors.push("Duration ต้องเป็น ISO 8601 เช่น PT5M30S");

  if (safeStr(video.uploadDate) && !isValidIsoDateTime(video.uploadDate))
    errors.push("uploadDate ต้องเป็น ISO DateTime เช่น 2026-01-06T12:34:56Z");

  if (!safeStr(video.transcriptHtml))
    errors.push("กรุณาใส่ Transcript (HTML) หรือเปิด Auto Transcript แล้วใส่ Raw Transcript");
  if (!Array.isArray(video.faqs) || video.faqs.length < 3)
    errors.push("FAQ ควรมีอย่างน้อย 3 ข้อ (ต้องมีทั้งคำถามและคำตอบ)");

  return errors;
}

function sortByDateDescThenSlug(a, b) {
  const ad = safeStr(a?.date);
  const bd = safeStr(b?.date);
  if (ad !== bd) return bd.localeCompare(ad);
  return safeStr(a?.slug).localeCompare(safeStr(b?.slug));
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = safeStr(searchParams.get("slug"));

  const items = await readAll();
  items.sort(sortByDateDescThenSlug);

  if (slug) {
    const found = items.find((x) => safeStr(x.slug) === slug);
    if (!found) return json({ error: "not_found" }, 404);
    return json({ item: found });
  }

  return json({ items });
}

export async function POST(req) {
  let body = null;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const incoming = normalizeVideo(body);
  const errors = validateVideo(incoming);

  if (errors.length) {
    return json(
      {
        error: "validation_error",
        errors,
        received: {
          slug: incoming.slug,
          title: !!incoming.title,
          date: incoming.date,
          youtubeOk: !!extractYoutubeId(incoming.youtube),
          duration: incoming.duration,
          transcriptLen: (incoming.transcriptHtml || "").length,
          faqsCount: Array.isArray(incoming.faqs) ? incoming.faqs.length : 0,
        },
      },
      400
    );
  }

  const items = await readAll();

  const idx = items.findIndex((x) => safeStr(x.slug) === incoming.slug);
  if (idx >= 0) items[idx] = incoming;
  else items.push(incoming);

  items.sort(sortByDateDescThenSlug);
  await writeAll(items);

  return json({ ok: true, item: incoming }, 200);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const slug = safeStr(searchParams.get("slug"));
  if (!slug) return json({ error: "missing_slug" }, 400);

  const items = await readAll();
  const before = items.length;
  const next = items.filter((x) => safeStr(x.slug) !== slug);

  if (next.length === before) return json({ error: "not_found" }, 404);

  next.sort(sortByDateDescThenSlug);
  await writeAll(next);

  return json({ ok: true }, 200);
}
