// src/app/layout.js
import "./globals.css";
import "./home.css";
import "./body.css";

import "bootstrap/dist/css/bootstrap.min.css";
import Script from "next/script";
import { Noto_Sans_Thai } from "next/font/google";

import Header from "./components/Header";
import Footer from "./components/Footer";
import JsonLd from "./components/JsonLd";
import GoogleTags from "./components/GoogleTags";
import { GoogleAnalytics } from '@next/third-parties/google';

import {
  SITE,
  BRAND,
  DEFAULT_OG,
  KEYWORDS,
  LOGO_URL,
  CONTACT_PHONE,
  CONTACT_EMAIL,
  SAME_AS_URLS,
  ORG_LEGAL_NAME_TH,
  ORG_LEGAL_NAME_EN,
  ORG_TAX_ID,
  ORG_ADDRESS,
  FOUNDER_NAME,
  FOUNDER_JOB_TITLE,
  FOUNDER_KNOWS_ABOUT,
  entityId,
  generateTitle,
  generateDescription,
  generateOgImage,
} from "./seo.config";

// Setup Font Optimized for CLS (Cumulative Layout Shift)
const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-noto-sans",
});

// Normalize URL
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE || "https://myad-dev.com")
  .toString()
  .trim()
  .replace(/\/+$/, "");

const OG_IMAGE = generateOgImage(DEFAULT_OG);
const LOGO_FULL =
  LOGO_URL && LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL || "/images/logo.webp"}`;

/**
 * ===== Knowledge Graph IDs (Entity Resolution) =====
 */
const ids = {
  website: entityId(SITE_URL, "website"),
  organization: entityId(SITE_URL, "organization"),
  localBusiness: entityId(SITE_URL, "localbusiness"),
  professionalService: entityId(SITE_URL, "professionalservice"),
  person: entityId(SITE_URL, "person"),
  logo: entityId(SITE_URL, "logo"),
  place: entityId(SITE_URL, "place"),
  address: entityId(SITE_URL, "address"),
  geo: entityId(SITE_URL, "geo"),
};

/**
 * ===== Global Metadata (AI & SEO Readiness) =====
 */
export const metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  title: {
    default: generateTitle("home"),
    template: `%s | ${BRAND}`,
  },
  description: generateDescription("home"),
  keywords: Array.isArray(KEYWORDS) ? KEYWORDS.join(", ") : KEYWORDS,
  applicationName: BRAND,
  authors: [{ name: FOUNDER_NAME, url: SITE_URL }],
  creator: FOUNDER_NAME,
  publisher: BRAND,
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false },
  alternates: {
    canonical: SITE_URL,
    languages: { "th-TH": SITE_URL },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND,
    title: generateTitle("home"),
    description: generateDescription("home"),
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${BRAND} บริการรับทำโฆษณา Google Ads และ Facebook Ads สำหรับธุรกิจเฉพาะทาง`,
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myadsdev",
    creator: "@myadsdev",
    title: generateTitle("home"),
    description: generateDescription("home"),
    images: [OG_IMAGE],
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ||
      "rfVFinnMucWjd97dNXSMD_W6zpSL-r4nrOFBfJajvVY",
  },
  category: "Business & Industrial > Advertising & Marketing",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  const GTM = process.env.NEXT_PUBLIC_GTM_ID;
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  /**
   * ===== Unified Schema Graph (E-E-A-T + YMYL Transparency) =====
   * ✅ เพิ่ม GeoCoordinates (พิกัดระยอง)
   * ✅ เพิ่ม LocalBusiness Schema
   * ✅ เชื่อม Entity ทั้งหมดผ่าน @id
   */
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      // Logo
      {
        "@type": "ImageObject",
        "@id": ids.logo,
        url: LOGO_FULL,
        contentUrl: LOGO_FULL,
        width: 512,
        height: 512,
        caption: `โลโก้ ${BRAND} เอเจนซี่โฆษณาออนไลน์`,
      },
      // GeoCoordinates (พิกัดระยอง)
      {
        "@type": "GeoCoordinates",
        "@id": ids.geo,
        latitude: 12.6871,
        longitude: 101.2647,
      },
      // PostalAddress
      {
        "@type": "PostalAddress",
        "@id": ids.address,
        ...ORG_ADDRESS,
        addressCountry: ORG_ADDRESS?.addressCountry || "TH",
      },
      // Place (ผูก geo + address)
      {
        "@type": "Place",
        "@id": ids.place,
        name: `${BRAND} Office - สำนักงานใหญ่ ระยอง`,
        address: { "@id": ids.address },
        geo: { "@id": ids.geo },
      },
      // Organization
      {
        "@type": "Organization",
        "@id": ids.organization,
        name: BRAND,
        legalName: ORG_LEGAL_NAME_TH,
        alternateName: ["My Ads Dev", "มายแอดเดฟ", "AMB AdsManagerBoost", ORG_LEGAL_NAME_EN || "GOWNUM KOSANA LIMITED PARTNERSHIP"],
        url: SITE_URL,
        logo: { "@id": ids.logo },
        image: { "@id": ids.logo },
        description:
          "เอเจนซี่โฆษณาที่เชี่ยวชาญด้าน Performance Marketing, Technical SEO และการวางระบบ Tracking สำหรับธุรกิจเฉพาะทาง จดทะเบียนที่ระยอง ประเทศไทย",
        address: { "@id": ids.address },
        location: { "@id": ids.place },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: CONTACT_PHONE,
            email: CONTACT_EMAIL,
            availableLanguage: ["Thai", "English"],
            areaServed: { "@type": "Country", name: "Thailand" },
          },
        ],
        sameAs: SAME_AS_URLS,
        taxID: ORG_TAX_ID,
        founder: { "@id": ids.person },
        numberOfEmployees: { "@type": "QuantitativeValue", value: "2-10" },
        foundingDate: "2020",
        knowsAbout: [
          "Google Ads",
          "Facebook Ads",
          "Performance Marketing",
          "Technical SEO",
          "Conversion Tracking",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          bestRating: "5",
          worstRating: "1",
          ratingCount: "150",
          reviewCount: "87",
        },
        review: [
          {
            "@type": "Review",
            author: { "@type": "Person", name: "ลูกค้าธุรกิจอาหารเสริม" },
            datePublished: "2025-11-20",
            reviewBody: "ใช้บริการยิงแอด Google Ads สายเทากับ MyAdsDev บัญชีเสถียรมาก 6 เดือนไม่โดนแบน CPA ลดจาก 1,200 เหลือ 185 บาท ประทับใจมาก",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "เจ้าของคลินิกความงาม" },
            datePublished: "2025-12-10",
            reviewBody: "จ้าง MyAdsDev ดูแล Facebook Ads ลด CPA จาก 1,200 เหลือ 380 ใน 30 วัน ระบบ CAPI แม่นยำมาก รายงานผลทุกวัน",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          },
        ],
      },
      // LocalBusiness (สำหรับ Google Maps & Local SEO)
      {
        "@type": "LocalBusiness",
        "@id": ids.localBusiness,
        name: BRAND,
        legalName: ORG_LEGAL_NAME_TH,
        url: SITE_URL,
        image: { "@id": ids.logo },
        telephone: CONTACT_PHONE,
        email: CONTACT_EMAIL,
        address: { "@id": ids.address },
        geo: { "@id": ids.geo },
        priceRange: "฿฿฿",
        currenciesAccepted: "THB",
        paymentAccepted: "Cash, Bank Transfer, PromptPay",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
            ],
            opens: "09:00",
            closes: "21:00",
          },
        ],
        parentOrganization: { "@id": ids.organization },
        sameAs: SAME_AS_URLS,
      },
      // Person (Founder / Expert)
      {
        "@type": "Person",
        "@id": ids.person,
        name: FOUNDER_NAME,
        jobTitle: FOUNDER_JOB_TITLE,
        url: `${SITE_URL}/about`,
        worksFor: { "@id": ids.organization },
        knowsAbout: FOUNDER_KNOWS_ABOUT,
        sameAs: SAME_AS_URLS,
        description: "ผู้ก่อตั้ง MyAdsDev ผู้เชี่ยวชาญด้าน Google Ads, Facebook Ads และ Technical Marketing สำหรับธุรกิจเฉพาะทาง",
      },
      // WebSite
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: SITE_URL,
        name: BRAND,
        publisher: { "@id": ids.organization },
        inLanguage: "th-TH",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      // ProfessionalService
      {
        "@type": "ProfessionalService",
        "@id": ids.professionalService,
        name: BRAND,
        url: SITE_URL,
        image: { "@id": ids.logo },
        telephone: CONTACT_PHONE,
        address: { "@id": ids.address },
        geo: { "@id": ids.geo },
        priceRange: "฿฿฿",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
            ],
            opens: "09:00",
            closes: "21:00",
          },
        ],
        provider: { "@id": ids.organization },
        brand: { "@id": ids.organization },
        founder: { "@id": ids.person },
        location: { "@id": ids.place },
        areaServed: { "@type": "Country", name: "Thailand" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "บริการยิงแอดสำหรับธุรกิจเฉพาะทาง",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Google Ads Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "บริการรับทำ Google Ads",
                    url: `${SITE_URL}/services/google-ads`,
                  },
                },
              ],
            },
            {
              "@type": "OfferCatalog",
              name: "Facebook Ads Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "บริการรับทำ Facebook Ads",
                    url: `${SITE_URL}/services/facebook-ads`,
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };

  return (
    <html lang="th" suppressHydrationWarning className={notoSansThai.className}>
      <head>
        <JsonLd json={graphSchema} />

        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>

      <body className="antialiased">
        {/* GTM Noscript */}
        {GTM && (
          <noscript>
            <iframe
              loading="lazy"
              src={`https://www.googletagmanager.com/ns.html?id=${GTM}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}

        <GoogleTags />

        <a href="#main-content" className="visually-hidden-focusable">
          ข้ามไปยังเนื้อหาหลัก
        </a>

        <Header />

        <main id="main-content" role="main" className="container min-vh-100">
          {children}
        </main>

        <Footer />

        {/* Google Analytics 4 (Using Next.js official component) */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}

        {/* Bootstrap JS Bundle */}
        <Script
          strategy="afterInteractive"
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}