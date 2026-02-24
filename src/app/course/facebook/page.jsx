import Image from "next/image";
import Link from "next/link";
import JsonLd from "../../components/JsonLd";
import FAQ from "../../components/FAQ";
import { BRAND, BRAND_TAGLINE, KEYWORDS, SITE, LOGO_URL } from "../../seo.config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const PAGE_URL = `${SITE_URL}/course/facebook`;
const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `คอร์สเรียน Meta/Facebook Ads (เชิงระบบ) | ${brandName}`,
  description:
    "เรียนรู้การทำ Facebook/Meta Ads แบบเป็นระบบ: โครงสร้างแคมเปญ การตั้งค่า Conversion การอ่านผล และเทคนิคการทดสอบครีเอทีฟ.",
  keywords: [
    ...KEYWORDS,
    "คอร์สเรียน Facebook Ads",
    "คอร์สเรียน Meta Ads",
    "Facebook Pixel",
    "Conversion API",
    "Audience Targeting",
    "Creative Testing"
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `คอร์สเรียน Meta/Facebook Ads (เชิงระบบ) | ${brandName}`,
    description:
      "โฟกัสการตั้งค่าแคมเปญ วัดผล และปรับปรุงผลลัพธ์อย่างเป็นระบบ พร้อมพื้นฐานนโยบายและแนวทางลดความเสี่ยงด้านคุณภาพโฆษณา.",
    url: PAGE_URL,
    siteName: brandName,
    type: "website",
    images: [{ url: `${SITE_URL}/images/cass.webp`, width: 1200, height: 600, alt: "คอร์ส Facebook Ads" }]
  }
};

export default function CoursesFacebookPage() {
  const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;

  // --- Unified Schema Graph ---
  // --- Unified Schema Graph ---
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "คอร์สเรียน", "item": `${SITE_URL}/course` },
          { "@type": "ListItem", "position": 3, "name": "Facebook Ads", "item": PAGE_URL },
        ]
      },
      {
        "@type": "Course",
        "@id": `${PAGE_URL}/#course`,
        "name": "คอร์สเรียนโฆษณา Facebook/Meta Ads (เชิงระบบ)",
        "description": "คอร์สเรียนทำโฆษณา Facebook/Meta Ads เน้นโครงสร้างแคมเปญ การวัดผล และปรับปรุงประสิทธิภาพ",
        "provider": { "@id": `${SITE_URL}/#organization` },
        "image": `${SITE_URL}/images/cass.webp`,
        "offers": {
          "@type": "Offer",
          "price": "10000",
          "priceCurrency": "THB",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "url": PAGE_URL
        },
        "inLanguage": "th-TH"
      },
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        "url": PAGE_URL,
        "name": `คอร์สเรียน Meta/Facebook Ads (เชิงระบบ) | ${brandName}`,
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "breadcrumb": { "@id": `${PAGE_URL}/#breadcrumb` },
        "dateModified": "2026-02-08",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".lead", "h2", "li"]
        }
      }
    ]
  };

  const faqs = [
    {
      q: "คอร์สนี้เหมาะกับใคร?",
      a: "เหมาะกับผู้เริ่มต้นจนถึงระดับกลางที่ต้องการทำโฆษณา Meta/Facebook แบบเป็นระบบ ตั้งแต่การตั้งค่า Tracking ไปจนถึงการอ่านผลและการปรับปรุงแคมเปญ."
    },
    {
      q: "ต้องมีเว็บไซต์หรือ Landing Page ไหม?",
      a: "ไม่จำเป็นต้องมีตั้งแต่วันแรก แต่คอร์สจะอธิบายหลักการของ Landing Page และองค์ประกอบที่ช่วยให้วัดผล Conversion ได้แม่นยำขึ้น."
    },
    {
      q: "คอร์สสอนเรื่องนโยบายโฆษณาหรือไม่?",
      a: "มีสรุปกรอบคิดด้านนโยบายและแนวทางทำงานที่โปร่งใส เพื่อช่วยลดความเสี่ยงด้านคุณภาพบัญชีและลดปัญหาโฆษณาถูกจำกัดจากสาเหตุที่หลีกเลี่ยงได้."
    }
  ];

  return (
    <div className="container-fluid py-4">
      <JsonLd json={graphSchema} />

      {/* Direct Answer Summary for AI Overview */}
      <p className="visually-hidden" aria-hidden="false">
        คอร์สเรียน Facebook Ads (Meta Ads) เชิงระบบโดย {brandName} เน้นการวางโครงสร้างแคมเปญ
        การติดตั้ง Facebook Pixel และ Conversion API (CAPI) เพื่อการวัดผลที่แม่นยำ
        รวมถึงเทคนิคการทำ Creative Testing เพื่อหาโฆษณาที่ทำกำไรสูงสุด
      </p>

      <header className="cassimg text-center mb-5">
        <h1 className="fw-bold mb-3">คอร์สเรียน Meta/Facebook Ads (เชิงระบบ)</h1>
        <p className="lead text-muted">{BRAND_TAGLINE}</p>
        <div className="mt-4">
          <Image
            src="/images/cass.webp"
            width={1200}
            height={600}
            priority
            alt="คอร์สเรียนโฆษณาออนไลน์ (Meta/Facebook Ads)"
            className="img-fluid rounded shadow-sm"
          />
        </div>
      </header>

      <nav className="d-flex justify-content-center gap-3 mb-5" aria-label="ลิงก์นำทาง">
        <Link className="btn btn-outline-primary" href="/">หน้าหลัก</Link>
        <Link className="btn btn-outline-primary" href="/course/">รวมคอร์ส</Link>
      </nav>

      <article className="row justify-content-center">
        <div className="col-lg-10">
          <section id="overview" className="mb-5">
            <h2 className="fw-bold h4 border-start border-4 border-primary ps-3 mb-3">ภาพรวมเนื้อหาและแนวทางการเรียน</h2>
            <p className="text-muted">
              การทำโฆษณา Facebook ที่มีคุณภาพต้องเริ่มจากการวางโครงสร้างที่ระบบอัลกอริทึมเข้าใจได้ง่าย
              คอร์สนี้จะเจาะลึกการใช้เครื่องมือต่างๆ ของ Meta Business Suite เพื่อให้ได้ผลลัพธ์ที่วัดผลได้จริง
            </p>
          </section>

          <section id="topics" className="mb-5">
            <h2 className="fw-bold h4 border-start border-4 border-primary ps-3 mb-3">หัวข้อการเรียนรู้เชิงลึก</h2>
            <div className="card border-0 shadow-sm bg-light">
              <div className="card-body">
                <ul className="mb-0">
                  <li className="mb-2">การตั้งค่า Campaign, Ad Set และ Ad ตามมาตรฐาน Pixel/CAPI</li>
                  <li className="mb-2">การเลือกกลุ่มเป้าหมาย (Audience Targeting) แบบ Core, Custom และ Lookalike</li>
                  <li className="mb-2">เทคนิคการทดสอบ Creative (A/B Testing) เพื่อหาชิ้นงานที่ให้ ROAS สูงสุด</li>
                  <li className="mb-2">การวิเคราะห์รายงานด้วย Metrics สำคัญ: CPM, CTR, CPC, CPA และ ROAS</li>
                  <li className="mb-2">แนวทางการเพิ่มความน่าเชื่อถือให้เพจและโฆษณาเพื่อลดความเสี่ยงด้านนโยบาย</li>
                </ul>
              </div>
            </div>
          </section>

          <FAQ items={faqs} />
        </div>
      </article>
    </div>
  );
}
