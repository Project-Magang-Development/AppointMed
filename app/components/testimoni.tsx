"use client";
import React from "react";
import { Flex } from "antd";
import Marquee from "react-fast-marquee";

// Data testimonials
const testimonials = [
  {
    testimoni:
      " AppointMe ini platformnya gampang dipake, bikin ngurus reservasi dan jadwal  jadi gampang. Supportnya juga cepet dan helpful. Pokoknya bikin hidup santai!",
    nama_customer: "Kusuma",
    jenis_rental: "Klinik Sehati",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "Saya suka sekali dengan AppointMe. Interface-nya user-friendly dan proses booking sangat cepat. Customer service mereka selalu siap membantu",
    nama_customer: "Gekmas",
    jenis_rental: "Klinik Kami",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "Menggunakan AppointMe untuk pertama kali dan saya sangat terkesan. Semuanya mudah dan jelas. Pasti akan pakai lagi!",
    nama_customer: "Manik",
    jenis_rental: "Klinik Sehati",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "Platform ini sangat membantu dalam mengatur jadwal saya. Tidak perlu repot lagi, semuanya terorganisir dengan baik.",
    nama_customer: "Diah",
    jenis_rental: "Klinik Sehati",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "AppointMe benar-benar mengubah cara saya menyewa barang. Prosesnya simpel dan efisien. Highly recommended!",
    nama_customer: "Dewantara",
    jenis_rental: "Klinik Kami",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "Sangat puas dengan layanan AppointMe. Booking menjadi lebih mudah dan cepat. Support mereka juga sangat responsif.",
    nama_customer: "Mahalini",
    jenis_rental: "Klinik Sehati",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
];

const testimonial2 = [
  {
    testimoni:
      "Pengalaman saya dengan AppointMe sangat positif. Platform ini sangat intuitif dan memudahkan segala kebutuhan saya.",
    nama_customer: "Bambang",
    jenis_rental: "Klinik Sehati",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "Layanan customer support mereka luar biasa! Sangat cepat merespons dan membantu menyelesaikan masalah saya.",
    nama_customer: "Linda",
    jenis_rental: "Klinik Kami",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "AppointMe menyediakan berbagai pilihan yang saya butuhkan. Semuanya bisa diakses dengan mudah dan tanpa ribet.",
    nama_customer: "Mahardika",
    jenis_rental: "Klinik Sehati",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "Tidak ada lagi stres dalam mengatur penyewaan barang. AppointMe membuat semuanya jadi simpel.",
    nama_customer: "Rakasiwi",
    jenis_rental: "Klinik Sehati",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "Sangat praktis! Proses reservasi barang kini bisa dilakukan dengan beberapa klik saja. Terima kasih, AppointMe!",
    nama_customer: "Mika",
    jenis_rental: "Klinik Kami",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
  {
    testimoni:
      "Dengan AppointMe, saya tidak perlu khawatir lagi soal ketersediaan barang. Selalu ada pilihan yang tersedia.",
    nama_customer: "Luna",
    jenis_rental: "Klinik Sehati",
    icon_avatar: "https://hpsnf.com/wp-content/uploads/2021/04/avatar.jpg",
  },
];

const Testimonials = () => {
  return (
    <Flex vertical>
      <Marquee direction="left" gradient={false} speed={110}>
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              marginRight: "50px",
              padding: "20px",
              background: "#FFFFFF",
              borderRadius: "10px",
              width: "380px",
              height: "170px",
              textAlign: "center",
              border: "1px solid #E5E5E5",
            }}
          >
            <Flex vertical justify="space-around">
              <Flex>
                <p
                  style={{
                    textAlign: "left",
                    maxWidth: "100%",
                    textWrap: "balance",
                    fontStyle: "italic",
                  }}
                >
                  {testimonial.testimoni}
                </p>
              </Flex>
              <Flex gap={20} justify="space-between">
                <Flex vertical align="start">
                  <p style={{ fontWeight: "bold" }}>
                    {testimonial.nama_customer}
                  </p>
                  <p style={{ fontStyle: "italic" }}>
                    {testimonial.jenis_rental}
                  </p>
                </Flex>
                <img
                  src={testimonial.icon_avatar}
                  alt={testimonial.nama_customer}
                  draggable="false"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginBottom: "10px",
                  }}
                />
              </Flex>
            </Flex>
          </div>
        ))}
      </Marquee>
      <Marquee
        style={{ marginTop: "45px" }}
        direction="right"
        gradient={false}
        speed={110}
      >
        {testimonial2.map((testimonial, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              marginRight: "50px",
              padding: "20px",
              background: "#FFFFFF",
              borderRadius: "10px",
              width: "380px",
              height: "170px",
              textAlign: "center",
              border: "1px solid #E5E5E5",
            }}
          >
            <Flex vertical justify="space-around">
              <Flex>
                <p
                  style={{
                    textAlign: "left",
                    maxWidth: "100%",
                    textWrap: "balance",
                    fontStyle: "italic",
                  }}
                >
                  {testimonial.testimoni}
                </p>
              </Flex>
              <Flex gap={20} justify="space-between">
                <Flex vertical align="start">
                  <p style={{ fontWeight: "bold" }}>
                    {testimonial.nama_customer}
                  </p>
                  <p style={{ fontStyle: "italic" }}>
                    {testimonial.jenis_rental}
                  </p>
                </Flex>
                <img
                  src={testimonial.icon_avatar}
                  alt={testimonial.nama_customer}
                  draggable="false"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginBottom: "10px",
                  }}
                />
              </Flex>
            </Flex>
          </div>
        ))}
      </Marquee>
    </Flex>
  );
};

export default Testimonials;
