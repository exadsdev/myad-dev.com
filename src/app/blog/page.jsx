// src/app/blog/page.jsx

import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import JsonLd from "@/app/components/JsonLd";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";
import { getAllPosts } from "@/lib/postsStore";
import AuthorBio from "@/app/components/AuthorBio";
import "./blog.css";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;
const PAGE_URL = `${SITE_URL}/blog`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

// --- 1. Metadata Optimization (ใช้คำที่ปลอดภัยแต่ครอบคลุม) ---
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `คลังบทความการตลาดออนไลน์ & กลยุทธ์การจัดการโฆษณาขั้นสูง | ${BRAND}`,
  description: `รวมบทความเจาะลึก SEO, เทคนิคการยิงแอด Google & Facebook สำหรับธุรกิจเฉพาะทาง และ MarTech ล่าสุด อัปเดตปี 2026 พร้อมแนวทางป้องกันบัญชีถูกระงับ`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: BRAND,
    title: `คลังความรู้การตลาดออนไลน์ & เทคนิคโฆษณา | ${BRAND}`,
    description: `แหล่งรวมเทคนิค SEO และการบริหารจัดการโฆษณาความเสี่ยงสูงอย่างมืออาชีพ`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${BRAND} Knowledge Hub` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `บทความการตลาดออนไลน์ | ${BRAND}`,
    description: `เจาะลึกเทคนิค SEO และการจัดการโฆษณาขั้นสูง`,
    images: [OG_IMAGE],
  },
};

function resolveThumbnailUrl(thumbnail) {
  if (!thumbnail) return "/images/og-default.jpg";
  const s = String(thumbnail).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const cleanPath = s.startsWith("/") ? s : `/${s}`;
  const base = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  return `${base}${cleanPath}`;
}

function formatDateShort(input) {
  const s = String(input || "").trim();
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export default async function BlogIndexPage({ searchParams }) {
  const allPosts = await getAllPosts();
  const resolvedParams = await searchParams;
  const tag = resolvedParams?.tag || "";

  const posts = tag
    ? allPosts.filter(
      (p) =>
        Array.isArray(p.tags) &&
        p.tags.some((t) => String(t).toLowerCase() === tag.toLowerCase())
    )
    : allPosts;

  // --- 10 FAQs ปรับหัวข้อให้ซอฟต์ลงแต่ได้ใจความ (SEO & AI Overview Friendly) ---
  const faqItems = [
    {
      q: "บริการดูแลโฆษณาสำหรับธุรกิจความเสี่ยงสูงคืออะไร?",
      a: "คือบริการทำโฆษณาบน Google และ Facebook สำหรับธุรกิจที่มักติดปัญหานโยบายแพลตฟอร์ม โดยใช้เทคนิคการวางโครงสร้างบัญชีสำรองและการจัดการ Landing Page ให้ถูกต้องตามมาตรฐานเพื่อความต่อเนื่องในการรันแคมเปญ"
    },
    {
      q: "สาเหตุที่โฆษณาบนโซเชียลมีเดียมักโดนปฏิเสธหรือแบนบัญชี?",
      a: "ส่วนใหญ่เกิดจาก AI ตรวจพบเนื้อหาหรือหน้า Landing Page ที่ไม่สอดคล้องกับนโยบายปัจจุบัน การแก้ไขต้องใช้เทคนิคการปรับปรุง Creative และการใช้ระบบกรองคุณภาพ Traffic ก่อนส่งเข้าหน้าเว็บไซต์หลัก"
    },
    {
      q: "การจัดการระบบ Landing Page เพื่อลดความเสี่ยงโฆษณาทำอย่างไร?",
      a: "คือการสร้างหน้าเว็บไซต์ที่เน้นเนื้อหาเชิงคุณภาพและถูกต้องตามนโยบาย (Compliance Page) เพื่อให้ระบบตรวจสอบผ่านได้ง่าย ในขณะที่ยังสามารถนำเสนอคุณค่าของบริการแก่ผู้ใช้งานจริงได้อย่างครบถ้วน"
    },
    {
      q: "วิธีทำให้โฆษณา Google ติดหน้าแรกสำหรับคีย์เวิร์ดที่มีการแข่งขันสูง?",
      a: "ต้องเน้นการเพิ่ม Quality Score ของหน้าเว็บไซต์ การคัดเลือกคีย์เวิร์ดเชิงกลยุทธ์ และการจัดการระบบ Redirect ที่มีประสิทธิภาพเพื่อรักษาความปลอดภัยของบัญชีโฆษณาในระยะยาว"
    },
    {
      q: "งบประมาณเริ่มต้นสำหรับการบริหารจัดการโฆษณาขั้นสูง?",
      a: "งบประมาณจะขึ้นอยู่กับความยากของกลุ่มเป้าหมายและการแข่งขัน โดยมักคิดค่าบริการเป็นรายเดือนหรือตามสัดส่วนการจัดการ เพื่อครอบคลุมระบบสำรองบัญชีและการดูแลความปลอดภัย 24 ชม."
    },
    {
      q: "ความแตกต่างระหว่างการทำ SEO ทั่วไปกับการทำ SEO สำหรับธุรกิจเฉพาะทาง?",
      a: "SEO สำหรับธุรกิจเฉพาะทางจะเน้นการสร้าง Authority และ Backlink ที่เข้มข้นกว่าในระยะเวลาสั้น ควบคู่กับการใช้ Content ที่ตอบโจทย์ Search Intent ของลูกค้าอย่างแม่นยำเพื่อเพิ่มอัตรา Conversion"
    },
    {
      q: "หากบัญชีโฆษณาถูกระงับ มีขั้นตอนการแก้ไขอย่างไร?",
      a: "เราใช้ระบบ 'Account Infrastructure' หรือการเตรียมชุดบัญชีธุรกิจ (Business Manager) สำรองคุณภาพสูงที่ผ่านการวอร์มประวัติการใช้งานมาแล้ว ทำให้สามารถย้ายแคมเปญมารันต่อได้ทันทีโดยธุรกิจไม่สะดุด"
    },
    {
      q: "ทำไมหน้า Landing Page ถึงมีความสำคัญต่อความเสถียรของแอด?",
      a: "เพราะเป็นด่านแรกที่บอทตรวจสอบ หากโครงสร้าง HTML ดูน่าเชื่อถือ มีนโยบายความเป็นส่วนตัวชัดเจน และไม่มีสคริปต์ต้องสงสัย จะช่วยให้อายุการใช้งานของบัญชีโฆษณายืนยาวขึ้น"
    },
    {
      q: "หลักการเลือกทีมงานดูแลโฆษณาที่เป็นมืออาชีพ?",
      a: "ควรเลือกทีมที่มีประสบการณ์จัดการบัญชีโฆษณาจำนวนมาก มีระบบรายงานผลที่ชัดเจน และมีความรู้ด้าน Technical SEO เพื่อช่วยลดต้นทุนค่าโฆษณา (CPC) ในระยะยาว"
    },
    {
      q: "แนวโน้มการโฆษณาสำหรับธุรกิจเฉพาะทางในปี 2026 เป็นอย่างไร?",
      a: "การแข่งขันจะย้ายไปอยู่ที่ความฉลาดของระบบจัดการความเสี่ยง (Risk Management) ใครที่สามารถรันแอดได้นิ่งและต่อเนื่องกว่าจะครองส่วนแบ่งตลาดใน Google และ Facebook ได้มากกว่า"
    }
  ];

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
      {
        "@type": "Blog",
        "@id": `${PAGE_URL}/#blog`,
        "name": `คลังบทความ ${BRAND}`,
        "url": PAGE_URL,
        "description": metadata.description,
        "publisher": { "@id": `${SITE_URL}/#organization` },
        "inLanguage": "th-TH",
        "blogPost": posts.slice(0, 20).map(post => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/blog/${post.slug}#article`,
          "headline": post.title,
          "url": `${SITE_URL}/blog/${post.slug}`,
          "datePublished": post.createdAt || post.date,
          "dateModified": post.updatedAt || post.date || post.createdAt,
          "author": { "@type": "Person", "name": post.author || BRAND }
        }))
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}/#faq`,
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      },
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}/#webpage`,
        "url": PAGE_URL,
        "name": metadata.title,
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "about": { "@id": `${PAGE_URL}/#blog` },
        "breadcrumb": { "@id": `${PAGE_URL}/#breadcrumb` },
        "datePublished": "2024-01-01",
        "dateModified": "2026-02-14",
        "inLanguage": "th-TH",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#direct-answer-blog", "h1", "h2"]
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "บทความ", "item": PAGE_URL },
        ]
      }
    ]
  };

  return (
    <Fragment>
      <JsonLd json={graphSchema} />

      <div className="container-fluid py-5">
        <header className="mb-5 border-bottom pb-4">
          <div className="row align-items-end">
            <div className="col-lg-8">
              <h1 className="fw-bold display-5 mb-3">
                <span className="text-primary">Knowledge Hub</span> <br />
                เทคนิคการตลาดออนไลน์ & SEO
              </h1>

              {/* Direct Answer (AI Overview) */}
              <div
                id="direct-answer-blog"
                className="alert alert-info border-start border-4 border-primary mb-3"
              >
                <p className="mb-0 small">
                  <strong>สรุป:</strong> รวมบทความเจาะลึกกลยุทธ์โฆษณาขั้นสูง Technical SEO Audit
                  และแนวทางการจัดการบัญชีโฆษณาที่ทีมงาน {BRAND} ใช้จริง
                </p>
              </div>
              <p className="lead text-muted mb-0">
                รวมบทความเจาะลึกกลยุทธ์โฆษณาขั้นสูง, Technical SEO Audit
                และแนวทางการจัดการบัญชีโฆษณาที่ทีมงาน {BRAND} ใช้จริง
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              {tag && (
                <div className="d-inline-flex align-items-center bg-light px-3 py-2 rounded-pill border">
                  <span className="me-2 text-secondary">กรอง:</span>
                  <span className="fw-bold text-primary me-3">{tag}</span>
                  <Link href="/blog" className="text-decoration-none text-danger small">✕ ล้างค่า</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mb-5">
          <AuthorBio
            title="ผู้เขียนบทความด้านรับทำโฆษณา Google สายเทา และ Facebook สายเทา"
            highlight="รับทำโฆษณา facebook สายเทา"
          />
        </div>

        <div className="row g-4">
          {posts.map((p, index) => {
            const thumbUrl = resolveThumbnailUrl(p.thumbnail);
            return (
              <div className="col-md-6 col-lg-4" key={`${p.slug}-${index}`}>
                <article className="card h-100 border-0 shadow-sm hover-lift" itemScope itemType="https://schema.org/BlogPosting">
                  <Link href={`/blog/${p.slug}`}>
                    <div className="ratio ratio-16x9">
                      <Image src={thumbUrl} alt={p.title} width={800} height={450} priority={index < 2} className="object-fit-cover rounded-top" unoptimized />
                    </div>
                  </Link>
                  <div className="card-body d-flex flex-column p-4">
                    <h2 className="card-title h5 fw-bold mb-3"><Link href={`/blog/${p.slug}`} className="text-decoration-none text-dark">{p.title}</Link></h2>
                    <div className="small text-muted mb-2">
                      อัปเดตล่าสุด: {formatDateShort(p.updatedAt || p.date || p.createdAt)}
                    </div>
                    <p className="card-text text-muted small mb-4 flex-grow-1">{p.excerpt}</p>
                    <div className="mt-auto pt-3 border-top"><Link href={`/blog/${p.slug}`} className="btn btn-sm btn-outline-primary rounded-pill">อ่านต่อ →</Link></div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* --- FAQ Section ปรับรูปแบบให้สวยงามและปลอดภัยต่อ SEO --- */}
        <section className="mt-5 pt-5 border-top">
          <h2 className="fw-bold mb-4">คำถามที่พบบ่อย (FAQ) เกี่ยวกับการจัดการโฆษณาขั้นสูง</h2>
          <div className="row g-4">
            {faqItems.map((item, idx) => (
              <div className="col-md-6" key={idx}>
                <div className="p-4 bg-white rounded shadow-sm h-100 border-start border-primary border-4">
                  <h3 className="h6 fw-bold text-primary">{idx + 1}. {item.q}</h3>
                  <p className="small text-muted mb-0">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Fragment>
  );
}
