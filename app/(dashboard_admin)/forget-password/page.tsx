"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Layout,
  Typography,
  message,
  Space,
  Image,
  Flex,
  notification,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { wrap } from "module";
import Link from "next/link";

const { Content } = Layout;
const { Title } = Typography;

export default function ForgetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/sendEmailReset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      notification.success({
        message: "Silahkan Cek Email Anda",
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Flex
        className="logo-login"
        style={{
          backgroundColor: "transparent",
          paddingInline: "2rem",
        }}
      >
        <Image
          draggable={false}
          src="/logo.png"
          alt="logo"
          width={150}
          preview={false}
        />
      </Flex>
      <Content
        style={{
          zIndex: "1",

          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Flex
          justify="center"
          align="center"
          wrap={"wrap-reverse"}
          style={{ marginTop: "3rem" }}
        >
          <Flex
            vertical
            wrap={"wrap"}
            style={{ paddingInline: "1rem" }}
            align="center"
            justify="center"
          >
            <Flex wrap="wrap" justify="center" align="center">
              <Title level={2}>Lupa Password</Title>
            </Flex>
            <Form
              style={{ width: "65%" }}
              name="forget-password"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                ]}
              >
                <Input
                  style={{ borderColor: "#007E85" }}
                  prefix={<UserOutlined />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ backgroundColor: "#007E85", color: "white" }}
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Kirim Permintaan
                </Button>
              </Form.Item>
              <Form.Item>
                <Link
                  href="/dashboard/login"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "16px",
                    color: "#007E85",
                  }}
                >
                  Kembali Ke Login
                </Link>
              </Form.Item>
            </Form>
            <Flex
              gap={30}
              justify="center"
              style={{ textAlign: "center", marginTop: 16 }}
              wrap="wrap"
            >
              <Flex gap={10}>
                <img src="/icons/wa.svg" alt="" />
                <Flex vertical justify="center" align="start">
                  <p style={{ fontWeight: "500" }}>WHATSAPP</p>
                  <p>+6281337333155</p>
                </Flex>
              </Flex>
              <Flex gap={10} align="center">
                <Image
                  src="/icons/email.svg"
                  alt="Email"
                  width={23}
                  style={{ marginRight: 8 }}
                />
                <Flex vertical justify="center" align="start">
                  <p style={{ fontWeight: "500" }}>EMAIL</p>
                  <p>kodingakademi.id</p>
                </Flex>
              </Flex>
              <Flex gap={10}>
                <img
                  src="/icons/web.svg"
                  alt="Website"
                  width={24}
                  style={{ marginRight: 8 }}
                />
                <Flex vertical justify="center" align="start">
                  <p style={{ fontWeight: "500" }}>WEBSITE</p>
                  <p>www.kodingakademi.id</p>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <img
            src="/icon-login.png"
            alt="Side"
            width={400}
            style={{ minWidth: "100", maxWidth: "450" }}
          />
        </Flex>
      </Content>
      <div
        className="half-color-login"
        style={{
          position: "absolute",
          right: "0",
          height: "100%",
          width: " 30%",
          backgroundColor: "#007E85",
          zIndex: "0",
        }}
      ></div>
    </Layout>
  );
}
