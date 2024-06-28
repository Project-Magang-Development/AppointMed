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

export default function LoginDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/login_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status === 403) {
          notification.error({
            message: "Masa Langganan Sudah Habis",
            description: (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="link" onClick={() => router.push("/home/renew")}>
                  Perpanjang Langganan
                </Button>
              </div>
            ),
            duration: 2,
          });
        } else if (response.status === 404) {
          notification.error({
            message: "Email Tidak Terdaftar",
          });
        } else {
          notification.error({
            message: "Password Salah",
          });
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      Cookies.set("token", data.token, { expires: 1 });
      notification.success({
        message: "Login Berhasil!",
      });
      setLoading(false);
      window.location.href = "/dashboard";
    } catch (error) {
      notification.error({
        message: "Login failed.",
      });
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
            <Flex wrap="wrap" justify="center" align="center" style={{ marginBottom: "2rem" }}>
              <Title level={2}>Selamat Datang!</Title>
            </Flex>
            <Form
              style={{ width: "65%" }}
              name="normal_login"
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
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  style={{ borderColor: "#007E85" }}
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Link
                  href="/forget-password"
                  style={{
                    display: "block",
                    textAlign: "right",
                    color: "#007E85F",
                  }}
                >
                  Lupa Password?
                </Link>
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ backgroundColor: "#007E85", color: "white" }}
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Login
                </Button>
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
