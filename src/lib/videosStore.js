import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/* ===== Path config ===== */
const DATA_DIR = process.env.VIDEOS_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = process.env.VIDEOS_DATA_FILE || path.join(DATA_DIR, "videos.json");

/* ===== FS helpers ===== */
async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(DATA_FILE); }
  catch { await fs.writeFile(DATA_FILE, "[]", "utf8"); }
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

/* ===== YouTube helpers ===== */
export function extractYoutubeId(input = "") {
  const s = String(input).trim();
  if (!s) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s; // already an ID
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

function autoThumbFromYoutube(youtube, currentThumb) {
  if (currentThumb) return currentThumb;
  const id = extractYoutubeId(youtube);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

/* ===== Public API (First-Write-Wins by slug) ===== */
export async function getAllVideos() {
  const items = await readAll();
  // Hide drafts / internal items by default:
  // - published === false => excluded
  // - hidden === true => excluded
  const visible = items.filter((v) => v && v.published !== false && v.hidden !== true);
  return visible.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/** Robust slug lookup:
 * - exact match first
 * - then case-insensitive match
 * - tolerates already-encoded slug (decodeURIComponent safe)
 */
export async function getVideoBySlug(slugInput) {
  const items = await getAllVideos();
  if (!slugInput) return null;

  let s = String(slugInput);
  try { s = decodeURIComponent(s); } catch { }
  const exact = items.find(v => v.slug === s);
  if (exact) return exact;

  const lower = s.toLowerCase();
  return items.find(v => String(v.slug || "").toLowerCase() === lower) || null;
}

export async function addVideoFullFirstWrite({
  slug = "",
  title = "",
  date = new Date().toISOString().slice(0, 10),
  excerpt = "",
  youtube = "",
  tags = [],
  author = "ทีมวิดีโอ",
  duration = "PT5M",
  thumbnail = "",
  contentHtml = "<p>สรุป/ไฮไลท์วิดีโอ…</p>",
  keywords = [],
  transcriptHtml = "",
  faqs = [],
  chapters = [],
  contentUrl = "",
  uploadDate = "",
  highlights = [],
  description = "",
}) {
  const items = await readAll();

  const normSlug = String(slug || "").trim();
  if (!normSlug) throw new Error("Missing 'slug'.");

  const existed = items.find((x) => String(x.slug || "").trim() === normSlug);
  if (existed) return { existed: true, item: existed };

  const now = Date.now();
  const item = {
    id: crypto.randomUUID(),
    slug: normSlug,
    title: String(title || "").trim(),
    date: String(date || "").trim(),
    excerpt: String(excerpt || "").trim(),
    youtube: String(youtube || "").trim(),
    tags: Array.isArray(tags) ? tags.map((t) => String(t)) : [],
    author: String(author || "").trim(),
    duration: String(duration || "").trim(),
    thumbnail: autoThumbFromYoutube(youtube, String(thumbnail || "").trim()),
    contentHtml: String(contentHtml || ""),
    keywords: Array.isArray(keywords) ? keywords.map((k) => String(k)) : [],
    transcriptHtml: String(transcriptHtml || ""),
    faqs: Array.isArray(faqs) ? faqs : [],
    chapters: Array.isArray(chapters) ? chapters : [],
    contentUrl: String(contentUrl || "").trim(),
    uploadDate: String(uploadDate || "").trim(),
    highlights: Array.isArray(highlights) ? highlights.map((h) => String(h).trim()).filter(Boolean) : [],
    description: String(description || "").trim(),
    createdAt: now,
    updatedAt: now,
  };

  items.push(item);
  await writeAll(items);
  return { existed: false, item };
}

export async function deleteVideoBySlug(slug) {
  const items = await readAll();
  const next = items.filter((v) => v.slug !== slug);
  if (next.length === items.length) throw new Error("Video not found");
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
