import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Sitemap</title>
        <style>
          :root{color-scheme:light dark}
          body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;margin:24px;line-height:1.5}
          table{border-collapse:collapse;width:100%}
          th,td{border:1px solid #e5e7eb;padding:8px;text-align:left;font-size:14px}
          th{background:#f8fafc}
          caption{margin-bottom:12px;font-weight:700;text-align:left}
          .muted{color:#64748b}
          a{color:inherit}
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <table>
          <caption class="muted">แสดงผลเพื่ออ่านง่ายเท่านั้น (Search engine อ่านจาก XML ดิบ)</caption>
          <thead>
            <tr><th>URL</th><th>Last Modified</th><th>Changefreq</th><th>Priority</th></tr>
          </thead>
          <tbody>
            <xsl:for-each select="/s:urlset/s:url">
              <tr>
                <td>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="s:loc"/></xsl:attribute>
                    <xsl:value-of select="s:loc"/>
                  </a>
                </td>
                <td><xsl:value-of select="s:lastmod"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td><xsl:value-of select="s:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
        <p class="muted">Note: ข้อความเตือน “no style information” จะไม่แสดงเพราะเราแนบ stylesheet แล้ว (ไม่กระทบ SEO).</p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

export async function GET() {
  return new NextResponse(XSL, {
    headers: {
      "Content-Type": "application/xslt+xml; charset=utf-8",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
