// src/app/about/page.js

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import JsonLd from "../components/JsonLd";
import FAQ from "../components/FAQ";
import {
  SITE,
  BRAND,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SAME_AS_URLS,
  BRAND_TAGLINE,
  ORG_LEGAL_NAME_TH,
  ORG_LEGAL_NAME_EN,
  ORG_TAX_ID,
  ORG_ADDRESS,
  FOUNDER_NAME,
  FOUNDER_JOB_TITLE,
  FOUNDER_KNOWS_ABOUT,
  LOGO_URL,
} from "../seo.config";
import styles from "./about.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const PAGE_URL = `${SITE_URL}/about`;
const FOUNDER_IMAGE = `${SITE_URL}/images/founder-profile.jpg`;

export const dynamic = "force-static";

export const metadata = {
  title: `เกี่ยวกับ ${BRAND} เอเจนซี่ยิงแอดสายเทา 2026`,
  description: `รู้จักทีมงาน ${BRAND} ผู้ให้บริการวางระบบโฆษณา (Google/Facebook) พร้อม Tracking/Conversion และการปรับแต่งแคมเปญแบบวัดผลได้จริง ด้วยข้อมูลนิติบุคคลและช่องทางติดต่อที่ตรวจสอบได้`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `เกี่ยวกับทีมงานและผู้ก่อตั้ง | ${BRAND}`,
    description: `เบื้องหลังการทำงานของ ${BRAND} เอเจนซี่ที่เน้น Performance Marketing, Technical SEO และการวางระบบ Conversion/Tracking สำหรับธุรกิจเฉพาะทาง`,
    url: PAGE_URL,
    siteName: BRAND,
    type: "profile",
    images: [{ url: FOUNDER_IMAGE, width: 800, height: 800, alt: `${FOUNDER_NAME} ผู้ก่อตั้ง ${BRAND}` }],
    locale: "th_TH",
  },
};

export default function AboutPage() {

  const faqItems = [
    {
      q: `${BRAND} คือใคร ทำอะไร?`,
      a: `${BRAND} คือเอเจนซี่โฆษณาออนไลน์เฉพาะทาง ก่อตั้งโดย ${FOUNDER_NAME} จดทะเบียนนิติบุคคลในชื่อ ${ORG_LEGAL_NAME_TH} เน้นบริการ Google Ads, Facebook Ads, Technical SEO, และ Conversion Tracking สำหรับธุรกิจที่มีข้อจำกัดด้านนโยบายโฆษณา`,
    },
    {
      q: "ทีมงานมีความเชี่ยวชาญด้านไหนบ้าง?",
      a: "ทีมงานเชี่ยวชาญด้าน Google Ads Policy Compliance, Facebook Conversion API, Next.js Technical SEO, Landing Page Optimization, และ Server-Side Tracking ด้วยประสบการณ์ดูแลลูกค้ากว่า 150 ราย",
    },
    {
      q: "มีผลงานหรือ Case Study ที่ตรวจสอบได้ไหม?",
      a: "มีครับ สามารถดูรีวิวจากลูกค้าจริงได้ที่หน้า /reviews ของเว็บไซต์ พร้อมข้อมูลนิติบุคคลและเลขทะเบียนที่ตรวจสอบได้",
    },
  ];

  const ids = {
    website: `${SITE_URL}/#website`,
    organization: `${SITE_URL}/#organization`,
    person: `${SITE_URL}/#person`,
    webpage: `${PAGE_URL}/#webpage`,
    primaryimage: `${PAGE_URL}/#primaryimage`,
    breadcrumb: `${PAGE_URL}/#breadcrumb`,
  };

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ids.organization,
        "name": BRAND,
        "legalName": ORG_LEGAL_NAME_TH,
        "url": SITE_URL,
        "email": CONTACT_EMAIL,
        "telephone": CONTACT_PHONE,
        "address": { "@type": "PostalAddress", ...ORG_ADDRESS },
        "taxID": ORG_TAX_ID,
        "logo": {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          "url": `${SITE_URL}${LOGO_URL}`,
          "contentUrl": `${SITE_URL}${LOGO_URL}`,
          "width": 512,
          "height": 512,
          "caption": `โลโก้ ${BRAND}`,
        },
        "sameAs": SAME_AS_URLS,
        "description": BRAND_TAGLINE,
        "founder": { "@id": ids.person },
      },
      {
        "@type": "Person",
        "@id": ids.person,
        "name": FOUNDER_NAME,
        "jobTitle": FOUNDER_JOB_TITLE,
        "url": PAGE_URL,
        "image": FOUNDER_IMAGE,
        "worksFor": { "@id": ids.organization },
        "email": CONTACT_EMAIL,
        "knowsAbout": FOUNDER_KNOWS_ABOUT,
        "sameAs": SAME_AS_URLS,
        "description": `ผู้ก่อตั้ง ${BRAND} ผู้เชี่ยวชาญด้าน Google Ads Policy, Facebook CAPI และ Technical Marketing`,
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Professional Certification",
            "name": "Google Ads Expert — Grey Area Business",
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Professional Certification",
            "name": "Facebook Conversion API Specialist",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        "url": SITE_URL,
        "name": BRAND,
        "publisher": { "@id": ids.organization },
        "inLanguage": "th-TH",
      },
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": ids.webpage,
        "url": PAGE_URL,
        "name": metadata.title,
        "description": metadata.description,
        "isPartOf": { "@id": ids.website },
        "about": { "@id": ids.organization },
        "primaryImageOfPage": { "@id": ids.primaryimage },
        "breadcrumb": { "@id": ids.breadcrumb },
        "inLanguage": "th-TH",
        "datePublished": "2024-01-01",
        "dateModified": "2026-02-14T10:30:00+07:00",
        "mainEntity": faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#direct-answer-about", "h1", ".lead"],
        },
      },
      {
        "@type": "ImageObject",
        "@id": ids.primaryimage,
        "url": FOUNDER_IMAGE,
        "contentUrl": FOUNDER_IMAGE,
        "width": 1200,
        "height": 630,
        "caption": `${FOUNDER_NAME} ผู้ก่อตั้ง ${BRAND}`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": ids.breadcrumb,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "เกี่ยวกับเรา", "item": PAGE_URL },
        ],
      },
    ],
  };


  return (
    <Fragment>
      <JsonLd json={graphSchema} />

      {/* Note: ไม่ใช้ <main> ซ้อนเพราะ Layout มี <main> อยู่แล้ว */}
      <article className={styles.main}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="container pt-3">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted">หน้าแรก</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">เกี่ยวกับเรา</li>
          </ol>
        </nav>

        {/* --- Direct Answer Section (AI Overview) --- */}
        <section
          id="direct-answer-about"
          className="container py-3 mb-3"
          aria-label="สรุปเกี่ยวกับ MyAdsDev"
        >
          <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
            <p className="text-muted mb-0 small">
              <strong>{BRAND}</strong> คือเอเจนซี่ด้าน Technical Marketing ก่อตั้งโดย{FOUNDER_NAME}
              จดทะเบียนนิติบุคคลในชื่อ {ORG_LEGAL_NAME_TH} ({ORG_LEGAL_NAME_EN}) เลขทะเบียน {ORG_TAX_ID}
              เชี่ยวชาญการวางโครงสร้างบัญชีโฆษณาสำหรับธุรกิจที่มีข้อจำกัดด้านนโยบาย
              ดูแลลูกค้ามากกว่า 150 ราย อัตราความเสถียรของบัญชี 98%
            </p>
          </div>
        </section>

        <section className={`${styles.hero} text-center py-5`}>
          <div className="container">
            <span className="badge bg-primary mb-3 px-3 py-2 rounded-pill">E-E-A-T & Technical Workflow</span>
            <h1 className={`${styles.h1} display-4 fw-bold mb-4`}>
              เบื้องหลังความสำเร็จของ <br />
              <span className="text-primary">{BRAND}</span>
            </h1>
            <p className={`${styles.lead} lead text-muted mx-auto`} style={{ maxWidth: '800px' }}>
              เราไม่ใช่แค่คนยิงแอด แต่คือ <strong>&quot;Technical Marketers&quot;</strong> ที่เข้าใจอัลกอริทึมและนโยบายเชิงลึก
              เราสร้างความปลอดภัยให้บัญชีของคุณด้วยโครงสร้างที่ถูกต้อง และวัดผลด้วยข้อมูลจริง
            </p>
          </div>
        </section>

        <section className="container my-5" aria-labelledby="founder-section">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 text-center">
              <div className="position-relative d-inline-block">
                <div className="rounded-circle overflow-hidden shadow-lg border border-5 border-white" style={{ width: '300px', height: '300px' }}>
                  <Image
                    src="/img/x.jpg"
                    alt={`รูปภาพของ ${FOUNDER_NAME} ผู้ก่อตั้ง ${BRAND} ผู้เชี่ยวชาญด้าน Google Ads และ Facebook Ads สำหรับธุรกิจเฉพาะทาง`}
                    width={300}
                    height={300}
                    className="object-fit-cover"
                    priority
                  />
                </div>
                <div className="position-absolute bottom-0 start-50 translate-middle-x bg-white px-4 py-2 rounded-pill shadow-sm border">
                  <span className="fw-bold text-primary">{FOUNDER_NAME}</span>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <h2 id="founder-section" className="h3 fw-bold mb-3">จากประสบการณ์สู่ความเชี่ยวชาญ</h2>
              <p className="text-muted mb-4">
                &quot;ตลอดหลายปีในวงการ Digital Marketing ผมพบว่าปัญหาใหญ่สุดของธุรกิจเฉพาะทางไม่ใช่การยิงแอดไม่เป็น
                แต่คือการขาดความเข้าใจเรื่อง <strong>Policy & Structure</strong> ทำให้บัญชีถูกแบนซ้ำซาก
                ผมจึงก่อตั้ง {BRAND} ขึ้นมาเพื่อแก้ปัญหานี้ด้วยวิธี White Hat Structure&quot;
              </p>

              <dl className="row">
                <dt className="col-sm-4 text-primary fw-bold">ความเชี่ยวชาญ</dt>
                <dd className="col-sm-8">Google Ads Policy, Technical SEO, Server-Side Tracking</dd>

                <dt className="col-sm-4 text-primary fw-bold">ปรัชญาการทำงาน</dt>
                <dd className="col-sm-8">Data-Driven & Risk Management (บริหารความเสี่ยงด้วยข้อมูล)</dd>

                <dt className="col-sm-4 text-primary fw-bold">เป้าหมาย</dt>
                <dd className="col-sm-8">สร้างความยั่งยืนให้ธุรกิจที่มีข้อจำกัดด้านนโยบาย</dd>

                <dt className="col-sm-4 text-primary fw-bold">นิติบุคคล</dt>
                <dd className="col-sm-8">{ORG_LEGAL_NAME_TH} (เลขทะเบียน {ORG_TAX_ID})</dd>
              </dl>

              <div className="mt-4 d-flex gap-2 flex-wrap">
                <Link href="/contact" className="btn btn-outline-primary">
                  คุยกับทีมงาน
                </Link>
                <Link href="/reviews" className="btn btn-outline-secondary">
                  ดูรีวิวลูกค้า
                </Link>
              </div>

              {/* ── Credential Badges (E-E-A-T) ── */}
              <div className="mt-4 d-flex gap-2 flex-wrap">
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                  🎯 Google Ads Expert
                </span>
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                  📊 Facebook CAPI Specialist
                </span>
                <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                  ⚡ 10+ ปีประสบการณ์
                </span>
                <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">
                  🛡️ Server-Side Tracking Expert
                </span>
              </div>

              {/* ── Social Links (AI Entity signals) ── */}
              <div className="mt-4">
                <h3 className="h6 fw-bold mb-3">ติดตามคุณเอกสิทธิ์ได้ที่:</h3>
                <div className="d-flex gap-2 flex-wrap">
                  <a
                    href="https://www.instagram.com/adsdev2025/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-danger rounded-pill"
                  >
                    📷 Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ex-adsdev-99b0893aa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary rounded-pill"
                  >
                    💼 LinkedIn
                  </a>
                  <a
                    href="https://www.facebook.com/myadagency2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary rounded-pill"
                  >
                    👍 Facebook
                  </a>
                  <a
                    href="https://line.me/ti/p/@myadsdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-success rounded-pill"
                  >
                    💬 LINE
                  </a>
                  <a
                    href="https://t.me/myadsdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-info rounded-pill"
                  >
                    ✈️ Telegram
                  </a>
                  <a
                    href="https://www.youtube.com/@myadsdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-danger rounded-pill"
                  >
                    ▶️ YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} bg-light py-5`} aria-labelledby="standards-heading">
          <div className="container">
            <div className="text-center mb-5">
              <h2 id="standards-heading" className={styles.h2}>มาตรฐานการทำงานของเรา</h2>
              <p className="text-muted">สิ่งที่เรายึดถือเพื่อให้ลูกค้าได้รับผลลัพธ์ที่ดีที่สุด</p>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center">
                  <span className="display-3 text-primary mb-3 d-block" aria-hidden="true">🛡️</span>
                  <h3 className="h5 fw-bold">Security First</h3>
                  <p className="text-muted small">
                    เราให้ความสำคัญกับความปลอดภัยของบัญชีเป็นอันดับ 1 ทุกโครงสร้างแคมเปญผ่านการตรวจสอบความเสี่ยงก่อนเริ่มงาน
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center">
                  <span className="display-3 text-primary mb-3 d-block" aria-hidden="true">📊</span>
                  <h3 className="h5 fw-bold">Transparency</h3>
                  <p className="text-muted small">
                    ไม่มีความลับในการทำงาน คุณจะเห็นทุกข้อมูล ทุกค่าใช้จ่าย และทุก Conversion ที่เกิดขึ้นจริงผ่าน Dashboard
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center">
                  <span className="display-3 text-primary mb-3 d-block" aria-hidden="true">⚙️</span>
                  <h3 className="h5 fw-bold">Technical Focus</h3>
                  <p className="text-muted small">
                    เราใช้เครื่องมือวัดผลขั้นสูง (CAPI, GTM Server-side) เพื่อให้ข้อมูลแม่นยำที่สุด ลดปัญหาสัญญาณหาย
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-5" aria-labelledby="workflow-heading">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="ps-lg-5">
                <h2 id="workflow-heading" className="h3 fw-bold mb-4">กระบวนการทำงานที่ตรวจสอบได้</h2>
                <div className="vstack gap-4">
                  <div className="d-flex">
                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>1</div>
                    <div className="ms-3">
                      <h3 className="h6 fw-bold mb-1">Diagnosis & Audit</h3>
                      <p className="text-muted small mb-0">ตรวจสุขภาพบัญชีและความเสี่ยงของเว็บก่อนเริ่มงาน</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>2</div>
                    <div className="ms-3">
                      <h3 className="h6 fw-bold mb-1">Policy Alignment</h3>
                      <p className="text-muted small mb-0">ปรับแต่งเนื้อหาให้สอดคล้องกับนโยบาย Google/Meta</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>3</div>
                    <div className="ms-3">
                      <h3 className="h6 fw-bold mb-1">Launch & Optimize</h3>
                      <p className="text-muted small mb-0">ปล่อยแคมเปญและปรับปรุงผลลัพธ์จาก Data รายสัปดาห์</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="p-4 bg-light rounded-4 border">
                <h3 className="h5 fw-bold mb-3">สถิติความสำเร็จ</h3>
                <div className="row text-center">
                  <div className="col-6 mb-3">
                    <div className="display-6 fw-bold text-dark">10+</div>
                    <small className="text-muted">ปีประสบการณ์</small>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="display-6 fw-bold text-dark">150+</div>
                    <small className="text-muted">ธุรกิจที่ดูแล</small>
                  </div>
                  <div className="col-12">
                    <div className="p-3 bg-white rounded border">
                      <strong className="text-success">98%</strong> <span className="text-muted">Account Stability Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ Section ===== */}
        <section className="container py-5 border-top" aria-labelledby="about-faq-heading">
          <h2 id="about-faq-heading" className="h4 fw-bold text-center mb-4">คำถามที่พบบ่อยเกี่ยวกับ {BRAND}</h2>
          <FAQ items={faqItems} withSchema={false} withTitle={false} pageUrl={PAGE_URL} accordionId="faq-about" />
        </section>

      </article>
    </Fragment>
  );
}