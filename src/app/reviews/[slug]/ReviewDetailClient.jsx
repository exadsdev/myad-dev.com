// src/app/reviews/[slug]/ReviewDetailClient.jsx

"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { 
  SITE, 
  BRAND, 
  FOUNDER_NAME 
} from "../../seo.config";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || SITE;

function formatShortThai(dateStr = "") {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  const yy = String(y).slice(-2);
  return `${d}/${m}/${yy}`;
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630'>
      <rect width='1200' height='630' fill='#f0f7ff'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Arial, sans-serif' font-size='36' fill='#007bff'>
        MyAdsDev Review Results
      </text>
    </svg>`
  );

function resolveImg(src) {
  if (!src) return PLACEHOLDER;
  const s = String(src).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const origin = String(SITE_ORIGIN || "").replace(/\/+$/, "");
  return s.startsWith("/") ? (origin + s) : (origin + "/" + s);
}

export default function ReviewDetailClient({ review, internalLinks = [] }) {
  const [broken, setBroken] = useState(false);

  if (!review) return null;

  const r = review;
  const src = broken ? PLACEHOLDER : resolveImg(r?.thumbnail);

  return (
    <main className="container py-5">
      {/* Breadcrumb UI */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small bg-transparent p-0">
          <li className="breadcrumb-item"><Link href="/">หน้าแรก</Link></li>
          <li className="breadcrumb-item"><Link href="/reviews">รีวิว</Link></li>
          <li className="breadcrumb-item active text-truncate" aria-current="page">{r.title}</li>
        </ol>
      </nav>

      <div className="row g-5">
        <article className="col-lg-8">
          <header className="mb-4">
            <h1 className="display-6 fw-bold mb-3">{r.title}</h1>
            <div className="d-flex flex-wrap gap-3 text-muted small border-bottom pb-3">
              <span><i className="bi bi-person-fill"></i> {r.author || "ลูกค้า"}</span>
              <span><i className="bi bi-calendar-check"></i> {formatShortThai(r.date)}</span>
              <span className="badge bg-primary px-3">{String(r.category || "").toUpperCase()}</span>
            </div>
          </header>

          <div className="mb-4 position-relative rounded-4 overflow-hidden shadow-sm" style={{ aspectRatio: "16/9", background: "#f8f9fa" }}>
            <Image
              src={src}
              alt={`ผลลัพธ์การยิงแอด: ${r.title}`}
              fill
              sizes="(max-width: 992px) 100vw, 800px"
              className="object-fit-cover"
              priority
              onError={() => setBroken(true)}
            />
          </div>

          {r.excerpt && (
            <blockquote className="blockquote fs-5 text-secondary border-start border-4 border-primary ps-4 my-5 italic">
              {r.excerpt}
            </blockquote>
          )}

          {r.contentHtml && (
            <section 
              className="review-rich-text mb-5"
              style={{ fontSize: "1.125rem", lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: r.contentHtml }}
            />
          )}

          {internalLinks.length > 0 && (
            <section className="mt-5 p-4 bg-light rounded-4 border">
              <h2 className="h6 fw-bold mb-3 text-uppercase opacity-75">บริการที่เกี่ยวข้อง</h2>
              <div className="d-flex flex-wrap gap-2">
                {internalLinks.map((l, i) => (
                  <Link key={i} href={l.href} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar E-E-A-T */}
        <aside className="col-lg-4">
          <div className="sticky-top" style={{ top: "100px" }}>
            <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ background: "#fffef9", border: "1px solid #d1e3f8 !important" }}>
              <div className="card-body p-4 text-center">
                <Image src="/images/logo.png" alt={BRAND} width={64} height={64} className="mb-3 rounded-circle shadow-sm" />
                <h2 className="h5 fw-bold mb-1">{BRAND}</h2>
                <p className="text-muted small">Verified Performance Results</p>
                <hr className="my-3 opacity-10" />
                <ul className="list-unstyled small text-start mb-0">
                  <li className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">ประเภทบริการ:</span>
                    <strong className="text-primary">{String(r.category || "").toUpperCase()}</strong>
                  </li>
                  <li className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">วันที่ตรวจสอบ:</span>
                    <strong>{formatShortThai(r.date)}</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span className="text-secondary">ผู้เชี่ยวชาญ:</span>
                    <strong>{FOUNDER_NAME.split(' ')[0]}</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div className="d-grid gap-2">
              <Link href="/contact" className="btn btn-primary btn-lg fw-bold rounded-3 shadow-sm">
                ปรึกษายิงแอดแบบเคสนี้
              </Link>
              <Link href="/packages" className="btn btn-outline-dark rounded-3">
                ดูแพ็กเกจราคา
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}