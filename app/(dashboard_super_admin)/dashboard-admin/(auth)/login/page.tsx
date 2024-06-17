"use client";

import React, { useState } from "react";
import { Button, Form, Input, Layout, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
      message.success("Login successful!");
      setLoading(false);
      router.push("/dashboard-admin");
    } catch (error) {
      message.error("Login failed.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <img
        src="/icons/buletan 1.svg"
        alt=""
        style={{
          objectFit: "fill",
          position: "absolute",
          top: 50,
          height: 450,
        }}
      />
      <img
        src="/icons/buletan 2.svg"
        alt=""
        style={{
          objectFit: "fill",
          position: "absolute",
          top: -10,
          right: -20,
          width: 250,
          height: 250,
        }}
      />
      <img
        src="/icons/panah3.svg"
        alt=""
        style={{
          objectFit: "cover",
          position: "absolute",
          top: 258,
          right: -20,
          width: 250,
          height: 250,
        }}
      />
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 300 }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
            Super Admin Login
          </Title>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                style={{
                  border: "none",
                  borderBottom: "1px solid #000",
                  borderRadius: "0",
                  paddingLeft: "0",
                }}
                className="custom-input"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                style={{
                  border: "none",
                  borderBottom: "1px solid #000",
                  borderRadius: "0",
                  paddingLeft: "0",
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ backgroundColor: "#6B7CFF" }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}
