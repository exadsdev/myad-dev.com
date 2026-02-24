import React from "react";
import { BRAND, SITE } from "@/app/seo.config";

const ServiceSchema = ({ serviceName, description }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    provider: {
      "@type": "Organization",
      name: BRAND,
      url: SITE,
    },
    description: description,
    areaServed: "TH",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ServiceSchema;
