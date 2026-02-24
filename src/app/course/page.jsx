import Link from "next/link";
import Image from "next/image";
import JsonLd from "../components/JsonLd";
import FAQ from "../components/FAQ";
import { SITE, BRAND, LOGO_URL } from "../seo.config";
import AuthorBio from "../components/AuthorBio";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const PAGE_URL = `${SITE_URL}/course`;
const OG_IMAGE = `${SITE_URL}/img/heromaim.webp`;

export const dynamic = "force-static";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `คอร์สเรียนโฆษณาออนไลน์ (Facebook/Meta + Google Ads) | ${BRAND}`,
  description: `คอร์สเรียนโฆษณาออนไลน์: พื้นฐานถึงลงมือทำจริง ครอบคลุม Facebook/Meta Ads และ Google Ads เน้นโครงสร้าง การวัดผล และการอ่านรายงาน โดยทีมงาน ${BRAND}`,
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
    siteName: BRAND,
    title: `คอร์สเรียนโฆษณาออนไลน์ (Facebook/Meta + Google Ads) | ${BRAND}`,
    description: "คอร์สเรียนโฆษณาออนไลน์ ครอบคลุม Facebook/Meta Ads และ Google Ads เน้นโครงสร้าง การวัดผล และการอ่านรายงาน",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 600,
        alt: `${BRAND} - คอร์สเรียนโฆษณาออนไลน์`,
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myadsdev",
    title: `คอร์สเรียนโฆษณาออนไลน์ (Facebook/Meta + Google Ads) | ${BRAND}`,
    description: "คอร์สเรียนโฆษณาออนไลน์ ครอบคลุม Facebook/Meta Ads และ Google Ads เน้นโครงสร้าง การวัดผล และการอ่านรายงาน",
    images: [OG_IMAGE],
  },
  keywords: [
    "คอร์สเรียนยิงแอด",
    "คอร์สเรียนการตลาดออนไลน์",
    "คอร์ส Facebook Ads",
    "คอร์ส Google Ads",
    "เรียนยิงแอด",
    "สอนยิงแอด",
    "คอร์สยิงแอด",
  ],
};

export default function CoursesPage() {
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
          { "@type": "ListItem", "position": 2, "name": "คอร์สเรียน", "item": PAGE_URL },
        ]
      },
      // Facebook Course
      {
        "@type": "Course",
        "@id": `${PAGE_URL}/#facebook-course`,
        "name": "คอร์สเรียนโฆษณา Facebook/Meta Ads สายเทา",
        "description": "คอร์สเรียนทำโฆษณา Facebook/Meta Ads เน้นโครงสร้างแคมเปญ การทดสอบครีเอทีฟ และการวัดผล",
        "provider": { "@id": `${SITE_URL}/#organization` },
        "image": `${SITE_URL}/img/heromaim.webp`,
        "offers": {
          "@type": "Offer",
          "price": "10000",
          "priceCurrency": "THB",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://classroom.myad-dev.com/facebook"
        }
      },
      // Google Course
      {
        "@type": "Course",
        "@id": `${PAGE_URL}/#google-course`,
        "name": "คอร์สเรียนโฆษณา Google Ads",
        "description": "คอร์สเรียนทำโฆษณา Google Ads เน้นโครงสร้างแคมเปญ คีย์เวิร์ด การตั้งค่า Conversion และการอ่านรายงาน",
        "provider": { "@id": `${SITE_URL}/#organization` },
        "image": `${SITE_URL}/images/cass.webp`,
        "offers": {
          "@type": "Offer",
          "price": "18500",
          "priceCurrency": "THB",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://classroom.myad-dev.com/google"
        }
      },
      // WebPage
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": `${PAGE_URL}/#webpage`,
        "url": PAGE_URL,
        "name": `คอร์สเรียนโฆษณาออนไลน์ (Facebook/Meta + Google Ads) | ${BRAND}`,
        "description": "คอร์สเรียนโฆษณาออนไลน์ ครอบคลุม Facebook/Meta Ads และ Google Ads เน้นโครงสร้าง การวัดผล และการอ่านรายงาน",
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "about": { "@id": `${SITE_URL}/#organization` },
        "breadcrumb": { "@id": `${PAGE_URL}/#breadcrumb` },
        "datePublished": "2024-01-01",
        "dateModified": "2026-02-14",
        "inLanguage": "th-TH",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#direct-answer-course", "h1", "h2"]
        }
      }
    ]
  };

  return (
    <>
      <JsonLd json={graphSchema} />

      {/* Direct Answer (AI Overview) — แสดงผลปกติ */}
      <div
        id="direct-answer-course"
        className="alert alert-info border-start border-4 border-primary mx-auto mb-4"
        style={{ maxWidth: 800 }}
      >
        <p className="mb-0 small">
          <strong>สรุป:</strong> คอร์สเรียนโฆษณาออนไลน์จาก {BRAND} ครอบคลุมทั้ง Facebook/Meta Ads และ Google Ads
          สอนตั้งแต่พื้นฐานจนถึงการวางโครงสร้างแคมเปญระดับเทคนิค (Technical Marketing)
          เน้นการตั้งค่า Conversion Tracking และการวัดผลที่พิสูจน์ได้จริง
        </p>
      </div>

      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold text-center mb-4">คอร์สเรียนโฆษณาออนไลน์ Facebook และ Google Ads</h1>

        <div className="mb-5 d-flex justify-content-center">
          <div style={{ maxWidth: 980, width: "100%" }}>
            <AuthorBio
              title="ผู้สอนคอร์สโฆษณาออนไลน์สำหรับธุรกิจเฉพาะทาง"
              highlight="รับทำโฆษณา Google สายเทา"
            />
          </div>
        </div>

        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none">หน้าแรก</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">คอร์สเรียน</li>
          </ol>
        </nav>

        <div className="text-center mb-5">
          <Link href="https://classroom.myad-dev.com/" className="btn btn-success mb-4">เข้าสู่ระบบห้องเรียนออนไลน์</Link>
          <div className="h2 fw-bold mb-4">เรียนยิงแอดโฆษณา ครบวงจร</div>
          <Image
            src="/img/heromaim.webp"
            width={1200}
            height={600}
            priority={true}
            className="img-fluid rounded shadow-sm"
            alt="คอร์สเรียนโฆษณาออนไลน์ Facebook และ Google Ads"
          />
        </div>

        { }
        <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
          <Link href="https://classroom.myad-dev.com/facebook" className="btn btn-outline-primary btn-lg">
            คอร์สเรียน Facebook/Meta Ads
          </Link>
          <Link href="https://classroom.myad-dev.com/google" className="btn btn-outline-primary btn-lg">
            คอร์สเรียน Google Ads
          </Link>
        </div>

        { }
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <h2 className="fw-bold">บริการคอร์สเรียนทำการตลาดออนไลน์</h2>
              <Image
                src="/images/facebook_ads.webp"
                width={600}
                height={350}
                loading="lazy"
                className="img-fluid rounded shadow-sm mt-3"
                alt="คอร์สเรียนทำการตลาดออนไลน์ Facebook Ads"
              />
            </div>

            <section className="mb-5">
              <h2 className="fw-bold text-primary">ทำไมควรเรียนรู้การโฆษณาออนไลน์แบบวัดผลได้</h2>
              <p className="text-muted">
                การโฆษณาออนไลน์ที่ดีคือการตั้งเป้าหมายให้ชัดเจน สร้างโครงสร้างแคมเปญที่ตรวจสอบได้
                และวัดผลด้วยเหตุการณ์ Conversion เพื่อปรับปรุงประสิทธิภาพจากข้อมูลจริง
              </p>
            </section>

            <section className="mb-5">
              <h2 className="fw-bold text-primary">คอร์สเรียน Facebook/Meta Ads</h2>
              <p className="text-muted">
                เน้นการวางโครงสร้างแคมเปญ การกำหนดกลุ่มเป้าหมาย การทดสอบครีเอทีฟ และการตั้งค่าสัญญาณวัดผล (Pixel/Conversion API)
              </p>

              <h3 className="mt-4">สิ่งที่คุณจะได้เรียนรู้</h3>
              <ul className="text-muted">
                <li>การวิเคราะห์กลุ่มเป้าหมายและการแบ่งกลุ่มตาม Funnel</li>
                <li>การเขียนข้อความโฆษณาให้ชัดเจนและสอดคล้องกับหน้า Landing</li>
                <li>การใช้เครื่องมือและฟีเจอร์ของ Facebook ในการสร้างและปรับแต่งโฆษณา</li>
                <li>วิธีการประเมินและวิเคราะห์ผลลัพธ์จากโฆษณา</li>
              </ul>
            </section>

            <section className="mb-5">
              <h2 className="fw-bold text-primary">คอร์สเรียน Google Ads</h2>
              <p className="text-muted">
                Google Ads เป็นแพลตฟอร์มที่มีศักยภาพสูงในการเข้าถึงลูกค้าหลากหลายกลุ่ม...
              </p>

              <h3 className="mt-4">สิ่งที่คุณจะได้เรียนรู้</h3>
              <ul className="text-muted">
                <li>การตั้งค่าและปรับแต่งแคมเปญ Google Ads ตามโครงสร้างที่ตรวจสอบได้</li>
                <li>การเลือกคำค้นหา (Keywords) ให้สอดคล้องกับเจตนาการค้นหา และลดคลิกที่ไม่เกี่ยวข้อง</li>
                <li>เทคนิคการสร้าง Landing Page ที่มี Conversion สูง</li>
                <li>การตรวจสอบและวิเคราะห์ผลลัพธ์ของแคมเปญอย่างละเอียด</li>
              </ul>
            </section>

            <section className="mb-5">
              <h2 className="fw-bold text-primary">พื้นฐานนโยบายและการลดความเสี่ยงในการทำโฆษณา</h2>
              <p className="text-muted">
                เรียนรู้หลักการตรวจสอบนโยบายและข้อกำหนดของแพลตฟอร์ม แนวทางทำคอนเทนต์ให้ชัดเจนและไม่ทำให้ผู้ใช้เข้าใจผิด
                รวมถึงการตั้งค่าและการวัดผลอย่างถูกต้องเพื่อลดความเสี่ยงในการปฏิเสธโฆษณา
              </p>
            </section>

            <section className="mb-5">
              <h2 className="fw-bold text-primary">ขั้นตอนการเริ่มเรียน</h2>
              <p className="text-muted">
                แจ้งเป้าหมายที่ต้องการ (เช่น ยอดขาย/ลีด/ทราฟฟิก) ระดับประสบการณ์ และแพลตฟอร์มที่สนใจ เพื่อให้ทีมงานแนะนำแนวทางและรูปแบบการเรียนที่เหมาะสม
              </p>
            </section>

            { }
            <div className="row g-4">
              <div className="col-md-6">
                <article className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title text-success h5">
                      คอร์สเรียน Facebook/Meta Ads
                    </h3>
                    <ul className="small text-muted">
                      <li>โครงสร้างแคมเปญและการตั้งค่า Objective ให้เหมาะกับเป้าหมาย</li>
                      <li>การกำหนดกลุ่มเป้าหมาย และการทดสอบครีเอทีฟอย่างเป็นระบบ</li>
                      <li>การติดตั้ง Pixel และ (ถ้าจำเป็น) Conversion API เพื่อวัดผล</li>
                      <li>การอ่านรายงานและการปรับปรุงตามข้อมูล (CPC/CPA/ROAS)</li>
                      <li>พื้นฐานการทำหน้า Landing ให้สอดคล้องกับข้อความโฆษณา</li>
                    </ul>
                    <p className="card-text fw-bold text-success fs-5 mt-3">ราคาเริ่มต้น 10,000 บาท</p>
                    <Link href="https://classroom.myad-dev.com/facebook" className="btn btn-success w-100">
                      ดูรายละเอียดคอร์ส Facebook
                    </Link>
                  </div>
                </article>
              </div>

              <div className="col-md-6">
                <article className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title text-primary h5">คอร์สเรียน Google Ads</h3>
                    <ul className="small text-muted">
                      <li>โครงสร้างแคมเปญ Search และแนวคิดการจัดกลุ่มโฆษณา</li>
                      <li>การเลือกคีย์เวิร์ด/Match type และการใช้ Negative keywords</li>
                      <li>การเขียนข้อความโฆษณาให้สอดคล้องกับเจตนาการค้นหา</li>
                      <li>การตั้งค่า Conversion และการเชื่อม Google Analytics/Tag Manager</li>
                      <li>การอ่านรายงานและการปรับปรุงตามข้อมูล (CPC/CPA/Quality Score)</li>
                      <li>พื้นฐานนโยบายโฆษณาและการทำคอนเทนต์ให้ชัดเจน ไม่ทำให้เข้าใจผิด</li>
                    </ul>
                    <p className="card-text fw-bold text-primary fs-5 mt-3">ราคาเริ่มต้น 18,500 บาท</p>
                    <Link href="https://classroom.myad-dev.com/google" className="btn btn-primary w-100">
                      ดูรายละเอียดคอร์ส Google
                    </Link>
                  </div>
                </article>
              </div>
            </div>

            <FAQ
              items={[
                {
                  q: "คอร์สนี้เหมาะกับผู้เริ่มต้นไหม?",
                  a: "เหมาะ โดยเริ่มจากพื้นฐานโครงสร้างแคมเปญและการวัดผล แล้วค่อยลงมือทำตามตัวอย่างเพื่อเข้าใจเหตุผลของแต่ละการตั้งค่า",
                },
                {
                  q: "ต้องมีเว็บไซต์ก่อนเรียนหรือไม่?",
                  a: "ไม่จำเป็น แต่ถ้ามีเว็บไซต์/หน้า Landing จะทำให้ฝึกการติดตั้ง Conversion และการอ่านรายงานได้ใกล้เคียงงานจริงมากขึ้น",
                },
                {
                  q: "คอร์สเน้นทฤษฎีหรือปฏิบัติ?",
                  a: "เน้นปฏิบัติ โดยใช้กรณีตัวอย่างและขั้นตอนที่ทำตามได้ เพื่อให้ต่อยอดกับบัญชีโฆษณาจริงของผู้เรียนได้",
                },
              ]}
            />

            { }
            <div className="text-center mt-5">
              <Link href="/contact" className="btn btn-success btn-lg">
                ติดต่อเพื่อสอบถามและเริ่มเรียน
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
