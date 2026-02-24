// src/app/components/SchemaGraph.jsx
import React from "react";

export default function SchemaGraph({
  siteUrl,
  brandName,
  tagline,
  logoUrl,
  pagePath = "/",
  pageName = "",
  pageDescription = "",
  personName = "",
  personJobTitle = "",
  personImage = "",
  sameAs = [],
  telephone = "",
  email = "",
  address = null
}) {
  const cleanSite = siteUrl.replace(/\/+$/, "");
  const pageUrl = `${cleanSite}${pagePath === "/" ? "" : pagePath}`;

  const ids = {
    website: `${cleanSite}/#website`,
    webpage: `${pageUrl}#webpage`,
    org: `${cleanSite}/#organization`,
    person: `${cleanSite}/#person`,
    service: `${cleanSite}/#professionalservice`,
    logo: `${cleanSite}/#logo`,
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: cleanSite,
        name: brandName,
        description: tagline || pageDescription || "",
        publisher: { "@id": ids.org },
        inLanguage: "th-TH"
      },
      {
        "@type": "WebPage",
        "@id": ids.webpage,
        url: pageUrl,
        name: pageName || brandName,
        description: pageDescription || tagline || "",
        isPartOf: { "@id": ids.website },
        about: [{ "@id": ids.service }, { "@id": ids.org }, { "@id": ids.person }],
        primaryImageOfPage: logoUrl ? { "@id": ids.logo } : undefined,
        inLanguage: "th-TH"
      },
      {
        "@type": "ImageObject",
        "@id": ids.logo,
        url: logoUrl,
        contentUrl: logoUrl,
        caption: brandName
      },
      {
        "@type": "Person",
        "@id": ids.person,
        name: personName || brandName,
        jobTitle: personJobTitle || "Marketing Specialist",
        image: personImage || undefined,
        url: cleanSite,
        sameAs: Array.isArray(sameAs) ? sameAs : [],
        worksFor: { "@id": ids.org }
      },
      {
        "@type": "Organization",
        "@id": ids.org,
        name: brandName,
        url: cleanSite,
        logo: { "@id": ids.logo },
        founder: { "@id": ids.person },
        contactPoint: (telephone || email)
          ? [{
              "@type": "ContactPoint",
              telephone: telephone || undefined,
              email: email || undefined,
              contactType: "customer support",
              availableLanguage: ["th", "en"]
            }]
          : undefined,
        address: address || undefined,
        sameAs: Array.isArray(sameAs) ? sameAs : []
      },
      {
        "@type": "ProfessionalService",
        "@id": ids.service,
        name: `${brandName} - Professional Service`,
        url: cleanSite,
        description: tagline || "",
        provider: { "@id": ids.org },
        brand: { "@id": ids.org },      // ✅ เชื่อมด้วย @id
        founder: { "@id": ids.person }, // ✅ เชื่อมด้วย @id
        areaServed: "TH",
        inLanguage: "th-TH"
      }
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
