"use client";

import React, { useState } from "react";
import { Form, Layout, Button, Input, message, Modal, Table } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation"; // Impor useSearchParams
dayjs.extend(utc);

const { Content } = Layout;

export default function FormPage() {
  const searchParams = useSearchParams();
  const schedules_id = searchParams.get("scheduleId");
  const apiKey = searchParams.get("apiKey");
  const date_time = searchParams.get("date_time");
  const no_reservation = searchParams.get("no_reservation"); // Dapatkan no_reservation dari URL

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);

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
        setReservationData(data);
        setIsModalVisible(true); // Tampilkan modal
      } else {
        message.error(data.error || "Failed to create reservation");
        console.error("Error:", data);
      }
    } catch (error) {
      message.error("An unexpected error occurred");
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const data = reservationData
    ? [
        {
          key: "no_reservation",
          field: "Reservation Number",
          value: reservationData.data.no_reservation,
        },
        {
          key: "patient_name",
          field: "Patient Name",
          value: reservationData.data.patient_name,
        },
        {
          key: "doctor_name",
          field: "Doctor Name",
          value: reservationData.data.Schedule.doctor.name,
        },
        {
          key: "patient_gender",
          field: "Patient Gender",
          value: reservationData.data.patient_gender,
        },
      ]
    : [];

  return (
    <div>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          style={{
            background: "#f7f7f7",
            padding: "20px",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "400px",
          }}
          onFinish={handleOk}
        >
          <Form.Item
            label="Name"
            name="patient_name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="patient_phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="patient_gender"
            rules={[{ required: true, message: "Please input your gender!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="patient_email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="patient_address"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              OK
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <Modal
        title="Reservation Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="key"
        />
      </Modal>
    </div>
  );
}
