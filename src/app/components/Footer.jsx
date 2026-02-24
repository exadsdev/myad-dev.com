// src/app/components/Footer.js

import Link from "next/link";
import Image from "next/image";
import {
  BRAND,
  SITE,
  LOGO_URL,
  CONTACT_EMAIL,
  ORG_LEGAL_NAME_TH,
  ORG_TAX_ID,
  ORG_ADDRESS,
  FOUNDER_NAME,
  SAME_AS_URLS,
  entityId,
} from "../seo.config";
import styles from "./Footer.module.css";
import JsonLd from "./JsonLd";

export default function Footer() {
  const year = new Date().getFullYear();

  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE || "https://myad-dev.com")
    .toString()
    .trim()
    .replace(/\/+$/, "");

  // ✅ Absolute Logo URL สำหรับ Schema (กัน URL เพี้ยน)
  const logoUrl = LOGO_URL?.startsWith("http")
    ? LOGO_URL
    : `${SITE_URL}${(LOGO_URL || "/images/logo.png").startsWith("/") ? "" : "/"}${LOGO_URL || "/images/logo.png"}`;

  // ✅ Address string สำหรับแสดงผล (YMYL Transparency ใน Footer ทุกหน้า)
  const addr = ORG_ADDRESS || {};
  const addressCountryISO = addr.addressCountry || "TH";
  const addressText = [
    addr.streetAddress,
    addr.addressLocality,
    addr.addressRegion,
    addr.postalCode,
    addressCountryISO,
  ]
    .filter(Boolean)
    .join(", ");

  /**
   * Schema Synergy:
   * ✅ ไม่สร้าง Organization ใหม่คนละตัว (ไม่แตก Entity)
   * ✅ อ้างอิง @id เดิมจาก layout.js และ “เติม” taxID + PostalAddress + addressCountry (ISO)
   */
  const orgId = entityId(SITE_URL, "organization");
  const addressId = entityId(SITE_URL, "address");
  const placeId = entityId(SITE_URL, "place");
  const logoId = entityId(SITE_URL, "logo");

  const footerSchema = {
    "@context": "https://schema.org",
    "@graph": [
      // Logo (node อ้างอิงได้)
      {
        "@type": "ImageObject",
        "@id": logoId,
        url: logoUrl,
        contentUrl: logoUrl,
        width: 512,
        height: 512,
        caption: BRAND,
      },

      // PostalAddress (explicit + ISO country code)
      {
        "@type": "PostalAddress",
        "@id": addressId,
        ...addr,
        addressCountry: addressCountryISO, // ✅ ISO 3166-1 alpha-2 (เช่น TH)
      },

      // Place (ผูก physical presence)
      {
        "@type": "Place",
        "@id": placeId,
        name: `${BRAND} Office`,
        address: { "@id": addressId },
      },

      // Organization (reference + เติมความโปร่งใส YMYL)
      {
        "@type": "Organization",
        "@id": orgId,
        name: BRAND,
        legalName: ORG_LEGAL_NAME_TH,
        url: SITE_URL,
        logo: { "@id": logoId },
        image: { "@id": logoId },
        taxID: ORG_TAX_ID,
        address: { "@id": addressId },
        location: { "@id": placeId },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: "+66 82 469 5621",
            email: CONTACT_EMAIL,
            areaServed: { "@type": "Country", name: "Thailand" },
            availableLanguage: ["Thai", "English"],
          },
        ],
      },
    ],
  };

  return (
    <footer className={`${styles.footer} mt-5`} aria-labelledby="site-footer">
      <JsonLd json={footerSchema} />

      <div className="container-fluid py-5">
        <h2 id="site-footer" className="visually-hidden">
          ส่วนท้ายเว็บไซต์ {BRAND}
        </h2>

        {/* CTA Section */}
        <div className={`${styles.cta} rounded-4 p-4 p-md-5 mb-5`}>
          <div className="row align-items-center g-3">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt={`${BRAND} โลโก้เอเจนซี่รับยิงแอดสายเทา 2026`}
                  width={48}
                  height={48}
                  className="rounded-2"
                />
                <div>
                  <h3 className="h5 mb-1 text-white">พร้อมเริ่มโฆษณาให้ธุรกิจของคุณหรือยัง?</h3>
                  <p className="mb-0 text-secondary">
                    คุยกลยุทธ์ กำหนด KPI และเริ่มต้นอย่างถูกต้องตั้งแต่วันแรกกับผู้เชี่ยวชาญ
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 d-flex gap-2 justify-content-lg-end">
              <Link href="/contact" className="btn btn-primary fw-bold px-4 rounded-3">
                ติดต่อเรา
              </Link>
              <Link href="/" className="btn btn-outline-light px-4 rounded-3">
                ← กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {/* Column 1: Brand Info */}
          <div className="col">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Image
                src={LOGO_URL || "/images/logo.png"}
                alt={`${BRAND} โลโก้เอเจนซี่รับยิงแอดสายเทา`}
                width={36}
                height={36}
                className="rounded-2"
              />
              <strong className="fs-5 text-white">{BRAND}</strong>
            </div>

            <p className="text-secondary mb-3 small">
              เอเจนซี่ที่เชี่ยวชาญด้าน Technical Ads วางระบบ Tracking/Measurement
              และการปรับประสิทธิภาพแคมเปญสำหรับธุรกิจเฉพาะทาง ดูแลโดยคุณ {FOUNDER_NAME.split(" ")[0]}
            </p>

            {/* Social Icons — Entity Connection signals */}
            <div className="d-flex gap-3 flex-wrap">
              <a
                href="https://www.instagram.com/adsdev2025/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={styles.iconBtn}
              >
                <i className="bi bi-instagram text-white fs-5"></i>
              </a>
              <a
                href="https://www.facebook.com/myadagency2026"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={styles.iconBtn}
              >
                <i className="bi bi-facebook text-white fs-5"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/ex-adsdev-99b0893aa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={styles.iconBtn}
              >
                <i className="bi bi-linkedin text-white fs-5"></i>
              </a>
              <a
                href="https://lin.ee/OuyclyD"
                target="_blank"
                rel="noopener nofollow"
                aria-label="LINE Contact"
                className={styles.iconBtn}
              >
                <i className="bi bi-line text-white fs-5"></i>
              </a>
              <a
                href="https://www.youtube.com/@myadsdev"
                target="_blank"
                rel="noopener nofollow"
                aria-label="YouTube Channel"
                className={styles.iconBtn}
              >
                <i className="bi bi-youtube text-white fs-5"></i>
              </a>
              <a
                href="https://t.me/myadsdev"
                target="_blank"
                rel="noopener nofollow"
                aria-label="Telegram"
                className={styles.iconBtn}
              >
                <i className="bi bi-telegram text-white fs-5"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="col">
            <h3 className="h6 text-uppercase text-primary fw-bold mb-3">บริการของเรา</h3>
            <ul className={`${styles.linkList} list-unstyled small`}>
              <li className="mb-2">
                <Link href="/services" className="text-secondary text-decoration-none">
                  บริการทั้งหมด (Overview)
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/services/google-ads" className="text-secondary text-decoration-none">
                  Google Ads
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/services/facebook-ads" className="text-secondary text-decoration-none">
                  Facebook Ads
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/packages" className="text-secondary text-decoration-none">
                  แพ็กเกจราคาพิเศษ
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/course" className="text-secondary text-decoration-none">
                  คอร์สเรียนยิง Ads
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Knowledge Base */}
          <div className="col">
            <h3 className="h6 text-uppercase text-primary fw-bold mb-3">แหล่งเรียนรู้</h3>
            <ul className={`${styles.linkList} list-unstyled small`}>
              <li className="mb-2">
                <Link href="/videos" className="text-secondary text-decoration-none">
                  วิดีโอเทคนิคการยิงแอด
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/blog" className="text-secondary text-decoration-none">
                  บทความความรู้
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/faq" className="text-secondary text-decoration-none">
                  คำถามที่พบบ่อย (FAQ)
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/refund" className="text-secondary text-decoration-none">
                  นโยบายการคืนเงิน
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/toolfree" className="text-secondary text-decoration-none">
                  เครื่องมือฟรี
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Tax Info */}
          <div className="col">
            <h3 className="h6 text-uppercase text-primary fw-bold mb-3">ข้อมูลการติดต่อ</h3>
            <ul className={`${styles.contactList} list-unstyled small text-secondary`}>
              <li className="mb-2">
                <strong>เว็บไซต์:</strong>{" "}
                <a href={SITE_URL} className="text-secondary text-decoration-none">
                  {SITE_URL.replace("https://", "").replace("http://", "")}
                </a>
              </li>
              <li className="mb-2">
                <strong>อีเมล:</strong>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-secondary text-decoration-none">
                  {CONTACT_EMAIL}
                </a>
              </li>

              <li className="mt-3 text-white fw-bold">{ORG_LEGAL_NAME_TH}</li>
              <li className="mb-1">เลขผู้เสียภาษี (Tax ID): {ORG_TAX_ID}</li>
              <li className="mb-2">ที่อยู่: {addressText || "—"}</li>

              <li>
                <a
                  href="https://maps.app.goo.gl/E3PrCnVSWAdCkvvs8"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="btn btn-sm btn-outline-primary mt-2"
                >
                  <i className="bi bi-geo-alt-fill me-1"></i> เปิด Google Maps
                </a>
              </li>
            </ul>

            {/* ── Google Maps Embed (Location Signal for AI Overview) ── */}
            <div className="mt-3 rounded-3 overflow-hidden" style={{ height: 180 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.4!2d101.27!3d12.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s!5e0!3m2!1sth!2sth!4v1707900000000!5m2!1sth!2sth"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`แผนที่สำนักงาน ${BRAND}`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom: Legal Links */}
      <div className={`${styles.bottom} py-4 border-top border-dark`}>
        <div className="container-fluid d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-center">
          <div className="small text-secondary">
            © {year} {BRAND}. สงวนลิขสิทธิ์. | ก้าวนำ โฆษณา
          </div>
          <nav aria-label="ลิงก์นโยบายทางกฎหมาย">
            <ul className={`${styles.bottomLinks} list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-0 small`}>
              <li>
                <Link href="/privacy" className="text-secondary text-decoration-none">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary text-decoration-none">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-secondary text-decoration-none">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-secondary text-decoration-none">
                  Security Policy
                </Link>
              </li>
              <li>
                <a href="#top" className="text-primary text-decoration-none fw-bold">
                  ↑ กลับขึ้นบน
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
