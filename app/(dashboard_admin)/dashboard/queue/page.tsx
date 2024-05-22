"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Input,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ScheduleOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";

dayjs.extend(utc);

const { Title } = Typography;

const fetcher = (url: any) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

interface Doctor {
  name: string;
}

interface Schedule {
  doctors: Doctor;
}

interface Reservation {
  Schedule: Schedule;
  patient_name: string;
  date_time: string;
  time: string;
  status: string;
}

interface Queue {
  queue_id: string;
  Reservation: Reservation;
  has_arrived: boolean;
}

export default function DashboardQueue() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const date = searchParams.get("date") || dayjs().utc().format("YYYY-MM-DD");
  const fetchUrl = useMemo(() => {
    let url = "/api/queue/show";
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    return `${url}?${params.toString()}`;
  }, [date]);

  const { data: queues, error, mutate } = useSWR<Queue[]>(fetchUrl, fetcher);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredQueues = useMemo(() => {
    if (!queues || !Array.isArray(queues)) return [];
    return queues.filter(
      (queue: any) =>
        queue.Reservation.patient_name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        queue.Reservation.Schedule.doctors.name
          .toLowerCase()
          .includes(searchText.toLowerCase())
    );
  }, [queues, searchText]);

  const groupByDoctor = (queues: Queue[]) => {
    return queues.reduce((acc, queue) => {
      const doctorName = queue.Reservation.Schedule.doctors.name;
      if (!acc[doctorName]) {
        acc[doctorName] = [];
      }
      acc[doctorName].push(queue);
      return acc;
    }, {} as Record<string, Queue[]>);
  };

  const queuesGroupedByDoctor = useMemo(() => {
    if (!queues || !Array.isArray(queues)) return {};
    return groupByDoctor(queues);
  }, [queues]);

  const updateArrivalStatus = async (queue_id: string, arrived: boolean) => {
    try {
      const response = await fetch("/api/queue/updateArrival", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ queue_id, arrived }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      mutate();
    } catch (error) {
      console.error("Failed to update arrival status:", error);
      message.error("Failed to update arrival status.");
    }
  };

  const handleDateChange = (date: any) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      router.push(`/dashboard/queue?date=${formattedDate}`);
    } else {
      router.push(`/dashboard/queue`);
    }
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Nama Pasien",
      dataIndex: ["Reservation", "patient_name"],
      key: "patientName",
    },
    {
      title: "No. Antrian",
      dataIndex: ["Reservation", "no_reservation"],
      key: "noReservation",
    },
    {
      title: "Tanggal Reservasi",
      dataIndex: ["Reservation", "date_time"],
      key: "date",
      render: (text: any) => dayjs.utc(text).format("DD MMM YYYY"),
    },
    {
      title: "Jam",
      dataIndex: ["Reservation", "date_time"],
      key: "time",
      render: (text: any) => dayjs.utc(text).format("HH:mm"),
    },
    {
      title: "Keterangan",
      key: "actions",
      render: (text: any, record: Queue) => (
        <Space>
          {record.has_arrived ? (
            <Button
              disabled
              style={{ cursor: "not-allowed", backgroundColor: "green" }}
            >
              Datang
            </Button>
          ) : (
            <Button onClick={() => updateArrivalStatus(record.queue_id, true)}>
              Datang
            </Button>
          )}
          {!record.has_arrived ? (
            <Button
              disabled
              style={{ cursor: "not-allowed", backgroundColor: "red" }}
            >
              Tidak Datang
            </Button>
          ) : (
            <Button onClick={() => updateArrivalStatus(record.queue_id, false)}>
              Tidak Datang
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Flex justify="space-around">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Data Antrian Pasien
        </Title>
        <Flex justify="end" gap={30}>
          <DatePicker
            placeholder="Pilih Tanggal"
            style={{ width: "100%" }}
            onChange={handleDateChange}
          />
          <Input
            placeholder="Cari Pasien..."
            value={searchText}
            onChange={handleSearch}
            style={{ width: "100%" }}
          />
        </Flex>
      </Flex>
      <Divider />
      {error && <div>Failed to load data</div>}
      {!queues && !error && <div>Loading...</div>}
      {Object.keys(queuesGroupedByDoctor).length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          Tidak ada data pasien
        </div>
      ) : (
        Object.entries(queuesGroupedByDoctor).map(
          ([doctorName, filteredQueues]) => (
            <div key={doctorName} style={{ marginBottom: 32 }}>
              <Flex
                justify="space-between"
                style={{ marginBottom: 24, alignItems: "center" }}
              >
                <Flex
                  justify="start"
                  align="center"
                  gap={10}
                  style={{ marginLeft: 30 }}
                >
                  <Title level={2} style={{ margin: 0 }}>
                    <ScheduleOutlined
                      style={{
                        margin: 0,
                        backgroundColor: "white",
                        fontSize: 30,
                      }}
                    />
                  </Title>
                  <Title level={4} style={{ marginBlock: 2 }}>
                    Antrian Pasien {doctorName}
                  </Title>
                </Flex>
                <Button
                  icon={<PlusOutlined />}
                  style={{ color: "#FFF", backgroundColor: "#007E85" }}
                >
                  Tambah Pasien
                </Button>
              </Flex>
              <Table
                dataSource={filteredQueues}
                columns={columns}
                rowKey="queue_id"
                pagination={{ pageSize: 5 }}
              />
            </div>
          )
        )
      )}
    </div>
  );
}
