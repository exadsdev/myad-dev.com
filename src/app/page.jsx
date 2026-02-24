// src/app/page.jsx

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import JsonLd from "./components/JsonLd";
import {
  SITE,
  BRAND,
  DEFAULT_OG,
  FOUNDER_NAME,
  CONTACT_PHONE,
  CONTACT_EMAIL,
  generateTitle,
  generateDescription,
  generateCanonical,
  generateOgImage,
  entityId,
} from "./seo.config";
import { homeFaqs } from "./components/faqData";
import { fbPackages, googlePackages } from "./lib/packagesData";

import Sections from "./components/Sections";
import LatestContent from "./components/LatestContent";
import FAQ from "./components/FAQ";
import AuthorBio from "./components/AuthorBio";

// Force static for max speed (Core Web Vitals)
export const dynamic = "force-static";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE || "https://myad-dev.com")
  .toString()
  .trim()
  .replace(/\/+$/, "");

const PAGE_URL = generateCanonical("/");
const HERO_IMAGE = generateOgImage(DEFAULT_OG);

// ✅ เปลี่ยนเป็น .webp เฉพาะรูปใน /images เท่านั้น
const toWebpImagesOnly = (src) => {
  if (!src || typeof src !== "string") return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (!src.startsWith("/images/")) return src;
  if (src.toLowerCase().endsWith(".webp")) return src;
  return src.replace(/\.(png|jpg|jpeg)$/i, ".webp");
};

/**
 * --- 1. Metadata Optimization (Extreme SEO) ---
 */
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: generateTitle("home"),
  description: generateDescription("home"),
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: BRAND,
    title: generateTitle("home"),
    description: generateDescription("home"),
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: `บริการรับทำโฆษณา Google Ads และ Facebook Ads สำหรับธุรกิจเฉพาะทาง โดย ${BRAND}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: generateTitle("home"),
    description: generateDescription("home"),
    images: [HERO_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    maxImagePreview: "large",
    googleBot: {
      index: true,
      follow: true,
      maxImagePreview: "large",
    },
  },
};

export default function HomePage() {
  /**
   * --- 2. Advanced Unified Schema Graph ---
   * ✅ แก้ Search Console "รายการที่ไม่มีชื่อ" ใน FAQ:
   *    - WebPage เป็น ["WebPage","FAQPage"] และใส่ mainEntity (Question/Answer) โดยตรง
   *    - ปิด schema ใน <FAQ /> ไม่ให้ซ้ำ
   */
  const ids = {
    website: entityId(SITE_URL, "website"),
    organization: entityId(SITE_URL, "organization"),
    person: entityId(SITE_URL, "person"),
    webpage: entityId(SITE_URL, "webpage"),
    primaryimage: entityId(SITE_URL, "primaryimage"),
  };

  const offersFromPackages = (pkgs = [], category = "") =>
    (Array.isArray(pkgs) ? pkgs : [])
      .filter((p) => p && p.name && p.price)
      .map((p, idx) => ({
        "@type": "Offer",
        "@id": `${PAGE_URL}#offer-${category}-${idx + 1}`,
        name: p.name,
        description: p.detail || p.period || "",
        price: String(p.price).replace(/[^0-9.]/g, ""),
        priceCurrency: "THB",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/packages`,
      }));

  const faqEntities = (Array.isArray(homeFaqs) ? homeFaqs : [])
    .filter(
      (f) =>
        f &&
        typeof f.q === "string" &&
        f.q.trim() &&
        typeof f.a === "string" &&
        f.a.trim()
    )
    .map((faq) => ({
      "@type": "Question",
      name: faq.q.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a.trim(),
      },
    }));

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ids.organization,
        name: BRAND,
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: SITE_URL,
        name: BRAND,
        publisher: { "@id": ids.organization },
        inLanguage: "th-TH",
      },

      // ✅ WebPage + FAQPage ในตัวเดียว (แก้ Unnamed item ใน GSC)
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": ids.webpage,
        url: PAGE_URL,
        name: generateTitle("home"),
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.organization },
        description: generateDescription("home"),
        inLanguage: "th-TH",
        datePublished: "2024-01-01",
        dateModified: "2026-02-13",
        mainEntity: faqEntities,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#direct-answer", "h1", ".lead"],
        },
      },

      {
        "@type": "Service",
        "@id": `${PAGE_URL}#service-main`,
        name: "รับทำโฆษณา Google & Facebook สำหรับธุรกิจเฉพาะทาง",
        provider: { "@id": ids.organization },
        areaServed: "TH",
        serviceType: ["Google Ads", "Facebook Ads", "Performance Marketing"],
        url: `${SITE_URL}/services`,
        offers: [
          ...offersFromPackages(fbPackages, "fb"),
          ...offersFromPackages(googlePackages, "google"),
        ],
      },
    ],
  };

  return (
    <Fragment>
      <JsonLd json={graphSchema} />

      <article className="homepage-content" itemScope itemType="https://schema.org/WebPage">
   
        <section
          id="direct-answer"
          className="container-fluid py-3 mb-4 border-bottom border-secondary-subtle"
          aria-label="สรุปบริการ MyAdsDev"
        >
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <p className="text-muted mb-0 small">
                <strong>{BRAND}</strong> คือเอเจนซี่รับทำโฆษณา Google Ads และ Facebook Ads
                สำหรับธุรกิจเฉพาะทาง ก่อตั้งโดย{FOUNDER_NAME} เน้นวางระบบ Technical Ads,
                ติดตั้ง Conversion Tracking และวัดผล ROI แม่นยำ บริการเริ่มต้น 9,900 บาท/เดือน
                รายงานผลทุกวัน พร้อมปรับปรุงแคมเปญรายสัปดาห์เพื่อผลลัพธ์ที่วัดได้จริง
              </p>
            </div>
          </div>
        </section>

        {/* ===== Hero Section ===== */}
        <header className="hero container-fluid" aria-labelledby="hero-title">
          <div className="hero__text">
            <h1 id="hero-title" className="mb-2">
              <strong>รับยิงแอดสายเทา 2026</strong> วัดผลจริง <br />
              Google Ads &amp; Facebook Ads โดย {BRAND}
            </h1>

            <p className="text-muted lead">
              บริการทำโฆษณาให้ &quot;ธุรกิจเฉพาะทาง&quot; ด้วยแนวทางที่ยึดหลักคุณภาพหน้าเว็บ การตั้งค่า
              Conversion/Tracking ที่ถูกต้อง และการบริหารแคมเปญอย่างเป็นระบบ เพื่อเพิ่มยอดขายและลดความเสี่ยง
              MyAdsDev ช่วยวางโครงสร้างบัญชี ปรับครีเอทีฟ/คีย์เวิร์ดให้เหมาะกับนโยบาย และรายงานผลแบบวัดได้จริง (ROI/CPA/ROAS)
              โดยตั้งเป้าให้เห็นทิศทางผลลัพธ์ใน 7–14 วันแรก และเพิ่มประสิทธิภาพต่อเนื่องรายสัปดาห์
            </p>

            <div className="btn-row d-flex gap-2 flex-wrap">
              <Link className="btn btn-primary px-4 py-2 fw-bold" href="/packages">
                ดูแพ็กเกจและราคา
              </Link>
              <Link className="btn btn-outline-light px-4 py-2" href="/contact">
                ติดต่อสอบถาม
              </Link>
            </div>

            <ul className="meta mt-4 list-unstyled opacity-75" aria-label="จุดเด่นบริการ">
              <li>
                <i className="bi bi-check-circle-fill text-primary me-2"></i>วิเคราะห์ความเสี่ยงและนโยบายโฆษณาเชิงลึก
              </li>
              <li>
                <i className="bi bi-check-circle-fill text-primary me-2"></i>โครงสร้างแคมเปญแข็งแรง รายงานผล Real-time
              </li>
              <li>
                <i className="bi bi-check-circle-fill text-primary me-2"></i>ดูแลโดยทีมงานคุณ{FOUNDER_NAME.split(" ")[0]}
              </li>
            </ul>
          </div>

          <div className="hero__media mt-4">
            <Image
              src={toWebpImagesOnly("/images/og-default.jpg")}
              alt={`กราฟแสดงผลลัพธ์บริการรับทำโฆษณาออนไลน์ Google Ads และ Facebook Ads โดย ${BRAND}`}
              width={800}
              height={450}
              priority
              fetchPriority="high"
              sizes="(max-width: 576px) 100vw, (max-width: 992px) 95vw, 800px"
              quality={85}
              className="hero__img img-fluid rounded-4 shadow-lg"
              style={{ aspectRatio: "16/9", objectFit: "cover" }}
            />
          </div>
        </header>

        <section className="container-fluid my-5 py-4 border-top border-bottom border-secondary-subtle">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <AuthorBio
                title={`ผู้เชี่ยวชาญ ${BRAND} ด้านรับยิงแอดสายเทาแบบวัดผลได้`}
                highlight="รับทำโฆษณาสายเทา"
              />
            </div>
          </div>
        </section>
        <LatestContent />
        <Sections />

    
        <section className="container-fluid my-5 pt-5 border-top" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-center mb-5 fw-bold">
            คำถามที่พบบ่อย (FAQ)
          </h2>

     
          <FAQ withTitle={false} pageUrl={PAGE_URL} accordionId="faq-app" items={homeFaqs} withSchema={false} />
        </section>
      </article>
    </Fragment>
  );
}
