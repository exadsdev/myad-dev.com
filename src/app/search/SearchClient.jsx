// src/app/search/SearchClient.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SearchClient({ initialPosts, initialFaqs }) {
  const [searchTerm, setSearchTerm] = useState("");

  // ระบบส่ง Keyword ไปยัง Google Analytics (GA4)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 2 && window.gtag) {
        window.gtag("event", "search", {
          search_term: searchTerm,
          search_type: "global_site_search"
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredFaqs = initialFaqs.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = initialPosts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-5">
        <input
          type="text"
          className="form-control form-control-lg rounded-pill shadow-sm"
          placeholder="พิมพ์เพื่อค้นหา บัญชีโฆษณา, รับยิงแอดสายเทา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {/* ผลลัพธ์ FAQ */}
        <div className="col-lg-6 mb-4">
          <h2 className="h4 fw-bold text-primary border-bottom pb-2">คำถามที่พบบ่อย ({filteredFaqs.length})</h2>
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="p-3 bg-white border-start border-primary border-4 shadow-sm mb-3 rounded">
              <h3 className="h6 fw-bold mb-1">{faq.q}</h3>
              <p className="small text-muted mb-0">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* ผลลัพธ์บทความ */}
        <div className="col-lg-6">
          <h2 className="h4 fw-bold text-success border-bottom pb-2">บทความที่เกี่ยวข้อง ({filteredPosts.length})</h2>
          {filteredPosts.map((post, i) => (
            <Link href={`/blog/${post.slug}`} key={i} className="text-decoration-none text-dark">
              <div className="p-3 bg-white shadow-sm mb-3 rounded hover-lift">
                <h3 className="h6 fw-bold mb-1">{post.title}</h3>
                <p className="small text-muted mb-0 line-clamp-1">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}