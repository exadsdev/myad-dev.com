"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const next = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("next") || "/admin"
    : "/admin";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const username = form.get("username");
    const password = form.get("password");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
      window.location.href = next || "/admin";
    } catch (e) {
      setErr(e.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "เข้าสู่ระบบ | แอดมิน";
  }, []);

  return (
    <main className="container-fluid py-5" style={{ maxWidth: 480 }}>
      <h1 className="h4 text-center mb-4">เข้าสู่ระบบก่อนเข้าหน้า Admin</h1>

      <form onSubmit={onSubmit} className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label">ชื่อผู้ใช้</label>
            <input name="username" type="text" className="form-control" placeholder="admin" required />
          </div>
          <div className="mb-3">
            <label className="form-label">รหัสผ่าน</label>
            <input name="password" type="password" className="form-control" placeholder="••••••••" required />
          </div>
          {err ? <div className="alert alert-danger py-2">{err}</div> : null}
          <button type="submit" className="btn btn-dark w-100" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </div>
      </form>
    </main>
  );
}
