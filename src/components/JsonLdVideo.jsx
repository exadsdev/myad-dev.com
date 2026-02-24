// JsonLdVideo.jsx
// This component generates JSON-LD structured data for a video, including hasPart (Clip) entries based on chapters.
import React from "react";

export default function JsonLdVideo({ video }) {
    if (!video) return null;
    const {
        title,
        description,
        thumbnail,
        duration,
        uploadDate,
        author,
        transcriptHtml,
        keywords = [],
        chapters = [],
        contentUrl,
    } = video;

    // Build hasPart array from chapters if available
    const hasPart = chapters
        .filter((c) => c.t && c.label)
        .map((c, idx) => {
            // Convert timecode (HH:MM:SS or MM:SS) to seconds for startOffset
            const parts = c.t.split(":").map(Number);
            let seconds = 0;
            if (parts.length === 3) {
                seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
                seconds = parts[0] * 60 + parts[1];
            } else if (parts.length === 1) {
                seconds = parts[0];
            }
            return {
                "@type": "Clip",
                name: c.label,
                startOffset: seconds,
                // endOffset could be next chapter start or omitted
                // We'll omit endOffset for simplicity
            };
        });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title || "",
        description: description || "",
        thumbnailUrl: thumbnail || "",
        duration: duration || "PT0M",
        uploadDate: uploadDate || undefined,
        author: {
            "@type": "Person",
            name: author || "",
        },
        transcript: transcriptHtml ? transcriptHtml.replace(/<[^>]+>/g, " ") : undefined,
        keywords: keywords.join(", "),
        hasPart: hasPart.length ? hasPart : undefined,
        contentUrl: contentUrl || undefined,
    };

    // Remove undefined fields
    Object.keys(jsonLd).forEach((k) => jsonLd[k] === undefined && delete jsonLd[k]);

    return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    );
}
