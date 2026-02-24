// src/app/seo.config.js

export const SITE = "https://myad-dev.com";

export const BRAND = "MyAdsDev";
export const BRAND_FULL = "MyAdsDev - Technical Ads Agency 2026";
export const BRAND_TAGLINE = "เอเจนซี่รับยิงแอดสำหรับธุรกิจเฉพาะทาง วางระบบ Tracking และ Optimization เพื่อผลลัพธ์ที่วัดได้จริง";

export const DEFAULT_OG = "/images/og-default.jpg";
export const LOGO_URL = "/images/logo.png";

/**
 * ===== Trust / Legal signals (YMYL & E-E-A-T) =====
 * ข้อมูลนิติบุคคลและความน่าเชื่อถือเพื่อ Google Algorithm 2026
 */
export const ORG_LEGAL_NAME_TH = "ห้างหุ้นส่วนจำกัด ก้าวนำ โฆษณา";
export const ORG_LEGAL_NAME_EN = "GOWNUM KOSANA LIMITED PARTNERSHIP";
export const ORG_TAX_ID = "0213548002976";

export const ORG_ADDRESS = {
  "@type": "PostalAddress",
  "streetAddress": "130 ถนนราษฎร์อุทิศ ตำบลเชิงเนิน",
  "addressLocality": "อำเภอเมืองระยอง",
  "addressRegion": "ระยอง",
  "postalCode": "21000",
  "addressCountry": "TH",
};

/**
 * ===== Founder / Expert Entity (E-E-A-T Reinforced) =====
 * ข้อมูลคุณเอกสิทธิ์ เพ็ชรมนี เพื่อสร้าง Knowledge Graph ที่แข็งแรง
 */
export const FOUNDER_NAME = "เอกสิทธิ์ เพ็ชรมนี (Akasit Phetmanee)";
export const FOUNDER_JOB_TITLE = "Founder & Performance Marketer & Technical Ads Specialist";
export const FOUNDER_KNOWS_ABOUT = [
  "Google Ads Policy Compliance",
  "Facebook Conversion API (CAPI)",
  "Next.js Technical SEO",
  "Advanced Conversion Tracking",
  "Performance Marketing Strategy",
  "Landing Page Optimization",
  "Analytics & Attribution",
];

export const YOUTUBE_VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

export const CONTACT_PHONE = "+66 82 469 5621";
export const CONTACT_EMAIL = "contact@myad-dev.com";

export const SAME_AS_URLS = [
  "https://www.facebook.com/myadagency2026",
  "https://www.facebook.com/adsdark2020",
  "https://www.instagram.com/adsdev2025/",
  "https://www.linkedin.com/in/ex-adsdev-99b0893aa/",
  "https://line.me/ti/p/@myadsdev",
  "https://www.youtube.com/@myadsdev",
  "https://t.me/myadsdev",
];

/**
 * ===== Keywords (Semantic Focus) =====
 */
export const KEYWORDS = [
  "รับยิงแอดสายเทา",
  "ยิงแอดสายเทา",
  "Google Ads สายเทา",
  "Facebook Ads สายเทา",
  "เอเจนซี่โฆษณาสายเทา",
  "Compliance โฆษณา",
  "Conversion API สายเทา",
  "Technical SEO สายเทา",
  "MyAdsDev",
  "เอกสิทธิ์ เพ็ชรมนี"
];

/**
 * ===== SEO Generator Functions (AI Overview & SGE Optimized) =====
 */

export function generateTitle(pageType, params = {}) {
  const templates = {
    home: `รับยิงแอดสายเทา 2026 วัดผลจริง เอเจนซี่โฆษณาที่เชี่ยวชาญด้าน Google Ads & Facebook Ads | ${BRAND}`,
    services: `บริการยิงแอดสายเทา 2026 Google & Facebook | ${BRAND}`,
    packages: `แพ็กเกจยิงแอดสายเทา 2026 เริ่ม 9,900.- | ${BRAND}`,
    "service-google": `Google Ads สายเทา 2026 วางระบบ Tracking | ${BRAND}`,
    "service-facebook": `Facebook Ads สายเทา 2026 ยิงแอด CAPI | ${BRAND}`,
    faq: `FAQ เทคนิคยิงแอดสายเทา 2026 | ${BRAND}`,
    contact: `ปรึกษายิงแอดสายเทาฟรี 2026 | ${BRAND}`,
    about: `เกี่ยวกับ ${BRAND} เอเจนซี่ยิงแอดสายเทา 2026`,
    "case-studies": `ผลงานจริงยิงแอดสายเทา 2026 ROI/CPA | ${BRAND}`,
    "not-found": `ไม่พบหน้านี้ (404) | ${BRAND}`,
  };

  const title = templates[pageType] || `${params.title || pageType} | ${BRAND}`;
  // รักษาความยาวที่ 50-60 ตัวอักษรเพื่อการแสดงผลที่สมบูรณ์
  return title.length > 60 ? title.substring(0, 57) + "..." : title;
}

export function generateDescription(pageType, params = {}) {
  const templates = {
    home: `MyAdsDev โดยคุณเอกสิทธิ์ เพ็ชรมนี เอเจนซี่รับยิงแอดสายเทาอันดับ 1 วางระบบ Technical Ads ป้องกันการโดนแบน พร้อม Conversion API วัดผล ROI แม่นยำ 100% เริ่มต้น 9,900.-`,
    packages: `ตรวจสอบราคาแพ็กเกจยิงแอดสายเทา Google & Facebook Ads จาก ${BRAND} โดยคุณเอกสิทธิ์ เพ็ชรมนี มีให้เลือก 3 ระดับตามงบประมาณ พร้อมระบบ Tracking และรายงานผล`,
    "service-google": `รับทำ Google Ads สายเทา โดย เอกสิทธิ์ เพ็ชรมนี เน้น 1. วางระบบ Tracking 2. ติดตั้ง Tracking 3. รายงานผล Real-time เพื่อผลลัพธ์สูงสุดแม้ธุรกิจมีความเสี่ยง`,
    faq: `รวมคำตอบเทคนิคการยิงแอดสายเทาโดยคุณเอกสิทธิ์: วิธีแก้แบน, การวางโครงสร้างบัญชี และแนวทาง Compliance ที่ตรวจสอบได้`,
    contact: `ยิงแอดสายเทาให้เสถียรและยั่งยืน ปรึกษาคุณเอกสิทธิ์ เพ็ชรมนี และทีมงาน ${BRAND} เพื่อวางแผนโครงสร้างแคมเปญและระบบความปลอดภัยฟรี!`,
  };

  const description = templates[pageType] || params.excerpt || `${BRAND} เอเจนซี่รับยิงแอดสายเทาและเทคนิคการตลาดออนไลน์ขั้นสูง`;
  return description.length > 160 ? description.substring(0, 157) + "..." : description;
}

export function generateCanonical(path = "") {
  const cleanPath = path === "/" ? "" : (path.startsWith("/") ? path : `/${path}`);
  return `${SITE}${cleanPath}`.replace(/\/+$/, "");
}

export function generateOgImage(image = DEFAULT_OG) {
  if (!image) return `${SITE}${DEFAULT_OG}`;
  if (image.startsWith("http")) return image;
  return `${SITE}${image.startsWith("/") ? image : `/${image}`}`;
}

export function entityId(siteOrigin, fragment) {
  const origin = String(siteOrigin || SITE).replace(/\/+$/, "");
  const f = String(fragment || "").replace(/^#?/, "");
  return `${origin}/#${f}`;
}

export const defaultSEO = {
  title: generateTitle("home"),
  description: generateDescription("home"),
  canonical: SITE,
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: SITE,
    siteName: BRAND,
    images: [{ url: generateOgImage(), width: 1200, height: 630, alt: BRAND_FULL }]
  },
  twitter: {
    handle: "@myadsdev",
    site: "@myadsdev",
    cardType: "summary_large_image",
  },
};
