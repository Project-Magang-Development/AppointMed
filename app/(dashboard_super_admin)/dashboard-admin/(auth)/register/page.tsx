"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Layout, Typography, message, notification } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

const RegisterDashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const response = await fetch("/api/register_super_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      localStorage.removeItem("planDuration");
      notification.success({
        message: "Register Berhasil!",
      });
      router.push("/dashboard-admin/login");
      setLoading(false);
    } catch {
      message.error("Registration failed.");
      setLoading(false);
    }
  };

  return (
    <Layout
      className="layout"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
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
          padding: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form
          name="register"
          className="register-form"
          onFinish={onFinish}
          style={{ maxWidth: "300px" }}
        >
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            Register Super Admin
          </Title>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
                type: "email",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              style={{
                border: "none",
                borderBottom: "1px solid #000",
                borderRadius: "0",
                paddingLeft: "0",
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
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
              className="register-form-button"
              block
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default RegisterDashboard;
