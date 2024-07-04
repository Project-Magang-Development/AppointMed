"use client";

import React, { useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  Layout,
  Typography,
  message,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

const { Content } = Layout;
const { Title } = Typography;

export default function LoginDashboardSuperAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/login_super_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      Cookies.set("tokenAdmin", data.token);
      notification.success({
        message: "Login Berhasil!",
      });
      setLoading(false);
      router.push("/dashboard-admin");
    } catch (error) {
      setLoading(false)
     notification.error({
      message: "Login Gagal!"
     })
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
        <img
          loading="lazy"
          draggable={false}
          src="/logo.png"
          alt="logo"
          width={150}
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
            <Flex
              wrap="wrap"
              justify="center"
              align="center"
              style={{ marginBottom: "2rem" }}
            >
              <Title level={2}>Login Super Admin</Title>
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
                <img
                  loading="lazy"
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
