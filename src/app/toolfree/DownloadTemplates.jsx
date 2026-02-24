// src/app/components/DownloadTemplates.jsx
"use client";

import { useEffect, useRef, useState } from "react";

const WAIT_MS = 30 * 60 * 1000;

const DOWNLOADS = [
  {
    key: "html",
    title: "Landing Page (HTML)",
    desc: "ไฟล์ ZIP สำหรับหน้า Landing Page แบบ HTML",
    url: "/downloads/HTML.zip",
    tone: "primary",
  },
  {
    key: "next",
    title: "Landing Page (Next.js)",
    desc: "Template สำหรับ Next.js หน้า Home",
    url: "/downloads/HomePage.zip",
    tone: "outline-primary",
  },
  {
    key: "shop",
    title: "หน้าออเดอร์ Shop",
    desc: "ไฟล์เว็บไซต์หน้าคำสั่งซื้อสำหรับ Shop",
    url: "/downloads/shop.zip",
    tone: "outline-primary",
  },
];

function triggerDownload(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function formatTime(ms) {
  const total = Math.ceil(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function TemplateCard({ title, desc, url, tone }) {
  const [remaining, setRemaining] = useState(WAIT_MS);
  const [running, setRunning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const startRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    if (running) return;

    setRemaining(WAIT_MS);
    setRunning(true);
    setShowPopup(true);

    startRef.current = performance.now();

    timerRef.current = setInterval(() => {
      const elapsed = performance.now() - startRef.current;
      const left = Math.max(WAIT_MS - elapsed, 0);
      setRemaining(left);

      if (left === 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;

        setRunning(false);
        setShowPopup(false);

        triggerDownload(url);

        // NOTE: window.close() จะทำงานได้เฉพาะหน้าที่ถูกเปิดด้วย window.open()
        setTimeout(() => {
          try {
            window.close();
          } catch (_) {}
        }, 300);
      }
    }, 120);
  };

  const progress = Math.min(((WAIT_MS - remaining) / WAIT_MS) * 100, 100);

  return (
    <div className="col-md-4">
      <div className="border border-2 rounded-4 p-3 h-100 bg-white shadow-sm">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="small text-muted text-uppercase">ประกาศอย่างเป็นทางการ</div>
          <span className="badge bg-dark-subtle text-dark">OFFICIAL</span>
        </div>

        <h3 className="h6 fw-bold mb-2">{title}</h3>
        <p className="small text-muted mb-3">{desc}</p>

        <button
          type="button"
          className={`btn ${tone === "primary" ? "btn-primary" : "btn-outline-primary"} w-100`}
          onClick={startCountdown}
          disabled={running}
        >
          {running ? "กำลังนับถอยหลัง..." : "เริ่มนับถอยหลัง 30 นาที"}
        </button>

        <div className="mt-3">
          <div className="progress" style={{ height: 6 }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%`, transition: "width 200ms ease" }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <div className="small text-muted mt-2">
            {running ? `เริ่มดาวน์โหลดอัตโนมัติใน ${formatTime(remaining)}` : "ระบบรอครบเวลา 30 นาทีแล้วจึงดาวน์โหลด"}
          </div>
          <div className="small text-muted mt-1">ไฟล์: {url}</div>
        </div>

        {showPopup && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(15, 23, 42, 0.65)", zIndex: 1055 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-4 p-4 shadow" style={{ maxWidth: 420, width: "90%" }}>
              <div className="fw-bold mb-2">กำลังนับถอยหลัง</div>
              <div className="text-muted mb-3">กรุณารอให้ครบเวลา ระบบจะดาวน์โหลดอัตโนมัติทันที</div>
              <div className="display-6 fw-bold text-primary">{formatTime(remaining)}</div>
              <div className="small text-muted mt-2">ไฟล์: {url}</div>

              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-3"
                onClick={() => setShowPopup(false)}
              >
                ปิดหน้าต่างนี้
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DownloadTemplates() {
  return (
    <section className="mb-5" aria-label="ดาวน์โหลดเทมเพลต Landing Page">
      <div className="card border-0 shadow rounded-4 overflow-hidden">
        <div
          className="p-4 p-md-5 text-white"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <div className="small text-uppercase opacity-75">ประกาศเพื่อการดาวน์โหลด</div>
              <h2 className="h4 fw-bold mb-1">ศูนย์ดาวน์โหลด Template อย่างเป็นทางการ</h2>
              <div className="small opacity-75">เลขที่ประกาศ: DL-2026-02</div>
            </div>

            <div
              className="rounded-circle bg-white text-dark d-flex align-items-center justify-content-center"
              style={{ width: 64, height: 64, fontWeight: 700 }}
            >
              ✔
            </div>
          </div>

          <p className="mt-3 mb-0 opacity-75">
            ทุกปุ่มจะเริ่มนับถอยหลัง 30 นาทีแบบสมูท และดาวน์โหลดอัตโนมัติเมื่อครบเวลา
          </p>
        </div>

        <div className="card-body p-4 p-md-5 bg-light">
          <div className="row g-4">
            {DOWNLOADS.map((item) => {
              const { key, ...rest } = item;
              return <TemplateCard key={key} {...rest} />;
            })}
          </div>

          <div className="small text-muted mt-4 text-center">
            เมื่อเริ่มดาวน์โหลดอัตโนมัติ ระบบจะพยายามปิดหน้าต่าง (บางเบราว์เซอร์อาจไม่อนุญาต) หากไม่ปิดอัตโนมัติให้ปิดด้วยตนเอง
          </div>
        </div>
      </div>
    </section>
  );
}