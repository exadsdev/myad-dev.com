// src/app/terms/page.js
import { SITE, BRAND, LOGO_URL, ORG_LEGAL_NAME_TH, ORG_TAX_ID, CONTACT_EMAIL, entityId } from "../seo.config";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE).toString().trim().replace(/\/+$/, "");
const LOGO_FULL = LOGO_URL?.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL || "/images/logo.png"}`;
const PAGE_URL = `${SITE_URL}/terms`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;
const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";

export const dynamic = "force-static";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `ข้อตกลงและเงื่อนไขการใช้บริการ | ${brandName}`,
  description: `รายละเอียดเงื่อนไขและข้อตกลงในการใช้บริการโฆษณาออนไลน์ ${brandName} การชำระเงิน ข้อจำกัดความรับผิดชอบ และรูปแบบการให้บริการ`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: brandName,
    title: `ข้อตกลงและเงื่อนไขการใช้บริการ | ${brandName}`,
    description: `เงื่อนไขการให้บริการรับทำโฆษณาออนไลน์ ${brandName} และการใช้งานระบบต่างๆ ของเรา`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `ข้อตกลงและเงื่อนไขการใช้บริการ ${brandName}` }],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: `ข้อตกลงและเงื่อนไขการใช้บริการ | ${brandName}`,
    description: `เงื่อนไขการให้บริการรับทำโฆษณาออนไลน์ ${brandName}`,
    images: [OG_IMAGE],
  },
};

export default function TermsPage() {
  const faqItems = [
    {
      q: "การเริ่มงานต้องมัดจำหรือไม่?",
      a: "โดยปกติจะต้องชำระค่าบริการเต็มจำนวนก่อนเริ่มดำเนินการ หรือเป็นไปตามเงื่อนไขที่ระบุในใบเสนอราคา",
    },
    {
      q: "หากบัญชีโฆษณาถูกระงับจะจัดการอย่างไร?",
      a: "เราจะใช้ความเชี่ยวชาญในการตรวจสอบและหาสาเหตุ หากเป็นความผิดพลาดเชิงเทคนิคจากทางเรา เรายินดีช่วยเหลือแก้ไขตามนโยบายการรับประกัน",
    },
    {
      q: "สามารถยกเลิกบริการระหว่างทางได้หรือไม่?",
      a: "ได้ แต่การคืนเงินจะเป็นไปตามสัดส่วนงานที่ยังไม่ได้ดำเนินการ และต้องแจ้งล่วงหน้าตามที่ระบุในข้อตกลง ดูนโยบายคืนเงินเพิ่มเติมที่หน้า /refund",
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
          { "@type": "ListItem", position: 2, name: "ข้อตกลงการใช้บริการ", item: PAGE_URL },
        ],
      },
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": ids.webpage,
        name: `ข้อตกลงและเงื่อนไขการใช้บริการ | ${brandName}`,
        url: PAGE_URL,
        description: `รายละเอียดเงื่อนไขและข้อตกลงในการใช้บริการโฆษณาออนไลน์ ${brandName}`,
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
          cssSelector: ["#direct-answer-terms", "h1", "h2"],
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
          <li className="breadcrumb-item active" aria-current="page">ข้อตกลงการใช้บริการ</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="bg-white p-4 p-md-5 shadow-sm rounded">
            <h1 className="mb-4 text-primary fw-bold">ข้อตกลงและเงื่อนไขการใช้บริการ</h1>

            {/* Direct Answer (AI Overview) — แสดงผลปกติ */}
            <div
              id="direct-answer-terms"
              className="alert alert-info border-start border-4 border-primary mb-4"
            >
              <p className="mb-0 small">
                <strong>สรุป:</strong> ข้อตกลงการใช้บริการของ {brandName} ครอบคลุมขอบเขตการให้บริการโฆษณาออนไลน์,
                การชำระเงิน, ข้อจำกัดความรับผิดชอบ, และนโยบายการยกเลิก/คืนเงิน
                การใช้บริการถือว่ายอมรับข้อตกลงทั้งหมด
              </p>
            </div>

            <p className="text-muted border-bottom pb-3">
              อัปเดตล่าสุด: 13 กุมภาพันธ์ 2569 | มีผลบังคับใช้: 1 มกราคม 2567
            </p>

            <div className="content-body mt-4">
              <section className="mb-5">
                <h2 className="fw-bold h4">1. การยอมรับข้อตกลง</h2>
                <p>
                  การเข้าใช้งานเว็บไซต์ {SITE_URL} และการรับบริการใดๆ จาก <strong>{brandName}</strong>{" "}
                  ({ORG_LEGAL_NAME_TH} เลขทะเบียน {ORG_TAX_ID})
                  ถือว่าท่านได้รับทราบและยอมรับข้อตกลงและเงื่อนไขการใช้งานเหล่านี้โดยสมบูรณ์
                </p>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">2. ขอบเขตและรูปแบบการให้บริการ</h2>
                <p>เราให้บริการด้านการตลาดดิจิทัลและเครื่องมือส่งเสริมการขาย ดังนี้:</p>
                <ul>
                  <li>การวางแผนและจัดการโฆษณา Google Ads และ Facebook Ads</li>
                  <li>คอร์สเรียนออนไลน์เกี่ยวกับการทำการตลาดดิจิทัล</li>
                  <li>บริการสนับสนุนด้านเทคนิคและการวัดผล (Conversion Tracking)</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">3. การโอนเงินและค่าธรรมเนียม</h2>
                <p>
                  ค่าบริการทั้งหมดต้องถูกชำระผ่านช่องทางที่กำหนดเท่านั้น การเริ่มงานจะเกิดขึ้นหลังจากได้รับการยืนยันการชำระเงินเรียบร้อยแล้ว
                  ในกรณีที่มีค่าธรรมเนียมเพิ่มเติมจากแพลตฟอร์มโฆษณา ผู้ใช้บริการเป็นผู้รับผิดชอบค่าใช้จ่ายนั้นตามจริง
                </p>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">4. ข้อจำกัดความรับผิดชอบ</h2>
                <div className="alert alert-warning">
                  <h3 className="h6 fw-bold mb-2">โปรดทราบ:</h3>
                  <p className="mb-0 small">
                    ผลลัพธ์ของโฆษณาขึ้นอยู่กับปัจจัยภายนอกหลายประการ (อัลกอริทึม, คู่แข่ง, สภาพตลาด)
                    เราไม่สามารถรับประกันยอดขายหรือกำไรที่แน่นอนได้ 100% แต่เราจะดำเนินการให้ดีที่สุดตามกลยุทธ์ที่วางไว้
                  </p>
                </div>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">5. การสงวนสิทธิ์และการเปลี่ยนแปลง</h2>
                <p>
                  เราขอสงวนสิทธิ์ในการปรับปรุงหรือแก้ไขข้อตกลงนี้ได้ตลอดเวลาโดยไม่จำเป็นต้องแจ้งให้ทราบล่วงหน้า
                  การใช้งานอย่างต่อเนื่องหลังการเปลี่ยนแปลงถือว่าท่านยอมรับข้อตกลงใหม่นั้น
                </p>
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
