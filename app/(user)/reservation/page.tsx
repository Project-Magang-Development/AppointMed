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

  const handleOk = async (values: any) => {
    setLoading(true);
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

  const invoiceData = reservationData
    ? [
        {
          key: "doctor_name",
          field: "Doctor Name",
          value: reservationData.data.Schedule.doctor.name,
        },
        {
          key: "patient_gender",
          field: "Patient Gender",
          value: reservationData.data.patient_gender,
          doctor: detailSchedule.detailSchedule.doctor.name,
          date: dayjs(reservationData.Schedule.date).format("D MMM YYYY"),
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
            <table style={{ width: "300px" }}>
              <tr>
                <td>Name</td>
                <td>
                  {" "}
                  <p style={{ fontWeight: "bold" }}>{reservationData.patient_name}</p>
                </td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>
                  {" "}
                  <p style={{ fontWeight: "bold" }}>{reservationData.patient_gender}</p>
                </td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>
                  {" "}
                  <p style={{ fontWeight: "bold" }}> {reservationData.patient_phone}</p>
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>
                  {" "}
                  <p style={{ fontWeight: "bold" }}>{reservationData.patient_email}</p>
                </td>
              </tr>
              <tr>
                <td>Address</td>
                <td>
                  {" "}
                  <p style={{ fontWeight: "bold" }}>{reservationData.patient_address}</p>
                </td>
              </tr>
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
                <p>
                  Rp{" "}
                  {(
                    detailSchedule.detailSchedule.doctor.price * 0.03
                  ).toLocaleString()}
                </p>
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
                    reservationData.Schedule.doctor.price * 1.03
                  ).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
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
              <Form onFinish={handleOk} layout="vertical">
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
