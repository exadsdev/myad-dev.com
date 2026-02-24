import { BRAND, SITE } from "../seo.config";

export const metadata = {
  metadataBase: new URL(SITE),
  title: `Login | ${BRAND}`,
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  alternates: {
    canonical: `${SITE}/login`
  }
};

export default function Layout({ children }) {
  return children;
}
