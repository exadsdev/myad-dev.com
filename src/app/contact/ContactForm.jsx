"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CONTACT_EMAIL } from "../seo.config";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      budget: "",
      platform: "google",
      message: "",
    },
  });

  const onSubmit = (data) => {
    setStatus("");
    const subject = `ติดต่อขอคำปรึกษา: ${data.name}`;
    const body = [
      `ชื่อ: ${data.name}`,
      `อีเมล: ${data.email}`,
      `เบอร์โทร: ${data.phone}`,
      `งบประมาณต่อเดือน: ${data.budget}`,
      `แพลตฟอร์มหลัก: ${data.platform}`,
      `รายละเอียดเพิ่มเติม: ${data.message}`,
    ].join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (typeof window !== "undefined") {
      window.location.href = mailto;
      setStatus("ระบบกำลังเปิดอีเมลเพื่อส่งข้อมูล หากไม่ขึ้นอัตโนมัติสามารถคัดลอกข้อมูลได้จากฟอร์มนี้");
      reset();
    } else {
      setStatus("ไม่สามารถเปิดอีเมลอัตโนมัติได้");
    }
  };

  return (
    <section className="border rounded-4 p-4 p-md-5 bg-light">
      <h2 className="h5 fw-bold mb-4">ฟอร์มติดต่อทีมงาน</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">ชื่อ-นามสกุล</label>
          <input
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="ชื่อจริงของคุณ"
            {...register("name", { required: true, minLength: 2 })}
          />
          {errors.name && <div className="invalid-feedback">กรุณาระบุชื่อ</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">อีเมล</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="name@email.com"
            {...register("email", { required: true })}
          />
          {errors.email && <div className="invalid-feedback">กรุณาระบุอีเมล</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">เบอร์โทร</label>
          <input
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            placeholder="เบอร์โทรติดต่อ"
            {...register("phone", { required: true })}
          />
          {errors.phone && <div className="invalid-feedback">กรุณาระบุเบอร์โทร</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">งบประมาณต่อเดือน</label>
          <input
            className="form-control"
            placeholder="เช่น 30,000 - 100,000 บาท"
            {...register("budget")}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">แพลตฟอร์มหลัก</label>
          <select className="form-select" {...register("platform")}>
            <option value="google">Google Ads</option>
            <option value="facebook">Facebook Ads</option>
            <option value="both">Google + Facebook</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">รายละเอียดเพิ่มเติม</label>
          <textarea
            className="form-control"
            rows={5}
            placeholder="ตัวอย่าง: ต้องการเพิ่มยอดขาย/ลีด, กลุ่มเป้าหมาย, ปัญหาที่เจอ"
            {...register("message")}
          />
        </div>
        <div className="col-12 d-flex flex-wrap gap-2">
          <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
            ส่งข้อมูลให้ทีมงาน
          </button>
          <a className="btn btn-outline-secondary" href={`mailto:${CONTACT_EMAIL}`}>
            ส่งอีเมลโดยตรง
          </a>
        </div>
        {status && (
          <div className="col-12">
            <div className="alert alert-info mb-0">{status}</div>
          </div>
        )}
      </form>
    </section>
  );
}
