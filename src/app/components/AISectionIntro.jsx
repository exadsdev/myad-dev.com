// src/app/components/AISectionIntro.jsx

/**
 * AISectionIntro
 * - ใช้ใส่ “สรุป 40–60 คำ” ตอนต้นของทุก section แบบไม่ทำลายดีไซน์
 * - แนะนำให้วางก่อนเนื้อหา section จริง
 */
export default function AISectionIntro({ text = "" }) {
  if (!text) return null;

  return (
    <p className="visually-hidden" aria-hidden="false">
      {text}
    </p>
  );
}
