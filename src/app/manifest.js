import { getSiteUrl } from "@/lib/site-url";

export default function manifest() {
  const origin = getSiteUrl();

  return {
    name: "MyAdsDev",
    short_name: "MyAdsDev",
    description:
      "MyAdsDev — บริการการตลาดออนไลน์และดูแลแคมเปญโฆษณา (Google / Meta) พร้อมโครงสร้าง SEO และการวัดผล",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#0b1220",
    icons: [
      {
        src: `${origin}/images/logo.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${origin}/images/logo.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
