"use client";
// ═══════════════════════════════════════════════════════════════════════
// FaqClient.jsx — Client Component (Interactive FAQ with Search + GA4)
// Semantic HTML: <article> for each FAQ card, proper H2/H3 hierarchy
// Supports category grouping for AI Overview optimization
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FaqClient({ faqItems, faqCategories, pageUrl }) {
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ GA4: ส่ง search event เมื่อผู้ใช้พิมพ์ค้นหา (debounce 1s)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length > 2 && window.gtag) {
                window.gtag("event", "search", {
                    search_term: searchTerm,
                    page_location: pageUrl,
                });
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, pageUrl]);

    const filteredFaqs = faqItems.filter(
        (item) =>
            item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // เมื่อมีการค้นหา ให้แสดงผลลัพธ์ทั้งหมดโดยไม่แยกหมวด
    const isSearching = searchTerm.length > 0;

    return (
        <div className="container">
            {/* ── Search Bar ─────────────────────────────────────────────── */}
            <div className="text-center mb-5">
                <h2 className="h5 text-muted mb-3">
                    ค้นหาเทคนิคการ <strong>รับยิงแอดสายเทา</strong> และวิธีบริหารจัดการ{" "}
                    <strong>บัญชีโฆษณา</strong> ให้ปลอดภัย
                </h2>

                <div className="mx-auto" style={{ maxWidth: "600px" }}>
                    <div className="input-group input-group-lg shadow-sm border rounded-pill overflow-hidden bg-white">
                        <span className="input-group-text bg-transparent border-0 ps-4 text-primary">
                            🔍
                        </span>
                        <input
                            id="faq-search"
                            type="search"
                            className="form-control border-0 shadow-none ps-2"
                            placeholder="ค้นหาปัญหาที่เจอ เช่น 'โดนแบน', 'ROI', 'Tracking'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="ค้นหาคำถามที่พบบ่อย"
                        />
                    </div>
                </div>
            </div>

            {/* ── FAQ Content ─────────────────────────────────────────────── */}
            {isSearching ? (
                /* ── Flat search results ── */
                <div className="row g-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((item, idx) => (
                            <div className="col-lg-6" key={idx}>
                                <FaqCard item={item} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">
                                ไม่พบข้อมูลที่คุณค้นหา? ลองใช้คำอื่น หรือปรึกษาเราโดยตรง
                            </p>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="btn btn-outline-primary btn-sm rounded-pill"
                            >
                                ล้างคำค้นหา
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* ── Category-grouped display ── */
                faqCategories && faqCategories.length > 0 ? (
                    faqCategories.map((cat, catIdx) => (
                        <section key={catIdx} className="mb-5" aria-labelledby={`faq-cat-${catIdx}`}>
                            <h2
                                id={`faq-cat-${catIdx}`}
                                className="h4 fw-bold text-primary mb-4 pb-2 border-bottom border-primary border-opacity-25"
                            >
                                {cat.title}
                            </h2>
                            <div className="row g-4">
                                {cat.items.map((item, idx) => (
                                    <div className="col-lg-6" key={idx}>
                                        <FaqCard item={item} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                ) : (
                    /* Fallback: flat list if no categories */
                    <div className="row g-4">
                        {faqItems.map((item, idx) => (
                            <div className="col-lg-6" key={idx}>
                                <FaqCard item={item} />
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* ── CTA ────────────────────────────────────────────────────── */}
            <div className="mt-5 text-center">
                <Link
                    href="/contact"
                    className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow"
                >
                    ปรึกษาผู้เชี่ยวชาญด้านบัญชีโฆษณา
                </Link>
                <p className="small text-muted mt-2">
                    พูดคุยกับคุณเอกสิทธิ์โดยตรง — LINE: @myadsdev | Telegram: @myadsdev
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   FAQ Card Component — Reusable card for each FAQ item
   ═══════════════════════════════════════════════════════════════════════ */
function FaqCard({ item }) {
    return (
        <article
            className="p-4 bg-white rounded shadow-sm h-100 border-start border-primary border-5"
            style={{ borderLeft: "5px solid #0d6efd" }}
            itemScope
            itemType="https://schema.org/Question"
        >
            <h3
                className="h6 fw-bold text-primary mb-3"
                style={{ lineHeight: "1.6" }}
                itemProp="name"
            >
                {item.q}
            </h3>
            <div
                itemScope
                itemType="https://schema.org/Answer"
                itemProp="acceptedAnswer"
            >
                <p
                    className="text-muted mb-0 small"
                    style={{ textAlign: "justify" }}
                    itemProp="text"
                >
                    {item.a}
                </p>
            </div>
        </article>
    );
}
