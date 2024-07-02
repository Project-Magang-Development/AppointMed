"use client";
import Navbar from "@/app/components/Navbar";
import FooterSection from "@/app/components/footer";
import Section from "@/app/components/revealAnimation";
import { Col, Flex, Row } from "antd";
import React, { CSSProperties } from "react";

const Fitur = () => {
  return (
    <>
      <Navbar />

      <Section>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "-350px",
              zIndex: "-1",
              right: "0",
              left: " 0",
              bottom: "0",
            }}
          >
            <img style={{ width: "100%" }} src="/wave/wave7.svg" alt="" />
          </div>

          <Flex vertical justify="center" align="center">
            <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>Fitur</h1>
            <p style={{ fontSize: "15px", textAlign: "center" }}>
              Platform kami menawarkan serangkaian layanan untuk mengoptimalkan{" "}
              <br />
              operasional klinik Anda
            </p>
          </Flex>
          {/* card 1*/}
          <Flex
            flex={1}
            wrap="wrap"
            justify="center"
            gap={20}
            style={{ marginTop: "20px" }}
          >
            {/* fitur 1 */}
            <Flex
              wrap="wrap"
              vertical
              style={{
                backgroundColor: "white",
                borderRadius: "25px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                width: "360px",
                height: "500px",
                padding: "20px",
              }}
            >
              <Flex justify="center">
                <img width={300} src="/image/fiturpage1.png" alt="" />
              </Flex>
              <Flex vertical gap={10}>
                <p
                  style={{
                    color: "#007E85",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  Reservasi Online Via Website
                </p>

                <ul>
                  <li style={{ listStyle: "inside" }}>
                    Reservasi janji temu dengan dokter secara online
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Pasien dapat memilih dokter, tanggal, dan waktu sesuai
                    kebutuhan mereka
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Sistem akan secara otomatis memeriksa ketersediaan dokter
                  </li>
                </ul>
              </Flex>
            </Flex>
            {/* fitur 2 */}
            <Flex
              vertical
              style={{
                backgroundColor: "white",
                borderRadius: "25px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                width: "360px",
                height: "500px",
                padding: "20px",
              }}
            >
              <Flex justify="center">
                <img width={300} src="/image/fiturpage2.png" alt="" />
              </Flex>
              <Flex vertical gap={10}>
                <p
                  style={{
                    color: "#007E85",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  Nomor Antrian Otomatis
                </p>

                <ul>
                  <li style={{ listStyle: "inside" }}>
                    Pasien akan menerima nomor antrian otomatis setelah
                    melakukan transaksi pembayaran
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Staff klinik akan memanggil pasien berdasarkan nomor antrian
                    yang tertera pada sistem
                  </li>
                </ul>
              </Flex>
            </Flex>
            {/* fitur 3*/}
            <Flex
              vertical
              style={{
                backgroundColor: "white",
                borderRadius: "25px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                width: "360px",
                height: "500px",
                padding: "20px",
              }}
            >
              <Flex justify="center">
                <img width={300} src="/image/fiturpage3.png" alt="" />
              </Flex>
              <Flex vertical gap={10}>
                <p
                  style={{
                    color: "#007E85",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  Pengingat Janji Temu
                </p>

                <ul>
                  <li style={{ listStyle: "inside" }}>
                    Pasien akan menerima pengingat janji temu lewat email satu
                    jam sebelum jadwal
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Dapat membantu mengurangi risiko pasien yang lupa dengan
                    janji temu mereka
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Klinik dapat mengurangi jumlah janji temu yang terlewatkan
                    dan menghemat waktu
                  </li>
                </ul>
              </Flex>
            </Flex>
          </Flex>
          {/* card 2*/}
          <Flex
            flex={1}
            wrap="wrap"
            justify="center"
            gap={20}
            style={{ marginTop: "20px" }}
          >
            {/* fitur 1 */}
            <Flex
              vertical
              style={{
                backgroundColor: "white",
                borderRadius: "25px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                width: "400px",
                height: "500px",
                padding: "20px",
              }}
            >
              <Flex justify="center">
                <img src="/image/fiturpage4.png" alt="" />
              </Flex>
              <Flex vertical gap={10}>
                <p
                  style={{
                    color: "#007E85",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  Manajemen Data Dokter
                </p>

                <ul>
                  <li style={{ listStyle: "inside" }}>
                    Kelola data dan jadwal dokter Anda dengan mudah
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Tambahkan informasi profil dokter, keahlian, dan
                    ketersediaan waktu
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Pastikan pasien dapat menemukan dokter yang tepat untuk
                    kebutuhan mereka
                  </li>
                </ul>
              </Flex>
            </Flex>
            {/* fitur 2 */}
            <Flex
              vertical
              style={{
                backgroundColor: "white",
                borderRadius: "25px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                width: "360px",
                height: "500px",
                padding: "20px",
              }}
            >
              <Flex justify="center">
                <img width={300} src="/image/fiturpage5.png" alt="" />
              </Flex>
              <Flex vertical gap={10}>
                <p
                  style={{
                    color: "#007E85",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  Dashboard Klinik
                </p>

                <ul>
                  <li style={{ listStyle: "inside" }}>
                    Klinik dapat melihat gambaran umum tentang kinerja klinik
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Klinik dapat melacak jumlah reservasi, pasien, dan
                    pendapatan
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Klinik dapat mengidentifikasi area yang perlu ditingkatkan
                  </li>
                </ul>
              </Flex>
            </Flex>
            {/* fitur 3*/}
            <Flex
              vertical
              style={{
                backgroundColor: "white",
                borderRadius: "25px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                width: "360px",
                height: "500px",
                padding: "20px",
              }}
            >
              <Flex justify="center">
                <img width={300} src="/image/fiturpage6.png" alt="" />
              </Flex>
              <Flex vertical gap={10}>
                <p
                  style={{
                    color: "#007E85",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  Sistem Payment Gateway
                </p>

                <ul>
                  <li style={{ listStyle: "inside" }}>
                    Pasien akan membayar biaya janji temu secara online dengan
                    beragam metode pembayaran
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Membantu klinik menerima pembayaran lebih cepat dan mudah,
                    serta mengurangi risiko penipuan
                  </li>
                  <li style={{ listStyle: "inside" }}>
                    Uang pasien akan dikembalikan apabila melakukan pembatalan
                    janji
                  </li>
                </ul>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </Section>
      <FooterSection />
    </>
  );
};

export default Fitur;
