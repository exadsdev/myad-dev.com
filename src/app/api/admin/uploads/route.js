import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
  }
}

function extFromMime(mime = "", fallback = "") {
  const m = String(mime || "").toLowerCase();
  if (m.includes("jpeg")) return ".jpg";
  if (m.includes("jpg")) return ".jpg";
  if (m.includes("png")) return ".png";
  if (m.includes("webp")) return ".webp";
  if (m.includes("gif")) return ".gif";
  if (m.includes("svg")) return ".svg";
  return fallback || "";
}

function randomName(ext = "") {
  const hash = crypto.randomBytes(10).toString("hex");
  const ts = Date.now();
  return `${ts}-${hash}${ext}`;
}

function safeFolderName(input = "") {
  const s = String(input || "").trim();
  if (!s) return "";
  if (!/^[a-z0-9_-]{1,50}$/i.test(s)) return "";
  return s;
}

function safeSlugPart(input = "") {
  const s = String(input || "").trim().toLowerCase();
  if (!s) return "";
  return s
    .replace(/[^a-z0-9\p{L}\p{N}_-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  try {
    const form = await req.formData();

    const file = form.get("file");
    if (!file || typeof file === "string") {
      return jsonResponse({ ok: false, error: "ไม่พบไฟล์" }, 400);
    }

    const folder = safeFolderName(form.get("folder") || "");
    const slug = safeSlugPart(form.get("slug") || "");

    const contentType = file.type || "";
    if (!/^image\//i.test(contentType)) {
      return jsonResponse({ ok: false, error: "อนุญาตเฉพาะไฟล์รูปภาพ" }, 400);
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB
    const size = Number(file.size || 0);
    if (Number.isFinite(size) && size > maxBytes) {
      return jsonResponse({ ok: false, error: "ไฟล์ใหญ่เกินไป (สูงสุด 10MB)" }, 413);
    }

    const uploadsDir = folder
      ? path.join(process.cwd(), "public", "uploads", folder)
      : path.join(process.cwd(), "public", "uploads");

    await ensureDir(uploadsDir);

    const origName = typeof file.name === "string" ? file.name : "image";
    const origExt = path.extname(origName || "");
    const ext = origExt || extFromMime(contentType, ".jpg");

    const arr = new Uint8Array(await file.arrayBuffer());

    const baseName = randomName(ext);
    const filename = slug ? `${slug}-${baseName}` : baseName;

    const fullpath = path.join(uploadsDir, filename);
    await fs.writeFile(fullpath, arr);

    const url = folder ? `/uploads/${folder}/${filename}` : `/uploads/${filename}`;

    return jsonResponse({ ok: true, url, path: url }, 200);
  } catch (e) {
    return jsonResponse({ ok: false, error: e?.message || "อัปโหลดล้มเหลว" }, 500);
  }
}

export const runtime = "nodejs";
