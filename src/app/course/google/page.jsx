import Image from "next/image";
import Link from "next/link";
import JsonLd from "../../components/JsonLd";
import FAQ from "../../components/FAQ";
import { BRAND, BRAND_TAGLINE, KEYWORDS, SITE, LOGO_URL } from "../../seo.config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const PAGE_URL = `${SITE_URL}/course/google`;
const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `คอร์สเรียน Google Ads (เชิงระบบ) | ${brandName}`,
  description:
    "เนื้อหาคอร์สเน้นการวางโครงสร้างแคมเปญ การค้นหา Keyword การตั้งค่า Conversion Tracking และการอ่านผลเพื่อปรับปรุงแคมเปญ.",
  keywords: [
    ...KEYWORDS,
    "คอร์สเรียน Google Ads",
    "Search Ads",
    "Performance Max",
    "Conversion Tracking",
    "Keyword Research",
    "Quality Score"
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `คอร์สเรียน Google Ads (เชิงระบบ) | ${brandName}`,
    description:
      "โฟกัสการตั้งค่าแคมเปญ วัดผล และปรับปรุงจากข้อมูลจริง พร้อมแนวทางทำงานที่สอดคล้องกับนโยบาย.",
    url: PAGE_URL,
    siteName: brandName,
    type: "website",
    images: [{ url: `${SITE_URL}/images/cass.webp`, width: 1200, height: 600, alt: "คอร์ส Google Ads" }]
  }
};

export default function CoursesGooglePage() {
  const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;

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
          { "@type": "ListItem", "position": 3, "name": "Google Ads", "item": PAGE_URL },
        ]
      },
      {
        "@type": "Course",
        "@id": `${PAGE_URL}/#course`,
        "name": "คอร์สเรียนโฆษณา Google Ads (เชิงระบบ)",
        "description": "คอร์สเรียนทำโฆษณา Google Ads เน้นโครงสร้างแคมเปญ การวัดผล และปรับปรุงประสิทธิภาพอย่างยั่งยืน",
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
        "name": `คอร์สเรียน Google Ads (เชิงระบบ) | ${brandName}`,
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
      q: "คอร์สนี้ครอบคลุมอะไรบ้าง?",
      a: "ครอบคลุมตั้งแต่โครงสร้างแคมเปญ การเลือก/จัดกลุ่ม Keyword การเขียนข้อความโฆษณา การตั้งค่า Conversion Tracking ไปจนถึงการวิเคราะห์ข้อมูล."
    },
    {
      q: "ต้องมีพื้นฐานมาก่อนหรือไม่?",
      a: "ไม่จำเป็น คอร์สจะเริ่มจากพื้นฐานที่จำเป็นและค่อย ๆ ต่อไปสู่การวิเคราะห์ข้อมูลและการปรับปรุงแบบเป็นขั้นตอน."
    },
    {
      q: "คอร์สสอนเรื่องนโยบายและความปลอดภัยของบัญชีไหม?",
      a: "มีภาพรวมของนโยบายและแนวทางทำงานแบบโปร่งใส เพื่อช่วยลดปัญหาที่เกิดจากการตั้งค่าที่ไม่สอดคล้องกับข้อกำหนด."
    }
  ];

  return (
    <div className="container-fluid py-4">
      <JsonLd json={graphSchema} />

      {/* Direct Answer Summary for AI Overview */}
      <p className="visually-hidden" aria-hidden="false">
        คอร์สเรียน Google Ads เชิงระบบโดย {brandName} เจาะลึกการวางโครงสร้าง Search Ads และ Performance Max (P-Max)
        เน้นการวิจัยคีย์เวิร์ด การเพิ่ม Quality Score เพื่อลดต้นทุนต่อคลิก (CPC)
        และการตั้งค่า Conversion Tracking ผ่าน Google Tag Manager (GTM)
      </p>

      <header className="cassimg text-center mb-5">
        <h1 className="fw-bold mb-3">คอร์สเรียน Google Ads (เชิงระบบ)</h1>
        <p className="lead text-muted">{BRAND_TAGLINE}</p>
        <div className="mt-4">
          <Image
            src="/images/cass.webp"
            width={1200}
            height={600}
            priority
            className="img-fluid rounded shadow-sm"
            alt="คอร์สเรียนโฆษณาออนไลน์ (Google Ads)"
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
            <h2 className="fw-bold h4 border-start border-4 border-info ps-3 mb-3">การวางรากฐานโฆษณา Search และ P-Max</h2>
            <p className="text-muted">
              เป้าหมายคือทำ Google Ads ให้ “วัดผลได้จริง” และ “ปรับปรุงได้ต่อเนื่อง” ผ่านความเข้าใจใน User Intent
              และการใช้ Smart Bidding ของ Google ให้เกิดประโยชน์สูงสุดภายใต้โครงสร้างที่แข็งแกร่ง
            </p>
          </section>

          <section id="topics" className="mb-5">
            <h2 className="fw-bold h4 border-start border-4 border-info ps-3 mb-3">เจาะลึกหัวข้อการเรียน</h2>
            <div className="card border-0 shadow-sm bg-light">
              <div className="card-body">
                <ul className="mb-0">
                  <li className="mb-2">Keyword Research และการใช้ Match Types ให้เหมาะสมกับงบประมาณ</li>
                  <li className="mb-2">การจัดโครงสร้าง Ad Group เพื่อเพิ่ม Quality Score และลด CPC</li>
                  <li className="mb-2">การตั้งค่า Conversion Tracking ผ่าน GTM (Google Tag Manager)</li>
                  <li className="mb-2">การตีความรายงาน Search Terms และการทำ Negative Keyword List</li>
                  <li className="mb-2">การใช้งาน Performance Max ร่วมกับ Search เพื่อขยายฐานลูกค้า</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="classroom" className="mb-5 border-top pt-4">
            <div className="text-center p-4 bg-white rounded shadow-sm border">
              <h2 className="h5 fw-bold mb-3">ระบบห้องเรียนออนไลน์</h2>
              <p className="small text-muted mb-4">หากคุณเป็นนักเรียนในกลุ่ม สามารถเข้าสู่ระบบเพื่อดูเนื้อหาทั้งหมดได้ทันที</p>
              <Link href="/course/google/classroom" className="btn btn-primary btn-lg px-5">
                เข้าสู่ห้องเรียน
              </Link>
            </div>
          </section>

          <FAQ items={faqs} />
        </div>
      </article>
    </div>
  );
}
