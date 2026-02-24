// src/app/components/Header.js

"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// ✅ Client-only import + no placeholder
const LineFAB = dynamic(() => import("./LineFAB"), {
  ssr: false,
  loading: () => null,
});

// ✅ Freeze brand for hydration stability (MUST NOT differ server/client)
const BRAND_UI = "MyAdsDev";

export default function Header() {
  const collapseId = "mainNav";

  const [navOpen, setNavOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navRootRef = useRef(null);
  const dropdownRef = useRef(null);

  const closeAll = useCallback(() => {
    setNavOpen(false);
    setServicesOpen(false);
  }, []);

  const toggleNav = useCallback(() => {
    setNavOpen((v) => !v);
    setServicesOpen(false);
  }, []);

  const toggleServices = useCallback(() => {
    setServicesOpen((v) => !v);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      const root = navRootRef.current;
      if (!root) return;
      if (!root.contains(e.target)) {
        closeAll();
      } else {
        const dd = dropdownRef.current;
        if (dd && !dd.contains(e.target)) setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [closeAll]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAll]);

  const NavItem = ({ href, className, children, ...rest }) => {
    return (
      <Link href={href} className={className} onClick={closeAll} {...rest}>
        {children}
      </Link>
    );
  };

  const navStyle = {
    background: "rgba(8,10,14,0.86)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(212,175,55,0.18)",
  };

  const dropdownMenuStyle = {
    background: "rgba(8,10,14,0.96)",
    border: "1px solid rgba(212,175,55,0.18)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
  };

  const dropdownItemStyle = {
    color: "rgba(244,241,230,0.92)",
  };

  const ctaStyle = {
    background:
      "linear-gradient(135deg, rgba(212,175,55,0.95), rgba(212,175,55,0.70))",
    border: "1px solid rgba(212,175,55,0.55)",
    color: "#0b0f14",
    fontWeight: 800,
    borderRadius: "12px",
  };

  return (
    <>
      <header className="header sticky-top" ref={navRootRef}>
        <nav
          className="navbar navbar-expand-md navbar-dark container-fluid"
          style={navStyle}
        >
          <NavItem
            href="/"
            className="navbar-brand d-flex align-items-center gap-2"
            aria-label={`${BRAND_UI} Home`}
          >
            <Image
              src="/images/logo.png"
              alt={`${BRAND_UI} โลโก้เอเจนซี่รับยิงแอดสายเทา`}
              width={40}
              height={40}
              priority
            />
            <span className="fw-bold">{BRAND_UI}</span>
          </NavItem>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls={collapseId}
            aria-expanded={navOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={toggleNav}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className={`collapse navbar-collapse ${navOpen ? "show" : ""}`}
            id={collapseId}
          >
            <ul className="navbar-nav ms-auto align-items-md-center">
              <li
                className={`nav-item dropdown ${servicesOpen ? "show" : ""}`}
                ref={dropdownRef}
              >
                <button
                  className="nav-link dropdown-toggle btn btn-link text-start"
                  type="button"
                  aria-expanded={servicesOpen ? "true" : "false"}
                  onClick={toggleServices}
                  style={{
                    textDecoration: "none",
                    color: "rgba(244,241,230,0.86)",
                  }}
                >
                  บริการ
                </button>

                <ul
                  className={`dropdown-menu ${servicesOpen ? "show" : ""}`}
                  style={dropdownMenuStyle}
                >
                  <li>
                    <NavItem
                      href="/services"
                      className="dropdown-item"
                      style={dropdownItemStyle}
                    >
                      บริการทั้งหมด
                    </NavItem>
                  </li>
                  <li>
                    <NavItem
                      href="/services/google-ads"
                      className="dropdown-item"
                      style={dropdownItemStyle}
                    >
                      Google Ads
                    </NavItem>
                  </li>
                  <li>
                    <NavItem
                      href="/services/facebook-ads"
                      className="dropdown-item"
                      style={dropdownItemStyle}
                    >
                      Facebook Ads
                    </NavItem>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <NavItem href="/about" className="nav-link">
                  เกี่ยวกับเรา
                </NavItem>
              </li>

              <li className="nav-item">
                <NavItem href="/reviews" className="nav-link">
                  รีวิว
                </NavItem>
              </li>

              <li className="nav-item">
                <NavItem href="/blog" className="nav-link">
                  บทความ
                </NavItem>
              </li>

              <li className="nav-item">
                <NavItem href="/videos" className="nav-link">
                  วิดีโอ
                </NavItem>
              </li>

              <li className="nav-item">
                <NavItem href="/course" className="nav-link">
                  คอร์สเรียน
                </NavItem>
              </li>

              <li className="nav-item">
                <NavItem href="/toolfree" className="nav-link">
                  เครื่องมือฟรี
                </NavItem>
              </li>

              <li className="nav-item">
                <NavItem href="/packages" className="nav-link">
                  แพ็กเกจ
                </NavItem>
              </li>
              <li className="nav-item">
                <NavItem href="/faq" className="nav-link">
                  คำถามที่พบบ่อย
                </NavItem>
              </li>
              <li className="nav-item ms-md-2">
                <NavItem
                  href="/contact"
                  className="nav-link px-3"
                  style={ctaStyle}
                >
                  ติดต่อเรา
                </NavItem>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* ✅ After mount only */}
      {mounted ? <LineFAB /> : null}
    </>
  );
}