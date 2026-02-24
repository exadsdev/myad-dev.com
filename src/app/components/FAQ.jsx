import { useMemo } from "react";
import JsonLd from "@/app/components/JsonLd";

/**
 * FAQ Component (Bootstrap Accordion)
 * - ออกแบบโครงสร้างเพื่อรองรับ Google AI (SGE/AI Overviews)
 * - รองรับคำตอบแบบรายการ (List) เพื่อเพิ่มโอกาสติด Featured Snippets
 * - ระบบ Schema อัจฉริยะ ป้องกันข้อมูลซ้ำซ้อนกับหน้าหลัก
 *
 * Props:
 * - items: [{ q: string, a: string | string[] }]
 * - withTitle: boolean (default true)
 * - titleText: string
 * - withSchema: boolean (default true)
 * - pageUrl: string (absolute recommended)
 * - accordionId: string
 * - headingAs: "h2" | "h3" | "h4" (default "h2")
 */
export default function FAQ({
  items = [],
  withTitle = true,
  titleText = "คำถามที่พบบ่อย (FAQ)",
  withSchema = true,
  pageUrl = "",
  accordionId = "faq-accordion",
  headingAs = "h2",
}) {
  // กรองข้อมูลที่สมบูรณ์เท่านั้น เพื่อความปลอดภัยของข้อมูล
  const safeItems = useMemo(() => {
    return Array.isArray(items) 
      ? items.filter((x) => x && x.q && x.a && String(x.q).trim() !== "" && (Array.isArray(x.a) ? x.a.length > 0 : String(x.a).trim() !== ""))
      : [];
  }, [items]);

  const HeadingTag = headingAs;

  /**
   * --- FAQ Schema Optimization ---
   * สร้าง Schema เพื่อให้ Google AI เข้าใจโครงสร้างคำถาม-คำตอบ
   */
  const faqSchema = useMemo(() => {
    if (!withSchema || !safeItems.length) return null;

    // สร้าง @id ให้คงที่ตามโครงสร้างมาตรฐาน
    const faqId = pageUrl ? `${pageUrl.replace(/\/+$/, "")}/#faq` : `#faq`;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": faqId,
      "mainEntity": safeItems.map((it) => {
        // หากเป็น Array ให้เชื่อมด้วยขึ้นบรรทัดใหม่เพื่อให้ Google Bot อ่านเข้าใจลำดับ
        const answerText = Array.isArray(it.a) ? it.a.filter(Boolean).join("\n") : String(it.a);
        return {
          "@type": "Question",
          "name": String(it.q).trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answerText.trim(),
          },
        };
      }),
    };
  }, [withSchema, safeItems, pageUrl]);

  if (!safeItems.length) return null;

  return (
    <section 
      aria-labelledby={`${accordionId}-title`} 
      className="faq-section"
      itemScope 
      itemType={withSchema ? "https://schema.org/FAQPage" : undefined}
    >
      {/* ฝัง Schema ลงใน Metadata เพื่อให้ Search Engine เก็บข้อมูลได้เร็วขึ้น */}
      {faqSchema && <JsonLd json={faqSchema} />}

      {withTitle && (
        <HeadingTag id={`${accordionId}-title`} className="fs-4 fw-bold mb-4">
          {titleText}
        </HeadingTag>
      )}

      <div className="accordion" id={accordionId}>
        {safeItems.map((it, idx) => {
          const itemId = `${accordionId}-item-${idx}`;
          const headingId = `${itemId}-heading`;
          const collapseId = `${itemId}-collapse`;
          const isFirst = idx === 0;

          return (
            <div 
              className="accordion-item" 
              key={itemId}
              itemProp="mainEntity" 
              itemScope 
              itemType="https://schema.org/Question"
            >
              <div className="accordion-header" id={headingId}>
                <button
                  className={`accordion-button ${isFirst ? "" : "collapsed"} py-3`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${collapseId}`}
                  aria-expanded={isFirst ? "true" : "false"}
                  aria-controls={collapseId}
                >
                  <span className="fw-semibold text-dark" itemProp="name">
                    {it.q}
                  </span>
                </button>
              </div>

              <div
                id={collapseId}
                className={`accordion-collapse collapse ${isFirst ? "show" : ""}`}
                aria-labelledby={headingId}
                data-bs-parent={`#${accordionId}`}
                itemProp="acceptedAnswer" 
                itemScope 
                itemType="https://schema.org/Answer"
              >
                <div className="accordion-body" itemProp="text">
                  {Array.isArray(it.a) ? (
                    <ul className="mb-0 text-muted">
                      {it.a.filter(Boolean).map((line, j) => (
                        <li key={`${itemId}-a-${j}`} className="mb-1">{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mb-0 text-muted" style={{ whiteSpace: "pre-line" }}>
                      {it.a}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}