"use client";

import GoogleAdsConversion from "@/app/components/GoogleAdsConversion";

export default function ThankYouPage() {
  const orderId = "ORDER-12345"; // replace with your real txn id

  return (
    <>
      <GoogleAdsConversion value={1990} currency="THB" transactionId={orderId} />
      <section className="py-5 text-center">
        <h1 className="mb-3">ขอบคุณสำหรับการสั่งซื้อ</h1>
        <p>ระบบได้บันทึกคำสั่งซื้อเรียบร้อยแล้ว เลขที่คำสั่งซื้อ: {orderId}</p>
      </section>
    </>
  );
}
