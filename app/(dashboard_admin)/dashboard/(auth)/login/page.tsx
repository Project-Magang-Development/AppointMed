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
} from "antd";
import { UserOutlined, LockOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      Cookies.set("token", data.token, { expires: 1 });
      message.success("Login successful!");
      setLoading(false);
      window.location.href = "/dashboard";
    } catch (error) {
      message.error("Login failed.");
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF",
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: 800,
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <div style={{ flex: 1, padding: 24 }}>
            <Space
              direction="vertical"
              style={{ width: "100%", textAlign: "center", marginBottom: 40 }}
            >
              <Image src="/logo.png" alt="logo" width={100} preview={false} />
              <Title level={2}>Selamat Datang!</Title>
            </Space>
            <Form
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
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Space>
                <div>
                  <Title level={5}>
                    <WhatsAppOutlined />
                  </Title>
                  +6281337333155
                </div>
                <div>
                  <Image
                    src="/email.png"
                    alt="Email"
                    width={24}
                    style={{ marginRight: 8 }}
                  />
                  kodingakademi.id
                </div>
                <div>
                  <img
                    src="/website.png"
                    alt="Website"
                    width={24}
                    style={{ marginRight: 8 }}
                  />
                  www.kodingakademi.id
                </div>
              </Space>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Image src="/icon-login.png" alt="Side" style={{ width: "80%" }} preview={false} />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
