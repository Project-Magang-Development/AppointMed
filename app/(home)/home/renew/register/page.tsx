"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Form, message, notification, Image, Flex } from "antd";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CheckOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";
import { Footer } from "antd/es/layout/layout";
import { wrap } from "module";

interface MerchantData {
  merchant_name: string;
  merchant_whatsapp: string;
  rental_name: string;
  rental_type: string;
  merchant_city: string;
  merchant_address: string;
}

const RegisterRenew = () => {
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const packageDataId = searchParams.get("package");
  const [packageData, setPackageData] = useState<any>("");
  const [packageName, setPackageName] = useState<string>("");
  const [features, setFeatures] = useState<string[]>([]);
  const [form] = useForm();
  const [pendingId, setPendingId] = useState("");

  const createMerchant = async (pending_id: string): Promise<any> => {
    try {
      const package_id = packageDataId;
      const payloadMerchant = {
        pending_id,
        plan: package_id,
        email,
      };

      const registerMerchant = await axios.post(
        "/api/register_admin",
        payloadMerchant,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (registerMerchant.status === 200 && registerMerchant.data) {
        return registerMerchant.data;
      } else {
        throw new Error("Failed to register merchant");
      }
    } catch (error: any) {
      console.error(
        "Error during merchant registration:",
        error.response?.data || error
      );
      message.error("Terdapat Kesalahan dalam pendaftaran merchant");
      throw error;
    }
  };

  const createInvoice = async (
    formData: any,
    external_id: string
  ): Promise<any> => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

      if (!secretKey) {
        throw new Error("tidak ada API Key xendit");
      }

      const endpoint = "https://api.xendit.co/v2/invoices";
      const basicAuthHeader = `Basic ${btoa(secretKey + ":")}`;
      const payload = {
        external_id,
        amount: packageData.package_price,
        description: packageData.package_description,
        currency: "IDR",
        customer: {
          given_names: formData.merchant_name,
          surname: formData.merchant_name,
          email: formData.email,
          mobile_number: formData.merchant_whatsapp,
          addresses: [
            {
              city: formData.merchant_city,
              country: "Indonesia",
              street_line1: formData.merchant_address,
            },
          ],
        },
        customer_notification_preference: {
          invoice_paid: ["email", "whatsapp"],
        },
        success_redirect_url: `http://localhost:3000/home/register/success`,
        failure_redirect_url: `http://localhost:3000/home/register?package=${packageDataId}`,
        items: [
          {
            name: packageData.package_name,
            quantity: 1,
            price: packageData.package_price,
          },
        ],
      };

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const { invoice_url, id } = response.data;
        return { id_invoice: id, invoice_url };
      } else {
        console.error("Gagal membuat invoice", response.data);
        return { id_invoice: null };
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      return { id_invoice: null };
    }
  };

  useEffect(() => {
    if (pendingId && packageData.package_price === 0) {
      createMerchant(pendingId);
    }
  }, [pendingId, packageData.package_price]);

  useEffect(() => {
    if (packageDataId) {
      axios
        .get(`/api/showDetailPackage?package_id=${packageDataId}`)
        .then((response) => {
          setPackageData(response.data);
          const featureList =
            response.data.features ||
            (response.data.package_feature
              ? response.data.package_feature.split(", ")
              : []);
          setFeatures(featureList);
          setPackageName(response.data.package_name);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [packageDataId]);

  const handleEmailCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch merchant data. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data?.status === 200) {
        setMerchantData(data?.data);
        form.setFieldsValue(data.data);
        setLoading(false);
      } else if (data.status === 404) {
        notification.error({
          message: "Email tidak terdaftar",
        });
        setLoading(false);
      } else {
        notification.error({
          message: "Gagal Mengecek Email",
        });
        setMerchantData(null);
        setLoading(false);
        form.resetFields();
      }
    } catch (error) {
      message.error("Failed to fetch merchant data");
      setMerchantData(null);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const createPaymentInvoice = async (
    formData: any,
    external_id: string,
    package_name: string
  ): Promise<any> => {
    try {
      let status = "Pending"; // Default status
      if (packageData.package_price === 0) {
        status = "PAID"; // Update status to PAID if package price is 0
      }

      const payloadPayment = {
        amount: packageData.package_price,
        invoice_id: external_id,
        package_name,
        package_id: packageDataId,
        merchant_name: formData.merchant_name,
        merchant_email: email,
        merchant_whatsapp: formData.merchant_whatsapp,
        klinik_name: formData.klinik_name,
        klinik_type: formData.klinik_type,
        merchant_city: formData.merchant_city,
        merchant_address: formData.merchant_address,
        status,
      };

      const createPayment = await axios.post(
        "/api/payment/createPendingPayment",
        payloadPayment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (createPayment.status === 200) {
        setPendingId(createPayment.data.newPayment.pending_id);
        return createPayment.data;
      } else {
        console.error("Failed to create payment:", createPayment.data);
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      message.error("Terdapat Kesalahan dalam pembuatan pembayaran");
      throw error;
    }
  };

  const handleSubmit = async () => {
    const external_id = "INV-" + Math.random().toString(36).substring(2, 9);
    setLoading(true);
    try {
      const formData = form.getFieldsValue();

      let invoiceResult = { id_invoice: null, invoice_url: null };

      if (packageData.package_price > 0) {
        invoiceResult = await createInvoice(formData, external_id);

        if (!invoiceResult.id_invoice) {
          throw new Error("Failed to create invoice");
        }
      }

      const paymentResult = await createPaymentInvoice(
        formData,
        external_id,
        packageName
      );

      if (!paymentResult) {
        throw new Error("Failed to create payment invoice");
      }

      if (packageData.package_price === 0) {
        console.log("Merchant Dibuat");
      }

      notification.success({
        message: "Registrasi Berhasil",
      });
      if (invoiceResult.invoice_url) {
        window.location.href = invoiceResult.invoice_url;
      } else {
        if (packageData.package_price > 0) {
          message.error("Terjadi Kesalahan");
        } else {
          console.log("Tidak ada invoice yang perlu dibuat");
        }
      }
      setLoading(false);
    } catch (error) {
      message.error("Registration failed.");
      setLoading(false);
    }
  };

  return (
    <Flex
      vertical
      style={{
        minHeight: "100vh",

        justifyContent: "space-between",
        alignContent: "space-between",
      }}
    >
      <Flex
        vertical
        style={{
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <Title level={2} style={{ marginBottom: "20px" }}>
          Perbarui Paket Anda
        </Title>
        <Flex
          gap={30}
          style={{
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <Flex
            vertical
            style={{
              backgroundColor: "white",
              boxShadow:
                "0 2px 4px 0 rgba(0,0,0,0.2), 0 4px 5px -1px rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)",
              borderRadius: "20px",
              marginBottom: "20px",
              maxWidth: "600px",
              height: "60%",

              width: "100%",
            }}
          >
            <Flex justify="end">
              <Flex
                justify="center"
                align="center"
                style={{
                  color:
                    packageData.package_tag === "Istimewa" ? "black" : "white",

                  width: "100px",
                  height: "25px",
                  backgroundColor:
                    packageData.package_tag === "" || !packageData.package_tag
                      ? "transparent"
                      : packageData.package_tag === "Istimewa"
                      ? "#CDFFF9"
                      : "#007E85",
                  borderRadius: "0px 15px",
                }}
              >
                {packageData.package_tag}
              </Flex>
            </Flex>
            <Flex vertical style={{ padding: "2rem" }}>
              <Flex>
                <p
                  style={{
                    fontSize: "19px",
                    fontWeight: "bold",
                  }}
                >
                  {packageData.package_name}
                </p>
              </Flex>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                Rp.
                {packageData?.package_price
                  ? packageData.package_price.toLocaleString()
                  : "0"}
              </p>
              <p
                style={{
                  color: "#A5A5A5",
                  fontSize: "17px",
                  fontWeight: "normal",
                }}
              >
                /bulan
              </p>
              <p style={{ marginTop: "1rem" }}>
                {packageData.package_description}
              </p>
              <ul>
                {features.length > 0 ? (
                  features.map((feature, index) => (
                    <li
                      key={index}
                      style={{ display: "flex", marginTop: "1rem" }}
                    >
                      <CheckOutlined
                        style={{ marginRight: "5px", color: "#6B7CFF" }}
                      />
                      {feature}
                    </li>
                  ))
                ) : (
                  <li>Tidak ada fitur yang tersedia</li>
                )}
              </ul>
            </Flex>
          </Flex>
          <div
            className="card"
            style={{
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "100%",
              height: "30%",
            }}
          >
            <Title level={4} style={{ marginBottom: "20px" }}>
              Masukkan Email Anda
            </Title>
            <div
              style={{
                gap: "10px",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                width: "100%",
                height: "40px",
                maxHeight: "50px",
              }}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ marginRight: "10px", flex: "1" }}
              />
              <Button
                style={{ color: "#FFF", backgroundColor: "#007E85" }}
                onClick={handleEmailCheck}
              >
                Check Email
              </Button>
            </div>
            {merchantData && (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={merchantData}
                style={{ width: "100%" }}
              >
                <Form.Item
                  name="merchant_name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your merchant name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="merchant_whatsapp"
                  label="WhatsApp"
                  rules={[
                    {
                      required: true,
                      message: "Please input your merchant WhatsApp",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="klinik_name"
                  label="Nama Klinik"
                  rules={[
                    {
                      required: true,
                      message: "Please input your rental name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="klinik_type"
                  label="Tipe Klinik"
                  rules={[
                    {
                      required: true,
                      message: "Please input your rental type",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="merchant_city"
                  label="Kota"
                  rules={[
                    {
                      required: true,
                      message: "Please input your merchant city",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="merchant_address"
                  label="Alamat"
                  rules={[
                    {
                      required: true,
                      message: "Please input your merchant address",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      width: "100%",
                      color: "#FFF",
                      backgroundColor: "#007E85",
                    }}
                  >
                    Perbarui Sekarang
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </Flex>
      </Flex>
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
    </Flex>
  );
};

export default RegisterRenew;
