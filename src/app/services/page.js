// src/app/services/page.js
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import JsonLd from "../components/JsonLd";
import FAQ from "../components/FAQ";
import { SITE, BRAND, LOGO_URL, entityId } from "../seo.config";
import AuthorBio from "../components/AuthorBio";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;
const PAGE_URL = `${SITE_URL}/services`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `บริการยิงแอดสายเทา 2026 Google & Facebook | ${BRAND}`,
  description: `รวมบริการยิงแอดสายเทา Google Ads และ Facebook Ads สำหรับธุรกิจที่มีข้อจำกัดด้านนโยบาย แก้ปัญหาแอดไม่ผ่าน วางโครงสร้างบัญชีปลอดภัย วัดผล ROI ได้จริง`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: BRAND,
    title: `บริการยิงแอดสายเทา 2026 | ${BRAND}`,
    description: `โซลูชันโฆษณาสำหรับธุรกิจสายเทา Google Ads & Facebook Ads ปลอดภัย วัดผลแม่นยำ`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${BRAND} Services` }],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myadsdev",
    title: `บริการยิงแอดสายเทา 2026 | ${BRAND}`,
    description: `บริการดูแลโฆษณาสายเทา Google & Meta Ads`,
    images: [OG_IMAGE],
  },
};

const faqItems = [
  {
    q: "บริการนี้เหมาะกับธุรกิจประเภทใด?",
    a: "เหมาะกับธุรกิจสายเทา (Grey Area) หรือธุรกิจที่มีข้อจำกัดด้านนโยบายโฆษณาของแพลตฟอร์ม เช่น อาหารเสริม, ความงาม หรือสินค้าเฉพาะทาง ที่ต้องการความปลอดภัยของบัญชีและการวัดผลที่แม่นยำ",
  },
  {
    q: "ทำไมต้องจ้างทำ Google Ads/Facebook Ads กับ MyAdsDev?",
    a: "เพราะเราเชี่ยวชาญด้าน Technical Setup และ Policy Workarounds เราไม่ได้แค่ยิงแอด แต่เราวางโครงสร้างบัญชีและ Landing Page ให้ปลอดภัย ลดความเสี่ยงในการโดนแบน และเน้น ROI เป็นหลัก",
  },
  {
    q: "มีการรับประกันผลลัพธ์หรือไม่?",
    a: "เราเน้นการวัดผลที่โปร่งใสผ่าน Conversion Tracking และ Report จริง ลูกค้าจะเห็นต้นทุนต่อผลลัพธ์ (CPA/ROAS) เพื่อตัดสินใจปรับปรุงแคมเปญได้ตลอดเวลา",
  },
];

export default function ServicesPage() {

  const ids = {
    organization: entityId(SITE_URL, "organization"),
    website: entityId(SITE_URL, "website"),
    breadcrumb: `${PAGE_URL}/#breadcrumb`,
    webpage: `${PAGE_URL}/#webpage`,
  };

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": ids.organization },
      { "@type": "WebSite", "@id": ids.website },
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": ids.webpage,
        "url": PAGE_URL,
        "name": metadata.title,
        "description": metadata.description,
        "isPartOf": { "@id": ids.website },
        "about": { "@id": ids.organization },
        "primaryImageOfPage": { "@id": `${PAGE_URL}/#primaryimage` },
        "breadcrumb": { "@id": ids.breadcrumb },
        "datePublished": "2024-01-01",
        "dateModified": "2026-02-14",
        "inLanguage": "th-TH",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        })),
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#direct-answer-services", "h1", "h2"]
        }
      },
      {
        "@type": "ImageObject",
        "@id": `${PAGE_URL}/#primaryimage`,
        "url": OG_IMAGE,
        "width": 1200,
        "height": 630,
        "caption": metadata.title
      },
      {
        "@type": "BreadcrumbList",
        "@id": ids.breadcrumb,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "บริการ", "item": PAGE_URL },
        ]
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}/#itemlist`,
        "mainEntityOfPage": { "@id": ids.webpage },
        "numberOfItems": 2,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Service",
              "@id": `${SITE_URL}/services/google-ads/#service`,
              "name": "บริการยิงแอด Google Ads สายเทา",
              "url": `${SITE_URL}/services/google-ads`,
              "description": "บริการรับทำ Google Ads สายเทา เน้น Search & Performance Max ปลอดภัย วัดผลได้",
              "provider": { "@id": ids.organization },
              "offers": {
                "@type": "Offer",
                "price": 12900,
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Service",
              "@id": `${SITE_URL}/services/facebook-ads/#service`,
              "name": "บริการยิงแอด Facebook Ads สายเทา",
              "url": `${SITE_URL}/services/facebook-ads`,
              "description": "รับทำโฆษณา Facebook สายเทา แก้ปัญหาปิดบัญชี ยิง Conversion แม่นยำ",
              "provider": { "@id": ids.organization },
              "offers": {
                "@type": "Offer",
                "price": 9900,
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock"
              }
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}/#howto`,
        "name": "วิธีเลือกบริการยิงแอดสายเทาที่เหมาะสม",
        "description": "แนวทางเลือกบริการโฆษณาออนไลน์สำหรับธุรกิจที่มีข้อจำกัด",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "ประเมินประเภทธุรกิจ",
            "text": "พิจารณาว่าสินค้า/บริการของคุณมีข้อจำกัดด้านนโยบายแพลตฟอร์มหรือไม่"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "เลือกแพลตฟอร์ม",
            "text": "Google Ads เหมาะสำหรับ High Intent Traffic | Facebook Ads เหมาะสำหรับ Discovery และ Social Commerce"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "ปรึกษาผู้เชี่ยวชาญ",
            "text": "ติดต่อทีม MyAdsDev เพื่อประเมินความเสี่ยงและวางแผนโครงสร้างแคมเปญ"
          }
        ]
      }
    ]
  };

  return (
    <Fragment>
      <JsonLd json={graphSchema} />

      <nav className="container-fluid pt-3" aria-label="Breadcrumb">
        <ol className="breadcrumb mb-0 small text-muted">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none text-muted hover-primary">หน้าแรก</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">บริการของเรา</li>
        </ol>
      </nav>

      <header className="container-fluid my-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold mb-3 lh-base">
              บริการยิงแอดสายเทา <br />
              <span className="text-primary">Google Ads & Facebook Ads</span>
            </h1>

            {/* Direct Answer (AI Overview) — แสดงผลปกติ */}
            <div
              id="direct-answer-services"
              className="alert alert-info border-start border-4 border-primary mb-4"
            >
              <p className="mb-0 small">
                <strong>สรุป:</strong> {BRAND} ให้บริการยิงแอด Google Ads และ Facebook Ads
                สำหรับธุรกิจเฉพาะทางที่มีข้อจำกัดด้านนโยบาย เน้นวางโครงสร้างบัญชีแคมเปญให้ปลอดภัย
                ติดตั้ง Conversion Tracking วัดผลแม่นยำ เริ่มต้น 9,900 บาท/เดือน
              </p>
            </div>

            {/* Definition Snippet (AI Visibility — <200 chars) */}
            <div className="p-3 bg-light rounded-3 border-start border-4 border-primary mb-4">
              <p className="mb-0">
                <dfn><strong>การยิงแอดสายเทา คือ</strong></dfn>{" "}
                การใช้เทคนิค Compliance Page Structure และ Account Infrastructure
                เพื่อให้โฆษณา Google/Facebook สามารถรันได้อย่างเสถียรสำหรับธุรกิจเฉพาะทาง
              </p>
            </div>

            <p className="lead text-muted mb-4">
              ปลดล็อกศักยภาพธุรกิจที่มีข้อจำกัดด้านนโยบาย ด้วยเทคนิคยิงแอดขั้นสูง
              เน้นความปลอดภัยของบัญชี โครงสร้างแคมเปญที่แข็งแกร่ง และการวัดผล Conversion ที่แม่นยำระดับ Technical
            </p>
            <div className="d-flex gap-3">
              <Link href="/contact" className="btn btn-primary px-4 py-2">
                ปรึกษาฟรี
              </Link>
              <Link href="#packages" className="btn btn-outline-secondary px-4 py-2">
                ดูแพ็กเกจ
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="position-relative rounded-4 overflow-hidden shadow-lg">
              <Image
                src="/images/review.jpg"
                alt="กราฟแสดงผลลัพธ์บริการยิงแอดสายเทา Google Ads และ Facebook Ads ที่เติบโตขึ้น"
                width={800}
                height={500}
                className="w-100 h-auto object-fit-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="container-fluid my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <AuthorBio
              title="ทีมผู้เชี่ยวชาญรับทำโฆษณาสายเทาแบบวัดผลจริง"
              highlight="รับทำ Google สายเทา"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          AI-Ready: "What is" Section — บริการยิงแอดสายเทาคืออะไร?
          (AI Overview loves pulling bulleted definitions)
          ═══════════════════════════════════════════════════════════ */}
      <section className="container-fluid py-5 bg-light border-bottom" aria-labelledby="what-is-heading">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h2 id="what-is-heading" className="h3 fw-bold mb-4">
              บริการยิงแอดสายเทาคืออะไร?
            </h2>
            <p className="text-muted mb-3">
              <strong>บริการยิงแอดสายเทา</strong> คือบริการทำโฆษณา Google Ads และ Facebook Ads
              สำหรับธุรกิจเฉพาะทาง (Grey Area Business) ที่มีข้อจำกัดด้านนโยบายแพลตฟอร์ม
              โดย {BRAND} ให้บริการดังนี้:
            </p>
            <ul className="text-muted mb-4">
              <li><strong>วางโครงสร้างบัญชีโฆษณา</strong> — ใช้เทคนิค Compliance Page Structure เพื่อให้แอดรันได้อย่างต่อเนื่อง</li>
              <li><strong>ระบบสำรองบัญชี (Account Infrastructure)</strong> — มีบัญชีคุณภาพสูงสำรองพร้อมสลับทันทีหากติดปัญหา</li>
              <li><strong>ตั้งค่า Server-Side Tracking</strong> — ใช้ Facebook CAPI / Google Offline Conversion วัดผลแม่นยำ 100%</li>
              <li><strong>Dashboard รายงานผล Real-time</strong> — ลูกค้าดู CPA, ROAS, Conversion ได้ 24 ชม.</li>
              <li><strong>ดูแลโดยผู้เชี่ยวชาญ</strong> — คุณเอกสิทธิ์ เพ็ชรมนี ดูแลทุกโปรเจกต์โดยตรง</li>
            </ul>
            <p className="text-muted">
              เหมาะกับธุรกิจ: อาหารเสริม, ความงาม, เกมออนไลน์, บริการทางการเงิน
              และธุรกิจอื่นๆ ที่มีข้อจำกัดด้านนโยบายโฆษณา
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          AI-Ready: "How to" Section — ขั้นตอนการทำงาน
          (Ordered list structure for AI Overview extraction)
          ═══════════════════════════════════════════════════════════ */}
      <section className="container-fluid py-5 border-bottom" aria-labelledby="how-to-heading">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h2 id="how-to-heading" className="h3 fw-bold mb-4">
              ขั้นตอนการทำงานกับ {BRAND} เป็นอย่างไร?
            </h2>
            <p className="text-muted mb-4">
              กระบวนการทำงานกับ {BRAND} มี 6 ขั้นตอนหลัก
              ใช้เวลาเห็นผลลัพธ์ภายใน 7-14 วัน:
            </p>
            <ol className="text-muted mb-4">
              <li className="mb-3">
                <h3 className="h6 fw-bold d-inline">Diagnosis & Audit</h3>
                <span className="ms-1">— ตรวจสอบสุขภาพบัญชี ประวัติการโดนแบน และวิเคราะห์ความเสี่ยงของเว็บไซต์</span>
              </li>
              <li className="mb-3">
                <h3 className="h6 fw-bold d-inline">Policy Alignment</h3>
                <span className="ms-1">— ปรับแต่ง Landing Page และเนื้อหาให้สอดคล้องกับนโยบาย Google/Meta อย่างครบถ้วน</span>
              </li>
              <li className="mb-3">
                <h3 className="h6 fw-bold d-inline">Account Setup</h3>
                <span className="ms-1">— เตรียมบัญชีโฆษณาคุณภาพสูงผ่านกระบวนการ Warm-up พร้อมระบบสำรองบัญชี</span>
              </li>
              <li className="mb-3">
                <h3 className="h6 fw-bold d-inline">Tracking Installation</h3>
                <span className="ms-1">— ติดตั้ง Server-Side Tracking (Facebook CAPI / Google Conversion) เพื่อวัดผลแม่นยำ</span>
              </li>
              <li className="mb-3">
                <h3 className="h6 fw-bold d-inline">Campaign Launch</h3>
                <span className="ms-1">— ปล่อยแคมเปญด้วยกลยุทธ์ที่ออกแบบเฉพาะธุรกิจ เน้น Conversion Optimization</span>
              </li>
              <li className="mb-3">
                <h3 className="h6 fw-bold d-inline">Optimize & Scale</h3>
                <span className="ms-1">— ปรับปรุง CPA/ROAS รายสัปดาห์ และ Scale งบเมื่อบัญชีเสถียร</span>
              </li>
            </ol>
            <div className="d-flex gap-3 flex-wrap">
              <Link href="/contact" className="btn btn-primary px-4 py-2">
                เริ่มต้นปรึกษาฟรี
              </Link>
              <Link href="/knowledge-base" className="btn btn-outline-primary px-4 py-2">
                อ่านคู่มือเชิงลึก →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-fluid pb-5" id="packages">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="h3 fw-bold">เลือกแพลตฟอร์มที่ใช่สำหรับคุณ</h2>
            <p className="text-muted">บริการดูแลโฆษณาครบวงจร พร้อมรายงานผลรายเดือน</p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
          <div className="col">
            <article className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="ratio ratio-16x9 overflow-hidden rounded-top">
                <Image
                  src="/img/gg.jpg"
                  alt="บริการรับยิงแอด Google Ads สายเทา"
                  width={600}
                  height={338}
                  className="object-fit-cover hover-scale"
                />
              </div>
              <div className="card-body p-4">
                <h3 className="h4 fw-bold mb-2">Google Ads สายเทา</h3>
                <p className="text-muted mb-4">
                  เจาะกลุ่มลูกค้าที่กำลังค้นหา (High Intent) ด้วย Search & Performance Max
                  โครงสร้างแคมเปญที่สอดคล้องนโยบาย พร้อม Conversion API แม่นยำ
                </p>
                <ul className="list-unstyled text-secondary mb-4 space-y-2">
                  <li>✅ แก้ปัญหาโฆษณาไม่ผ่าน/โดนแบน</li>
                  <li>✅ ตั้งค่า Enhanced Conversion Tracking</li>
                  <li>✅ กรอง Click ผี/คู่แข่ง (Click Fraud Protection)</li>
                </ul>
                <div className="mt-auto">
                  <Link
                    href="/services/google-ads"
                    className="btn btn-outline-primary w-100 fw-semibold"
                  >
                    ดูรายละเอียด Google Ads
                  </Link>
                </div>
              </div>
              <div className="card-footer bg-light border-0 py-3 text-center">
                <small className="text-muted">ราคาเริ่มต้น</small>
                <strong className="d-block text-primary fs-5">12,900 บาท/เดือน</strong>
              </div>
            </article>
          </div>

          <div className="col">
            <article className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="ratio ratio-16x9 overflow-hidden rounded-top">
                <Image
                  src="/images/facebook_ads.webp"
                  alt="บริการรับยิงแอด Facebook Ads สายเทา"
                  width={600}
                  height={338}
                  className="object-fit-cover hover-scale"
                />
              </div>
              <div className="card-body p-4">
                <h3 className="h4 fw-bold mb-2">Facebook Ads สายเทา</h3>
                <p className="text-muted mb-4">
                  สร้างยอดขายด้วย Social Commerce เทคนิคทำคอนเทนต์และ Landing Page
                  ที่สอดคล้องกับแนวทางนโยบายของ Meta
                </p>
                <ul className="list-unstyled text-secondary mb-4 space-y-2">
                  <li>✅ เทคนิค &quot;บัญชีขาว&quot; เลี้ยงบัญชีให้แข็งแรง</li>
                  <li>✅ เทสกลุ่มเป้าหมาย (Audience Testing)</li>
                  <li>✅ ทำ Retargeting ดึงลูกค้าเก่ากลับมาซื้อซ้ำ</li>
                </ul>
                <div className="mt-auto">
                  <Link
                    href="/services/facebook-ads"
                    className="btn btn-outline-primary w-100 fw-semibold"
                  >
                    ดูรายละเอียด Facebook Ads
                  </Link>
                </div>
              </div>
              <div className="card-footer bg-light border-0 py-3 text-center">
                <small className="text-muted">ราคาเริ่มต้น</small>
                <strong className="d-block text-primary fs-5">9,900 บาท/เดือน</strong>
              </div>
            </article>
          </div>
        </div>

        <section className="bg-light rounded-4 p-5 mb-5 border border-secondary-subtle">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="h4 fw-bold mb-3">ไม่แน่ใจว่าธุรกิจคุณจัดเป็น &quot;สายเทา&quot; หรือไม่?</h2>
              <p className="text-muted mb-0">
                หากคุณทำธุรกิจอาหารเสริม, ความงาม, การเงิน, หรือบริการที่มีข้อจำกัดด้านกฎหมายและนโยบายแพลตฟอร์ม
                ทีมงาน MyAdsDev พร้อมให้คำปรึกษาฟรี เพื่อประเมินความเสี่ยงและวางแผนการตลาดที่ปลอดภัยที่สุด
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <Link href="/contact" className="btn btn-primary btn-lg px-5 shadow-sm">
                ปรึกษาผู้เชี่ยวชาญ
              </Link>
            </div>
          </div>
        </section>

        {/* ── Comparison Table: ยิงแอดเอง vs จ้าง Agency (AI Overview) ── */}
        <section className="mb-5" aria-labelledby="comparison-services">
          <h2 id="comparison-services" className="h4 fw-bold mb-4">เปรียบเทียบ: ยิงแอดเอง vs จ้างเอเจนซี่เฉพาะทาง</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th scope="col">หัวข้อ</th>
                  <th scope="col">ยิงแอดเอง</th>
                  <th scope="col">จ้าง {BRAND}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ความเสี่ยงโดนแบน</td>
                  <td className="text-danger">สูง — ไม่เข้าใจ Policy ละเอียด</td>
                  <td className="text-success">ต่ำ — Compliance Page Structure</td>
                </tr>
                <tr>
                  <td>CPA เฉลี่ย</td>
                  <td className="text-danger">สูง — ฿800–1,500+</td>
                  <td className="text-success">ต่ำ — ฿200–400</td>
                </tr>
                <tr>
                  <td>Conversion Tracking</td>
                  <td className="text-muted">Pixel อย่างเดียว — ข้อมูลหาย 30-40%</td>
                  <td className="text-success">Pixel + Server-Side — แม่นยำ 95%+</td>
                </tr>
                <tr>
                  <td>ระบบสำรองบัญชี</td>
                  <td className="text-danger">ไม่มี — โดนแบนแล้วหยุด</td>
                  <td className="text-success">มี — สลับบัญชีได้ทันที</td>
                </tr>
                <tr>
                  <td>รายงานผล</td>
                  <td className="text-muted">ดูเอง — ไม่รู้จะปรับอะไร</td>
                  <td className="text-success">Dashboard Real-time + คำแนะนำรายสัปดาห์</td>
                </tr>
                <tr>
                  <td>ระยะเวลาเห็นผล</td>
                  <td className="text-muted">ไม่แน่นอน</td>
                  <td className="text-primary fw-bold">7-14 วัน เริ่มเห็นตัวเลข</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="h4 fw-bold text-center mb-4">คำถามที่พบบ่อย (FAQ)</h2>
          <FAQ items={faqItems} withSchema={false} withTitle={false} pageUrl={PAGE_URL} accordionId="faq-services" />
        </section>

        {/* ── Topic Cluster: Semantic Internal Links ── */}
        <aside className="p-4 mt-5 bg-white rounded shadow-sm border" aria-label="เนื้อหาที่เกี่ยวข้อง">
          <h2 className="h5 fw-bold mb-3">เนื้อหาที่เกี่ยวข้อง</h2>
          <ul className="list-unstyled mb-0">
            <li className="mb-2">
              <Link href="/case-studies" className="text-primary text-decoration-none">
                → Case Studies — ผลงานจริง ตัวเลข ROI/CPA จากลูกค้าธุรกิจเฉพาะทาง
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/knowledge-base" className="text-primary text-decoration-none">
                → Knowledge Base — คู่มือแก้ปัญหาบัญชีโดนแบน + โครงสร้างบัญชีปลอดภัย
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/services/google-ads" className="text-primary text-decoration-none">
                → Google Ads สายเทา — วางระบบ Tracking & Compliance
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/services/facebook-ads" className="text-primary text-decoration-none">
                → Facebook Ads สายเทา — ยิงแอดแม่นยำด้วย CAPI
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/faq" className="text-primary text-decoration-none">
                → คำถามที่พบบ่อย (FAQ) — รวมคำตอบเทคนิคยิงแอดสายเทา
              </Link>
            </li>
          </ul>
        </aside>
      </section>
    </Fragment>
  );
}
