// src/lib/toWebp.js
/**
 * toWebp
 * - แปลงเฉพาะรูปในโฟลเดอร์ /images/ ให้เป็น .webp
 * - ห้ามไปยุ่งกับรูปจากโฟลเดอร์อื่นหรือ remote URL
 */
export function toWebp(src) {
  if (!src) return src;

  // Remote URL: ไม่แก้
  if (typeof src === "string" && /^https?:\/\//i.test(src)) return src;

  // Only /images/
  if (typeof src === "string" && src.startsWith("/images/")) {
    // Already webp
    if (src.toLowerCase().endsWith(".webp")) return src;

    // Replace common extensions with .webp
    return src.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  }

  // Any other local paths: ไม่แก้
  return src;
}
