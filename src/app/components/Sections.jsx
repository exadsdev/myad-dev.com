import React from "react";
import Image from "next/image";

export default function Sections() {
    return (
        <>
            {/* --- Packages Section --- */}
            <section className="container-fluid mt-5 pt-4" aria-labelledby="packages-title">
                <div className="text-center mb-5">
                    <h2 id="packages-title" className="h2 fw-bold mb-3">
                        แพ็กเกจยิงแอดสายเทา เริ่มต้นได้จริง ไม่ต้องกลัวโดนแบน
                    </h2>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: "800px" }}>
                        ทดลองใช้บริการก่อนได้ตั้งแต่ 7 วัน / 15 วัน หรือเลือกแพ็กเกจรายเดือน
                        เน้นโครงสร้างแคมเปญแข็งแรง วัดผล Conversion API รายงานทุกวัน โปร่งใส 100%
                    </p>

                    {/* Hero Image for Packages */}
                    <div className="my-4">
                        <Image
                            src="/images/home.webp"
                            alt="แดชบอร์ดผลลัพธ์จริงจากการยิงแอดสายเทา Google และ Facebook Ads โดย MyAdsDev"
                            width={1200}
                            height={675}
                            sizes="(max-width: 768px) 100vw, 1200px"
                            quality={90}
                            loading="lazy"
                            className="rounded img-fluid"
                            style={{ aspectRatio: "1200/675" }}
                        />
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4 mb-5 text-center">
                    {/* Package 1 */}
                    <div className="col">
                        <div className="card h-100 shadow border-success rounded-4 overflow-hidden">
                            <div className="card-header bg-success text-white py-4">
                                <h3 className="h5 fw-bold mb-0">ทดลองยิงแอดสายเทา 7 วัน</h3>
                            </div>
                            <div className="card-body d-flex flex-column p-4">
                                <p className="display-5 fw-bold text-success mb-3">3,500 ฿</p>
                                <ul className="list-unstyled text-start mb-4 flex-grow-1">
                                    <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i>เห็นผลลัพธ์ชัดเจนใน 7 วัน</li>
                                    <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i>รายงานผลทุกวันเวลา 10:00 น.</li>
                                    <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i>ชำระด้วยบัตรเครดิตหรือโอนเงินได้</li>
                                    <li><i className="bi bi-check2-circle text-success me-2"></i>เหมาะสำหรับทดสอบก่อนทำแพ็กยาว</li>
                                </ul>
                                <a
                                    href="https://lin.ee/UXiQ7IX"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success btn-lg w-100 mt-auto"
                                    aria-label="เริ่มทดลองยิงแอดสายเทา 7 วันผ่าน LINE ทันที"
                                >
                                    เริ่มทดลอง 7 วันวันนี้
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Package 2 */}
                    <div className="col">
                        <div className="card h-100 shadow border-info rounded-4 overflow-hidden">
                            <div className="card-header bg-info text-white py-4">
                                <h3 className="h5 fw-bold mb-0">สัมผัสผลลัพธ์ยิงแอด 15 วัน</h3>
                            </div>
                            <div className="card-body d-flex flex-column p-4">
                                <p className="display-5 fw-bold text-info mb-3">6,000 ฿</p>
                                <ul className="list-unstyled text-start mb-4 flex-grow-1">
                                    <li className="mb-2"><i className="bi bi-check2-circle text-info me-2"></i>ทดลองยาวขึ้น เห็นผลชัดเจนกว่า</li>
                                    <li className="mb-2"><i className="bi bi-check2-circle text-info me-2"></i>รายงานผลทุกวัน + ปรับแต่งเบื้องต้น</li>
                                    <li className="mb-2"><i className="bi bi-check2-circle text-info me-2"></i>ชำระด้วยบัตรเครดิตหรือโอนเงินได้</li>
                                    <li><i className="bi bi-check2-circle text-info me-2"></i>เหมาะสำหรับธุรกิจที่อยากมั่นใจก่อนคอมมิทยาว</li>
                                </ul>
                                <a
                                    href="https://lin.ee/UXiQ7IX"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-info btn-lg w-100 mt-auto"
                                    aria-label="เริ่มทดลองยิงแอดสายเทา 15 วันผ่าน LINE ทันที"
                                >
                                    เริ่มทดลอง 15 วันวันนี้
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Package 3 */}
                    <div className="col">
                        <div className="card h-100 shadow border-primary rounded-4 overflow-hidden position-relative">
                            <div className="card-header bg-primary text-white py-4">
                                <h3 className="h5 fw-bold mb-0">แพ็กเกจรายเดือนยิงแอดสายเทา</h3>
                            </div>
                            <div className="card-body d-flex flex-column p-4">
                                <p className="display-5 fw-bold text-primary mb-3">9,900 ฿</p>
                                <ul className="list-unstyled text-start mb-4 flex-grow-1">
                                    <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>ดูแลเต็ม 30 วัน + ปรับแคมเปญต่อเนื่อง</li>
                                    <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>Conversion API + รายงานผลทุกวัน</li>
                                    <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>ใช้บัตรลูกค้าเองได้ โปร่งใส 100%</li>
                                    <li><i className="bi bi-check2-circle text-primary me-2"></i>เหมาะสำหรับธุรกิจที่ต้องการผลลัพธ์ยั่งยืน</li>
                                </ul>
                                <a
                                    href="https://lin.ee/UXiQ7IX"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-lg w-100 mt-auto"
                                    aria-label="เริ่มแพ็กเกจรายเดือนยิงแอดสายเทาผ่าน LINE ทันที"
                                >
                                    เริ่มแพ็กเกจรายเดือนเลย
                                </a>
                            </div>
                            {/* Badge */}
                            <span className="position-absolute top-0 end-0 translate-middle-y badge rounded-pill bg-warning text-dark px-4 py-2 fs-5 fw-bold" style={{ transform: "translate(20%, -50%)" }}>
                                ยอดนิยม
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Services Details Section --- */}
            <section className="container-fluid py-5 bg-light" id="facebook" aria-labelledby="ads-title">
                <div className="text-center mb-5">
                    <h2 id="ads-title" className="h2 fw-bold">
                        บริการรับทำโฆษณาออนไลน์สายเทา — Facebook & Google Ads
                    </h2>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: "800px" }}>
                        ทีมงานมืออาชีพวางกลยุทธ์ สร้างครีเอทีฟ ตั้งค่า Conversion API
                        ปรับแต่งต่อเนื่อง ราคาเริ่มต้นเพียงเดือนละ 9,900 บาท
                    </p>

                    {/* Service Highlight Image */}
                    <div className="my-4">
                        <Image
                            src="/images/review.jpg"
                            alt="แดชบอร์ดและผลลัพธ์จริงจากการยิงแอด Facebook และ Google Ads สายเทา โดย MyAdsDev"
                            width={1200}
                            height={675}
                            sizes="(max-width: 768px) 100vw, 1200px"
                            quality={90}
                            loading="lazy"
                            className="rounded img-fluid"
                            style={{ aspectRatio: "1200/675" }}
                        />
                        <figcaption className="text-muted small mt-2">
                            ตัวอย่างแดชบอร์ดและผลลัพธ์จริงจากการรันโฆษณาสายเทา
                        </figcaption>
                    </div>
                </div>

                {/* Facebook Ads Article */}
                <article className="mb-5">
                    <h3 className="h4 fw-bold mb-3">บริการรับทำ Facebook Ads สายเทา</h3>
                    <p className="lead">
                        ออกแบบครีเอทีฟและกลุ่มเป้าหมายให้ผ่านนโยบายแพลตฟอร์ม
                        ตั้งค่า Conversion API + Enhanced Conversions เพื่อวัดผลแม่นยำ
                        แพ็กเกจเริ่มต้น <strong>9,900 บาท/เดือน</strong>
                    </p>
                    <ul className="list-unstyled mb-4">
                        <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>ครีเอทีฟผ่านนโยบาย + A/B Testing ต่อเนื่อง</li>
                        <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>ตั้งค่า Conversion API ให้วัดผลแม่นยำ</li>
                        <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>รายงานผลทุกวัน + ปรับแคมเปญจากข้อมูลจริง</li>
                        <li><i className="bi bi-check2-circle text-primary me-2"></i>รีวิวและเคสศึกษาจากลูกค้าจริง</li>
                    </ul>

                    <div className="mt-4">
                        <Image
                            src="/images/facebook001.jpg"
                            alt="ตัวอย่างครีเอทีฟและผลลัพธ์โฆษณา Facebook Ads สายเทา"
                            width={1200}
                            height={675}
                            sizes="(max-width: 768px) 100vw, 1200px"
                            quality={90}
                            loading="lazy"
                            className="rounded img-fluid"
                            style={{ aspectRatio: "1200/675" }}
                        />
                    </div>

                    <h4 className="h5 mt-4 mb-3">ผลงาน Facebook Ads บางส่วน (ตัวอย่างจริง)</h4>
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                        {[
                            "h0102.webp", "h0103.webp", "h0104.webp", "h0105.webp", "h0106.webp", "h0107.webp",
                            "h0108.webp", "h0109.webp", "h0110.webp", "h0111.webp", "h0112.webp", "h0113.webp",
                        ].map((file) => (
                            <div className="col" key={file}>
                                <figure className="mb-0">
                                    <img
                                        src={`/img/${file}`}
                                        alt={`ผลงาน Facebook Ads สายเทา MyAdsDev 2026 ตัวอย่าง ${file.replace(".webp", "")}`}
                                        loading="lazy"
                                        className="rounded img-fluid w-100"
                                        style={{ height: "auto" }}
                                    />
                                </figure>
                            </div>
                        ))}
                    </div>
                </article>

                <hr className="my-5" />

                {/* Google Ads Article */}
                <article id="google" aria-labelledby="google-title">
                    <h3 id="google-title" className="h4 fw-bold mb-3">บริการทำ Google Ads & SEO สายเทา</h3>
                    <p className="lead">
                        เพิ่มการมองเห็นผ่าน Search, Display, Video
                        ด้วยโครงสร้างคำค้นตอบเจตนาค้นหา + หน้าแลนดิงโหลดไว
                    </p>
                    <ul className="list-unstyled mb-4">
                        <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>โครงสร้างแคมเปญ + UTM Tracking ครบถ้วน</li>
                        <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>แดชบอร์ดสรุป ROAS และแหล่งทราฟฟิกชัดเจน</li>
                        <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>ปรับปรุงแคมเปญต่อเนื่องจากข้อมูลจริงทุกวัน</li>
                        <li><i className="bi bi-check2-circle text-primary me-2"></i>รวมเทคนิค SEO เบื้องต้นสนับสนุนแคมเปญ</li>
                    </ul>

                    <div className="mt-4">
                        <Image
                            src="/images/reviews.jpg"
                            alt="ตัวอย่างผลลัพธ์และแดชบอร์ด Google Ads & SEO สายเทา"
                            width={1200}
                            height={675}
                            sizes="(max-width: 768px) 100vw, 1200px"
                            quality={90}
                            loading="lazy"
                            className="rounded img-fluid"
                            style={{ aspectRatio: "1200/675" }}
                        />
                    </div>

                    <h4 className="h5 mt-4 mb-3">ผลงาน Google Ads บางส่วน (ตัวอย่างจริง)</h4>
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                        {Array.from({ length: 10 }, (_, i) => i + 2).map((n) => (
                            <div className="col" key={n}>
                                <figure className="mb-0">
                                    <img
                                        src={`/img-google/${n}.webp`}
                                        alt={`ผลงาน Google Ads สายเทา MyAdsDev 2026 ตัวอย่าง ${n}`}
                                        loading="lazy"
                                        className="rounded img-fluid w-100"
                                        style={{ height: "auto" }}
                                    />
                                </figure>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            {/* --- Reviews Section --- */}
            <section className="container-fluid py-5" id="reviews" aria-labelledby="reviews-title">
                <h2 id="reviews-title" className="h2 fw-bold mb-5 text-center">
                    รีวิวลูกค้าจริงจากการใช้บริการยิงแอดสายเทา
                </h2>
                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                    {[
                        "1.webp", "2.webp", "3.webp", "01.webp", "02.webp", "03.webp",
                        "reviews1.jpg", "reviews2.jpg", "reviews3.jpg", "reviews4.jpg", "reviews5.jpg", "reviews6.jpg",
                    ].map((r) => (
                        <div className="col" key={r}>
                            <figure className="mb-0">
                                <img
                                    src={`/review/${r}`}
                                    alt={`รีวิวลูกค้ายิงแอดสายเทา MyAdsDev 2026 ${r.replace(/\.(webp|jpg)$/, "")}`}
                                    loading="lazy"
                                    className="rounded img-fluid w-100"
                                    style={{ height: "auto" }}
                                />
                            </figure>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <p className="text-muted">
                        รีวิวทั้งหมดมาจากลูกค้าจริงที่ใช้บริการยิงแอดสายเทากับเรา
                    </p>
                </div>
            </section>

            {/* --- Contact / CTA Section --- */}
            <section className="container-fluid py-5 bg-primary text-white text-center" id="contact" aria-labelledby="contact-title">
                <h2 id="contact-title" className="h2 fw-bold mb-4">
                    พร้อมเริ่มยิงแอดสายเทาให้ธุรกิจคุณแล้วหรือยัง?
                </h2>
                <p className="lead mb-4">
                    คุยฟรี ไม่มีค่าใช้จ่าย — วิเคราะห์สินค้า & เสนอแผนยิงแอดสายเทาที่เหมาะกับคุณที่สุด
                </p>

                <figure className="mb-4">
                    <Image
                        src="/images/contact.webp"
                        alt="ติดต่อทีมงาน MyAdsDev เพื่อปรึกษายิงแอดสายเทาและวางแผนการตลาดออนไลน์"
                        width={1200}
                        height={675}
                        sizes="(max-width: 768px) 100vw, 1200px"
                        quality={90}
                        loading="lazy"
                        className="rounded img-fluid"
                        style={{ aspectRatio: "1200/675" }}
                    />
                </figure>

                <a
                    href="https://lin.ee/Lj4tBMs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-light btn-lg px-5 py-3 fw-bold"
                    aria-label="เพิ่มเพื่อน LINE เพื่อปรึกษาทีมงานยิงแอดสายเทาฟรี"
                >
                    🌈 เพิ่มเพื่อน LINE ปรึกษาฟรีเลย
                </a>
            </section>
        </>
    );
}