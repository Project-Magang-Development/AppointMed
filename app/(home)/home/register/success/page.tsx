"use client";

import React from "react";
import { Layout, Row, Col, Card, Typography, Button, Steps, Flex } from "antd";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircleFilled } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import FooterSection from "@/app/components/footer";
import Navbar from "@/app/components/Navbar";

const { Content, Footer } = Layout;
const { Step } = Steps;

const SuccesPage = () => {
  return (
    <Layout style={{ minHeight: "100vh", zIndex: 1 }}>
      <Navbar />
      <Content
        style={{
          padding: "20px 50px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Flex
          justify="center"
          style={{
            textAlign: "center",
            width: "100%",
          }}
        >
          <Flex align="center" justify="center" style={{ zIndex: 1 }}>
            <Flex vertical justify="center" align="center">
              <img src="/icons/success.svg" alt="" width={100} />
              <Title
                level={2}
                style={{
                  color: "#007E85",
                  margin: 0,
                  marginTop: 30,
                  textAlign: "center",
                }}
              >
                Sukses
              </Title>
              <Title
                level={4}
                style={{
                  color: "#black",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                terimaskasih telah menggunakan sistem kami
              </Title>
            </Flex>
            <img
              style={{
                width: "50%",
              }}
              src="/image/rafiki.svg"
              alt=""
            />
          </Flex>
        </Flex>
      </Content>
      <FooterSection />
      <img
        style={{
          position: "absolute",
          bottom: "-300px",
          left: 0,
          width: "100%",
          zIndex: 0,
        }}
        src="/wave/wave11.svg"
        alt=""
      />
    </Layout>
  );
};

export default SuccesPage;
