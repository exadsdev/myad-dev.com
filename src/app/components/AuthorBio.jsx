import Image from "next/image";
import {
  BRAND,
  FOUNDER_NAME,
  FOUNDER_JOB_TITLE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/app/seo.config";

export default function AuthorBio({
  title = "ผู้เชี่ยวชาญด้าน Performance Marketing และ Technical Ads",
  highlight = "รับยิงแอดสายเทา",
}) {
  return (
    <section className="border rounded-4 p-4 bg-white shadow-sm">
      <div className="row g-4 align-items-center">
        <div className="col-md-3 text-center">
          <Image
            src="/images/founder-profile.jpg"
            alt={`โปรไฟล์ ${FOUNDER_NAME} ผู้เชี่ยวชาญรับทำโฆษณาสายเทา`}
            width={220}
            height={220}
            className="rounded-circle object-fit-cover"
            loading="lazy"
          />
        </div>
        <div className="col-md-9">
          <h2 className="h4 fw-bold mb-2">{title}</h2>
          <h3 className="h6 text-muted mb-3">{FOUNDER_NAME} — {FOUNDER_JOB_TITLE}</h3>
          <p className="mb-2 text-muted">
            ผู้ก่อตั้ง {BRAND} ดูแลลูกค้าธุรกิจเฉพาะทางมากกว่า 150 ราย วางระบบโฆษณาแบบวัดผลจริง
            ทั้ง {highlight} และการจัดการแคมเปญที่ต้องสอดคล้องนโยบายบน Google Ads และ Facebook Ads
          </p>
          <p className="mb-0 text-muted">
            ติดต่อผู้เชี่ยวชาญโดยตรง: {CONTACT_EMAIL} | {CONTACT_PHONE}
          </p>
        </div>
      </div>
    </section>
  );
}
