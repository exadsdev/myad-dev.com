import { BRAND, SITE } from "../seo.config";

export const metadata = {
  metadataBase: new URL(SITE),
  title: `Logout | ${BRAND}`,
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  alternates: {
    canonical: `${SITE}/logout`
  }
};

export default function Layout({ children }) {
  return children;
}
