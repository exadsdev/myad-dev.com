// src/app/case-studies/page.js — Case Studies (AI-Ready ✅ E-E-A-T)
// ═══════════════════════════════════════════════════════════════════
// Structured: Problem → Solution (Technical) → Result (ROI/CPA numbers)
// Schema: Article + Person + Organization + BreadcrumbList
// ═══════════════════════════════════════════════════════════════════

import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import {
    SITE,
    BRAND,
    LOGO_URL,
    ORG_LEGAL_NAME_TH,
    ORG_TAX_ID,
    FOUNDER_NAME,
    FOUNDER_JOB_TITLE,
    FOUNDER_KNOWS_ABOUT,
    SAME_AS_URLS,
    CONTACT_PHONE,
    CONTACT_EMAIL,
    entityId,
} from "@/app/seo.config";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE).toString().trim().replace(/\/+$/, "");
const PAGE_URL = `${SITE_URL}/case-studies`;
const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const dynamic = "force-static";

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: `ผลงานจริงยิงแอดสายเทา 2026 ROI/CPA | ${BRAND}`,
    description: `ตัวอย่างผลงานจริงจาก ${BRAND}: ปัญหาที่เจอ → วิธีแก้ไข (Technical) → ผลลัพธ์ (ROI/CPA) สำหรับธุรกิจเฉพาะทาง โดยคุณเอกสิทธิ์ เพ็ชรมนี`,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
        type: "article",
        url: PAGE_URL,
        siteName: BRAND,
        title: `ผลงานจริงยิงแอดสายเทา 2026 | ${BRAND}`,
        description: "ผลงานจริง: ปัญหา → วิธีแก้ → ผลลัพธ์ (ROI/CPA) สำหรับธุรกิจเฉพาะทาง",
        images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${BRAND} Case Studies` }],
        locale: "th_TH",
    },
    twitter: {
        card: "summary_large_image", site: "@myadsdev",
        title: `Case Studies — ผลงานจริง | ${BRAND}`,
        description: "ตัวอย่างผลงานจริง: ปัญหา → วิธีแก้ → ผลลัพธ์ ROI สำหรับธุรกิจเฉพาะทาง",
        images: [OG_IMAGE],
    },
};

// ═══════════════════════════════════════════════════════════════════
// CASE STUDIES DATA
// ═══════════════════════════════════════════════════════════════════
const cases = [
    {
        id: "supplement-google-ads",
        title: "ธุรกิจอาหารเสริม — от บัญชีโดนแบน 3 ครั้ง สู่ยอดขาย 6 หลัก/เดือน",
        problem: "ลูกค้าเป็นเจ้าของแบรนด์อาหารเสริมที่มีสินค้าจริง มี อย. แต่โดน Google Ads แบนบัญชีติดต่อกัน 3 ครั้งภายใน 2 เดือน เนื่องจาก Landing Page ใช้คำอ้างผลลัพธ์ที่ Google ตีความว่าเป็น Misleading Content รวมถึงไม่มี Terms of Service และ Privacy Policy ที่ถูกต้อง",
        solution: [
            "Audit Landing Page ทุกหน้า — ลบคำอ้างผลลัพธ์ (Before/After) เปลี่ยนเป็นข้อมูลส่วนผสมและ ​อย.",
            "สร้างหน้า Privacy Policy, Terms of Service, Refund Policy ที่ครบถ้วนตาม Google Policy",
            "วาง Compliance Page Structure — แยก Landing Page สำหรับ Google Ads ออกจากหน้าขายบนเว็บหลัก",
            "ตั้งค่า Server-Side Tracking (Google Offline Conversion) วัดยอดขายจริงจาก CRM",
            "Warm-up บัญชีใหม่ 14 วัน ก่อนเริ่มรันแคมเปญจริง",
        ],
        results: {
            cpa: "฿185/Lead",
            roas: "8.2x",
            period: "60 วัน",
            highlight: "จากบัญชีโดนแบน 3 ครั้ง → รันแคมเปญเสถียร 6 เดือนต่อเนื่อง",
        },
        tags: ["Google Ads", "อาหารเสริม", "Policy Compliance", "Server-Side Tracking"],
    },
    {
        id: "beauty-facebook-ads",
        title: "คลินิกความงาม — ลด CPA จาก ฿1,200 เหลือ ฿380 ใน 30 วัน",
        problem: "คลินิกความงามที่ยิง Facebook Ads เอง มีปัญหา CPA สูง (฿1,200/Lead) เพราะใช้ Objective ไม่ตรงกับเป้าหมาย ครีเอทีฟไม่ผ่าน Review บ่อย และไม่ได้ตั้ง Pixel/CAPI ทำให้ระบบ AI ของ Meta ไม่สามารถ Optimize ได้อย่างมีประสิทธิภาพ",
        solution: [
            "เปลี่ยน Objective จาก Traffic เป็น Lead Generation + ตั้ง Custom Conversion Event",
            "ออกแบบครีเอทีฟใหม่ที่ปลอดภัยต่อนโยบาย — ใช้ Content แบบ Educational แทน Before/After",
            "ติดตั้ง Facebook Pixel + Conversion API (Server-Side) ส่งข้อมูลจาก CRM กลับไปที่ Meta",
            "ทดสอบ 6 ชุดครีเอทีฟ × 3 กลุ่มเป้าหมาย ใน 15 วันแรก เพื่อหา Winner",
            "Scale งบ 2 เท่าเมื่อพบชุดที่ CPA < ฿400 อย่างเสถียร",
        ],
        results: {
            cpa: "฿380/Lead (จาก ฿1,200)",
            roas: "5.4x",
            period: "30 วัน",
            highlight: "CPA ลด 68% ภายใน 30 วัน + บัญชีเสถียรไม่โดน Reject ครีเอทีฟ",
        },
        tags: ["Facebook Ads", "คลินิกความงาม", "Conversion API", "CAPI"],
    },
    {
        id: "finance-cross-platform",
        title: "บริการทางการเงิน — วางระบบ Google + Meta Ads แบบ Cross-Platform",
        problem: "ธุรกิจบริการทางการเงินที่ต้องการรันโฆษณาทั้ง Google และ Facebook พร้อมกัน แต่ทั้ง 2 แพลตฟอร์มมี Policy สำหรับ Financial Products ที่เข้มงวด ลูกค้าเคยลองยิงเองแต่แอดไม่ผ่าน Review ทุกครั้ง",
        solution: [
            "วิเคราะห์ Policy ของ Google Ads (Financial Products) และ Meta (Crypto/Finance Policy) แยกละเอียด",
            "สร้าง Landing Page แยกสำหรับแต่ละแพลตฟอร์ม — Google ต้องมี Disclaimer, Meta ต้องมี Terms ที่ชัดเจน",
            "ใช้ Agency Account ของ MyAdsDev ที่ผ่าน Verification สำหรับ Financial Products",
            "ติดตั้ง Cross-Platform Tracking — สร้าง Unified Dashboard ดู Performance ทั้ง Google + Meta ในที่เดียว",
            "วางกลยุทธ์ Funnel แบบ Cross-Platform: Meta = Awareness, Google = Intent Capture",
        ],
        results: {
            cpa: "฿290/Lead (เฉลี่ยรวม 2 แพลตฟอร์ม)",
            roas: "6.7x",
            period: "45 วัน",
            highlight: "จากแอดไม่ผ่าน Review → รัน 2 แพลตฟอร์มพร้อมกันเสถียร 4 เดือน",
        },
        tags: ["Google Ads", "Facebook Ads", "การเงิน", "Cross-Platform"],
    },
];

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function CaseStudiesPage() {
    const ids = {
        organization: entityId(SITE_URL, "organization"),
        website: entityId(SITE_URL, "website"),
        person: entityId(SITE_URL, "person"),
        breadcrumb: `${PAGE_URL}/#breadcrumb`,
        webpage: `${PAGE_URL}/#webpage`,
        article: `${PAGE_URL}/#article`,
    };

    const graphSchema = {
        "@context": "https://schema.org",
        "@graph": [
            { "@type": "Organization", "@id": ids.organization },
            { "@type": "WebSite", "@id": ids.website },
            {
                "@type": "Person",
                "@id": ids.person,
                name: FOUNDER_NAME,
                jobTitle: FOUNDER_JOB_TITLE,
                worksFor: { "@id": ids.organization },
                image: `${SITE_URL}/images/founder.webp`,
                url: `${SITE_URL}/about`,
                knowsAbout: FOUNDER_KNOWS_ABOUT,
                sameAs: SAME_AS_URLS,
            },
            {
                "@type": "Article",
                "@id": ids.article,
                headline: metadata.title,
                description: metadata.description,
                author: { "@id": ids.person },
                publisher: { "@id": ids.organization },
                datePublished: "2024-06-15",
                dateModified: "2026-02-14T11:00:00+07:00",
                mainEntityOfPage: { "@id": ids.webpage },
                image: OG_IMAGE,
                inLanguage: "th-TH",
                articleSection: "Case Studies",
                wordCount: 1500,
            },
            {
                "@type": "WebPage",
                "@id": ids.webpage,
                url: PAGE_URL,
                name: metadata.title,
                description: metadata.description,
                isPartOf: { "@id": ids.website },
                breadcrumb: { "@id": ids.breadcrumb },
                author: { "@id": ids.person },
                datePublished: "2024-06-15",
                dateModified: "2026-02-14T11:00:00+07:00",
                inLanguage: "th-TH",
                speakable: { "@type": "SpeakableSpecification", cssSelector: ["#direct-answer-cs", "h1", "h2"] },
            },
            {
                "@type": "BreadcrumbList",
                "@id": ids.breadcrumb,
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
                    { "@type": "ListItem", position: 2, name: "Case Studies", item: PAGE_URL },
                ],
            },
        ],
    };

    return (
        <>
            <JsonLd json={graphSchema} />

            <main className="container-fluid py-5" style={{ backgroundColor: "#f8fbff", minHeight: "100vh" }}>
                <div className="container">
                    {/* Breadcrumb */}
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">หน้าแรก</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Case Studies</li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <header className="text-center mb-5">
                        <span className="badge bg-success mb-3 px-3 py-2 rounded-pill">
                            📊 Case Studies — ผลงานจริง ตัวเลขจริง
                        </span>
                        <h1 className="fw-bold display-5 mb-3">
                            ผลงานจริงจากลูกค้า {BRAND}
                            <br />
                            <span className="text-primary">ปัญหา → วิธีแก้ → ผลลัพธ์ (ROI)</span>
                        </h1>

                        {/* Direct Answer Box */}
                        <div
                            id="direct-answer-cs"
                            className="alert alert-info border-start border-4 border-primary text-start mx-auto mb-4"
                            style={{ maxWidth: 900 }}
                            role="region"
                            aria-label="สรุป Case Studies"
                        >
                            <p className="mb-0">
                                <strong>สรุป:</strong> {BRAND} รวบรวม Case Studies จริงจากลูกค้าธุรกิจเฉพาะทาง
                                (อาหารเสริม, คลินิกความงาม, บริการทางการเงิน) แสดงผลลัพธ์ด้วยตัวเลข CPA/ROAS จริง
                                ทุกเคสดูแลโดยคุณ{FOUNDER_NAME.split(" ")[0]} ผู้ก่อตั้ง {BRAND}
                            </p>
                        </div>
                    </header>

                    {/* Case Studies */}
                    <article className="mx-auto" style={{ maxWidth: 900 }}>
                        {cases.map((c, idx) => (
                            <section
                                key={c.id}
                                className="mb-5 p-4 p-md-5 bg-white rounded-4 shadow-sm border"
                                aria-labelledby={`case-${c.id}`}
                            >
                                {/* Case Number Badge */}
                                <span className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill">
                                    Case #{idx + 1}
                                </span>

                                <h2 id={`case-${c.id}`} className="h4 fw-bold mb-4">
                                    {c.title}
                                </h2>

                                {/* ── ปัญหาที่เจอ ── */}
                                <div className="mb-4">
                                    <h3 className="h6 fw-bold text-danger mb-2">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>ปัญหาที่เจอ
                                    </h3>
                                    <p className="text-muted mb-0">{c.problem}</p>
                                </div>

                                {/* ── วิธีแก้ไข (Technical) ── */}
                                <div className="mb-4">
                                    <h3 className="h6 fw-bold text-primary mb-2">
                                        <i className="bi bi-tools me-2"></i>วิธีแก้ไข (Technical Solution)
                                    </h3>
                                    <ol className="text-muted">
                                        {c.solution.map((step, i) => (
                                            <li key={i} className="mb-2">{step}</li>
                                        ))}
                                    </ol>
                                </div>

                                {/* ── ผลลัพธ์ (ROI/CPA) ── */}
                                <div className="mb-4">
                                    <h3 className="h6 fw-bold text-success mb-3">
                                        <i className="bi bi-graph-up-arrow me-2"></i>ผลลัพธ์ที่ได้
                                    </h3>
                                    <div className="row g-3">
                                        <div className="col-6 col-md-3">
                                            <div className="p-3 bg-light rounded-3 text-center">
                                                <div className="small text-muted">CPA</div>
                                                <div className="fw-bold text-primary">{c.results.cpa}</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="p-3 bg-light rounded-3 text-center">
                                                <div className="small text-muted">ROAS</div>
                                                <div className="fw-bold text-success">{c.results.roas}</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="p-3 bg-light rounded-3 text-center">
                                                <div className="small text-muted">ระยะเวลา</div>
                                                <div className="fw-bold">{c.results.period}</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="p-3 bg-success bg-opacity-10 rounded-3 text-center">
                                                <div className="small text-muted">Highlight</div>
                                                <div className="fw-bold text-success small">{c.results.highlight}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="d-flex gap-2 flex-wrap">
                                    {c.tags.map((tag) => (
                                        <span key={tag} className="badge bg-light text-dark border px-2 py-1 rounded-pill small">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        ))}

                        {/* ── Comparison Table: ยิงแอดเอง vs จ้าง Agency ── */}
                        <section className="mb-5" aria-labelledby="cs-comparison">
                            <h2 id="cs-comparison" className="h4 fw-bold mb-4">
                                เปรียบเทียบ: ยิงแอดเอง vs จ้างเอเจนซี่เฉพาะทาง
                            </h2>
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover align-middle">
                                    <thead className="table-primary">
                                        <tr>
                                            <th scope="col">หัวข้อ</th>
                                            <th scope="col">ยิงแอดเอง</th>
                                            <th scope="col">จ้าง {BRAND}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>ความเสี่ยงโดนแบน</td>
                                            <td className="text-danger">สูง — ไม่รู้ Policy ละเอียด</td>
                                            <td className="text-success">ต่ำ — Compliance Structure</td>
                                        </tr>
                                        <tr>
                                            <td>CPA เฉลี่ย</td>
                                            <td className="text-danger">สูง — ฿800-1,500+</td>
                                            <td className="text-success">ต่ำ — ฿200-400</td>
                                        </tr>
                                        <tr>
                                            <td>Conversion Tracking</td>
                                            <td className="text-muted">Pixel อย่างเดียว — ข้อมูลหาย 30-40%</td>
                                            <td className="text-success">Pixel + Server-Side — แม่นยำ 95%+</td>
                                        </tr>
                                        <tr>
                                            <td>ระบบสำรองบัญชี</td>
                                            <td className="text-danger">ไม่มี — โดนแบนแล้วหยุด</td>
                                            <td className="text-success">มี — สลับบัญชีได้ทันที</td>
                                        </tr>
                                        <tr>
                                            <td>รายงานผล</td>
                                            <td className="text-muted">ดูเอง — ไม่รู้จะปรับอะไร</td>
                                            <td className="text-success">Dashboard Real-time + คำแนะนำรายสัปดาห์</td>
                                        </tr>
                                        <tr>
                                            <td>ระยะเวลาเห็นผล</td>
                                            <td className="text-muted">ไม่แน่นอน</td>
                                            <td className="text-primary fw-bold">7-14 วัน เริ่มเห็นตัวเลข</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* ── CTA ── */}
                        <section className="text-center p-5 bg-primary bg-opacity-10 rounded-4 mb-5">
                            <h2 className="h4 fw-bold mb-3">
                                อยากได้ผลลัพธ์แบบนี้กับธุรกิจคุณ?
                            </h2>
                            <p className="text-muted mb-4">
                                ปรึกษาคุณเอกสิทธิ์โดยตรง ฟรี ไม่มีค่าใช้จ่าย วิเคราะห์เคสให้ก่อนเริ่มงาน
                            </p>
                            <div className="d-flex gap-3 justify-content-center flex-wrap">
                                <Link href="/contact" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow">
                                    ปรึกษาฟรี
                                </Link>
                                <Link href="/services" className="btn btn-outline-primary px-5 py-3 rounded-pill fw-bold">
                                    ดูบริการทั้งหมด
                                </Link>
                            </div>
                            <p className="small text-muted mt-3">
                                LINE: @myadsdev | Telegram: @myadsdev | โทร: {CONTACT_PHONE}
                            </p>
                        </section>

                        {/* ── Related Content (Topic Cluster) ── */}
                        <aside className="p-4 bg-white rounded shadow-sm border mb-5" aria-label="เนื้อหาที่เกี่ยวข้อง">
                            <h2 className="h5 fw-bold mb-3">เนื้อหาที่เกี่ยวข้อง</h2>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">
                                    <Link href="/knowledge-base" className="text-primary text-decoration-none">
                                        → Knowledge Base — คู่มือแก้ปัญหาบัญชีโดนแบน (บทความเชิงลึก)
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/services/google-ads" className="text-primary text-decoration-none">
                                        → บริการ Google Ads สายเทา — วางระบบ Tracking & Compliance
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/services/facebook-ads" className="text-primary text-decoration-none">
                                        → บริการ Facebook Ads สายเทา — ยิงแอดแม่นยำด้วย CAPI
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/faq" className="text-primary text-decoration-none">
                                        → คำถามที่พบบ่อย (FAQ) — รวมคำตอบเทคนิคยิงแอดสายเทา
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/about" className="text-primary text-decoration-none">
                                        → เกี่ยวกับ {BRAND} — ผู้เชี่ยวชาญด้าน Technical Ads
                                    </Link>
                                </li>
                            </ul>
                        </aside>
                    </article>

                    {/* Trust Signals */}
                    <aside className="text-center mt-5 pt-4 border-top" aria-label="ข้อมูลความน่าเชื่อถือ">
                        <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                                📋 เลขนิติบุคคล {ORG_TAX_ID}
                            </span>
                            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                🏢 {ORG_LEGAL_NAME_TH}
                            </span>
                            <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                                📧 {CONTACT_EMAIL}
                            </span>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
}
