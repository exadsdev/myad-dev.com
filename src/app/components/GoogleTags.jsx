"use client";

import Script from "next/script";

export default function GoogleTags() {
  const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
  const ADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const GTM = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {}
      {}
      {(GA4 || ADS) && (
        <>
          <Script
            id="gtag-lib"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4 || ADS}`}
          />
          <Script id="gtag-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${GA4 ? `gtag('config', '${GA4}', { send_page_view: true });` : ""}
              ${ADS ? `gtag('config', '${ADS}');` : ""}
              gtag('consent', 'default', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'ad_personalization': 'granted',
                'ad_user_data': 'granted'
              });
            `}
          </Script>
        </>
      )}

      {}
      {}
      {GTM && (
        <Script id="gtm-init" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM}');
          `}
        </Script>
      )}
    </>
  );
}

export function adsConversion({
  send_to = `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL || ""}`,
  value,
  currency = "THB",
  transaction_id
} = {}) {
  if (typeof window === "undefined") return;
  const payload = { send_to };
  if (value != null) payload.value = value;
  if (currency) payload.currency = currency;
  if (transaction_id) payload.transaction_id = transaction_id;
  window.gtag?.("event", "conversion", payload);
}
