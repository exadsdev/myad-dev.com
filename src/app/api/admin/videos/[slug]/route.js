import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_DIR = process.env.VIDEOS_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE =
    process.env.VIDEOS_DATA_FILE || path.join(DATA_DIR, "videos.json");

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

async function writeAll(arr) {
    await ensureDir();
    const json = JSON.stringify(Array.isArray(arr) ? arr : [], null, 2);
    await fs.writeFile(DATA_FILE, json, "utf8");
}

function safeSlugParam(params) {
    const raw = params?.slug;
    if (!raw) return "";

    let s = String(raw).trim();

    try {
        if (/%[0-9A-Fa-f]{2}/.test(s)) s = decodeURIComponent(s);
    } catch { }

    try {
        if (/%[0-9A-Fa-f]{2}/.test(s)) s = decodeURIComponent(s);
    } catch { }

    return s.trim();
}

function json(data, init = {}) {
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        ...init,
    });
}

export async function GET(_req, { params }) {
    const slug = safeSlugParam(params);
    if (!slug) return json({ error: "missing slug" }, { status: 400 });

    const all = await readAll();
    const found = all.find((x) => String(x?.slug || "").trim() === slug);

    if (!found) return json({ error: "not found" }, { status: 404 });

    return json({ item: found }, { status: 200 });
}

export async function DELETE(_req, { params }) {
    const slug = safeSlugParam(params);
    if (!slug) return json({ error: "missing slug" }, { status: 400 });

    try {
        const all = await readAll();
        const before = all.length;

        const next = all.filter((x) => String(x?.slug || "").trim() !== slug);

        if (next.length === before) {
            return json(
                { error: "not found", slug, hint: "slug not matched in videos.json" },
                { status: 404 }
            );
        }

        await writeAll(next);

        return json(
            {
                ok: true,
                deletedSlug: slug,
                before,
                after: next.length,
            },
            { status: 200 }
        );
    } catch (e) {
        return json(
            {
                error: "delete failed",
                message: String(e?.message || e),
            },
            { status: 500 }
        );
    }
}
