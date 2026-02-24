// next.config.js
// ✅ ใส่เฉพาะโดเมนที่จำเป็นจริง ๆ (ไม่ต้องใส่ localhost ถ้าคุณใช้วิธี relative /uploads แล้ว)

const nextConfig = {
  images: {
    remotePatterns: [
      // YouTube thumbs (ที่คุณใช้ในโค้ด)
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      // ถ้ามีรูปจากโดเมนจริงของเว็บเป็น absolute URL ในข้อมูลบางกรณี ก็อนุญาตไว้ได้
      {
        protocol: "https",
        hostname: "myad-dev.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "myad-dev.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "gallery.myad-dev.com",
        pathname: "/api/file/**",
      },
    ],
  },
};

module.exports = nextConfig;
