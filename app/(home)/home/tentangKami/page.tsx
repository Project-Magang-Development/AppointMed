"use client";
import Navbar from "@/app/components/Navbar";
import FooterSection from "@/app/components/footer";
import Section from "@/app/components/revealAnimation";
import { Button, Col, Flex, Row } from "antd";
import { Footer } from "antd/es/layout/layout";
import { useInView } from "framer-motion";
import Link from "next/link";
import React, { CSSProperties, useRef } from "react";

const TentangKami = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const serviceBoxStyle: CSSProperties = {
    textAlign: "center",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "20px",
    backgroundColor: "white",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const rowStyle: CSSProperties = {
    marginBottom: "20px",
  };
  return (
    <>
      <Navbar />
      <div style={{ position: "relative", zIndex: "1" }}>
        {/* 1 */}
        <Section>
          <Flex
            justify="space-between"
            wrap={"wrap"}
            style={{
              paddingInline: "25px",
              paddingTop: "10px",
              zIndex: "1",
              marginBottom: "17rem",
            }}
          >
            <Flex flex={1} style={{ minWidth: "250px" }} justify="center">
              <img
                width={300}
                src="/image/tentangkami1.svg"
                alt="gambar tentang kami"
              />
            </Flex>
            <Flex vertical gap={20} flex={2} className="head-ten">
              <h1
                className="head-t"
                style={{ fontSize: "35px", color: "white", fontWeight: "bold" }}
              >
                Tentang Kami
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  marginBottom: "1.5rem",
                  textAlign: "justify",
                }}
              >
                AppointMed adalah sebuah Software as a Service (SaaS) yang
                dirancang untuk membantu dalam klinik mengelola reservasi
                pasien, data pasien, dokter, antrian otomatis, kalender dokter,
                dashboard klinik, pengingat janji temu, dan payment gateway.
                Dengan AppointMed, klinik dapat meningkatkan efisiensi, kepuasan
                pasien, dan citra profesional. Klinik juga dapat menghemat waktu
                dan meningkatkan efisiensi dengan mudah dalam mengelola
                reservasi, data pasien, dan dokter.
              </p>

              <Flex vertical gap={10}>
                <p style={{ fontSize: "15px" }}>
                  Mulai gunakan AppointMed hari ini dan rasakan manfaatnya!
                </p>
                <Flex wrap="wrap" gap={20} className="button-tentangKami">
                  <Link href="/home/pricing">
                    <Button
                      style={{
                        backgroundColor: "#007E85",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Gabung Sekarang
                    </Button>
                  </Link>
                  <p
                    style={{
                      fontSize: "15px",

                      textAlign: "center",
                    }}
                  >
                    atau
                  </p>
                  <Link href={"/home/Kontak"}>
                    <Button
                      className="button-tentangKami"
                      style={{ border: "1px solid #007E85", color: "#007E85" }}
                    >
                      Hubungi Kami
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </Flex>
            <div
              className="wave-tentangKami"
              style={{
                position: "absolute",
                top: "-5%",
                zIndex: "-1",
                right: "0",
                left: " 0",
              }}
            >
              <img style={{ width: "100%" }} src="/wave/wave5.svg" alt="" />
            </div>
          </Flex>
        </Section>

        <Section>
          {/* 2 */}
          <Flex vertical>
            <Flex
              vertical
              justify="center"
              align="center"
              style={{ marginBottom: "2rem" }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  color: "#007E85",
                  fontWeight: "600",
                }}
              >
                Layanan Kami
              </p>
              <p
                style={{
                  fontSize: "25px",
                  color: "#007E85",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Segera bergabung dan rasakan manfaat menggunakan layanan kamii
              </p>
              <div
                style={{
                  width: "84px",
                  height: "4px",
                  backgroundColor: "#FFB573",
                }}
              ></div>
            </Flex>
            <Flex vertical>
              <Row
                justify="center"
                align="middle"
                gutter={[20, 20]}
                style={{ paddingInline: "20px" }}
              >
                <Col xs={24} sm={12} md={8} lg={6}>
                  <div style={{ ...serviceBoxStyle, height: "240px" }}>
                    <img width={30} src="/icons/checklist.svg" alt="" />
                    <p
                      style={{
                        color: "#007E85",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Manajemen Reservasi Mudah
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      Memudahkan pasien untuk membuat janji temu secara online
                      tanpa perlu menghubungi klinik langsung, sehingga
                      meningkatkan kenyamanan dan kepuasan pasien
                    </p>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <div style={{ ...serviceBoxStyle, height: "240px" }}>
                    <img width={30} src="/icons/checklist.svg" alt="" />
                    <p
                      style={{
                        color: "#007E85",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Data Pasien Terorganisir
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      Menyimpan dan mengelola data pasien dengan rapi dan aman,
                      memudahkan akses dan pengelolaan informasi penting lainnya
                    </p>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <div style={{ ...serviceBoxStyle, height: "240px" }}>
                    <img width={30} src="/icons/checklist.svg" alt="" />
                    <p
                      style={{
                        color: "#007E85",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Penjadwalan Dokter Efisien
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      Memastikan jadwal dokter selalu terupdate dan tersedia,
                      sehingga mengurangi konflik jadwal dan memaksimalkan waktu
                      konsultasi
                    </p>
                  </div>
                </Col>
              </Row>

              <Row
                justify="center"
                align="middle"
                gutter={[20, 20]}
                style={{ marginTop: "20px", paddingInline: "20px" }}
              >
                <Col xs={24} sm={12} md={{ span: 12 }} lg={{ span: 9 }}>
                  <div style={{ ...serviceBoxStyle, height: "240px" }}>
                    <img width={30} src="/icons/checklist.svg" alt="" />
                    <p
                      style={{
                        color: "#007E85",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Laporan Otomatis dan Akurat
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      Memberikan laporan real-time mengenai kinerja klinik,
                      jumlah pasien, dan pendapatan klinik yang memudahkan
                      pengambilan keputusan strategis
                    </p>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={{ span: 12 }} lg={{ span: 9 }}>
                  <div style={{ ...serviceBoxStyle, height: "240px" }}>
                    <img width={30} src="/icons/checklist.svg" alt="" />
                    <p
                      style={{
                        color: "#007E85",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Profil Dokter Tersentralisasi
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      Mengelola informasi dokter secara terpusat sehingga mudah
                      diakses oleh staf klinik dan pasien, memastikan informasi
                      terkini mengenai spesialisasi dan ketersediaan dokter
                    </p>
                  </div>
                </Col>
              </Row>

              <Row
                justify="center"
                align="middle"
                gutter={[20, 20]}
                style={{ marginTop: "20px", paddingInline: "20px" }}
              >
                <Col xs={24} sm={12} md={8} lg={6}>
                  <div style={{ ...serviceBoxStyle, height: "240px" }}>
                    <img width={30} src="/icons/checklist.svg" alt="" />
                    <p
                      style={{
                        color: "#007E85",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Manajemen Reservasi Mudah
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      Memudahkan pasien untuk membuat janji temu secara online
                      tanpa perlu menghubungi klinik langsung, sehingga
                      meningkatkan kenyamanan dan kepuasan pasien
                    </p>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <div style={{ ...serviceBoxStyle, height: "240px" }}>
                    <img width={30} src="/icons/checklist.svg" alt="" />
                    <p
                      style={{
                        color: "#007E85",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Data Pasien Terorganisir
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      Menyimpan dan mengelola data pasien dengan rapi dan aman,
                      memudahkan akses dan pengelolaan informasi penting lainnya
                    </p>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <div style={{ ...serviceBoxStyle, height: "240px" }}>
                    <img width={30} src="/icons/checklist.svg" alt="" />
                    <p
                      style={{
                        color: "#007E85",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Penjadwalan Dokter Efisien
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      Memastikan jadwal dokter selalu terupdate dan tersedia,
                      sehingga mengurangi konflik jadwal dan memaksimalkan waktu
                      konsultasi
                    </p>
                  </div>
                </Col>
              </Row>
            </Flex>
          </Flex>
        </Section>
      </div>
      <FooterSection />
    </>
  );
};

export default TentangKami;
