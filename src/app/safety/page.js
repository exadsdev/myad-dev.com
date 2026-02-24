import { SITE, BRAND, LOGO_URL } from "../seo.config";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const LOGO_FULL = LOGO_URL?.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL || "/images/logo.png"}`;
const PAGE_URL = `${SITE_URL}/safety`;
const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "รับยิงAdsสายเทา";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `นโยบายความปลอดภัย | ${brandName}`,
  description: "มาตรฐานความปลอดภัยของข้อมูล และคำแนะนำเพื่อความปลอดภัยในการใช้งานระบบโฆษณาออนไลน์",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: brandName,
    title: `นโยบายความปลอดภัย | ${brandName}`,
    description: "มาตรฐานความปลอดภัยของข้อมูล และคำแนะนำเพื่อความปลอดภัยในการใช้งาน",
    images: [{ url: `${SITE_URL}/images/og-default.jpg`, width: 1200, height: 630, alt: `${brandName} Safety` }],
  },
};

export default function SafetyPage() {
  const faqItems = [
    {
      q: "การรับส่งข้อมูลบนเว็บไซต์มีความปลอดภัยอย่างไร?",
      a: "เราใช้โปรโตคอล HTTPS (SSL/TLS) ในการเข้ารหัสข้อมูลทุกขั้นตอน เพื่อป้องกันการถูกดักจับข้อมูลระหว่างทาง",
    },
    {
      q: "หากพบความผิดปกติในบัญชีโฆษณาต้องทำอย่างไร?",
      a: "หากพบกิจกรรมที่น่าสงสัย หรือไม่สามารถเข้าใช้งานได้ โปรดติดต่อทีมงานผ่าน LINE Official ทันทีเพื่อตรวจสอบและระงับความเสี่ยง",
    },
    {
      q: "ข้อมูลการชำระเงินถูกจัดเก็บไว้หรือไม่?",
      a: "เราไม่มีนโยบายจัดเก็บข้อมูลบัตรเครดิตหรือรหัสผ่านธนาคารของผู้ใช้ไว้ในเซิร์ฟเวอร์ของเราโดยตรง ทุกธุรกรรมจะผ่านตัวแทนรับชำระเงินที่ได้รับมาตรฐานสากล",
    },
  ];

  // --- Unified Schema Graph (Connected to Org/Website) ---
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
          { "@type": "ListItem", "position": 2, "name": "นโยบายความปลอดภัย", "item": PAGE_URL },
        ]
      },
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": `${PAGE_URL}/#webpage`,
        "name": `นโยบายความปลอดภัย | ${brandName}`,
        "url": PAGE_URL,
        "description": "มาตรฐานความปลอดภัยของข้อมูล และคำแนะนำเพื่อความปลอดภัยในการใช้งานระบบโฆษณา",
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "about": { "@id": `${SITE_URL}/#organization` },
        "breadcrumb": { "@id": `${PAGE_URL}/#breadcrumb` },
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
          "cssSelector": ["#direct-answer-safety", "h1", "h2"]
        }
      }
    ]
  };

  return (
    <div className="container-fluid py-5">
      <JsonLd json={graphSchema} />

      {/* Direct Answer (AI Overview) — แสดงผลปกติ */}
      <div
        id="direct-answer-safety"
        className="alert alert-info border-start border-4 border-primary mb-4"
      >
        <p className="mb-0 small">
          <strong>สรุป:</strong> มาตรฐานความปลอดภัยของ {brandName} เน้นการเข้ารหัสข้อมูลระดับสูงด้วย SSL/TLS
          การใช้ Payment Gateway มาตรฐาน PCI DSS และระบบจำกัดการเข้าถึงข้อมูล
          รวมถึงคำแนะนำการตั้งค่า 2FA เพื่อความปลอดภัยสูงสุดของผู้ใช้
        </p>
      </div>

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">หน้าแรก</Link></li>
          <li className="breadcrumb-item active" aria-current="page">นโยบายความปลอดภัย</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <article className="bg-white p-4 p-md-5 shadow-sm rounded">
            <h1 className="mb-4 text-primary fw-bold">นโยบายความปลอดภัย (Safety & Security)</h1>

            <div className="content-body mt-4">
              <section className="mb-5">
                <h2 className="fw-bold h4">1. การรักษาความปลอดภัยของข้อมูล</h2>
                <p>
                  <strong>{brandName}</strong> ตระหนักถึงความสำคัญของความปลอดภัยของข้อมูลส่วนบุคคลและข้อมูลทางธุรกิจ
                  เราดำเนินงานตามมาตรฐานสากลเพื่อรักษาความลับและความสมบูรณ์ของข้อมูลผู้ใช้งาน
                </p>
                <div className="mt-3">
                  <h3 className="h6 fw-bold">เทคโนโลยีที่ใช้:</h3>
                  <ul>
                    <li>การเข้ารหัส SSL/TLS สำหรับทุกการเชื่อมต่อ</li>
                    <li>Firewall และระบบตรวจจับการบุกรุก (IDS)</li>
                    <li>มาตรการจำกัดการเข้าถึงข้อมูลของผู้ปฏิบัติงาน (Least Privilege)</li>
                  </ul>
                </div>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">2. มาตรฐานการชำระเงิน</h2>
                <p>เราเลือกใช้บริการผู้ให้บริการชำระเงิน (Payment Gateway) ที่ได้รับมาตรฐาน PCI DSS เพื่อให้มั่นใจว่า:</p>
                <ul>
                  <li>ไม่มีการบันทึกข้อมูลบัตรเครดิตบนเว็บไซต์ของเรา</li>
                  <li>ข้อมูลทางบัญชีจะถูกส่งผ่านช่องทางที่เข้ารหัสและมีความปลอดภัยสูง</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">3. คำแนะนำการใช้งานบัญชีโฆษณาอย่างปลอดภัย</h2>
                <div className="alert alert-info">
                  <h3 className="alert-heading fw-bold h6">คำแนะนำสำหรับผู้ใช้:</h3>
                  <ul className="mb-0 small">
                    <li>ควรเปลี่ยนรหัสผ่านทันทีหลังได้รับมอบบัญชี (หากเป็นบริการจำหน่ายบัญชี)</li>
                    <li>ตั้งค่าการยืนยันตัวตนสองชั้น (2FA) ทุกครั้งที่มีโอกาส</li>
                    <li>แยกโปรไฟล์เบราว์เซอร์สำหรับงานโฆษณาเพื่อลดความเสี่ยงด้านความปลอดภัย</li>
                  </ul>
                </div>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">4. การรายงานและตรวจสอบความผิดปกติ</h2>
                <p>
                  หากท่านพบช่องโหว่ทางซอฟต์แวร์ หรือพบการแอบอ้างชื่อ <strong>{brandName}</strong> ในทางที่ผิด
                  โปรดติดต่อเราผ่านทาง <Link href="/contact">หน้าติดต่อเรา</Link> หรือ LINE Official ทันที
                </p>
              </section>
            </div>

            { }
            <FAQ items={faqItems} withSchema={false} />
          </article>
        </div>
      </div>
    </div>
  );
}
