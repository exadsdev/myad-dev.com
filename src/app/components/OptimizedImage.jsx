// src/app/components/OptimizedImage.jsx
import Image from "next/image";
import { toWebp } from "@/lib/toWebp";

/**
 * OptimizedImage (Next.js LCP + WebP)
 * - priority + fetchPriority="high" สำหรับรูป Above-the-fold (LCP)
 * - บังคับ path ใน /images/ ให้เป็น .webp อัตโนมัติ
 * - ใส่ sizes เพื่อช่วยลด LCP/CLS บน Mobile
 */
export default function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  className = "",
  aboveFold = false, // ✅ รูปเหนือพับ (LCP)
  sizes = "(max-width: 576px) 100vw, (max-width: 992px) 90vw, 900px",
  quality = 80,
  placeholder = "empty",
  blurDataURL,
  loading,
  decoding = "async",
  style,
  ...props
}) {
  const finalSrc = toWebp(src);

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      quality={quality}
      priority={Boolean(aboveFold)}
      fetchPriority={aboveFold ? "high" : "auto"}
      loading={loading || (aboveFold ? "eager" : "lazy")}
      decoding={decoding}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      style={style}
      {...props}
    />
  );
}
