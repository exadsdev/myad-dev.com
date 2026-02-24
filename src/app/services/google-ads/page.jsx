// src/app/services/google-ads/page.jsx

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";

function getSiteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || SITE || "https://myad-dev.com").trim();
  return raw.replace(/\/+$/, "");
}

const SITE_URL = getSiteUrl();
const CANON = `${SITE_URL}/services/google-ads`;
const PAGE_URL = CANON;

// ใช้ OG เป็น absolute URL (Schema/OG ต้อง absolute)
const OG_IMAGE_ABS = `${SITE_URL}/images/og-default.jpg`;

// ✅ สำคัญ: next/image แนะนำให้ใช้ path ภายในเว็บสำหรับรูปโลโก้ (กัน error remotePatterns)
// ถ้า LOGO_URL เป็น "/images/xxx.webp" ให้ใช้ตรงๆเป็น local path
// ถ้า LOGO_URL เป็น absolute URL ก็จะกลายเป็น remote image (ต้องตั้ง next.config.js) — เลี่ยงไว้ก่อน
const LOGO_LOCAL = LOGO_URL && LOGO_URL.startsWith("/") ? LOGO_URL : "/images/logo.webp";

export const dynamic = "force-static";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `รับทำ Google Ads ธุรกิจเฉพาะทาง วัดผลจริง เพิ่ม ROI | ${BRAND}`,
  description:
    `บริการจัดการ Google Ads สำหรับธุรกิจที่มีข้อจำกัดด้านนโยบาย เน้นโครงสร้างแคมเปญที่เป็นระบบ การปรับ Landing Page ให้สอดคล้อง และการติดตั้ง Tracking/Conversion เพื่อ Optimize จากข้อมูลจริง เริ่มต้น 12,900 บาท/เดือน`,
  alternates: { canonical: CANON },
  openGraph: {
    type: "website",
    url: CANON,
    siteName: BRAND,
    title: `รับทำ Google Ads ธุรกิจเฉพาะทาง — ปลอดภัย วัดผลจริง | ${BRAND}`,
    description: `โซลูชัน Google Ads สำหรับธุรกิจที่มีข้อจำกัดด้านนโยบาย เน้นความเสถียรของบัญชีและ ROI`,
    images: [
      {
        url: OG_IMAGE_ABS,
        width: 1200,
        height: 630,
        alt: `บริการรับทำ Google Ads โดย ${BRAND}`,
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myadsdev",
    title: `รับทำ Google Ads | ${BRAND}`,
    description: `เน้นวัดผล Conversion และปรับปรุง ROI จากข้อมูลจริง`,
    images: [OG_IMAGE_ABS],
  },
};

const faqList = [
  {
    q: "บริการรับทำ Google Ads แตกต่างจากโฆษณาทั่วไปอย่างไร?",
    a: "ความต่างคือการวางโครงสร้างให้เป็นระบบและลดความเสี่ยงตามนโยบาย เราเริ่มจาก Audit เว็บไซต์/ฟันเนล วางแคมเปญตาม Intent ปรับข้อความและหน้า Landing Page ให้สอดคล้อง พร้อมติดตั้ง Tracking/Conversion เพื่อ Optimize จากข้อมูลจริง ไม่ใช่แค่เพิ่มคลิก",
  },
  {
    q: "เริ่มต้นต้องเตรียมอะไรบ้าง?",
    a: "1) เว็บไซต์หรือ Landing Page 2) รายละเอียดสินค้า/บริการและกลุ่มเป้าหมาย 3) งบประมาณรายวัน/ต่อเดือน 4) เป้าหมายที่ต้องการวัดผล (เช่น โทร, ฟอร์ม, LINE) หากยังไม่พร้อมเราช่วยแนะนำสิ่งที่ต้องปรับก่อนเริ่มยิงจริงได้",
  },
  {
    q: "วัดผลความสำเร็จจากอะไร?",
    a: "วัดจาก Conversion ที่มีคุณภาพ เช่น การโทร, การกรอกฟอร์ม, การทักแชท/ไลน์ และคุณภาพ Lead หลังบ้าน เพื่อให้ Optimize ไปที่ยอดขายหรือโอกาสปิดการขายจริง ไม่ใช่ยอดคลิกอย่างเดียว",
  },
  {
    q: "ต้องใช้เวลาเท่าไรจึงเห็นผลลัพธ์?",
    a: "โดยทั่วไป 7–14 วันแรกเป็นช่วงเก็บข้อมูลและเรียนรู้ (Learning) เพื่อปรับคีย์เวิร์ด/โฆษณา/หน้า Landing Page ให้เข้าที่ หลังจากนั้นผลลัพธ์จะค่อยๆ เสถียรขึ้นเมื่อมีข้อมูล Conversion เพียงพอ",
  },
];

export default function GoogleAdsServicePage() {
  const priceTHB = 12900;

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": `${CANON}/#webpage`,
        url: CANON,
        name: `รับทำ Google Ads ธุรกิจเฉพาะทาง | ${BRAND}`,
        description: metadata.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${CANON}/#service` },
        primaryImageOfPage: { "@id": `${CANON}/#primaryimage` },
        breadcrumb: { "@id": `${CANON}/#breadcrumb` },
        mainEntity: faqList.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
        datePublished: "2024-01-01",
        dateModified: "2026-02-14",
        inLanguage: "th-TH",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#direct-answer-google-ads", "h1", "h2"],
        },
      },
      {
        "@type": "ImageObject",
        "@id": `${CANON}/#primaryimage`,
        url: OG_IMAGE_ABS,
        width: 1200,
        height: 630,
        caption: `รับทำ Google Ads โดย ${BRAND}`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANON}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "บริการ", item: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Google Ads", item: CANON },
        ],
      },
      {
        "@type": "Service",
        "@id": `${CANON}/#service`,
        name: "บริการรับทำ Google Ads (ธุรกิจเฉพาะทาง)",
        serviceType: "Google Ads Management / SEM / PPC",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: [{ "@type": "Country", name: "Thailand" }],
        audience: {
          "@type": "Audience",
          audienceType: "Businesses with policy-sensitive or specialized niches",
        },
        description: metadata.description,
        offers: {
          "@type": "Offer",
          "@id": `${CANON}/#offer-starter`,
          url: `${SITE_URL}/packages`,
          price: String(priceTHB),
          priceCurrency: "THB",
          availability: "https://schema.org/InStock",
          category: "https://schema.org/ProfessionalService",
          priceValidUntil: "2026-12-31",
          itemOffered: {
            "@type": "Service",
            name: "Starter Package — Google Ads",
            description:
              "ครอบคลุม: Audit เบื้องต้น, วางโครงสร้างแคมเปญ, ตั้งค่า Tracking/Conversion, รายงานผลรายเดือน (รายละเอียดอาจเปลี่ยนตามขอบเขตงานจริง)",
          },
        },
      },
      {
        "@type": "HowTo",
        "@id": `${CANON}/#howto`,
        name: "ขั้นตอนเริ่มต้นทำ Google Ads อย่างเป็นระบบ",
        description: "แนวทางเริ่มต้นตั้งค่าและทำแคมเปญเพื่อวัดผลและปรับปรุง ROI จากข้อมูลจริง",
        totalTime: "P7D",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Audit เว็บไซต์/ฟันเนล",
            text: "ตรวจสอบหน้า Landing Page, ข้อเสนอ, และจุดวัดผล เพื่อให้สอดคล้องกับโฆษณาและเป้าหมาย",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "กำหนดเป้าหมาย Conversion",
            text: "กำหนดว่าจะวัดผลอะไร เช่น โทร, ฟอร์ม, แชท เพื่อให้ Optimize ได้ตรงธุรกิจ",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "วางโครงสร้างแคมเปญ",
            text: "แยกแคมเปญตาม Intent/สินค้า/พื้นที่ และเตรียมคีย์เวิร์ด/Negative อย่างเป็นระบบ",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "ติดตั้ง Tracking/Conversion",
            text: "ติดตั้ง Tag/Conversion และทดสอบให้ข้อมูลถูกต้องก่อนเริ่มยิงจริง",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Launch และ Optimize",
            text: "ยิงจริง เก็บข้อมูล ปรับปรุงรายสัปดาห์จาก Conversion และคุณภาพ Lead",
          },
        ],
      },
    ],
  };

  return (
    <Fragment>
      <JsonLd json={graphSchema} />

      {/* Direct Answer (AI Overview) — แสดงผลปกติ */}
      <div
        id="direct-answer-google-ads"
        className="alert alert-info border-start border-4 border-primary mx-auto mb-4"
        style={{ maxWidth: 800 }}
      >
        <p className="mb-0 small">
          <strong>สรุป:</strong> บริการรับทำ Google Ads ของ {BRAND}{" "}
          เหมาะกับธุรกิจเฉพาะทางที่ต้องการวัดผลจริงและเพิ่ม ROI
          เราช่วย Audit เว็บไซต์ วางโครงสร้างแคมเปญ ตั้งค่า Tracking/Conversion
          และปรับ Optimization จากข้อมูลจริง แพ็กเกจเริ่มต้น 12,900 บาท/เดือน
        </p>
      </div>

      <div className="container-fluid py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small text-muted">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted">
                หน้าแรก
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/services" className="text-decoration-none text-muted">
                บริการ
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Google Ads
            </li>
          </ol>
        </nav>

        <section className="row align-items-center g-4 mb-5">
          <div className="col-lg-6">
            <h1 className="display-6 fw-bold mb-3">รับทำ Google Ads — เน้นวัดผลจริง และเพิ่ม ROI</h1>
            <p className="lead text-muted mb-4">
              ออกแบบโครงสร้างแคมเปญให้เป็นระบบ พร้อมตั้งค่า Tracking/Conversion และรายงานผล
              เหมาะกับธุรกิจที่ต้องการผลลัพธ์วัดได้จริง และต้องการลดความเสี่ยงด้านนโยบายด้วยแนวทางที่ถูกต้อง
            </p>

            <div className="d-flex flex-wrap gap-2">
              <Link href="/contact" className="btn btn-primary btn-lg">
                ปรึกษาฟรี
              </Link>
              <Link href="/packages" className="btn btn-outline-secondary btn-lg">
                ดูแพ็กเกจ & ราคา
              </Link>
              <Link href="/services" className="btn btn-outline-secondary btn-lg">
                ดูบริการทั้งหมด
              </Link>
            </div>

            <ul className="mt-4 list-unstyled text-muted small">
              <li>✅ Audit เว็บไซต์/ฟันเนลก่อนเริ่มงาน</li>
              <li>✅ โครงสร้างแคมเปญตาม Intent</li>
              <li>✅ ติดตั้ง Tracking + Conversion</li>
              <li>✅ Optimize จากข้อมูลจริงรายสัปดาห์</li>
            </ul>
          </div>

          <div className="col-lg-6">
            <div className="p-3 border rounded-4 bg-light">
              <div className="d-flex align-items-center gap-3">
                <Image src={LOGO_LOCAL} alt={`${BRAND} Logo`} width={56} height={56} priority />
                <div>
                  <p className="mb-0 fw-semibold">{BRAND}</p>
                  <p className="mb-0 text-muted small">Google Ads Management • Measurement • Optimization</p>
                </div>
              </div>

              <div className="mt-3">
                <Image
                  src="/images/og-default.jpg"
                  alt="Google Ads Strategy"
                  width={1200}
                  height={630}
                  className="img-fluid rounded-4"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="fs-4 fw-bold mb-3">Google Ads คืออะไร?</h2>
          <p className="text-muted mb-3">
            Google Ads คือการทำโฆษณาบนเครือข่ายของ Google เพื่อให้คนที่ “กำลังค้นหา” สินค้าหรือบริการ
            เจอธุรกิจของคุณเร็วขึ้น โดยหัวใจคือการวางคีย์เวิร์ดและข้อความโฆษณาให้ตรง Intent พร้อมวัดผล Conversion
            เพื่อปรับให้คุ้มที่สุด (ROI)
          </p>
          {/* Definition Snippet (AI Visibility — นิยามสั้นๆ <200 ตัวอักษร) */}
          <div className="p-3 bg-light rounded-3 border-start border-4 border-primary">
            <p className="mb-0">
              <dfn><strong>การยิงแอดธุรกิจเฉพาะทางด้วย Google Ads คือ</strong></dfn>{" "}
              การวางโครงสร้างแคมเปญแบบ White Hat Structure เพื่อลดความเสี่ยงการแบนบัญชี พร้อมติดตั้ง Conversion Tracking และวัดผล ROI จากข้อมูลจริง
              เหมาะกับธุรกิจที่มีข้อจำกัดด้านนโยบายแพลตฟอร์ม
            </p>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="fs-4 fw-bold mb-4">สิ่งที่คุณจะได้รับ</h2>
          <div className="row g-3">
            <div className="col-md-6 col-lg-4">
              <div className="h-100 p-4 border rounded-4">
                <h3 className="fs-6 fw-bold">Audit ก่อนเริ่มงาน</h3>
                <p className="text-muted small mb-0">
                  ตรวจหน้า Landing Page, ข้อเสนอ, และจุดวัดผล เพื่อหาจุดที่ทำให้โฆษณาไม่คุ้ม หรือข้อมูลวัดผลเพี้ยน
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="h-100 p-4 border rounded-4">
                <h3 className="fs-6 fw-bold">โครงสร้างแคมเปญตาม Intent</h3>
                <p className="text-muted small mb-0">
                  แยกแคมเปญ/กลุ่มโฆษณาให้ชัด ทำให้การ Optimize ง่ายขึ้น และช่วยคุมต้นทุนได้ดีขึ้น
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="h-100 p-4 border rounded-4">
                <h3 className="fs-6 fw-bold">Tracking + Conversion</h3>
                <p className="text-muted small mb-0">
                  ตั้งค่า Conversion ให้ถูกต้อง เพื่อให้ระบบ Optimize ไปที่ยอดขาย/Lead ที่มีคุณภาพ ไม่ใช่แค่คลิก
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="fs-4 fw-bold mb-4">ขั้นตอนเริ่มต้นทำ Google Ads (แบบเป็นระบบ)</h2>
          <ol className="list-group list-group-numbered">
            <li className="list-group-item">
              <span className="fw-semibold">Audit เว็บไซต์/ฟันเนล</span>
              <div className="text-muted small">เช็คความพร้อมของหน้า Landing Page และจุดวัดผล</div>
            </li>
            <li className="list-group-item">
              <span className="fw-semibold">กำหนด Conversion</span>
              <div className="text-muted small">เลือก KPI ที่ตอบโจทย์ยอดขาย/Lead จริง</div>
            </li>
            <li className="list-group-item">
              <span className="fw-semibold">วางโครงสร้างแคมเปญ</span>
              <div className="text-muted small">จัดกลุ่มคีย์เวิร์ดและ Intent ให้ Optimize ง่าย</div>
            </li>
            <li className="list-group-item">
              <span className="fw-semibold">ติดตั้ง Tracking/Conversion</span>
              <div className="text-muted small">ทดสอบให้ข้อมูลถูกต้องก่อนยิงจริง</div>
            </li>
            <li className="list-group-item">
              <span className="fw-semibold">Launch และ Optimize</span>
              <div className="text-muted small">ปรับจากข้อมูล Conversion และคุณภาพ Lead</div>
            </li>
          </ol>
        </section>
        {/* === Comparison Table (AI loves tables) === */}
        <section className="mb-5" aria-labelledby="comparison-heading">
          <h2 id="comparison-heading" className="fs-4 fw-bold mb-4">เปรียบเทียบ: บัญชีโฆษณาปกติ vs บัญชีเอเจนซี่ (Google Ads)</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th scope="col">หัวข้อ</th>
                  <th scope="col">บัญชีโฆษณาปกติ</th>
                  <th scope="col">บัญชีเอเจนซี่ ({BRAND})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ความเสี่ยงโดนแบน</td>
                  <td className="text-danger">สูง — โครงสร้างไม่แน่นอน</td>
                  <td className="text-success">ต่ำ — วาง White Hat Structure</td>
                </tr>
                <tr>
                  <td>Conversion Tracking</td>
                  <td className="text-muted">ติดตั้งเอง — เสี่ยงผิดพลาด</td>
                  <td className="text-success">ติดตั้งโดยผู้เชี่ยวชาญ + ทดสอบก่อนยิง</td>
                </tr>
                <tr>
                  <td>รายงานผล</td>
                  <td className="text-muted">ดูเอง — ไม่รู้จะปรับอะไร</td>
                  <td className="text-success">รายงานรายสัปดาห์ + คำแนะนำ ROI</td>
                </tr>
                <tr>
                  <td>Landing Page</td>
                  <td className="text-muted">ใช้หน้าเดิม — อาจไม่ Compliant</td>
                  <td className="text-success">Audit และปรับให้ Policy-Compliant</td>
                </tr>
                <tr>
                  <td>ค่าบริการ</td>
                  <td className="text-muted">ไม่มี</td>
                  <td className="text-primary fw-bold">เริ่มต้น 12,900 บาท/เดือน</td>
                </tr>
                <tr>
                  <td>Optimization</td>
                  <td className="text-muted">ปรับเองตามความรู้สึก</td>
                  <td className="text-success">Optimize จากข้อมูลจริงรายสัปดาห์</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-5">
          <div className="p-4 p-md-5 border rounded-4 bg-light">
            <h2 className="fs-4 fw-bold mb-2">อยากเริ่มยิง Google Ads แบบวัดผลจริง?</h2>
            <p className="text-muted mb-4">
              ทักมาปรึกษาฟรี เราช่วยประเมินความพร้อมของเว็บไซต์/การวัดผล และแนะนำแนวทางเริ่มต้นที่เหมาะกับธุรกิจคุณ
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              ปรึกษาฟรี
            </Link>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="fs-4 fw-bold mb-4">คำถามที่พบบ่อย</h2>
          <FAQ
            withTitle={false}
            pageUrl={PAGE_URL}
            accordionId="faq-google-ads"
            items={faqList}
            withSchema={false}
          />
        </section>

        {/* ── Topic Cluster: Semantic Internal Links ── */}
        <aside className="p-4 bg-white rounded shadow-sm border mb-4" aria-label="เนื้อหาที่เกี่ยวข้อง">
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
              <Link href="/services/facebook-ads" className="text-primary text-decoration-none">
                → บริการ Facebook Ads สายเทา — ยิงแอดแม่นยำด้วย Conversion API
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/faq" className="text-primary text-decoration-none">
                → คำถามที่พบบ่อย (FAQ) — รวมคำตอบเทคนิคยิงแอดสายเทา
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/about" className="text-primary text-decoration-none">
                → เกี่ยวกับผู้เชี่ยวชาญ — ประวัติและ Credential ของทีม MyAdsDev
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </Fragment>
  );
}
