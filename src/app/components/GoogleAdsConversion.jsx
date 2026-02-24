"use client";

import { useEffect } from "react";
import { adsConversion } from "./GoogleTags";

export default function GoogleAdsConversion({
  value,
  currency = "THB",
  transactionId
}) {
  useEffect(() => {
    adsConversion({
      value,
      currency,
      transaction_id: transactionId
    });
  }, [value, currency, transactionId]);

  return null;
}
