import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/* ===== Path config ===== */
const DATA_DIR =
  process.env.REVIEWS_DATA_DIR ||
  path.join(process.cwd(), "data");

const DATA_FILE =
  process.env.REVIEWS_DATA_FILE ||
  path.join(DATA_DIR, "reviews.json");

/* ===== FS helpers ===== */
async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readAll() {
  await ensureDataFile();
  const raw = await fs
    .readFile(DATA_FILE, "utf8")
    .catch(() => "[]");
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
    return [];
  }
}

async function writeAll(items) {
  await ensureDataFile();
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify(items, null, 2),
    "utf8"
  );
}

/* ===== Public API (First-Write-Wins by slug) ===== */
export async function getAllReviews() {
  const items = await readAll();
  return items.sort((a, b) => {
    // sort by date desc then createdAt desc
    const da = String(a.date || "");
    const db = String(b.date || "");
    const cmp = db.localeCompare(da);
    if (cmp !== 0) return cmp;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

/** alias สำหรับหน้าเว็บที่ import ว่า listReviews */
export async function listReviews() {
  return getAllReviews();
}

/** lookup by slug (exact -> case-insensitive) */
export async function getReviewBySlug(slugInput) {
  const items = await getAllReviews();
  if (!slugInput) return null;
  let s = String(slugInput);
  try {
    s = decodeURIComponent(s);
  } catch {}
  const exact = items.find((v) => v.slug === s);
  if (exact) return exact;
  const lower = s.toLowerCase();
  return (
    items.find(
      (v) => String(v.slug || "").toLowerCase() === lower
    ) || null
  );
}

/** First-Write-Wins add (stores ALL fields exactly as first write) */
export async function addReviewFullFirstWrite({
  slug = "",
  title = "",
  date = new Date().toISOString().slice(0, 10),
  excerpt = "",
  category = "google", // "google" | "facebook"
  author = "ทีมรีวิว",
  thumbnail = "",
  contentHtml = "<p>รายละเอียดรีวิว…</p>",
  keywords = [],
}) {
  const items = await readAll();

  const normSlug = String(slug || "").trim();
  if (!normSlug) throw new Error("Missing 'slug'.");

  const existed = items.find(
    (x) => String(x.slug || "").trim() === normSlug
  );
  if (existed) return { existed: true, item: existed };

  const now = Date.now();
  const item = {
    id: crypto.randomUUID(),
    slug: normSlug,
    title: String(title || "").trim(),
    date: String(date || "").trim(),
    excerpt: String(excerpt || "").trim(),
    category: String(category || "google").toLowerCase(), // normalize
    author: String(author || "").trim(),
    thumbnail: String(thumbnail || "").trim(),
    contentHtml: String(contentHtml || ""),
    keywords: Array.isArray(keywords)
      ? keywords.map(String)
      : [],
    createdAt: now,
    updatedAt: now,
  };

  items.push(item);
  await writeAll(items);
  return { existed: false, item };
}

export async function deleteReviewBySlug(slug) {
  const items = await readAll();
  const next = items.filter((v) => v.slug !== slug);
  if (next.length === items.length) {
    throw new Error("Review not found");
  }
  await writeAll(next);
  return { ok: true, slug };
}

export async function getStorageInfo() {
  return {
    dataDir: DATA_DIR,
    dataFile: DATA_FILE,
    nodeEnv: process.env.NODE_ENV || null,
  };
}
