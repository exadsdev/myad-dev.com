import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch { }
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

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "ไม่พบไฟล์" }), { status: 400 });
    }

    const contentType = file.type || "";
    if (!/^image\//i.test(contentType)) {
      return new Response(JSON.stringify({ error: "อนุญาตเฉพาะไฟล์รูปภาพ" }), { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await ensureDir(uploadsDir);

    const origName = typeof file.name === "string" ? file.name : "image";
    const origExt = path.extname(origName || "");
    const ext = origExt || extFromMime(contentType, ".jpg");

    const arr = new Uint8Array(await file.arrayBuffer());
    const filename = randomName(ext);
    const fullpath = path.join(uploadsDir, filename);
    await fs.writeFile(fullpath, arr, { mode: 0o644 });

    const url = `/uploads/${filename}`;

    return new Response(JSON.stringify({ ok: true, url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "อัปโหลดล้มเหลว" }), { status: 500 });
  }
}

export const runtime = "nodejs";
