"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden">
      {}
      <div className="position-absolute top-0 start-0 w-100 h-100 z-n1">
        <div className="grad grad-a" />
        <div className="grad grad-b" />
        <div className="grad grad-c" />
      </div>

      <main className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                  {}
                  <div className="flex-shrink-0">
                    <Illustration key={tick} />
                  </div>

                  {}
                  <div className="flex-grow-1 text-center text-md-start">
                    <span className="badge rounded-pill px-3 py-2 bg-warning text-dark mb-3">
                      โอ๊ะ! เกิดข้อผิดพลาด
                    </span>
                    <h1 className="display-4 fw-bold mb-2 text-gradient">404 ไม่พบหน้า</h1>
                    <p className="text-muted mb-4">
                      ลิงก์นี้อาจถูกย้าย ลบไปแล้ว หรือพิมพ์ไม่ถูกต้อง
                    </p>

                    <div className="d-flex flex-column flex-sm-row gap-3">
                      <Link href="/" className="btn btn-primary btn-lg rounded-3">
                        กลับสู่หน้าแรก
                      </Link>
                      <Link
                        href="/contact"
                        className="btn btn-outline-secondary btn-lg rounded-3"
                      >
                        ติดต่อเรา
                      </Link>
                    </div>

                    <div className="mt-4">
                      <small className="text-secondary">
                        เคล็ดลับ: ลองตรวจสอบตัวสะกดของ URL หรือใช้เมนูด้านบนเพื่อไปยังหน้าที่ต้องการ
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-light py-3 px-4 d-flex align-items-center justify-content-between">
                <span className="text-muted">
                  ไม่พบสิ่งที่ต้องการ? เราพร้อมช่วยเหลือคุณเสมอ
                </span>
                <Link href="/services" className="btn btn-success rounded--pill px-4">
                  ดูบริการทั้งหมด
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .text-gradient {
          background: linear-gradient(90deg, #6f42c1, #0d6efd, #20c997);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .grad {
          position: absolute;
          filter: blur(60px);
          opacity: 0.3;
          transform: translateZ(0);
          animation: float 18s ease-in-out infinite;
        }
        .grad-a {
          width: 45vmax;
          height: 45vmax;
          background: radial-gradient(circle at 30% 30%, #0d6efd, transparent 60%);
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }
        .grad-b {
          width: 50vmax;
          height: 50vmax;
          background: radial-gradient(circle at 70% 40%, #6f42c1, transparent 60%);
          bottom: -15%;
          right: -10%;
          animation-delay: 4s;
        }
        .grad-c {
          width: 40vmax;
          height: 40vmax;
          background: radial-gradient(circle at 50% 70%, #20c997, transparent 60%);
          top: 20%;
          right: 10%;
          animation-delay: 8s;
        }
        @keyframes float {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -2rem, 0) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

function Illustration() {
  return (
    <svg
      width="190"
      height="190"
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      className="d-block"
      role="img"
      aria-label="ตกแต่งหน้าค้นหาไม่พบ"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#0d6efd" />
          <stop offset="100%" stopColor="#6f42c1" />
        </linearGradient>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0%" stopColor="#20c997" />
          <stop offset="100%" stopColor="#0d6efd" />
        </linearGradient>
      </defs>

      {}
      <rect x="30" y="40" width="160" height="120" rx="16" fill="url(#g1)" opacity="0.12" />
      <rect
        x="36"
        y="46"
        width="148"
        height="108"
        rx="12"
        fill="#fff"
        stroke="#e9ecef"
        strokeWidth="2"
      />

      {}
      <rect x="50" y="64" width="120" height="16" rx="8" fill="#e9ecef" />
      <circle cx="56" cy="72" r="4" fill="#adb5bd" />
      <rect x="50" y="90" width="88" height="10" rx="5" fill="#f1f3f5" />
      <rect x="50" y="106" width="72" height="10" rx="5" fill="#f1f3f5" />
      <rect x="50" y="122" width="96" height="10" rx="5" fill="#f1f3f5" />

      {}
      <g transform="translate(120, 130) rotate(-12)">
        <rect width="82" height="36" rx="18" fill="url(#g2)" opacity="0.2" />
        <text
          x="41"
          y="24"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#0d6efd"
        >
          404
        </text>
      </g>

      {}
      <g fill="#ffd43b">
        <circle cx="28" cy="34" r="3" />
        <circle cx="198" cy="48" r="2.5" />
        <circle cx="186" cy="170" r="2.5" />
        <circle cx="26" cy="178" r="2.5" />
      </g>
    </svg>
  );
}
