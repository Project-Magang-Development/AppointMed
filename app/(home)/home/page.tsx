"use client";

import React from "react";
import { Layout, Row, Col, Typography, Button, Input, Card, Flex } from "antd";
import Image from "next/image";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Layout style={{ background: "#FFFFFF" }}>
      <Content style={{ padding: "50px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "577px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "390px",
              height: "392px",
              right: "592px",
              top: "11px",
              // background:
              //   "radial-gradient(483.9% 2719.65% at -49.5% -250%, #D798E1 17.55%, #9BFFA5 27.56%, #AED3FF 49.89%, #C9D4EF 56.53%, #CACFFA 65.69%)",
              // filter: "blur(200px)",
            }}
          ></div>
          <Row justify="center" gutter={32}>
            <Col span={12}>
              <Title style={{ textAlign: "justify" }}>
                Solusi Kelola Rental Kendaraan yang Tepat untuk Bisnis Anda.
              </Title>
              <Paragraph style={{ textAlign: "justify", fontWeight: "bold" }}>
                Optimalkan pelayanan pelanggan dengan Sistem Booking
                RentalinAja. Berikan kemudahan pada pelanggan untuk memesan
                secara online.
              </Paragraph>
              <Flex gap={50} style={{ padding: "10px" }}>
                <Button type="primary">Gabung Sekarang</Button>
                <Button>Uji Coba Gratis</Button>
              </Flex>
            </Col>

            <Col span={12}>
              <Card
                style={{
                  height: "300px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Konten card bisa ditempatkan di sini */}
              </Card>
            </Col>
          </Row>
        </div>

        {/* Features Section */}
        <Row gutter={[16, 16]} style={{ marginTop: "40px" }}>
          <Col
            span={8}
            style={{
              background: "#E0E4FC",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Title level={4}>Keamanan Data</Title>
            <Paragraph>
              Data terjamin aman, sehingga anda tidak perlu khawatir dengan
              kebocoran data.
            </Paragraph>
          </Col>
        </Row>

        <Row
          justify="center"
          style={{
            marginTop: "40px",
            background: "#E0E4FC",
            padding: "50px",
            borderRadius: "20px",
          }}
        >
          <Col span={24} style={{ textAlign: "center" }}>
            <Title>Apa yang bisa Anda dapatkan?</Title>
            <Paragraph>Discover the benefits...</Paragraph>
            <Input.Group compact>
              <Input
                style={{ width: "calc(100% - 200px)" }}
                defaultValue="Email address"
              />
              <Button type="primary">Subscribe</Button>
            </Input.Group>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
