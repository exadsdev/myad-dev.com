"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GoogleAnalytics({ gaId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId) return;
    if (typeof window === "undefined") return;
    if (!window.gtag) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    window.gtag("config", gaId, { page_path: url });
  }, [gaId, pathname, searchParams]);

  return null;
}
