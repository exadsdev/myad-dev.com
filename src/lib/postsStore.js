// src/lib/postsStore.js
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/* ===== Path config ===== */
const DATA_DIR = process.env.POSTS_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = process.env.POSTS_DATA_FILE || path.join(DATA_DIR, "posts.json");

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
  const raw = await fs.readFile(DATA_FILE, "utf8").catch(() => "[]");
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
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

/* ===== Normalizers ===== */
function safeStr(v) {
  return String(v ?? "").replace(/\u0000/g, "").trim();
}

function normalizeFaqs(input) {
  if (!Array.isArray(input)) return [];
  const out = [];

  for (const it of input) {
    // ✅ โครงสร้างที่ถูกต้อง: { q, a }
    if (it && typeof it === "object" && !Array.isArray(it)) {
      const q = safeStr(it.q);
      const a = safeStr(it.a);
      if (q && a) out.push({ q, a });
      continue;
    }

    // เผื่อเคยมีค่าผิดพลาดเป็น string (เช่น "[object Object]") ให้ข้าม
    if (typeof it === "string") {
      // ถ้าสตริงเป็น JSON object ก็พยายาม parse
      const s = safeStr(it);
      if (s.startsWith("{") && s.endsWith("}")) {
        try {
          const obj = JSON.parse(s);
          const q = safeStr(obj?.q);
          const a = safeStr(obj?.a);
          if (q && a) out.push({ q, a });
        } catch {}
      }
    }
  }

  return out;
}

function normalizeStringsArr(input) {
  if (Array.isArray(input)) return input.map((x) => safeStr(x)).filter(Boolean);
  if (typeof input === "string")
    return input
      .split(",")
      .map((s) => safeStr(s))
      .filter(Boolean);
  return [];
}

function normalizePost(item) {
  if (!item || typeof item !== "object") return item;
  return {
    ...item,
    slug: safeStr(item.slug),
    title: safeStr(item.title),
    date: safeStr(item.date),
    excerpt: safeStr(item.excerpt),
    tags: normalizeStringsArr(item.tags),
    author: safeStr(item.author),
    thumbnail: safeStr(item.thumbnail),
    contentHtml: String(item.contentHtml || ""),
    keywords: normalizeStringsArr(item.keywords),
    faqs: normalizeFaqs(item.faqs),
    createdAt: Number(item.createdAt || 0),
    updatedAt: Number(item.updatedAt || 0),
  };
}

/* ===== Public API (First-Write-Wins by slug) ===== */
export async function getAllPosts() {
  const items = (await readAll()).map(normalizePost);
  return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/** lookup by slug (exact -> case-insensitive) */
export async function getPostBySlug(slugInput) {
  const items = await getAllPosts();
  if (!slugInput) return null;
  let s = String(slugInput);
  try {
    s = decodeURIComponent(s);
  } catch {}
  const exact = items.find((v) => v.slug === s);
  if (exact) return exact;
  const lower = s.toLowerCase();
  return items.find((v) => String(v.slug || "").toLowerCase() === lower) || null;
}

/** First-Write-Wins add (stores ALL fields exactly as first write) */
export async function addPostFullFirstWrite({
  slug = "",
  title = "",
  date = new Date().toISOString().slice(0, 10),
  excerpt = "",
  tags = [],
  author = "ทีมบทความ",
  thumbnail = "",
  contentHtml = "<p>เนื้อหาบทความ…</p>",
  keywords = [],
  faqs = [],
}) {
  const items = await readAll();

  const normSlug = safeStr(slug);
  if (!normSlug) throw new Error("Missing 'slug'.");

  const existed = items.find((x) => safeStr(x.slug) === normSlug);
  if (existed) return { existed: true, item: normalizePost(existed) };

  const now = Date.now();
  const item = normalizePost({
    id: crypto.randomUUID(),
    slug: normSlug,
    title,
    date,
    excerpt,
    tags,
    author,
    thumbnail,
    contentHtml,
    keywords,
    faqs, // ✅ เก็บเป็น array ของ {q,a}
    createdAt: now,
    updatedAt: now,
  });

  items.push(item);
  await writeAll(items);
  return { existed: false, item };
}

export async function deletePostBySlug(slug) {
  const items = await readAll();
  const next = items.filter((v) => safeStr(v.slug) !== safeStr(slug));
  if (next.length === items.length) throw new Error("Post not found");
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
