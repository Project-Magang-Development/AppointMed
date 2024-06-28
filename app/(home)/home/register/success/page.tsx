"use client";

import React from "react";
import { Layout, Row, Col, Card, Typography, Button, Steps } from "antd";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircleFilled } from "@ant-design/icons";
import Title from "antd/es/typography/Title";

const { Content, Footer } = Layout;
const { Step } = Steps;

const SuccesPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          padding: "20px 50px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "100%",
          }}
        >
          <Row align="middle" justify="center">
            <Col>
              <div style={{ textAlign: "center" }}>
                <CheckCircleFilled
                  style={{ fontSize: "80px", color: "#6B7CFF" }}
                />
              </div>
              <Title
                level={3}
                style={{
                  color: "#6B7CFF",
                  margin: 0,
                  marginTop: 30,
                  textAlign: "center",
                }}
              >
                Payment Successful!
              </Title>
              <Title
                level={4}
                style={{
                  color: "#6B7CFF",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Thank you use our system and check your email
              </Title>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer>
        <h1
          style={{
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.5)",
            fontWeight: "normal",
            fontSize: "1rem",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Powered By
          <Image
            src="/logo.png"
            alt="Vercel Logo"
            width={120}
            height={30}
            style={{ marginLeft: "8px" }}
          />
        </h1>
      </Footer>
    </Layout>
  );
};

export default SuccesPage;
