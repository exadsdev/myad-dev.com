// src/app/packages/page.jsx
import JsonLd from "../components/JsonLd";
import { SITE, BRAND, generateTitle, generateDescription, entityId } from "../seo.config";
import { fbPackages, googlePackages } from "../lib/packagesData";

export const metadata = {
  title: generateTitle("packages"),
  description: generateDescription("packages"),
  alternates: { canonical: `${SITE}/packages` },
};


const courses = [
  { name: "คอร์สเรียนโฆษณา Facebook สายเทา", price: "10,000", type: "สอนตัวต่อตัว สดๆ" },
  { name: "คอร์สเรียน Google สายเทา", price: "18,500", type: "สอนตัวต่อตัว สดๆ" },
];

export default function PackagesPage() {
  const SITE_URL = SITE;
  const PAGE_URL = `${SITE_URL}/packages`;

  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": entityId(SITE_URL, "organization") },
      { "@type": "WebSite", "@id": entityId(SITE_URL, "website") },
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        "url": PAGE_URL,
        "name": generateTitle("packages"),
        "description": generateDescription("packages"),
        "isPartOf": { "@id": entityId(SITE_URL, "website") },
        "about": { "@id": entityId(SITE_URL, "organization") },
        "breadcrumb": { "@id": `${PAGE_URL}/#breadcrumb` },
        "datePublished": "2024-01-01",
        "dateModified": "2026-02-14",
        "inLanguage": "th-TH",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#direct-answer-packages", "h1", "h2"]
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "แพ็กเกจและราคา", "item": PAGE_URL },
        ]
      },
      ...fbPackages.concat(googlePackages).map((pkg) => ({
        "@type": "Product",
        "name": pkg.name,
        "offers": {
          "@type": "Offer",
          "price": pkg.price.replace(",", ""),
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock"
        }
      }))
    ]
  };

  // ✅ สไตล์สีฟ้าอ่อนและสีครีม (Light Blue & Cream Theme)
  const sectionStyle = {
    background: "#f0f7ff", // สีฟ้าอ่อนมากๆ (Alice Blue)
    color: "#2c3e50", // สีตัวอักษรน้ำเงินเข้ม
    minHeight: "100vh",
    paddingTop: "100px",
    paddingBottom: "80px"
  };

  const cardStyle = {
    background: "#fffef9", // สีครีมขาวสะอาด
    border: "1px solid #d1e3f8",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease",
  };

  const accentBlue = "#007bff"; // สีฟ้าหลัก
  const accentCream = "#fdf5e6"; // สีครีมเข้มสำหรับจุดเน้น

  const ctaStyle = {
    background: "linear-gradient(135deg, #007bff, #0056b3)",
    border: "none",
    color: "#ffffff",
    fontWeight: "700",
    borderRadius: "12px",
    padding: "12px 24px"
  };

  return (
    <section style={sectionStyle}>
      <JsonLd json={pageSchema} />

      <div className="container">
        <header className="text-center mb-5">
          <span className="badge rounded-pill px-3 py-2 mb-3" style={{ background: accentCream, color: "#856404", border: "1px solid #ffeeba" }}>
            Best Offers 2026
          </span>
          <h1 className="display-4 fw-bold mb-3" style={{ color: "#004085" }}>แพ็กเกจบริการและราคา</h1>

          {/* Direct Answer (AI Overview) */}
          <div
            id="direct-answer-packages"
            className="alert alert-info border-start border-4 border-primary text-start mb-3 mx-auto"
            style={{ maxWidth: 700 }}
          >
            <p className="mb-0 small">
              <strong>สรุป:</strong> {BRAND} เสนอแพ็กเกจยิงแอด Facebook Ads เริ่มต้น 9,900 บาท/เดือน
              และ Google Ads เริ่มต้น 12,900 บาท/เดือน พร้อมคอร์สเรียนโฆษณาสอนตัวต่อตัว
              โดยคุณเอกสิทธิ์ เพ็ชรมนี รายงานผลทุกวัน การันตีผลลัพธ์
            </p>
          </div>

          <p className="lead opacity-75">บริการยิงแอด Facebook & Google สายเทา ราคาพิเศษ โดยคุณเอกสิทธิ์ เพ็ชรมนี</p>
          <div style={{ width: "50px", height: "4px", background: accentBlue, margin: "0 auto", borderRadius: "2px" }}></div>
        </header>

        {/* Facebook Ads Section */}
        <div className="mb-5">
          <h2 className="h3 fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: "#0056b3" }}>
            🎖 Facebook Ads สายเทา
          </h2>
          <div className="row g-4">
            {fbPackages.map((pkg, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm" style={cardStyle}>
                  <div className="card-body p-4 d-flex flex-column">
                    <h3 className="h5 fw-bold mb-2">{pkg.name}</h3>
                    <div className="h2 fw-bold mb-2" style={{ color: accentBlue }}>฿{pkg.price}</div>
                    <p className="small mb-4 py-1 px-2 rounded" style={{ background: accentCream, display: "inline-block", width: "fit-content" }}>{pkg.detail}</p>
                    <ul className="list-unstyled mb-4 flex-grow-1 opacity-85 small">
                      <li className="mb-2"><i className="bi bi-check-lg me-2 text-success"></i>จัดการบัญชีโฆษณา {pkg.period}</li>
                      <li className="mb-2"><i className="bi bi-check-lg me-2 text-success"></i>รายงานผลทุกวัน 10.00 น.</li>
                      <li className="mb-2"><i className="bi bi-check-lg me-2 text-success"></i>เว็บไซต์เซลเพจหน้าขาว ฟรี</li>
                      <li className="mb-2"><i className="bi bi-check-lg me-2 text-success"></i>รูปภาพทำโฆษณาให้ 5 รูป</li>
                    </ul>
                    <a href="/contact" className="btn w-100 shadow-sm" style={ctaStyle}>เริ่มเลยครับ [พร้อม]</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Ads Section */}
        <div className="mb-5 pt-4">
          <h2 className="h3 fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: "#004085" }}>
            ✨ Google Ads สายเทา
          </h2>
          <div className="row g-4">
            {googlePackages.map((pkg, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm" style={cardStyle}>
                  <div className="card-body p-4 d-flex flex-column">
                    <h3 className="h5 fw-bold mb-2">{pkg.name}</h3>
                    <div className="h2 fw-bold mb-2" style={{ color: "#004085" }}>฿{pkg.price}</div>
                    <p className="small mb-4 py-1 px-2 rounded" style={{ background: "#e7f3ff", color: "#004085", display: "inline-block", width: "fit-content" }}>{pkg.detail}</p>
                    <ul className="list-unstyled mb-4 flex-grow-1 opacity-85 small">
                      <li className="mb-2"><i className="bi bi-check-lg me-2 text-primary"></i>เปิดโฆษณาตลอด 24 ชม.</li>
                      <li className="mb-2"><i className="bi bi-check-lg me-2 text-primary"></i>โครงสร้าง Compliance Page & Landing Page</li>
                      <li className="mb-2"><i className="bi bi-check-lg me-2 text-primary"></i>ตรวจสอบผ่าน VPS Remote</li>
                      <li className="mb-2"><i className="bi bi-check-lg me-2 text-primary"></i>การันตีผลลัพธ์</li>
                    </ul>
                    <a href="/contact" className="btn btn-outline-primary w-100 py-2 fw-bold" style={{ borderRadius: "12px" }}>ปรึกษาคุณเอกสิทธิ์</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-5 py-5 rounded-4" style={{ background: "#ffffff", border: "2px dashed #d1e3f8" }}>
          <h2 className="h3 fw-bold text-center mb-5" style={{ color: "#155724" }}>🟢 คอร์สเรียนโฆษณาสายเทา (สอนตัวต่อตัว)</h2>
          <div className="row g-4 justify-content-center px-3">
            {courses.map((course, i) => (
              <div key={i} className="col-md-5">
                <div className="card h-100 border-0 shadow-sm" style={{ background: "#f8fff9", border: "1px solid #d4edda", borderRadius: "16px" }}>
                  <div className="card-body p-4 text-dark">
                    <h3 className="h5 fw-bold mb-2" style={{ color: "#155724" }}>{course.name}</h3>
                    <div className="h2 fw-bold mb-3 text-success">฿{course.price}</div>
                    <ul className="small list-unstyled mb-4 opacity-75">
                      <li className="mb-1"><i className="bi bi-laptop me-2"></i>สอนสด ตัวต่อตัว TeamViewer / Zoom</li>
                      <li className="mb-1"><i className="bi bi-shield-check me-2"></i>แนวทางลดความเสี่ยงและดูแลบัญชีตามนโยบาย</li>
                      <li className="mb-1"><i className="bi bi-graph-up-arrow me-2"></i>สอนจดโดเมน/Hosting และเก็บ Pixel</li>
                    </ul>
                    <a href="/contact" className="btn btn-success w-100 fw-bold py-2 shadow-sm" style={{ borderRadius: "12px" }}>จองคอร์สเรียน</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Trust Section */}
        <div className="text-center p-4 rounded-4" style={{ background: accentCream, border: "1px solid #ffeeba" }}>
          <p className="mb-0 fw-bold" style={{ color: "#856404" }}>
            🚩 สิทธิ์ที่คุณจะได้: จ่ายง่าย บัตรเครดิต | รายงานผลทุกวัน 10.00 น. | การันตีผลลัพธ์
          </p>
          <small className="opacity-75 d-block mt-2 text-muted">
            * ค่าบริการ VPS ลูกค้าชำระเอง 590 บาท/เดือน | ยินดีให้คำปรึกษาฟรีทุกเคส
          </small>
        </div>
      </div>
    </section >
  );
}
