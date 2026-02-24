"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const CHANNELS = [
  {
    id: "line",
    label: "LINE",
    icon: "bi-line",
    color: "#00B900",
    href: "https://lin.ee/vjeDuCZ",
    emoji: "💬",
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: "bi-telegram",
    color: "#0088cc",
    href: "https://t.me/myadsdev",
    emoji: "✈️",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "bi-messenger",
    color: "#0084FF",
    href: "https://m.me/adsdark2020",
    emoji: "💙",
  },
  {
    id: "phone",
    label: "โทร",
    icon: "bi-telephone-fill",
    color: "#4CAF50",
    href: "tel:0832528058",
    emoji: "📞",
    sub: "083-252-8058",
  },
];

export default function LineFAB() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const fabRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (fabRef.current && !fabRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <div
        ref={fabRef}
        className="contact-fab-wrapper"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 9999,
          opacity: mounted ? 1 : 0,
          visibility: mounted ? "visible" : "hidden",
          transition: "opacity 0.3s ease",
        }}
      >
        {/* ── Channel Menu ── */}
        <div className={`cfab-menu ${open ? "cfab-menu--open" : ""}`}>
          {CHANNELS.map((ch, i) => (
            <a
              key={ch.id}
              href={ch.href}
              target={ch.id === "phone" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="cfab-item"
              aria-label={`ติดต่อผ่าน ${ch.label}`}
              style={{
                "--ch-color": ch.color,
                "--ch-delay": `${i * 60}ms`,
              }}
              onClick={() => setOpen(false)}
            >
              <span className="cfab-item-icon" style={{ background: ch.color }}>
                <i className={`bi ${ch.icon}`}></i>
              </span>
              <span className="cfab-item-label">
                <span className="cfab-item-name">{ch.label}</span>
                {ch.sub && <span className="cfab-item-sub">{ch.sub}</span>}
              </span>
            </a>
          ))}
        </div>

        {/* ── Backdrop overlay (mobile-friendly) ── */}
        {open && (
          <div
            className="cfab-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Main FAB Button ── */}
        <button
          type="button"
          className={`cfab-btn ${open ? "cfab-btn--open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="เลือกช่องทางติดต่อ"
          aria-expanded={open}
        >
          {/* Pulse rings */}
          {!open && (
            <>
              <span className="cfab-pulse" />
              <span className="cfab-pulse cfab-pulse--delay" />
            </>
          )}

          {/* Icon: LINE when closed, X when open */}
          <span className="cfab-icon">
            {open ? (
              <i className="bi bi-x-lg" style={{ fontSize: 28, color: "#fff" }}></i>
            ) : (
              <Image
                src="/images/line.png"
                alt="ติดต่อเรา"
                width={56}
                height={56}
                loading="lazy"
                style={{ borderRadius: "50%", display: "block" }}
              />
            )}
          </span>
        </button>
      </div>

      <style jsx global>{`
        /* ── FAB Main Button ── */
        .cfab-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, #00B900, #00D400);
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 185, 0, 0.45);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          padding: 0;
        }
        .cfab-btn--open {
          background: linear-gradient(135deg, #333, #555);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transform: rotate(90deg);
        }
        .cfab-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 28px rgba(0, 185, 0, 0.55);
        }
        .cfab-btn--open:hover {
          transform: rotate(90deg) scale(1.08);
          box-shadow: 0 6px 28px rgba(0, 0, 0, 0.35);
        }
        .cfab-btn:focus-visible {
          outline: 3px solid #00B900;
          outline-offset: 4px;
        }

        /* ── Icon ── */
        .cfab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }
        .cfab-btn:not(.cfab-btn--open) .cfab-icon {
          animation: cfabBounce 2s ease-in-out infinite;
        }
        @keyframes cfabBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* ── Pulse ── */
        .cfab-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(0, 200, 0, 0.35);
          animation: cfabPulse 2s ease-out infinite;
          z-index: 1;
        }
        .cfab-pulse--delay {
          animation-delay: 0.5s;
        }
        @keyframes cfabPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.9); opacity: 0; }
        }

        /* ── Menu ── */
        .cfab-menu {
          position: absolute;
          bottom: 72px;
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
          z-index: 9;
        }
        .cfab-menu--open {
          pointer-events: auto;
        }

        /* ── Menu Item ── */
        .cfab-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px 8px 8px;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.2s ease;
          opacity: 0;
          transform: translateY(16px) scale(0.85);
          white-space: nowrap;
        }
        .cfab-menu--open .cfab-item {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: var(--ch-delay);
        }
        .cfab-item:hover {
          transform: translateY(-2px) scale(1.03) !important;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
          border-color: var(--ch-color);
        }

        /* ── Item Icon Circle ── */
        .cfab-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 50%;
          color: #fff;
          font-size: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        /* ── Item Label ── */
        .cfab-item-label {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .cfab-item-name {
          font-size: 14px;
          font-weight: 600;
          color: #222;
        }
        .cfab-item-sub {
          font-size: 12px;
          color: #888;
          font-weight: 400;
        }

        /* ── Backdrop ── */
        .cfab-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .cfab-btn {
            width: 52px;
            height: 52px;
          }
          .cfab-pulse {
            width: 52px;
            height: 52px;
          }
          .cfab-item {
            padding: 6px 14px 6px 6px;
            gap: 10px;
          }
          .cfab-item-icon {
            width: 36px;
            height: 36px;
            min-width: 36px;
            font-size: 17px;
          }
          .cfab-item-name {
            font-size: 13px;
          }
          .cfab-menu {
            bottom: 62px;
          }
        }

        /* ── Safe area ── */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .contact-fab-wrapper {
            bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .cfab-icon { animation: none !important; }
          .cfab-pulse { animation: none; display: none; }
          .cfab-item {
            transition-duration: 0.01s !important;
          }
        }
      `}</style>
    </>
  );
}
