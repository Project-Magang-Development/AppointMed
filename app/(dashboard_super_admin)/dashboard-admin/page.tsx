"use client";

import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Row, Select, Spin, Statistic } from "antd";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
import moment from "moment";
import "moment/locale/id";
import {
  BookOutlined,
  CarOutlined,
  DatabaseOutlined,
  DollarCircleOutlined,
  OrderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Cookies from "js-cookie";
import useSWR from "swr";
import DashboardSkeleton from "@/app/components/dashboardSkeleton";

const { Option } = Select;

const fetcher = (url: any) =>
  fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${Cookies.get("tokenAdmin")}`,
      "Content-Type": "application/json",
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Fetching error:", error);
      throw error;
    });

export default function SuperAdminDashboard() {
  const currentMonth = moment().format("MMMM");
  const currentYear = moment().year();
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const { data: totalMerchants, error: errorTotalMerchants } = useSWR(
    "/api/merchant/totalMerchant",
    fetcher
  );

  const { data: totalPackages, error: errorTotalPackages } = useSWR(
    "/api/package/totalPackage",
    fetcher
  );

  const { data: monthlyPayments, error: errorMonthlyPayments } = useSWR(
    "/api/package/totalAmount",
    fetcher
  );

  const { data: yearMerchants, error: errorYearMerchants } = useSWR(
    `/api/merchant/${selectedYear}`,
    fetcher
  );

  const { data: yearAmounts, error: errorYearAmounts } = useSWR(
    `/api/package/${selectedYear}`,
    fetcher
  );

  if (
    typeof totalMerchants === "undefined" ||
    typeof totalPackages === "undefined" ||
    typeof monthlyPayments === "undefined"
  ) {
    return <DashboardSkeleton />;
  }

  const totalRevenue =
    monthlyPayments._sum.amount !== null ? monthlyPayments._sum.amount : 0;

  const yearPaymentsData =
    yearAmounts?.map((item: any) => ({
      month: moment(item.month, "M").locale("id").format("MMMM"),
      "Total Pendapatan": item.amount,
      TotalPendapatanFormatted: `Rp ${item.amount.toLocaleString()}`,
    })) || [];

  const yearMerchantsData =
    yearMerchants?.map((item: any) => ({
      month: moment(item.month, "M").locale("id").format("MMMM"),
      "Jumlah Merchant": item.count,
    })) || [];

  const currentMonthYearSentence = ` ${currentMonth} - ${currentYear}`;
  const data = [
    {
      title: "TOTAL PELANGGAN",
      value: totalMerchants,
      icon: <UserOutlined />,
    },
    {
      title: "TOTAL PAKET",
      value: totalPackages,
      icon: <DatabaseOutlined />,
    },
    {
      title: "TOTAL PENDAPATAN",
      value: "Rp " + totalRevenue.toLocaleString(),
      icon: <DollarCircleOutlined />,
    },
  ];

  return (
    <h1>Test</h1>
     )
}
