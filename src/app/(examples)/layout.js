import { BRAND, SITE } from "../seo.config";

export const metadata = {
  metadataBase: new URL(SITE),
  title: `Thank You | ${BRAND}`,
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  alternates: {
    canonical: `${SITE}/(examples)`
  }
};

export default function Layout({ children }) {
  return children;
}
