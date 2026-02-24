// src/app/refund/page.js
import { SITE, BRAND, CONTACT_EMAIL, entityId } from "../seo.config";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE).toString().trim().replace(/\/+$/, "");
const PAGE_URL = `${SITE_URL}/refund`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;
const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";

export const dynamic = "force-static";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `นโยบายการคืนเงินและการรับประกัน | ${brandName}`,
  description: `รายละเอียดเงื่อนไขการคืนเงิน การรับประกันบัญชีโฆษณา และสินค้าดิจิทัลของ ${brandName} คืนเงินได้ภายใน 24 ชม. หากยังไม่เริ่มงาน`,
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: brandName,
    title: `นโยบายการคืนเงินและการรับประกัน | ${brandName}`,
    description: `รายละเอียดเงื่อนไขการคืนเงิน การรับประกันบัญชีโฆษณา และสินค้าดิจิทัลของ ${brandName}`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `นโยบายการคืนเงินและการรับประกัน ${brandName}` }],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myadsdev",
    title: `นโยบายการคืนเงินและการรับประกัน | ${brandName}`,
    description: `รายละเอียดเงื่อนไขการคืนเงิน การรับประกันบัญชีโฆษณา และสินค้าดิจิทัลของ ${brandName}`,
    images: [OG_IMAGE],
  },
};

export default function RefundPage() {
  const faqItems = [
    {
      q: "ขอคืนเงินได้ภายในกี่วันหลังชำระเงิน?",
      a: "หากยังไม่ได้เริ่มดำเนินการใดๆ สามารถขอคืนเงินเต็มจำนวนได้ภายใน 24 ชั่วโมงหลังชำระเงิน",
    },
    {
      q: "สินค้าดิจิทัลหรือคอร์สเรียนคืนเงินได้หรือไม่?",
      a: "สินค้าดิจิทัลและคอร์สเรียนที่ได้ทำการดาวน์โหลดหรือเข้าถึงแล้วไม่สามารถคืนเงินได้ ยกเว้นกรณีไฟล์มีปัญหาทางเทคนิค",
    },
    {
      q: "ขั้นตอนการเคลมบัญชีโฆษณาคืออะไร?",
      a: "ติดต่อทีมงานผ่าน LINE Official พร้อมแนบหลักฐานการโอนเงิน ทีมงานจะตรวจสอบและให้บัญชีใหม่ภายใน 24 ชม. (หากเป็นกรณี Login ไม่ได้หรือ Pre-ban)",
    },
  ];

  // --- Unified Schema Graph ---
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
        "@type": "BreadcrumbList",
        "@id": ids.breadcrumb,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "นโยบายการคืนเงิน", item: PAGE_URL },
        ],
      },
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": ids.webpage,
        name: `นโยบายการคืนเงินและการรับประกัน | ${brandName}`,
        url: PAGE_URL,
        description: `รายละเอียดเงื่อนไขการคืนเงิน การรับประกันบัญชีโฆษณา และสินค้าดิจิทัลของ ${brandName}`,
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.organization },
        breadcrumb: { "@id": ids.breadcrumb },
        datePublished: "2024-01-01",
        dateModified: "2026-02-13",
        inLanguage: "th-TH",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#direct-answer-refund", "h1", "h2", ".card-title"],
        },
      },
    ],
  };

  return (
    <article className="container-fluid py-5">
      <JsonLd json={graphSchema} />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">หน้าแรก</Link></li>
          <li className="breadcrumb-item active" aria-current="page">นโยบายการคืนเงิน/ประกัน</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="bg-white p-4 p-md-5 shadow-sm rounded">
            <h1 className="mb-4 text-primary fw-bold">นโยบายการคืนเงินและการรับประกัน</h1>

            {/* Direct Answer (AI Overview) — แสดงผลปกติ */}
            <div
              id="direct-answer-refund"
              className="alert alert-info border-start border-4 border-primary mb-4"
            >
              <p className="mb-0 small">
                <strong>สรุป:</strong> บริการโฆษณาของ {brandName} คืนเงินได้เต็มจำนวนใน 24 ชม.
                หากยังไม่เริ่มงาน สินค้าดิจิทัลและคอร์สเรียนไม่รับคืนเงิน
                การรับประกันบัญชีโฆษณาครอบคลุมกรณี Login ไม่ได้หรือ Pre-ban ภายใน 24 ชม.
                เคลมเปลี่ยนบัญชีใหม่ได้ผ่าน LINE Official
              </p>
            </div>

            <div className="content-body mt-4">
              {/* Section 1 */}
              <section className="mb-5">
                <h2 className="fw-bold text-dark border-start border-4 border-primary ps-3 mb-3">1. นโยบายการคืนเงิน (Refund Policy)</h2>
                <h3 className="fw-bold mt-3">บริการทำโฆษณา</h3>
                <ul>
                  <li>หากเรายังไม่ได้เริ่มดำเนินการใดๆ ท่านสามารถขอคืนเงินได้เต็มจำนวนภายใน 24 ชั่วโมงหลังชำระเงิน</li>
                  <li>หากเริ่มดำเนินการติดตั้งหรือจัดการแคมเปญไปแล้ว ขอสงวนสิทธิ์ในการไม่คืนเงินทุกกรณี</li>
                </ul>
                <h3 className="fw-bold mt-3">คอร์สเรียนออนไลน์ / สินค้าดิจิทัล</h3>
                <ul>
                  <li>เนื่องจากเป็นสินค้าที่สามารถคัดลอกได้ <strong>สินค้าประเภทคอร์สเรียนและไฟล์ดาวน์โหลด ซื้อแล้วไม่รับคืนเงิน</strong></li>
                  <li>หากไฟล์มีปัญหา หรือดูไม่ได้ ทางเรายินดีแก้ไขให้จนกว่าจะใช้งานได้</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className="mb-5">
                <h2 className="fw-bold text-dark border-start border-4 border-success ps-3 mb-3">2. นโยบายการรับประกัน (Warranty Policy)</h2>
                <p>สำหรับบริการจำหน่ายบัญชีโฆษณา (Ad Accounts) เรามีการรับประกันดังนี้:</p>
                <div className="card bg-light border-0 mb-3">
                  <div className="card-body">
                    <h3 className="card-title fw-bold">เงื่อนไขการเคลมบัญชี</h3>
                    <ul>
                      <li>รับประกันกรณี <strong>Login ไม่ได้</strong> หรือ <strong>บัญชีมีปัญหาก่อนใช้งาน (Pre‑ban)</strong> ภายใน 24 ชม. หลังส่งมอบ</li>
                      <li>หากใช้งานบัญชีไปแล้ว หรือมีการเติมเงินเข้าบัญชีแล้ว ถือว่าสิ้นสุดการรับประกัน</li>
                      <li>กรณีทำผิดกฎร้ายแรงของแพลตฟอร์มด้วยตนเอง จะไม่อยู่ในเงื่อนไขการรับประกัน</li>
                    </ul>
                  </div>
                </div>
                <p className="small text-muted">* การเคลมจะเป็นการเปลี่ยนบัญชีใหม่ให้ทดแทน ไม่ใช่การคืนเงิน</p>
              </section>

              {/* Section 3 */}
              <section className="mb-4">
                <h2 className="fw-bold">3. ขั้นตอนการขอคืนเงิน/เคลมประกัน</h2>
                <p>โปรดติดต่อทีมงานผ่านทาง LINE Official พร้อมแนบหลักฐานการโอนเงินและรายละเอียดปัญหา ทีมงานจะดำเนินการตรวจสอบภายใน 1‑3 วันทำการ</p>
                <div className="mt-3 d-flex gap-2 flex-wrap">
                  <a href="https://lin.ee/OuyclyD" className="btn btn-success rounded-pill px-4" target="_blank" rel="noopener noreferrer nofollow">
                    ติดต่อแจ้งปัญหาผ่าน LINE
                  </a>
                  <Link href="/contact" className="btn btn-outline-primary rounded-pill px-4">
                    หน้าติดต่อเรา
                  </Link>
                </div>
              </section>
            </div>

            {/* FAQ */}
            <FAQ items={faqItems} withSchema={false} />
          </div>
        </div>
      </div>
    </article>
  );
}
