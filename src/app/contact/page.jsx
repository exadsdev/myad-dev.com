import {
  SITE,
  BRAND,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SAME_AS_URLS,
  FOUNDER_NAME,
  FOUNDER_JOB_TITLE,
  ORG_LEGAL_NAME_TH,
  ORG_LEGAL_NAME_EN,
  ORG_TAX_ID,
  ORG_ADDRESS,
  generateTitle,
  generateDescription,
  generateCanonical,
  generateOgImage,
} from "../seo.config";
import Link from "next/link";
import JsonLd from "../components/JsonLd";
import FAQ from "../components/FAQ";
import ContactForm from "./ContactForm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const PAGE_URL = generateCanonical("/contact");
const OG_IMAGE = generateOgImage();

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: generateTitle("contact"),
  description: generateDescription("contact"),
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: BRAND,
    title: generateTitle("contact"),
    description: generateDescription("contact"),
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: generateTitle("contact"),
    description: generateDescription("contact"),
    images: [OG_IMAGE],
  },
};

export default function ContactPage() {
  const faqItems = [
    {
      q: "ควรเตรียมข้อมูลอะไรบ้างก่อนติดต่อ?",
      a: "แนะนำให้เตรียมลิงก์เว็บไซต์/เพจ ประเภทสินค้า/บริการ กลุ่มลูกค้าเป้าหมาย งบประมาณ และเป้าหมายที่ต้องการวัดผล ทีมจะช่วยวิเคราะห์และเสนอแผนให้",
    },
    {
      q: "ใช้เวลาตอบกลับนานแค่ไหน?",
      a: "โดยทั่วไปทีมงานจะตอบกลับภายในวันทำการเดียวกัน หรือภายใน 24 ชั่วโมง สำหรับข้อความเร่งด่วน สามารถติดต่อผ่าน LINE ได้ทันที",
    },
    {
      q: "สามารถนัดประชุมออนไลน์ได้หรือไม่?",
      a: "ได้แน่นอน ทีมงานพร้อมนัดหมายประชุมออนไลน์ผ่าน Zoom หรือ Google Meet เพื่อพูดคุยรายละเอียดโครงการ",
    },
  ];

  // Unified Schema Graph for E-E-A-T & AI Overview
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      // Reference to main entities (defined in Layout)
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": BRAND,
        "legalName": ORG_LEGAL_NAME_TH,
        "url": SITE_URL,
        "email": CONTACT_EMAIL,
        "telephone": CONTACT_PHONE,
        "address": { "@type": "PostalAddress", ...ORG_ADDRESS },
        "taxID": ORG_TAX_ID,
        "sameAs": SAME_AS_URLS,
        "founder": { "@type": "Person", "@id": `${SITE_URL}/#person`, "name": FOUNDER_NAME, "jobTitle": FOUNDER_JOB_TITLE }
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        "name": ORG_LEGAL_NAME_EN,
        "url": SITE_URL,
        "address": { "@type": "PostalAddress", ...ORG_ADDRESS },
        "telephone": CONTACT_PHONE,
        "email": CONTACT_EMAIL,
        "parentOrganization": { "@id": `${SITE_URL}/#organization` }
      },
      { "@type": "Person", "@id": `${SITE_URL}/#person` },
      // Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "ติดต่อเรา", "item": PAGE_URL },
        ]
      },
      // ContactPage with proper connection
      {
        "@type": ["ContactPage", "FAQPage"],
        "@id": `${PAGE_URL}/#webpage`,
        "url": PAGE_URL,
        "name": generateTitle("contact"),
        "description": generateDescription("contact"),
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "about": { "@id": `${SITE_URL}/#organization` },
        "breadcrumb": { "@id": `${PAGE_URL}/#breadcrumb` },
        "inLanguage": "th-TH",
        "datePublished": "2024-01-01",
        "dateModified": "2026-02-14",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#direct-answer-contact", "h1", "h2"]
        },
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a,
            "author": { "@id": `${SITE_URL}/#person` }
          }
        }))
      }
    ]
  };

  return (
    <>
      {/* Unified Schema Graph */}
      <JsonLd json={graphSchema} />

      {/* Direct Answer (AI Overview) — แสดงผลปกติ */}
      <div
        id="direct-answer-contact"
        className="alert alert-info border-start border-4 border-primary mb-4"
      >
        <p className="mb-0 small">
          <strong>สรุป:</strong> ติดต่อ {BRAND} - {ORG_LEGAL_NAME_TH} เลขทะเบียนนิติบุคคล {ORG_TAX_ID}
          | อีเมล: {CONTACT_EMAIL} | LINE: @myadsdev
          | ที่อยู่: {ORG_ADDRESS.streetAddress} {ORG_ADDRESS.addressLocality} {ORG_ADDRESS.postalCode}
          | ผู้เชี่ยวชาญด้าน Google Ads และ Facebook Ads
        </p>
      </div>

      <div className="container py-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">หน้าแรก</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              ติดต่อเรา
            </li>
          </ol>
        </nav>

        <article className="bg-white p-4 p-md-5 shadow-sm rounded">
          <h1 className="mb-4 fw-bold text-primary">ติดต่อเรา</h1>

          <div className="mb-4">
            <h2 className="h5 mb-3">ข้อมูลบริษัท</h2>
            <ul className="list-unstyled">
              <li><strong>ชื่อธุรกิจ (TH):</strong> {ORG_LEGAL_NAME_TH}</li>
              <li><strong>Legal name (EN):</strong> {ORG_LEGAL_NAME_EN}</li>
              <li><strong>เลขทะเบียน/เลขผู้เสียภาษี:</strong> {ORG_TAX_ID}</li>
              <li>
                <strong>ที่อยู่:</strong>{" "}
                {ORG_ADDRESS.streetAddress} {ORG_ADDRESS.addressLocality} {ORG_ADDRESS.addressRegion} {ORG_ADDRESS.postalCode}
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="h5 mb-3">แผนที่บริษัท</h2>
            <div className="ratio ratio-16x9 rounded overflow-hidden border" style={{ maxHeight: "280px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.403517962247!2d101.26471893488771!3d12.687065099999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102fbea1662717b%3A0x884c384cdd471acf!2z4Lir4LmJ4Liy4LiH4Lir4Li44LmJ4LiZ4Liq4LmI4Lin4LiZ4LiI4Liz4LiB4Lix4LiUIOC4geC5ieC4suC4p-C4meC4s-C5guC4huC4qeC4k-C4sg!5e0!3m2!1sth!2sth!4v1767056376164!5m2!1sth!2sth"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                aria-label={`แผนที่ ${ORG_LEGAL_NAME_TH}`}
                title="แผนที่บริษัท"
              />
            </div>
            <p className="small text-muted mt-2">
              <a href="https://maps.app.goo.gl/E3PrCnVSWAdCkvvs8" target="_blank" rel="noopener noreferrer">
                เปิดดูแผนที่บน Google Maps
              </a>
            </p>
          </div>

          <div className="mb-4">
            <h2 className="h5 mb-3">ช่องทางติดต่อ</h2>
            <ul className="list-unstyled">
              <li><strong>อีเมล:</strong> {CONTACT_EMAIL}</li>
              <li><strong>เว็บไซต์:</strong> {SITE_URL}</li>
              <li><strong>LINE Official:</strong> @myadsdev</li>
            </ul>
          </div>

          <div className="d-flex gap-3 flex-wrap mb-4">
            <a href="https://lin.ee/vjeDuCZ" target="_blank" rel="noopener noreferrer" className="btn btn-success btn-lg">
              ติดต่อผ่าน LINE
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-outline-primary btn-lg">
              ส่งอีเมล
            </a>
            <Link href="/" className="btn btn-outline-secondary btn-lg">
              กลับหน้าแรก
            </Link>
          </div>

          <div className="mb-5">
            <ContactForm />
          </div>

          <div className="mt-5 pt-4 border-top">
            <h2 className="h5 mb-4">คำถามที่พบบ่อยเกี่ยวกับการติดต่อ</h2>
            <FAQ items={faqItems} withSchema={false} withTitle={false} pageUrl={PAGE_URL} accordionId="faq-contact" />
          </div>
        </article>
      </div>
    </>
  );
}
