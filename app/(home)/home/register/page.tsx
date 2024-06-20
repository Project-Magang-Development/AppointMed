"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Layout, Typography, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { useForm } from "antd/es/form/Form";

const { Content } = Layout;
const { Title } = Typography;

interface FormData {
  given_name: string;
  surname: string;
  whatsapp: string;
  company: string;
  jenis_rental: string;
  city: string;
  street_line1: string;
  email: string;
  password: string;
}

const RegisterDashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageDataId = searchParams.get("package");
  const [packageData, setPackageData] = useState<any>("");
  const [packageName, setPackageName] = useState<string>("");
  const [pendingId, setPendingId] = useState("");
  const [form] = useForm<FormData>();
  const [packageId, setPackageId] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    //sesuaikan dengan url package yang dipilih
    const package_id = searchParams.get("package");
    setPackageId(package_id);
  }, [searchParams]);

  // Fungsi untuk mengambil data pembayaran saat komponen dimuat
  // useEffect(() => {
  //   if (packageDataId) {
  //     axios
  //       .get(`/api/showDetailPackage?package_id=${packageDataId}`)
  //       .then((response) => {
  //         setPackageData(response.data);
  //         const featureList =
  //           response.data.features ||
  //           (response.data.package_feature
  //             ? response.data.package_feature.split(", ")
  //             : []);
  //         setFeatures(featureList);

  //         // Simpan package_name dalam state
  //         setPackageName(response.data.package_name);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [packageDataId]);

  const onFinish = async (values: any) => {
    const package_id = searchParams.get("package");
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        company: values.company,
        domain: values.domain,
        email: values.email,
        password: values.password,
        plan: package_id,
      };

      const response = await fetch("/api/register_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      message.success("Registration successful!");
      setLoading(false);
    } catch {
      message.error("Registration failed.");
      setLoading(false);
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
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
            Register
          </Title>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Name"
            />
          </Form.Item>
          <Form.Item
            name="company"
            rules={[{ required: true, message: "Please input your Company!" }]}
          >
            <Input
              prefix={<BankOutlined className="site-form-item-icon" />}
              placeholder="Company"
            />
          </Form.Item>
          <Form.Item
            name="domain"
            rules={[
              { required: true, message: "Please input your Domain Company!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Domain Company"
            />
          </Form.Item>
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
            />
          </Form.Item>
          <Form.Item>
            <Button
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
