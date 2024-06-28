"use client";

import React, { useMemo, useState } from "react";
import { Divider, Input, message, Table } from "antd";
import moment from "moment";
import "moment/locale/id";
import Title from "antd/es/typography/Title";
import Cookies from "js-cookie";
import useSWR from "swr";
import TableSkeleton from "@/app/components/tableSkeleton";

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

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
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
    // {
    //   title: "Harga Paket",
    //   dataIndex: ["MerchantPayment", "MerchantPendingPayment", "amount"],
    //   key: "amount",
    //   render: (amount: number) =>
    //     amount.toLocaleString("id-ID", {
    //       style: "currency",
    //       currency: "IDR",
    //     }) || "Tidak tersedia",
    // },
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
  ];

  return (
    <div>
      <Title level={3}>Data Merchant</Title>
      <Divider />
      <div style={{ display: "flex", justifyContent: "end" }}>
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
    </div>
  );
}
