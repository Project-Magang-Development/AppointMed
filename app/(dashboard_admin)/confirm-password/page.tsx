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
  MailOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { wrap } from "module";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


const { Content } = Layout;
const { Title } = Typography;

export default function ConfirmPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      notification.success({
        message: "Password berhasil diubah",
      });

      router.push("/dashboard/login");
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
            <Flex wrap="wrap" justify="center" align="center" style={{ marginTop: "2rem" }}>
              <Title level={2}>Lupa Password</Title>
            </Flex>
            <Form
              name="reset_password"
              className="reset-password-form"
              initialValues={{ email: email }}
              onFinish={onFinish}
              style={{ width: "65%" }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                  { type: "email", message: "The input is not valid Email!" },
                ]}
              >
                <Input
                  style={{ borderColor: "#007E85" }}
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
                hasFeedback
              >
                <Input.Password
                  style={{ borderColor: "#007E85" }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="New Password"
                />
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your Password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Password Tidak Sama!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  style={{ borderColor: "#007E85" }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Confirm Password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ backgroundColor: "#007E85" }}
                  type="primary"
                  htmlType="submit"
                  className="reset-password-form-button"
                  block
                  loading={loading}
                >
                  Reset Password
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
