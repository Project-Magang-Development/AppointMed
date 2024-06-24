"use client";

import React from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Card,
  Flex,
  Space,
} from "antd";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import YouTubeEmbed from "@/app/components/youtubeEmbed";
import Testimonials from "@/app/components/testimoni";
import Accordion from "@/app/components/accordion";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Flex vertical style={{ overflow: "hidden" }}>
      <Navbar />
      <Layout
        style={{
          background: "#FFFFFF",
          paddingTop: "1rem",
        }}
      >
        <Content style={{ paddingTop: "1.5rem" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              // border: "1px solid black",
              height: "auto",
              zIndex: 1,
            }}
          >
            {/* main section */}
            <Flex
              justify="center"
              align="center"
              style={{ width: "100%", paddingInline: "35px" }}
              gap={32}
              wrap={"wrap-reverse"}
            >
              <Flex
                flex={1.5}
                wrap={"wrap-reverse"}
                style={{ textAlign: "justify" }}
                vertical
              >
                <Title
                  style={{
                    fontSize: "25px",
                    fontWeight: "bold",
                    position: "relative",
                  }}
                >
                  Tingkatkan Efisiensi{" "}
                  <span
                    style={{
                      color: "#007E85",
                      zIndex: 1,
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    Klinik
                    <img
                      loading="lazy"
                      src="/image/shape.svg"
                      alt=""
                      width={100}
                      style={{
                        position: "absolute",
                        objectFit: "fill",
                        height: "auto",
                        right: "0px",
                        top: "18px",
                        zIndex: -1,
                      }}
                    />
                  </span>{" "}
                  Anda dengan Sistem <br /> Reservasi Online
                </Title>
                <Paragraph style={{ fontWeight: 600 }}>
                  Optimalkan pelayanan pelanggan dengan Sistem Booking
                  RentalinAja. Berikan kemudahan pada pelanggan untuk memesan
                  secara online.
                </Paragraph>
                <Space size="middle" style={{ marginTop: "2.5rem" }}>
                  <Button
                    style={{
                      backgroundColor: "#007E85",
                      color: "white",
                      minWidth: "50%",
                    }}
                    size="large"
                  >
                    Gabung Sekarang
                  </Button>
                  <Button
                    style={{
                      borderColor: "#007E85",
                      color: "#007E85",
                      minWidth: "50%",
                    }}
                    size="large"
                  >
                    Uji Coba Gratis
                  </Button>
                </Space>
              </Flex>

              <Flex justify="center" align="center" style={{}}>
                <img
                  loading="lazy"
                  draggable={false}
                  src="/image/doctor.svg"
                  alt="doctor"
                  style={{
                    objectFit: "contain",
                    maxWidth: "60%",
                    height: "auto",
                  }}
                />
              </Flex>
            </Flex>

            <Flex
              wrap={"wrap"}
              justify="center"
              align="center"
              style={{ zIndex: 1, marginTop: "5.8rem" }}
            >
              <Flex
                justify="center"
                align="center"
                vertical
                style={{ padding: "20px" }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "27px",
                    color: "#007E85",
                  }}
                >
                  99 <span style={{ color: "#53A6A8" }}>%</span>
                </p>
                <Paragraph
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    margin: "0px",
                  }}
                >
                  Kepuasan Pengguna
                </Paragraph>
              </Flex>
              <Flex
                justify="center"
                align="center"
                vertical
                style={{ padding: "20px" }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "27px",
                    color: "#007E85",
                  }}
                >
                  15 <span style={{ color: "#53A6A8" }}>k</span>
                </p>
                <Paragraph
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    margin: "0px",
                  }}
                >
                  Total Berlangganan
                </Paragraph>
              </Flex>
              <Flex
                justify="center"
                align="center"
                vertical
                style={{ padding: "20px" }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "27px",
                    color: "#007E85",
                  }}
                >
                  12 <span style={{ color: "#53A6A8" }}>k</span>
                </p>
                <Paragraph
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    margin: "0px",
                  }}
                >
                  Pengguna Baru Perbulan
                </Paragraph>
              </Flex>
            </Flex>
            <Flex justify="end">
              {/* //? Wave 1 */}
              <img
                loading="lazy"
                className="wave1"
                width={1000}
                style={{
                  position: "absolute",
                  zIndex: -1, // Ensure wave is behind other content
                  bottom: "-8.5%",
                  // Position at the bottom
                  objectFit: "cover",
                  display: "inline-block",
                }}
                src="/wave/wave1.svg"
                alt=""
              />
            </Flex>
          </div>

          {/* Video Embed Section */}
          <div style={{ position: "relative", width: "100%" }}>
            <Flex
              vertical
              justify="center"
              align="center"
              gap={5}
              style={{ marginBlock: "5.5rem", padding: "20px", zIndex: 1 }}
            >
              <p
                style={{
                  margin: "0px",
                  fontWeight: "bold",
                  fontSize: "25px",
                  fontFamily: "Lato",
                  color: "#007E85",
                  textAlign: "center",
                }}
              >
                Video Cara Penggunaan Sistem
              </p>
              <div
                style={{
                  width: "84px",
                  height: "4px",
                  backgroundColor: "#FFB573",
                }}
              ></div>
              <div
                style={{
                  zIndex: 2,
                  marginTop: "15px",
                  boxShadow: "0px 0px 10px 0px #00000028",
                  height: "auto",
                  width: "60%",
                  maxWidth: "50%",
                  minWidth: "300px",
                  borderRadius: "20px",
                  padding: "20px",
                  position: "relative",
                  backgroundColor: "white",
                }}
              >
                <div style={{ borderRadius: "20px", overflow: "hidden" }}>
                  <YouTubeEmbed videoId="oh0RQ_TgDnQ" />
                </div>
              </div>
            </Flex>
            {/* //?Wave 2 */}
            <img
              loading="lazy"
              draggable={false}
              style={{
                position: "absolute",
                bottom: "-96%", // Adjust the bottom position as needed
                left: "0",
                width: "100%",
                height: "auto",
                zIndex: 0, // Ensure wave is behind other content
              }}
              src="/wave/wave2.svg"
              alt="wave"
            />
          </div>

          {/* Feature Section */}
          <Flex vertical gap={20} style={{ zIndex: 3 }} align="center">
            <Flex
              vertical
              justify="center"
              align="center"
              style={{ zIndex: 1, marginBottom: "50px" }}
            >
              <p
                style={{
                  margin: "0px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  fontFamily: "Lato",
                  color: "#007E85",
                }}
              >
                Fitur Kami
              </p>
              <p
                style={{
                  textAlign: "center",
                  margin: "0px",
                  fontWeight: "bold",
                  fontSize: "25px",
                  fontFamily: "Lato",
                  color: "#007E85",
                }}
              >
                Dapatkan Solusi Terbaik untuk Reservasi Klinik Anda!
              </p>
              <div
                style={{
                  width: "84px",
                  height: "4px",
                  backgroundColor: "#FFB573",
                }}
              ></div>
            </Flex>
            <Flex vertical gap={90} align="center">
              {/* //?Section 1 : reservasi */}
              <Flex
                gap={10}
                style={{ zIndex: 1 }}
                wrap={"wrap"}
                justify="center"
              >
                <Flex justify="center" wrap={"wrap"}>
                  <img
                    loading="lazy"
                    src="/image/fitur1.png"
                    alt="Fitur 1"
                    draggable={false}
                    width={400}
                    style={{ objectFit: "contain" }}
                  />
                </Flex>
                <Flex
                  vertical
                  wrap={"wrap"}
                  style={{ padding: "20px", flexBasis: "400px" }}
                >
                  <span
                    style={{
                      textAlign: "center",
                      backgroundColor: "#007E85",
                      paddingInline: "12px",
                      paddingBlock: "5px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: "white",
                      width: "105px",
                      marginBottom: "10px",
                    }}
                  >
                    Untuk pasien
                  </span>
                  <p
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontFamily: "Lato",
                      fontSize: "25px",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        textAlign: "center",
                        backgroundColor: "#FFDC60",
                        paddingInline: "10px",
                        borderRadius: "30px",
                      }}
                    >
                      RESERVASI
                    </span>{" "}
                    ONLINE CEPAT & EFISIEN
                  </p>
                  <p style={{ fontSize: "15px", marginBottom: "20px" }}>
                    Pasien Anda bisa melakukan reservasi online melalui website
                    kapan saja dan di mana saja
                  </p>
                  <Flex vertical gap={20} wrap={"wrap"}>
                    {/* reservasi1 */}
                    <Flex gap={10}>
                      <img
                        width={50}
                        loading="lazy"
                        src="/icons/reserve1.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                          Tentukan Waktu
                        </p>
                        <p style={{ fontSize: "12px" }}>
                          Pasien bisa menentukan tanggal dan jam temu dokter
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi2 */}
                    <Flex gap={10}>
                      <img
                        width={50}
                        loading="lazy"
                        src="/icons/reserve2.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                          Pilih Dokter
                        </p>
                        <p style={{ fontSize: "12px" }}>
                          Pasien bisa memilih dokter yang diinginkan
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi3 */}
                    <Flex gap={10}>
                      <img
                        width={50}
                        loading="lazy"
                        src="/icons/reserve3.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                          Dapatkan Nomor Antrian
                        </p>
                        <p style={{ fontSize: "12px" }}>
                          Pasien akan mendapatkan nomor antrian setelah
                          melakukan reservasi
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi4 */}
                    <Flex gap={10}>
                      <img
                        width={50}
                        loading="lazy"
                        src="/icons/reserve4.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                          Notifikasi Janji Temu
                        </p>
                        <p style={{ fontSize: "12px" }}>
                          Pasien Anda juga akan mendapatkan notifikasi sebelum
                          waktu janji temu dokter
                        </p>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              {/* //?Section Fitur 2 */}
              <Flex
                gap={10}
                style={{ zIndex: 1 }}
                wrap={"wrap-reverse"}
                justify="center"
              >
                <Flex
                  vertical
                  gap={10}
                  style={{ zIndex: 1, flexBasis: "500px", padding: "20px" }}
                  wrap={"wrap"}
                  justify="center"
                >
                  <span
                    style={{
                      textAlign: "center",
                      backgroundColor: "#007E85",
                      paddingInline: "12px",
                      paddingBlock: "5px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: "white",
                      width: "105px",
                      marginBottom: "10px",
                    }}
                  >
                    Untuk pasien
                  </span>
                  <p
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontFamily: "Lato",
                      fontSize: "25px",
                    }}
                  >
                    SISTEM
                    <span
                      style={{
                        color: "white",
                        textAlign: "center",
                        backgroundColor: "#FFDC60",
                        paddingInline: "10px",
                        borderRadius: "30px",
                      }}
                    >
                      PAYMENT GATEAWAY
                    </span>{" "}
                    <br />
                    UNTUK KEMUDAHAN BERTRANSAKSI
                  </p>
                  <p style={{ fontSize: "15px", marginBottom: "20px" }}>
                    Fasilitasi transaksi pembayaran secara online dengan
                    menghubungkan situs web dengan bank atau lembaga keuangan
                    yang memproses pembayaran
                  </p>
                  <Flex gap={20} vertical>
                    <Flex gap={25} justify="center">
                      <img
                        width={50}
                        loading="lazy"
                        src="/icons/stop.svg"
                        alt=""
                      />
                      <img
                        loading="lazy"
                        width={150}
                        src="/icons/curve.svg"
                        alt=""
                      />
                      <img
                        width={50}
                        loading="lazy"
                        src="/icons/search.svg"
                        alt=""
                      />
                    </Flex>
                    <Flex gap={10} justify="space-around">
                      <Flex vertical justify="center" gap={10}>
                        <p
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "18px",
                          }}
                        >
                          Mengurangi Risiko Pembatalan
                        </p>
                        <p style={{ textAlign: "center", fontSize: "11px" }}>
                          Payment gateaway dapat mengurangi risiko pembatalan
                          atau pengembalian dana, karena pelanggan telah
                          melakukan pembayaran terlebih dahulu
                        </p>
                      </Flex>
                      <Flex vertical justify="center" gap={10}>
                        <p
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "20px",
                          }}
                        >
                          Pelacakan dan Pelaporan
                        </p>
                        <p style={{ textAlign: "center", fontSize: "12px" }}>
                          Memberikan kemampuan untuk melacak dan melaporkan
                          semua transaksi yang dilakukan melalui sistem
                        </p>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
                {/* gambar fitur 2 */}
                <Flex>
                  <img
                    loading="lazy"
                    src="/image/fitur2.png"
                    width={400}
                    draggable={false}
                    style={{ objectFit: "contain" }}
                    alt="Fitur 2"
                  />
                </Flex>
              </Flex>
              {/* //?Section Fitur 3 */}
              <Flex
                gap={10}
                style={{ zIndex: 1 }}
                wrap={"wrap"}
                justify="center"
              >
                <Flex justify="center" wrap={"wrap"} style={{ padding: "5px" }}>
                  <img
                    src="/image/fitur3.png"
                    alt="fitur3"
                    width={530}
                    loading="lazy"
                    style={{ objectFit: "contain" }}
                  />
                </Flex>
                <Flex
                  vertical
                  wrap={"wrap"}
                  style={{ padding: "20px", flexBasis: "400px" }}
                >
                  <span
                    style={{
                      textAlign: "center",
                      backgroundColor: "#007E85",
                      paddingInline: "12px",
                      paddingBlock: "5px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: "white",
                      width: "105px",
                      marginBottom: "10px",
                    }}
                  >
                    Untuk Klinik
                  </span>
                  <p
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontFamily: "Lato",
                      fontSize: "25px",
                    }}
                  >
                    KELOLA
                    <span
                      style={{
                        color: "white",
                        textAlign: "center",
                        backgroundColor: "#FFDC60",
                        paddingInline: "10px",
                        borderRadius: "30px",
                      }}
                    >
                      DASHBOARD
                    </span>{" "}
                    ADMIN KAPAN SAJA
                  </p>
                  <p style={{ fontSize: "15px", marginBottom: "20px" }}>
                    Dashboard Admin dapat membantu mengelola tugas dan
                    meningkatkan efisiensi dalam praktik klinik Anda.
                  </p>
                  <Flex vertical gap={20} wrap={"wrap"}>
                    {/* reservasi1 */}
                    <Flex gap={10}>
                      <img
                        width={30}
                        loading="lazy"
                        src="/icons/checklist.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontSize: "14px" }}>
                          Lihat perkembangan jumlah pasien dan pendapanan klinik
                          Anda
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi2 */}
                    <Flex gap={10}>
                      <img
                        width={30}
                        loading="lazy"
                        src="/icons/checklist.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontSize: "14px" }}>
                          Pengingat antrian pasien setiap harinya
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi3 */}
                    <Flex gap={10}>
                      <img
                        width={30}
                        loading="lazy"
                        src="/icons/checklist.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontSize: "14px" }}>
                          Statistik pendapatan klinik
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi4 */}
                    <Flex gap={10}>
                      <img
                        width={30}
                        loading="lazy"
                        src="/icons/checklist.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontSize: "14px" }}>
                          Lihat riwayat reservasi pasien
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi4 */}
                    <Flex gap={10}>
                      <img
                        width={30}
                        loading="lazy"
                        src="/icons/checklist.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontSize: "14px" }}>
                          Kelola antrian pasien
                        </p>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              {/* //?Section Fitur 4 */}
              <Flex
                gap={10}
                style={{ zIndex: 1 }}
                wrap={"wrap"}
                justify="center"
              >
                <Flex
                  vertical
                  wrap={"wrap"}
                  style={{ padding: "20px", flexBasis: "400px" }}
                >
                  <span
                    style={{
                      textAlign: "center",
                      backgroundColor: "#007E85",
                      paddingInline: "12px",
                      paddingBlock: "5px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: "white",
                      width: "105px",
                      marginBottom: "10px",
                    }}
                  >
                    Untuk Klinik
                  </span>
                  <p
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontFamily: "Lato",
                      fontSize: "25px",
                    }}
                  >
                    ATUR
                    <span
                      style={{
                        color: "white",
                        textAlign: "center",
                        backgroundColor: "#FFDC60",
                        paddingInline: "10px",
                        borderRadius: "30px",
                      }}
                    >
                      JADWAL DOKTER
                    </span>{" "}
                    DENGAN MUDAH
                  </p>
                  <p style={{ fontSize: "15px", marginBottom: "20px" }}>
                    Admin dapat mengatur jadwal dokter secara up to date yang
                    dapat langsung terlihat oleh pasien
                  </p>
                  <Flex vertical gap={20} wrap={"wrap"}>
                    {/* reservasi1 */}
                    <Flex gap={10}>
                      <img
                        width={30}
                        loading="lazy"
                        src="/icons/checklist.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontSize: "14px" }}>
                          Tambah, ubah, dan hapus data dokter
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi2 */}
                    <Flex gap={10}>
                      <img
                        width={30}
                        loading="lazy"
                        src="/icons/checklist.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontSize: "14px" }}>
                          Atur hari dan jam praktek dokter{" "}
                        </p>
                      </Flex>
                    </Flex>
                    {/* reservasi3 */}
                    <Flex gap={10}>
                      <img
                        width={30}
                        loading="lazy"
                        src="/icons/checklist.svg"
                        alt="fitur"
                      />
                      <Flex vertical wrap={"wrap"}>
                        <p style={{ fontSize: "14px" }}>
                          Lihat kalender dokter{" "}
                        </p>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex justify="center" wrap={"wrap"} style={{ padding: "5px" }}>
                  <img
                    src="/image/fitur4.png"
                    alt="fitur3"
                    width={530}
                    loading="lazy"
                    style={{ objectFit: "contain" }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          {/* //?offer section */}
          <div
            style={{
              position: "relative",
              width: "100%",

              height: "730px", // Atur tinggi div sesuai kebutuhan
              alignContent: "center",
            }}
          >
            <Flex
              vertical
              justify="center"
              align="center"
              gap={4}
              style={{
                marginBlock: "5.5rem",
                padding: "20px",
                zIndex: 1,
                position: "relative",
              }}
            >
              <p
                style={{
                  zIndex: 1,
                  margin: "0px",
                  fontWeight: "normal",
                  fontSize: "13px",
                  fontFamily: "Lato",
                  color: "#007E85",
                }}
              >
                Penawaran Spesial
              </p>
              <p
                style={{
                  zIndex: 1,
                  margin: "0px",
                  fontWeight: "bold",
                  fontSize: "25px",
                  fontFamily: "Lato",
                  color: "#007E85",
                }}
              >
                Tunggu Apa Lagi?
              </p>
              <div
                style={{
                  zIndex: 1,
                  width: "84px",
                  height: "4px",
                  backgroundColor: "#FFB573",
                }}
              ></div>
              <div
                style={{
                  zIndex: 2,
                  marginTop: "15px",
                  boxShadow: "0px 0px 10px 0px #00000028",
                  height: "auto",
                  width: "70%",
                  maxWidth: "80%",
                  minWidth: "20%",
                  borderRadius: "20px",
                  padding: "20px",
                  position: "relative",
                  backgroundColor: "#007E85",
                }}
              >
                <Flex
                  gap={5}
                  justify="space-evenly"
                  align="center"
                  wrap={"wrap"}
                >
                  <img src="/image/offer.png" alt="offer img" />
                  <Flex vertical>
                    <p style={{ fontFamily: "Lato" }}>
                      AppointMed menawarkan harga <br /> yang terjangkau{" "}
                      <span style={{ color: "#FFB573" }}>hanya dengan</span>
                    </p>
                    <p
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "227%",
                        fontFamily: "Lato",
                      }}
                    >
                      Rp 250.000<span style={{ fontSize: "12px" }}>/bulan</span>
                    </p>
                    <p
                      style={{
                        color: "white",
                        marginBottom: "20px",
                        fontFamily: "Lato",
                        fontSize: "12px",
                      }}
                    >
                      Anda sudah bisa menggunakan layanan kami
                    </p>
                    <Flex
                      gap={10}
                      wrap={"wrap"}
                      align="center"
                      justify="center"
                    >
                      <p
                        style={{
                          fontFamily: "Lato",
                          fontSize: "12px",
                          color: "white",
                        }}
                      >
                        info lebih lanjut?
                      </p>
                      <Button style={{ color: "#007E85" }}>
                        Gabung Sekarang
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </div>
            </Flex>
            {/* //?Wave 3 */}
            <img
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                left: "0",
                width: "100%",
                top: "0",
                zIndex: 0,
              }}
              src="wave/wave3.svg"
              alt=""
            />
          </div>
          {/* //?testimoni section */}
          <Flex
            vertical
            justify="center"
            align="center"
            style={{ overflow: "hidden", zIndex: 3, marginBottom: "10rem" }}
          >
            <p
              style={{
                zIndex: 3,
                margin: "0px",
                fontWeight: "normal",
                fontSize: "13px",
                fontFamily: "Lato",
                color: "#007E85",
              }}
            >
              Apa kata customer kami?
            </p>
            <p
              style={{
                zIndex: 3,
                margin: "0px",
                fontWeight: "bold",
                fontSize: "25px",
                fontFamily: "Lato",
                color: "#007E85",
                textAlign: "center",
              }}
            >
              Dipercaya Lebih dari Puluhan Customer
            </p>
            <div
              style={{
                zIndex: 3,
                width: "84px",
                height: "4px",
                backgroundColor: "#FFB573",
              }}
            ></div>
            <div
              style={{
                zIndex: 3,
                marginTop: "30px",
                overflow: "hidden",
                backgroundImage: 'url("/image/testimonial.svg")',
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                objectFit: "scale-down",
                width: "100%", // Atur lebar div sesuai kebutuhan
                height: "470px", // Atur tinggi div sesuai kebutuhan
                alignContent: "center",
                marginBottom: "3rem",
              }}
            >
              <Testimonials />
            </div>
          </Flex>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "auto",
              marginBottom: "9.5rem",
            }}
          >
            <Flex
              vertical
              style={{
                marginBottom: "100px",
              }}
              justify="center"
              align="center"
            >
              <p
                style={{
                  margin: "0px",
                  fontWeight: "normal",
                  fontSize: "13px",
                  fontFamily: "Lato",
                  color: "#007E85",
                }}
              >
                Roadmap
              </p>
              <p
                style={{
                  margin: "0px",
                  fontWeight: "bold",
                  fontSize: "25px",
                  fontFamily: "Lato",
                  color: "#007E85",
                  textAlign: "center",
                }}
              >
                Bagaimana Anda Bisa Memulainya
              </p>
              <div
                style={{
                  width: "84px",
                  height: "4px",
                  backgroundColor: "#FFB573",
                }}
              ></div>
              <img
                style={{
                  zIndex: 1,
                  marginTop: "40px",
                  width: "100%",
                  maxWidth: "750px", // Tentukan ukuran maksimum yang diinginkan
                  height: "auto",
                }}
                width={800}
                src="/image/roadmap.png"
                alt=""
              />

              <img
                loading="lazy"
                draggable={false}
                style={{
                  position: "absolute",
                  bottom: "-8%", // Adjust the bottom position as needed
                  left: "0",
                  width: "100%",
                  height: "auto",
                  zIndex: 0, // Ensure wave is behind other content
                }}
                src="/wave/wave4.svg"
                alt="wave"
              />
            </Flex>
          </div>

          {/* //?FAQ */}
          <Flex vertical justify="center" align="center">
            <Flex
              vertical
              justify="start"
              align="center"
              gap={20}
              style={{
                padding: "3%",
                height: "auto",
                width: "70%",
                borderRadius: "15px",
                background: "linear-gradient(to right, #BAF0EC, #369A9F)",
              }}
            >
              <Flex vertical align="center">
                <p
                  style={{
                    fontFamily: "Lato",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  FAQ
                </p>
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "Lato",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Temukan jawaban yang anda butuhkan
                </p>
              </Flex>
              <Flex vertical>
                <Accordion />
              </Flex>
            </Flex>
          </Flex>
        </Content>
      </Layout>
    </Flex>
  );
};

export default Home;
