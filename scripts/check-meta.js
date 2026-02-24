const port = Number(process.env.PORT || 3010);
const slug = 'รับยิงแอดสายเทา-โฆษณา-Google-Facebook-Ads-เพิ่มยอดขาย-MyAd-Dev';

async function main() {
  const url = `http://localhost:${port}/videos/${encodeURIComponent(slug)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let res;
  try {
    res = await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }

  const html = await res.text();

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i
  );

  const title = (titleMatch?.[1] || '').trim();
  const desc = (descMatch?.[1] || '').trim();

  console.log('status', res.status);
  console.log('url', url);
  console.log('TITLE_has_saitao', title.includes('สายเทา'));
  console.log('DESC_has_saitao', desc.includes('สายเทา'));
  console.log('TITLE', title);
  console.log('DESC', desc);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
