"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  Space,
  Table,
} from "antd";
import ReactQuill from "react-quill";
import moment from "moment";
import "moment/locale/id";
import Title from "antd/es/typography/Title";
import Cookies from "js-cookie";
import useSWR from "swr";
import TableSkeleton from "@/app/components/tableSkeleton";
import { useRouter } from "next/navigation";

interface Package {
  package_id: string;
  package_name: string;
  package_price: number;
}

interface MerchantPendingPayment {
  merchant_name: string;
  package_name: string;
  amount: number;
  klinik_name: string;
  klinik_type: string;
  merchant_city: string;
  status: string;
}

interface Merchant {
  merchant_id: string;
  pending_id: string;
  status_subscriber: string;
  start_date: string;
  end_date: string;
  MerchantPayment: {
    MerchantPendingPayment: MerchantPendingPayment;
  };
}

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("tokenAdmin")}`,
    },
  }).then((res) => res.json());

export default function AdminMerchantDashboard() {
  const {
    data: merchants,
    error,
    isLoading,
  } = useSWR("/api/merchant/show", fetcher);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleModalEmail = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async (values: any) => {
    setLoading(true);
    const token = Cookies.get("tokenAdmin");
    const payload = {
      subject: values.subject,
      text: emailContent,
    };

    try {
      const response = await fetch("/api/merchant/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send emails");
      }

      notification.success({
        message: "Sukses Kirim Pesan Email",
      });
      setIsModalVisible(false);
      form.resetFields();
      setEmailContent("");
      setLoading(false);
    } catch (error) {
      notification.error({
        message: "Gagal Kirim Pesan Email",
      });
      setLoading(false);
      console.error("Error sending emails:", error);
    }
  };

  const filteredMerchants = useMemo(() => {
    if (!merchants) return [];

    return merchants.filter((merchant: Merchant) => {
      const startDate = merchant.start_date
        ? moment(merchant.start_date).format("D MMMM YYYY").toLowerCase()
        : "";
      const endDate = merchant.end_date
        ? moment(merchant.end_date).format("D MMMM YYYY").toLowerCase()
        : "";
      return (
        (merchant.MerchantPayment.MerchantPendingPayment.merchant_name || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        startDate.includes(searchText.toLowerCase()) ||
        endDate.includes(searchText.toLowerCase()) ||
        (merchant.MerchantPayment?.MerchantPendingPayment?.package_name || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (merchant.MerchantPayment?.MerchantPendingPayment?.amount || 0)
          .toString()
          .includes(searchText) ||
        (merchant.MerchantPayment?.MerchantPendingPayment?.klinik_name || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (merchant.MerchantPayment?.MerchantPendingPayment?.merchant_city || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (merchant.MerchantPayment?.MerchantPendingPayment?.status || "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    });
  }, [merchants, searchText]);

  const showHistoryExpanse = (merchant_id: string) => {
    router.push(`/dashboard-admin/merchant/${merchant_id}`);
  };

  if (error) {
    message.error("Failed to fetch merchants.");
    console.error("Error fetching merchants:", error);
  }

  if (isLoading) {
    return <TableSkeleton />;
  }

  const columns = [
    {
      title: "No",
      dataIndex: "pending_id",
      key: "pending_id",
      render: (value: number, _: Merchant, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Nama Merchant",
      dataIndex: ["MerchantPayment", "MerchantPendingPayment", "merchant_name"],
      key: "merchant_name",
    },
    {
      title: "Status Subscriber",
      dataIndex: "status_subscriber",
      key: "status_subscriber",
    },
    {
      title: "Tanggal Mulai",
      dataIndex: "start_date",
      key: "start_date",
      render: (date: string) =>
        date
          ? moment(date).locale("id").format("DD MMMM YYYY")
          : "Tidak tersedia",
    },
    {
      title: "Tanggal Selesai",
      dataIndex: "end_date",
      key: "end_date",
      render: (date: string) =>
        date
          ? moment(date).locale("id").format("DD MMMM YYYY")
          : "Tidak tersedia",
    },
    {
      title: "Nama Paket",
      dataIndex: ["MerchantPayment", "MerchantPendingPayment", "package_name"],
      key: "package_name",
      render: (packageName: string) => packageName || "Tidak tersedia",
    },
    {
      title: "Nama Klinik",
      dataIndex: ["MerchantPayment", "MerchantPendingPayment", "klinik_name"],
      key: "klinik_name",
    },
    {
      title: "Jenis Klinik",
      dataIndex: ["MerchantPayment", "MerchantPendingPayment", "klinik_type"],
      key: "klinik_type",
    },
    {
      title: "Kota Merchant",
      dataIndex: ["MerchantPayment", "MerchantPendingPayment", "merchant_city"],
      key: "merchant_city",
    },
    {
      title: "Saldo Merchant",
      dataIndex: "available_balance",
      key: "available_balance",
      render: (balance: number) => `Rp ${balance.toLocaleString()}`,
    },
    {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render: (_: any, merchant: Merchant) => (
        <Space>
          <Button
            style={{ backgroundColor: "#007E85", color: "white" }}
            onClick={() => showHistoryExpanse(merchant.merchant_id)}
          >
            History Penarikan
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Data Merchant</Title>
      <Divider />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          style={{ backgroundColor: "#007E85", color: "white" }}
          onClick={handleModalEmail}
        >
          Kirim Email
        </Button>
        <Input
          placeholder="Cari Merchant..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "50%", height: "35px", marginBottom: "20px" }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredMerchants}
        loading={!merchants && !error}
        rowKey="pending_id"
        pagination={pagination}
        onChange={(newPagination) => {
          setPagination({
            pageSize: newPagination.pageSize || 10,
            current: newPagination.current || 1,
          });
        }}
      />
      {isModalVisible && (
        <Modal
          title={<div style={{ marginBottom: "16px" }}>Kirim Email</div>}
          visible={isModalVisible}
          footer={null}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="addPacketForm"
            initialValues={{ remember: true }}
            onFinish={handleOk}
            autoComplete="off"
          >
            <Form.Item
              name="subject"
              rules={[{ required: true, message: "Tolong Masukan Subject" }]}
            >
              <Input placeholder="Subject" />
            </Form.Item>
            <Form.Item
              name="text"
              rules={[{ required: true, message: "Tolong Masukan Text" }]}
            >
              <ReactQuill
                theme="snow"
                value={emailContent}
                onChange={setEmailContent}
                modules={{
                  toolbar: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ script: "sub" }, { script: "super" }],
                    [
                      { header: "1" },
                      { header: "2" },
                      "blockquote",
                      "code-block",
                    ],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    ["direction", { align: [] }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Kirim
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
