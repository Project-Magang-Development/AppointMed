"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { Divider, Flex, Input, Table } from "antd";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Title from "antd/es/typography/Title";
import TableSkeleton from "@/app/components/tableSkeleton";

dayjs.extend(utc);

const fetcher = (url: any) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

interface ReservationData {
  reservation_id: string;
  date_time: string;
  patient_name: string;
  patient_phone: string;
  patient_gender: string;
  patient_email: string;
  status: string;
  Schedule?: { doctors: { name: string } }; // Adding optional Schedule property for doctor name
}

export default function DashboardReservation() {
  const { data, error, isLoading } = useSWR<ReservationData[]>(
    "/api/reservation/show",
    fetcher
  );
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredReservation = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.filter(
      (reservation) =>
        reservation.patient_name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        reservation.date_time.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  const columns = [
    {
      title: "No",
      key: "index",
      render: (text: any, record: any, index: number) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Tanggal Reservasi",
      dataIndex: "date_time",
      key: "date_time",
      render: (text: any) => dayjs.utc(text).format("DD MMMM YYYY"),
    },
    {
      title: "Pilihan Jam",
      dataIndex: "date_time",
      key: "time_option",
      render: (text: any) => dayjs.utc(text).format("HH:mm"),
    },
    {
      title: "Nama Dokter",
      key: "doctor_name",
      render: (text: any, record: any) =>
        record.Schedule?.doctors?.name || "N/A",
    },
    {
      title: "Nama Pasien",
      dataIndex: "patient_name",
      key: "patient_name",
    },
    {
      title: "Jenis Kelamin",
      dataIndex: "patient_gender",
      key: "patient_gender",
    },
    {
      title: "No Hp Pasien",
      dataIndex: "patient_phone",
      key: "patient_phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <div
          style={{
            backgroundColor: status === "Pending" ? "#FCF3D4" : "#CCF0EB",
            color: status === "Pending" ? "#EFC326" : "#00B69B",
            padding: "5px",
            borderRadius: "5px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {status}
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: "#FFF", padding: "16px" }}>
      <Flex justify="space-between">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Data Reservasi
        </Title>
        <Input
          placeholder="Cari Pasien..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "50%" }}
        />
      </Flex>
      <Divider />
      {error && <div>Failed to load</div>}
      {!Array.isArray(data) && !error && <div><TableSkeleton /></div>}
      {Array.isArray(data) && (
        <Table
          dataSource={filteredReservation}
          columns={columns}
          rowKey="reservation_id"
          pagination={pagination}
          onChange={(newPagination) => {
            setPagination({
              pageSize: newPagination.pageSize || 10,
              current: newPagination.current || 1,
            });
          }}
        />
      )}
    </div>
  );
}
