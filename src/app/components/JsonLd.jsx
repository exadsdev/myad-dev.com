import React from "react";

export default function JsonLd({ data, json }) {
  const schema = data || json;

  if (!schema) {
    return null;
  }

  const jsonString = JSON.stringify(schema, null, 0);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
