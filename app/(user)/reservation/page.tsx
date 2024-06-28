"use client";

import React, { useState } from "react";
import {
  Form,
  Layout,
  Button,
  Input,
  message,
  Table,
  Row,
  Col,
  Steps,
  Typography,
  Divider,
  Spin,
  Flex,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import useSWR from "swr";
import axios from "axios";

dayjs.extend(utc);

const { Step } = Steps;
const { Title } = Typography;

const { Content } = Layout;

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

export default function FormPage() {
  const searchParams = useSearchParams();
  const schedules_id = searchParams.get("scheduleId");
  const apiKey = searchParams.get("apiKey");
  const date_time = searchParams.get("date_time");
  const no_reservation = searchParams.get("no_reservation");
  const { data: detailSchedule, error } = useSWR(
    `/api/schedule/getDetailSchedule/${schedules_id}`,
    fetcher
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const tax = 1500;

  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  // TODO: Buat xendit payment
  const createInvoice = async (
    invoiceData: any,
    externalId: string
  ): Promise<any> => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

      if (!secretKey) {
        throw Error("tidak ada API Key xendit");
      }

      const endpoint = "https://api.xendit.co/v2/invoices";
      const basicAuthHeader = `Basic ${btoa(secretKey + ":")}`;

      const payload = {
        external_id: externalId,
        amount: detailSchedule.detailSchedule.doctor.price + tax,
        description: "Clinic reservation",
        currency: "IDR",
        customer: {
          given_names: reservationData.customer_name,
          mobile_number: reservationData.customer_phone,
          email: reservationData.patient_email,
        },
        customer_notification_preference: {
          invoice_created: ["whatsapp"],
          invoice_reminder: ["whatsapp"],
          invoice_paid: ["whatsapp"],
        },
        success_redirect_url: "http://localhost:3000/reservation/success",
        items: [
          {
            name: detailSchedule.detailSchedule.doctor.name,
            quantity: 1,
            price: detailSchedule.detailSchedule.doctor.price,
          },
        ],
        fees: [
          {
            type: "ADMIN",
            value: tax,
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
        console.log(response.data);

        return { id_invoice: id, invoice_url, external_id: externalId };
      } else {
        console.error("Gagal membuat invoice");
        console.log(response.data);
        return { id_invoice: null, external_id: null };
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      return { id_invoice: null, external_id: null };
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const externalId = "INV-" + Math.random().toString(36).substring(2, 9);
    const payloadData = {
      schedules_id: schedules_id,
      apiKey,
      date_time: date_time,
      patient_name: values.patient_name,
      patient_phone: values.patient_phone,
      patient_gender: values.patient_gender,
      patient_email: values.patient_email,
      patient_address: values.patient_address,
      no_reservation: no_reservation,
      external_id: externalId,
      total_amount: detailSchedule.detailSchedule.doctor.price,
    };

    try {
      const response = await fetch("/api/reservation/createReservationUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      });
      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        setReservationData(data.data);
        setShowInvoice(true); // Show invoice page
      } else {
        message.error(data.error || "Failed to create reservation");
        console.error("Error:", data);
      }
    } catch (error) {
      setLoading(true);
      message.error("An unexpected error occurred");
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const externalId =
        reservationData.external_id ||
        "INV-" + Math.random().toString(36).substring(2, 9);
      const result = await createInvoice(reservationData, externalId);
      console.log(result);

      if (result && result.invoice_url) {
        window.location.href = result.invoice_url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const invoiceData = reservationData
    ? [
        {
          key: "doctor_name",
          doctor: detailSchedule.detailSchedule.doctor.name,
          date: dayjs(date_time).format("D MMM YYYY"),
          cost: `Rp ${detailSchedule.detailSchedule.doctor.price.toLocaleString()}`,
        },
      ]
    : [];

  const columnsInvoice = [
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total Cost",
      dataIndex: "cost",
      key: "cost",
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/background.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            padding: "0 20px",
          }}
        >
          <Col span={24}>
            <Steps
              size="small"
              current={showInvoice ? 2 : 1}
              style={{ marginBottom: "20px" }}
            >
              <Step title="Select Doctor" />
              <Step title="Fill Personal Data" />
              <Step title="Payment Process" />
              <Step title="Done" />
            </Steps>
          </Col>
        </Row>
        {showInvoice ? (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: "40px",
              borderRadius: "16px",
              width: "100%",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title level={2} style={{ textAlign: "center", marginBlock: 0 }}>
              Invoice Details
            </Title>
            <p style={{ textAlign: "center" }}>
              Check your reservation details
            </p>
            <Divider />
            <Flex justify="space-between">
              <p style={{ marginBottom: 10 }}>
                <strong>Invoice For</strong>
              </p>
              <p>
                <strong>Reservation {reservationData.no_reservation}</strong>
              </p>
            </Flex>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr style={{ width: "10%" }}>
                  <td style={{ width: "10%" }}>Name</td>
                  <td>
                    {" "}
                    <p style={{ fontWeight: "bold" }}>
                      {reservationData.patient_name}
                    </p>
                  </td>
                </tr>
                <tr style={{ width: "10%" }}>
                  <td style={{ width: "10%" }}>Gender</td>
                  <td>
                    {" "}
                    <p style={{ fontWeight: "bold" }}>
                      {reservationData.patient_gender}
                    </p>
                  </td>
                </tr>
                <tr style={{ width: "10%" }}>
                  <td style={{ width: "10%" }}>Phone</td>
                  <td>
                    {" "}
                    <p style={{ fontWeight: "bold" }}>
                      {" "}
                      {reservationData.patient_phone}
                    </p>
                  </td>
                </tr>
                <tr style={{ width: "10%" }}>
                  <td style={{ width: "10%" }}>Email</td>
                  <td>
                    {" "}
                    <p style={{ fontWeight: "bold" }}>
                      {reservationData.patient_email}
                    </p>
                  </td>
                </tr>
                <tr style={{ width: "10%" }}>
                  <td style={{ width: "10%" }}>Address</td>
                  <td>
                    {" "}
                    <p style={{ fontWeight: "bold" }}>
                      {reservationData.patient_address}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* <Flex
              justify="space-between"
              style={{
                marginBottom: "20px",
              }}
            >
              <div>
                <p>
                  <strong>Invoice For:</strong>
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "300px",
                  }}
                ></div>
                <Flex
                  gap={40}
                  style={{
                    display: "flex",

                    width: "300px",
                  }}
                >
                  <p>Name</p>
                  <p>{reservationData.patient_name}</p>
                </Flex>
                <Flex
                  gap={40}
                  style={{
                    display: "flex",

                    width: "300px",
                  }}
                >
                  <Flex>
                    <p>Gender</p>
                  </Flex>
                  <Flex justify="start">
                    <p>{reservationData.patient_gender}</p>
                  </Flex>
                </Flex>
                <Flex
                  gap={40}
                  style={{
                    display: "flex",

                    width: "300px",
                  }}
                >
                  <Flex>
                    <p>Phone</p>
                  </Flex>
                  <Flex>
                    <p style={{ textAlign: "left" }}>
                      {reservationData.patient_phone}
                    </p>
                  </Flex>
                </Flex>
                <Flex
                  gap={40}
                  style={{
                    display: "flex",

                    width: "300px",
                  }}
                >
                  <p>Email</p>
                  <p>{reservationData.patient_email}</p>
                </Flex>
                <Flex
                  gap={40}
                  style={{
                    display: "flex",

                    width: "300px",
                  }}
                >
                  <p>Address</p>
                  <p>{reservationData.patient_address}</p>
                </Flex>
              </div>
              <div>
                <p>
                  <strong>Reservation {reservationData.no_reservation}</strong>
                </p>
              </div>
            </Flex> */}
            <Table
              dataSource={invoiceData}
              columns={columnsInvoice}
              pagination={false}
              style={{ marginTop: "20px" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <p>
                  <strong>Subtotal</strong>
                </p>
                <p>
                  Rp{" "}
                  {detailSchedule.detailSchedule.doctor.price.toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <p>
                  <strong>TAX</strong>
                </p>
                <p>Rp {tax.toLocaleString()}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "300px",
                  border: "1px solid #007E85",
                  borderRadius: "5px",
                  backgroundColor: "#007E85",
                  marginTop: "20px",
                  padding: "5px",
                }}
              >
                <p style={{ fontWeight: "bold", color: "white" }}>
                  Rp{" "}
                  {(
                    reservationData.Schedule.doctor.price + tax
                  ).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              onClick={handleOk}
              type="primary"
              block
              style={{
                marginTop: "25px",
                color: "#FFFF",
                backgroundColor: "#007E85",
              }}
            >
              Proceed to Payment
            </Button>
          </div>
        ) : (
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Col
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                padding: "40px",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Title level={3} style={{ textAlign: "center" }}>
                Complete Your Details
              </Title>
              <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                  label="Full Name"
                  name="patient_name"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>
                <Form.Item
                  label="Gender"
                  name="patient_gender"
                  rules={[
                    { required: true, message: "Please select your gender!" },
                  ]}
                >
                  <Input placeholder="Select gender" />
                </Form.Item>
                <Form.Item
                  label="Phone Number"
                  name="patient_phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="patient_email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
                <Form.Item
                  label="Address"
                  name="patient_address"
                  rules={[
                    { required: true, message: "Please input your address!" },
                  ]}
                >
                  <Input placeholder="Enter address" />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    block
                    loading={loading}
                    style={{
                      color: "#FFFF",
                      backgroundColor: "#007E85",
                      width: "100%",
                      marginTop: "20px",
                    }}
                  >
                    Continue
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
