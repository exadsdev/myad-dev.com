// src/app/search/page.jsx
import { getAllPosts } from "@/lib/postsStore";
import SearchClient from "./SearchClient";
import JsonLd from "@/app/components/JsonLd";
import { SITE, BRAND } from "@/app/seo.config";

export const metadata = {
  title: `ค้นหาข้อมูล | ${BRAND}`,
  description: `ค้นหาบทความเทคนิคการจัดการบัญชีโฆษณา และบริการรับยิงแอดสายเทาได้ทั่วทั้งเว็บไซต์`,
};

export default async function SearchPage() {
  // ดึงข้อมูลบน Server (ไม่ต้องใช้ fs บน Client)
  const posts = await getAllPosts();
  
  // ข้อมูล FAQ พื้นฐานที่ต้องการให้ค้นหาได้
  const faqs = [
    { q: "รับยิงแอดสายเทาคืออะไร?", a: "บริการทำโฆษณาสำหรับธุรกิจเฉพาะทางโดยเทคนิคมืออาชีพ" },
    { q: "บัญชีโฆษณาโดนแบนแก้ยังไง?", a: "ใช้ระบบสำรองบัญชีคุณภาพสูงและแยก Fingerprint" },
    // เพิ่มข้ออื่นๆ ตามต้องการ...
  ];

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;

  return (
    <div className="container py-5">
      <JsonLd json={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `ระบบค้นหาข้อมูลทั่วเว็บไซต์ - ${BRAND}`,
        "url": `${SITE_URL}/search`
      }} />

      <h1 className="fw-bold mb-4">ค้นหาข้อมูลทั่วเว็บไซต์</h1>
      
      {/* ส่งข้อมูลที่ดึงมาแล้วไปให้ Client จัดการเรื่อง Search */}
      <SearchClient initialPosts={posts} initialFaqs={faqs} />
    </div>
  );
}