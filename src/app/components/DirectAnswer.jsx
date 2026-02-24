// src/app/components/DirectAnswer.jsx
import Link from "next/link";

/**
 * DirectAnswer
 * - ออกแบบสำหรับ SGE/AI Overview: สรุปสั้น + bullet facts + CTA
 * - ใช้ semantic tags ชัดเจน: <section> + <header>
 */
export default function DirectAnswer({
  id = "direct-answer",
  title = "คำตอบสั้น (Direct Answer)",
  answer = "",
  bullets = [],
  ctaHref = "/contact",
  ctaText = "ปรึกษาฟรี",
  secondaryHref = "/packages",
  secondaryText = "ดูแพ็กเกจ & ราคา",
}) {
  const safeBullets = Array.isArray(bullets) ? bullets.filter(Boolean) : [];

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mb-4">
      <div className="p-4 p-md-5 border rounded-4 bg-light">
        <header className="mb-2">
          <h2 id={`${id}-title`} className="fs-4 fw-bold mb-2">
            {title}
          </h2>
        </header>

        <p className="text-muted mb-3">{answer}</p>

        {safeBullets.length > 0 && (
          <ul className="mb-4 text-muted">
            {safeBullets.map((b, idx) => (
              <li key={`${id}-b-${idx}`}>{b}</li>
            ))}
          </ul>
        )}

        <div className="d-flex flex-wrap gap-2">
          {ctaHref && (
            <Link href={ctaHref} className="btn btn-primary">
              {ctaText}
            </Link>
          )}
          {secondaryHref && (
            <Link href={secondaryHref} className="btn btn-outline-secondary">
              {secondaryText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
