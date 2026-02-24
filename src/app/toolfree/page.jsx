// src/app/toolfree/page.jsx — Free Tools Page (AI-Ready ✅)
// ═══════════════════════════════════════════════════════════════════════
// Fixed: AEO summary visible, proper @graph schema via JsonLd component
// ═══════════════════════════════════════════════════════════════════════

import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import DownloadTemplates from "./DownloadTemplates";
import {
  SITE,
  BRAND,
  LOGO_URL,
  ORG_LEGAL_NAME_TH,
  ORG_LEGAL_NAME_EN,
  ORG_TAX_ID,
  ORG_ADDRESS,
  FOUNDER_NAME,
  FOUNDER_JOB_TITLE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SAME_AS_URLS,
  entityId,
} from "@/app/seo.config";

/* ─── Constants ──────────────────────────────────────────────────── */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE)
  .toString()
  .trim()
  .replace(/\/+$/, "");
const PAGE_URL = `${SITE_URL}/toolfree`;
const LOGO_ABS = LOGO_URL.startsWith("http")
  ? LOGO_URL
  : `${SITE_URL}${LOGO_URL}`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;
const brandName =
  typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";

export const dynamic = "force-static";

/* ═══════════════════════════════════════════════════════════════════════
   1. METADATA
   ═══════════════════════════════════════════════════════════════════════ */
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `เครื่องมือฟรี — ตรวจสอบบัญชีโฆษณาและ SEO | ${brandName}`,
  description: `ศูนย์รวมเครื่องมือฟรีสำหรับตรวจสอบบัญชีโฆษณา วิเคราะห์ Landing Page และระบบ SEO พัฒนาโดย ${FOUNDER_NAME} ภายใต้ ${brandName}`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    siteName: brandName,
    title: `เครื่องมือฟรี | ${brandName}`,
    description: `เครื่องมือช่วยตรวจสอบบัญชีโฆษณาและ SEO ฟรี พัฒนาโดย ${brandName}`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${brandName} Free Tools` }],
    locale: "th_TH",
  },
};

/* ═══════════════════════════════════════════════════════════════════════
   2. TOOLS DATA
   ═══════════════════════════════════════════════════════════════════════ */
const tools = [
  {
    name: "ตรวจสอบสุขภาพบัญชีโฆษณา",
    description:
      "เครื่องมือวิเคราะห์ความเสี่ยงของบัญชี Google Ads / Facebook Ads ช่วยประเมินโอกาสที่บัญชีจะถูกแบนและให้คำแนะนำในการป้องกัน",
    icon: "🛡️",
    status: "เร็วๆ นี้",
  },
  {
    name: "ตรวจสอบ Landing Page Compliance",
    description:
      "วิเคราะห์หน้า Landing Page ว่าผ่านมาตรฐานนโยบายของ Google Ads และ Facebook Ads หรือไม่ ตรวจสอบ Privacy Policy, Terms of Service และเนื้อหาที่อาจละเมิด",
    icon: "📋",
    status: "เร็วๆ นี้",
  },
  {
    name: "Technical SEO Checker",
    description:
      "ตรวจสอบ Schema Markup, Heading Structure, Open Graph Tags และ Core Web Vitals ของเว็บไซต์ เพื่อเพิ่มโอกาสติดอันดับใน Google AI Overview",
    icon: "🔍",
    status: "เร็วๆ นี้",
  },
  {
    name: "ROI Calculator",
    description:
      "คำนวณ Cost Per Acquisition (CPA), Return on Ad Spend (ROAS) และงบประมาณโฆษณาที่เหมาะสมกับธุรกิจเฉพาะทาง",
    icon: "📊",
    status: "เร็วๆ นี้",
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   3. COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function ToolFreePage() {
  const ids = {
    organization: entityId(SITE_URL, "organization"),
    website: entityId(SITE_URL, "website"),
    person: entityId(SITE_URL, "person"),
    breadcrumb: `${PAGE_URL}/#breadcrumb`,
    webpage: `${PAGE_URL}/#webpage`,
  };

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": ids.organization },
      { "@type": "WebSite", "@id": ids.website },
      {
        "@type": "WebPage",
        "@id": ids.webpage,
        "url": PAGE_URL,
        "name": metadata.title,
        "description": metadata.description,
        "isPartOf": { "@id": ids.website },
        "about": { "@id": ids.organization },
        "breadcrumb": { "@id": ids.breadcrumb },
        "author": { "@id": ids.person },
        "datePublished": "2024-06-01",
        "dateModified": "2026-02-14T10:30:00+07:00",
        "inLanguage": "th-TH",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#direct-answer-tools", "h1"],
        },
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        "name": `Free Marketing Tools by ${brandName}`,
        "provider": { "@id": ids.organization },
        "description": `ศูนย์รวมเครื่องมือฟรีสำหรับวิเคราะห์ระบบโฆษณาและตรวจสอบ SEO พัฒนาโดย ${brandName}`,
        "areaServed": { "@type": "Country", "name": "TH" },
        "serviceType": "Marketing Tools",
        "audience": {
          "@type": "Audience",
          "audienceType": "SME Business Owners",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": ids.breadcrumb,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "หน้าแรก",
            "item": SITE_URL,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "เครื่องมือฟรี",
            "item": PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd json={graphSchema} />

      <main
        className="container-fluid py-5"
        style={{ backgroundColor: "#f8fbff", minHeight: "100vh" }}
      >
        <div className="container">
          {/* ── Breadcrumb ─────────────────────────────────────── */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/" className="text-decoration-none text-muted">
                  หน้าแรก
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                เครื่องมือฟรี
              </li>
            </ol>
          </nav>

          {/* ── AEO Direct Answer (VISIBLE — ไม่ซ่อนจาก AI) ─ */}
          <section
            id="direct-answer-tools"
            className="mb-5"
            aria-label="สรุปเครื่องมือฟรี MyAdsDev"
          >
            <div className="alert alert-info border-start border-4 border-primary">
              <h2 className="h6 fw-bold mb-2">
                เครื่องมือฟรี {brandName} คืออะไร?
              </h2>
              <p className="mb-0 text-muted">
                ศูนย์รวมเครื่องมือสนับสนุนการยิงแอดออนไลน์ พัฒนาโดย{" "}
                {FOUNDER_NAME} ภายใต้ {ORG_LEGAL_NAME_TH} (เลขทะเบียน{" "}
                {ORG_TAX_ID})
                เพื่อช่วยตรวจสอบความเสถียรของบัญชีโฆษณาและระบบ Technical SEO
                — ใช้ได้ฟรี ไม่มีค่าใช้จ่าย
              </p>
            </div>
          </section>

          {/* ── H1 Header ─────────────────────────────────────── */}
          <header className="text-center mb-5">
            <span className="badge bg-primary mb-3 px-3 py-2 rounded-pill">
              🔧 Free Marketing Tools
            </span>
            <h1 className="fw-bold display-4 mb-3 text-dark">
              เครื่องมือฟรี
              <br />
              <span className="text-primary">
                ตรวจสอบบัญชีโฆษณาและ SEO
              </span>
            </h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: 700 }}>
              พัฒนาโดยทีมงาน {brandName}{" "}
              เพื่อช่วยให้ธุรกิจเฉพาะทางสามารถตรวจสอบและเพิ่มประสิทธิภาพโฆษณาได้ด้วยตัวเอง
            </p>
          </header>

          {/* ── Featured Free Tool: Landing Page Builder ──── */}
          <section className="mb-5" aria-label="Landing Page Builder ฟรี">
            <div
              className="card border-0 shadow rounded-4 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <div className="card-body p-4 p-md-5 text-white">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-3">
                      🎉 ใช้งานฟรี — ไม่มีค่าใช้จ่าย
                    </span>
                    <h2 className="h3 fw-bold mb-3">
                      🚀 Landing Page Builder
                    </h2>
                    <p className="mb-3 opacity-90" style={{ maxWidth: 580 }}>
                      สร้างหน้า Landing Page สำหรับธุรกิจของคุณได้ง่าย ๆ
                      ไม่ต้องเขียนโค้ด ออกแบบมาเพื่อรองรับ Google Ads
                      และ Facebook Ads โดยเฉพาะ — คลิกเข้าไปใช้งานได้เลยตอนนี้!
                    </p>
                    <div className="d-flex gap-3 flex-wrap">
                      <a
                        href="https://landing-page.myad-dev.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-warning btn-lg px-5 py-3 rounded-pill fw-bold shadow text-dark"
                      >
                        เข้าใช้งานฟรี →
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-4 text-center d-none d-lg-block">
                    <div style={{ fontSize: "8rem", lineHeight: 1 }}>🏗️</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <DownloadTemplates />

          <section aria-labelledby="tools-list">
            <h2 id="tools-list" className="visually-hidden">
              รายการเครื่องมือฟรี
            </h2>
            <div className="row g-4 mb-5">
              {tools.map((tool, idx) => (
                <div key={idx} className="col-md-6 col-lg-3">
                  <article className="card h-100 shadow-sm border-0 rounded-4">
                    <div className="card-body text-center p-4">
                      <div
                        className="display-3 mb-3"
                        role="img"
                        aria-label={tool.name}
                      >
                        {tool.icon}
                      </div>
                      <h3 className="h6 fw-bold mb-2">{tool.name}</h3>
                      <p className="small text-muted mb-3">
                        {tool.description}
                      </p>
                      <span className="badge bg-warning text-dark rounded-pill">
                        {tool.status}
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ───────────────────────────────────────────── */}
          <section className="text-center p-5 bg-primary bg-opacity-10 rounded-4 mb-5">
            <h2 className="h4 fw-bold mb-3">
              ต้องการให้ผู้เชี่ยวชาญช่วยวิเคราะห์ให้?
            </h2>
            <p className="text-muted mb-4">
              ปรึกษาคุณเอกสิทธิ์โดยตรง ตรวจสอบบัญชีและวางแผนฟรี
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link
                href="/contact"
                className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow"
              >
                ปรึกษาฟรี
              </Link>
              <Link
                href="/knowledge-base"
                className="btn btn-outline-primary px-5 py-3 rounded-pill fw-bold"
              >
                อ่านคู่มือเชิงลึก
              </Link>
            </div>
            <p className="small text-muted mt-3">
              LINE: @myadsdev | Telegram: @myadsdev | โทร: {CONTACT_PHONE}
            </p>
          </section>

          {/* ── Trust Signals ──────────────────────────────────── */}
          <aside
            className="text-center pt-4 border-top"
            aria-label="ข้อมูลความน่าเชื่อถือ"
          >
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                📋 เลขนิติบุคคล {ORG_TAX_ID}
              </span>
              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                📍 {ORG_ADDRESS.addressLocality} จ.{ORG_ADDRESS.addressRegion}
              </span>
              <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                📧 {CONTACT_EMAIL}
              </span>
            </div>
            <p className="small text-muted">
              © 2024-2026 {ORG_LEGAL_NAME_TH} ({ORG_LEGAL_NAME_EN}) |
              เลขทะเบียน {ORG_TAX_ID}
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}