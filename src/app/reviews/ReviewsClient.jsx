// src/app/reviews/ReviewsClient.jsx

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SITE, BRAND, entityId } from "../seo.config";

function formatShortThai(dateStr = "") {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${String(y).slice(-2)}`;
}

function resolveImg(src, siteOrigin) {
  if (!src) return "";
  const s = String(src).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const origin = (siteOrigin || SITE).replace(/\/+$/, "");
  return s.startsWith("/") ? `${origin}${s}` : `${origin}/${s}`;
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
      <rect width='800' height='450' fill='#f8f9fa'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Arial, sans-serif' font-size='24' fill='#dee2e6'>
        MyAdsDev Results
      </text>
    </svg>`
  );

export default function ReviewsClient({ initialItems = [], internalLinks = [] }) {
  const [items, setItems] = useState(initialItems);
  const [origin, setOrigin] = useState("");
  const [broken, setBroken] = useState({});

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const google = useMemo(() => items.filter((x) => String(x.category || "").toLowerCase() === "google"), [items]);
  const facebook = useMemo(() => items.filter((x) => String(x.category || "").toLowerCase() === "facebook"), [items]);

  const sizes = "(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw";

  const renderCard = (r, idx, prefix) => {
    const key = `${prefix}-${r.slug}-${idx}`;
    const src = broken[key] ? PLACEHOLDER : (resolveImg(r.thumbnail, origin) || PLACEHOLDER);
    
    return (
      <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={key}>
        <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: "#ffffff", border: "1px solid #edf2f7 !important" }}>
          <div className="position-relative" style={{ aspectRatio: "16/9", background: "#f8f9fa" }}>
            <Image
              src={src}
              fill
              sizes={sizes}
              className="object-fit-cover"
              alt={`รีวิวลูกค้า: ${r.title}`}
              loading="lazy"
              onError={() => setBroken(prev => ({ ...prev, [key]: true }))}
            />
          </div>
          <div className="card-body p-4 d-flex flex-column">
            <h3 className="h6 fw-bold mb-2 line-clamp-2">
              <Link href={`/reviews/${r.slug}`} className="text-decoration-none text-dark hover-primary">
                {r.title}
              </Link>
            </h3>
            <div className="small text-muted mb-3 d-flex justify-content-between align-items-center">
              <span><i className="bi bi-calendar3 me-1"></i> {formatShortThai(r.date)}</span>
              <span className="text-warning">★★★★★</span>
            </div>
            {r.excerpt && <p className="small text-secondary line-clamp-3 mb-4 flex-grow-1">{r.excerpt}</p>}
            <Link href={`/reviews/${r.slug}`} className="btn btn-sm btn-primary w-100 rounded-pill py-2 fw-bold">
              ดูรายละเอียดเคสนี้
            </Link>
          </div>
        </article>
      </div>
    );
  };

  return (
    <main className="py-5" style={{ background: "#f0f7ff", minHeight: "100vh" }}>
      <div className="container-fluid px-lg-5">
        <header className="mb-5 text-center">
          <h1 className="display-5 fw-bold mb-3 text-dark">⭐ รวมผลลัพธ์จากลูกค้าจริง</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "800px" }}>
            พิสูจน์ความสำเร็จด้วยหลักฐานจริงจากการยิงแอดสายเทาทุกรูปแบบ 
            เราเน้นความโปร่งใสและผลลัพธ์ที่วัดผลเป็นยอดขายได้จริง
          </p>
        </header>

        <nav className="mb-5 sticky-top py-3 bg-f0f7ff-transparent shadow-sm" style={{ top: "70px", zIndex: 10, backdropFilter: "blur(10px)" }}>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            <a className="btn btn-dark px-4 rounded-pill shadow-sm" href="#google">Google Ads</a>
            <a className="btn btn-dark px-4 rounded-pill shadow-sm" href="#facebook">Facebook Ads</a>
            {internalLinks.map((l, i) => (
              <Link key={i} className="btn btn-outline-dark px-4 rounded-pill shadow-sm" href={l.href}>{l.label}</Link>
            ))}
          </div>
        </nav>

        <section id="google" className="mb-5 pt-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="h4 fw-bold m-0 text-primary"><i className="bi bi-google me-2"></i>Google Ads Case Studies</h2>
            <hr className="flex-grow-1 opacity-10" />
          </div>
          <div className="row g-4">
            {google.map((r, i) => renderCard(r, i, "g"))}
          </div>
        </section>

        <section id="facebook" className="mb-5 pt-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="h4 fw-bold m-0 text-primary"><i className="bi bi-facebook me-2"></i>Facebook Ads Case Studies</h2>
            <hr className="flex-grow-1 opacity-10" />
          </div>
          <div className="row g-4">
            {facebook.map((r, i) => renderCard(r, i, "f"))}
          </div>
        </section>
      </div>
    </main>
  );
}