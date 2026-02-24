// src/app/toolfree/ToolFreeClient.jsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ToolFreeClient() {
  const sp = useSearchParams();

  // ตัวอย่าง: รองรับ query เช่น /toolfree?tab=seo
  const tab = (sp?.get("tab") || "all").toLowerCase();

  const tools = [
    {
      key: "seo",
      title: "SEO Checklist",
      desc: "เช็กลิสต์พื้นฐานสำหรับ SEO + Technical SEO",
      href: "/toolfree?tab=seo",
    },
    {
      key: "utm",
      title: "UTM Builder",
      desc: "ช่วยสร้าง UTM สำหรับติดตามแคมเปญ",
      href: "/toolfree?tab=utm",
    },
    {
      key: "schema",
      title: "Schema Helper",
      desc: "แนวทางช่วยจัดโครงสร้าง JSON-LD ให้ถูกต้อง",
      href: "/toolfree?tab=schema",
    },
  ];

  const filtered =
    tab === "all" ? tools : tools.filter((t) => t.key === tab);

  return (
    <section className="d-flex flex-column gap-3">
      <div className="d-flex flex-wrap gap-2">
        <Link className={`btn btn-sm ${tab === "all" ? "btn-primary" : "btn-outline-primary"}`} href="/toolfree?tab=all">
          ทั้งหมด
        </Link>
        <Link className={`btn btn-sm ${tab === "seo" ? "btn-primary" : "btn-outline-primary"}`} href="/toolfree?tab=seo">
          SEO
        </Link>
        <Link className={`btn btn-sm ${tab === "utm" ? "btn-primary" : "btn-outline-primary"}`} href="/toolfree?tab=utm">
          UTM
        </Link>
        <Link className={`btn btn-sm ${tab === "schema" ? "btn-primary" : "btn-outline-primary"}`} href="/toolfree?tab=schema">
          Schema
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-warning mb-0">
          ไม่พบเครื่องมือในหมวด: <span className="fw-semibold">{tab}</span>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((t) => (
            <div className="col-12 col-md-6" key={t.key}>
              <div className="border rounded p-3 h-100">
                <div className="fw-semibold mb-1">{t.title}</div>
                <div className="text-muted mb-3">{t.desc}</div>
                <Link className="btn btn-outline-secondary btn-sm" href={t.href}>
                  เปิด
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
