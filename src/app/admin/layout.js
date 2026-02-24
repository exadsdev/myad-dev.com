import { BRAND, SITE } from "../seo.config";

export const metadata = {
  metadataBase: new URL(SITE),
  title: `Admin | ${BRAND}`,
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  alternates: {
    canonical: `${SITE}/admin`
  }
};

export default function Layout({ children }) {
  return children;
}
