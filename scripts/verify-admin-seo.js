/*
  E2E verification for Admin -> data source -> frontend -> video sitemap.
  - Uses the same endpoints the Admin UI uses: /api/admin/videos
  - Verifies video page HTML (SSR) and sitemap output
  - Runs `npm run build` to confirm build passes

  Usage:
    node scripts/verify-admin-seo.js
*/

const { spawnSync } = require("child_process");

const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  return { res, text };
}

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { res, json };
}

function assert(cond, msg) {
  if (!cond) {
    const err = new Error(msg);
    err.name = "AssertionError";
    throw err;
  }
}

function urlEncodeSlug(slug) {
  // Keep behavior consistent with frontend encodeURIComponent
  return encodeURIComponent(slug);
}

async function waitForServer(maxMs = 20000) {
  const started = Date.now();
  let lastErr = null;
  while (Date.now() - started < maxMs) {
    try {
      const { res } = await fetchText(`${BASE}/robots.txt`, { cache: "no-store" });
      if (res.ok) return;
      lastErr = new Error(`robots.txt status=${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await sleep(600);
  }
  throw lastErr || new Error("Server not reachable");
}

function matchOne(text, re) {
  const m = String(text || "").match(re);
  return m ? m[1] : "";
}

async function main() {
  console.log(`[verify] base=${BASE}`);
  await waitForServer();

  // 1) Check robots includes video sitemap
  {
    const { res, text } = await fetchText(`${BASE}/robots.txt`, { cache: "no-store" });
    assert(res.ok, `robots.txt not ok: ${res.status}`);
    assert(/Sitemap:\s*.*\/video-sitemap\.xml/i.test(text), "robots.txt missing video-sitemap.xml");
    console.log("[ok] robots.txt includes video-sitemap.xml");
  }

  // 2) Policy-safe <title>/<meta description> for a real production slug (contains forbidden term in slug/title data)
  {
    const slug = "รับยิงแอดสายเทา-โฆษณา-Google-Facebook-Ads-เพิ่มยอดขาย-MyAd-Dev";
    const enc = urlEncodeSlug(slug);
    const { res, text } = await fetchText(`${BASE}/videos/${enc}`, { cache: "no-store" });
    assert(res.ok, `video page not ok: ${res.status}`);

    const title = matchOne(text, /<title>([^<]*)<\/title>/i);
    const hasForbiddenInTitle = /<title>[^<]*สายเทา/i.test(text);
    const hasForbiddenInMetaDesc = /name="description"[^>]*content="[^"]*สายเทา/i.test(text);

    assert(title, "missing <title>" );
    assert(!hasForbiddenInTitle, "forbidden term found in <title>" );
    assert(!hasForbiddenInMetaDesc, "forbidden term found in meta description" );

    console.log("[ok] video metadata is policy-safe (no forbidden term in title/meta description)");
  }

  // 3) Admin scenario: add new video
  const testSlug = `admin-e2e-video-${new Date().toISOString().slice(0, 10)}`;
  const yt = "https://www.youtube.com/watch?v=6C50PoBy8O8";
  const transcriptHtmlV1 = '<div class="transcript"><p class="mb-2"><span class="badge text-bg-secondary me-2">00:00</span>ทดสอบเพิ่มวิดีโอจาก Admin</p></div>';

  const videoV1 = {
    slug: testSlug,
    title: "ทดสอบเพิ่มวิดีโอจาก Admin",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "วิดีโอทดสอบสำหรับตรวจสอบการบันทึกข้อมูลจากหน้า Admin และการแสดงผลบนหน้า /videos/[slug]",
    youtube: yt,
    tags: ["admin", "e2e"],
    author: "ทีมวิดีโอ",
    duration: "PT1M30S",
    thumbnail: "",
    contentHtml: "<p>เนื้อหาทดสอบ (contentHtml) จาก Admin</p>",
    keywords: ["admin", "e2e"],
    transcriptHtml: transcriptHtmlV1,
    faqs: [
      { q: "ทดสอบคำถาม 1", a: "ทดสอบคำตอบ 1" },
      { q: "ทดสอบคำถาม 2", a: "ทดสอบคำตอบ 2" },
      { q: "ทดสอบคำถาม 3", a: "ทดสอบคำตอบ 3" },
    ],
    chapters: [
      { t: "00:00", label: "ทดสอบเพิ่มวิดีโอจาก Admin" },
      { t: "00:30", label: "ตรวจสอบหน้าแสดงผล" },
    ],
  };

  {
    const { res, json } = await fetchJson(`${BASE}/api/admin/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(videoV1),
    });

    assert(res.ok, `admin POST failed: ${res.status} ${JSON.stringify(json)}`);
    assert(json && json.ok, "admin POST did not return ok" );
    console.log("[ok] Admin POST add video");
  }

  // 4) Verify frontend shows it (SSR HTML)
  {
    const enc = urlEncodeSlug(testSlug);
    const { res, text } = await fetchText(`${BASE}/videos/${enc}`, { cache: "no-store" });
    assert(res.ok, `video page for test slug not ok: ${res.status}`);

    // Above-the-fold: iframe
    assert(/<iframe[^>]+src="https:\/\/www\.youtube\.com\/embed\//i.test(text), "missing YouTube embed iframe" );

    // Transcript rendered in HTML
    assert(text.includes("ทดสอบเพิ่มวิดีโอจาก Admin"), "expected transcript/title text not found in HTML" );

    // VideoObject JSON-LD exists
    assert(/application\/ld\+json/i.test(text), "missing JSON-LD script" );
    assert(/"@type"\s*:\s*"VideoObject"/i.test(text), "missing VideoObject schema" );

    console.log("[ok] Frontend /videos/[slug] renders iframe + transcript + VideoObject in HTML");
  }

  // 5) Edit existing video from Admin (same slug) and confirm refresh shows changes
  const transcriptHtmlV2 = '<div class="transcript"><p class="mb-2"><span class="badge text-bg-secondary me-2">00:00</span>ทดสอบแก้ไขวิดีโอจาก Admin (v2)</p></div>';
  const videoV2 = { ...videoV1, excerpt: "อัปเดต excerpt (v2) จาก Admin", transcriptHtml: transcriptHtmlV2 };

  {
    const { res, json } = await fetchJson(`${BASE}/api/admin/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(videoV2),
    });

    assert(res.ok, `admin POST edit failed: ${res.status} ${JSON.stringify(json)}`);
    assert(json && json.ok, "admin POST edit did not return ok" );

    const enc = urlEncodeSlug(testSlug);
    const { res: r2, text } = await fetchText(`${BASE}/videos/${enc}`, { cache: "no-store" });
    assert(r2.ok, `video page after edit not ok: ${r2.status}`);
    assert(text.includes("อัปเดต excerpt (v2) จาก Admin"), "updated excerpt not visible on video page" );
    assert(text.includes("ทดสอบแก้ไขวิดีโอจาก Admin (v2)"), "updated transcript not visible on video page" );

    console.log("[ok] Admin POST edit video + frontend reflects new data after refresh");
  }

  // 6) Verify video sitemap contains video:video tags
  {
    const { res, text } = await fetchText(`${BASE}/video-sitemap.xml`, { cache: "no-store" });
    assert(res.ok, `video-sitemap.xml not ok: ${res.status}`);
    assert(/<video:video>/i.test(text), "video sitemap missing <video:video>" );
    // Sitemap loc should use canonical site origin (often https://myad-dev.com), not necessarily localhost in dev.
    assert(/<loc>[^<]*\/videos\//i.test(text), "video sitemap missing expected /videos/ loc" );

    // Print one <url> entry for reporting
    const one = matchOne(text, /(<url>[\s\S]*?<\/url>)/i);
    if (one) {
      console.log("[sample] video-sitemap first <url> entry:\n" + one);
    }

    console.log("[ok] video-sitemap.xml contains video entries");
  }

  // 7) Cleanup: delete test video
  {
    const enc = urlEncodeSlug(testSlug);
    const { res, json } = await fetchJson(`${BASE}/api/admin/videos/${enc}`, {
      method: "DELETE",
    });

    assert(res.ok, `admin DELETE failed: ${res.status} ${JSON.stringify(json)}`);
    console.log("[ok] Cleanup: deleted test video");
  }

  // 8) Run build
  console.log("[build] npm run build");
  const build = spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    shell: true,
  });
  assert(build.status === 0, `npm run build failed with status ${build.status}`);
  console.log("[ok] npm run build passed");
}

main().catch((err) => {
  console.error("\n[FAILED]", err && err.stack ? err.stack : String(err));
  process.exit(1);
});
