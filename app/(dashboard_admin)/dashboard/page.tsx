"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate, SWRConfig } from "swr";
import Cookies from "js-cookie";
import {
  Row,
  Col,
  Card,
  Statistic,
  Alert,
  Typography,
  Flex,
  Modal,
  Spin,
  Avatar,
  Table,
  Select,
} from "antd";
import {
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/id";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import DashboardSkeleton from "@/app/components/dashboardSkeleton";

dayjs.extend(utc);
dayjs.locale("id");
const { Option } = Select;
const { Title } = Typography;

interface EventDetails {
  patient_name: string;
  doctor_name: string;
  patient_phone: string;
  patient_gender: string;
  time: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    },
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

export default function AdminDashboard() {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const {
    data: countData,
    error: countError,
    isLoading: loading,
  } = useSWR("/api/reservation/countPatient", fetcher);
  const {
    data: showQueue,
    error: showQueueError,
    mutate,
    isLoading,
  } = useSWR("/api/queue/showQueueDashboard", fetcher);
  const {
    data: totalAmount,
    error: totalAmountError,
    isLoading: totalAmountLoading,
  } = useSWR("/api/payment/totalAmount", fetcher);
  const {
    data: countPatient,
    error: countPatientError,
    isLoading: countPatientLoading,
  } = useSWR("/api/queue/countPatient", fetcher);
  const {
    data: queuePerMonth,
    error: queuePerMonthError,
    isLoading: queuePerMonthLoading,
  } = useSWR(`/api/queue/${selectedYear}`, fetcher);
  const {
    data: revenuePerMonth,
    error: revenuePerMonthError,
    isLoading: revenuePerMonthLoading,
  } = useSWR(`/api/payment/${selectedYear}`, fetcher);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const currentMonth = dayjs().format("MMMM");
  const currentYear = dayjs().year();
  const currentMonthYearSentence = ` ${currentMonth} - ${currentYear}`;

  const [currentTime, setCurrentTime] = useState(new Date());

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent({
      patient_name: clickInfo.event.extendedProps.patient_name,
      doctor_name: clickInfo.event.extendedProps.doctor_name,
      patient_phone: clickInfo.event.extendedProps.patient_phone,
      patient_gender: clickInfo.event.extendedProps.patient_gender,
      time: clickInfo.event.extendedProps.time,
    });
    setIsModalVisible(true);
  };

  const renderModal = () => {
    const columns = [
      {
        title: "Field",
        dataIndex: "field",
        key: "field",
      },
      {
        title: "Detail",
        dataIndex: "detail",
        key: "detail",
      },
    ];

    const data = [
      {
        key: "1",
        field: "Nama Pasien",
        detail: selectedEvent ? selectedEvent.patient_name : "",
      },
      {
        key: "2",
        field: "Dokter",
        detail: selectedEvent ? selectedEvent.doctor_name : "",
      },
      {
        key: "3",
        field: "No Hp Pasien",
        detail: selectedEvent ? selectedEvent.patient_phone : "",
      },
      {
        key: "4",
        field: "Gender",
        detail: selectedEvent ? selectedEvent.patient_gender : "",
      },
      {
        key: "5",
        field: "Waktu",
        detail: selectedEvent ? selectedEvent.time : "",
      },
    ];

    return (
      <Modal
        title="Detail Pasien"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={false}
          size="middle"
        />
      </Modal>
    );
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      tick();
    }, 1000); // Memanggil tick setiap detik

    return () => {
      clearInterval(timerID); // Bersihkan interval ketika komponen unmount
    };
  }, []);

  // useEffect(() => {
  //   const timerID = setInterval(() => {
  //     tick();
  //   }, 60000); // Memanggil tick setiap menit

  //   return () => {
  //     clearInterval(timerID);
  //   };
  // }, []);

  const tick = async () => {
    setCurrentTime(new Date());
    await mutate();
  };

  if (countError || showQueueError)
    return <Alert message="Error loading data!" type="error" />;

  if (
    countData == null ||
    showQueue == null ||
    totalAmount == null ||
    countPatient == null ||
    queuePerMonth == null ||
    revenuePerMonth == null
  )
    return <DashboardSkeleton />;

  const totalRevenue =
    totalAmount._sum.amount !== null ? totalAmount._sum.amount : 0;

  const totalPatient = countPatient.count;

  const queuePerMonths = queuePerMonth.map((queue: any) => ({
    month: dayjs()
      .month(queue.month - 1)
      .format("MMMM"),
    "Jumlah Pasien": queue.count,
  }));

  const revenuePerMonths = revenuePerMonth.map((revenue: any) => ({
    month: dayjs()
      .month(revenue.month - 1)
      .format("MMMM"),
    "Jumlah Pendapatan": revenue.amount,
  }));

  const stats = [
    {
      title: "Total Pasien",
      value: countData,
      icon: <img src="/icons/pasien.svg" alt="" />,
    },
    {
      title: "Waktu Hari Ini",
      value: currentTime.toLocaleTimeString("en-GB", { hourCycle: "h23" }),
      icon: <img src="/icons/waktu.svg" alt="" />,
    },
    {
      title: "Pendapatan",
      value: `Rp. ${totalRevenue.toLocaleString()}`,
      icon: <img src="/icons/pendapatan.svg" alt="" />,
    },
    {
      title: "Antrian Hari Ini",
      value: totalPatient,
      icon: <img src="/icons/antrian.svg" alt="" />,
    },
  ];

  return (
    <SWRConfig>
      <div>
        <Title level={3}>{currentMonthYearSentence}</Title>
        <Flex justify="space-between">
          <Flex gap={16} style={{ marginBottom: 30, width: "100%" }}>
            {stats.map((item, index) => (
              <Flex
                gap={20}
                style={{
                  padding: "20px",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  fontFamily: "Lato",
                }}
                key={index}
              >
                <Flex gap={20}>
                  <Flex
                    justify="space-between"
                    style={{
                      width: "100%",
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      style: { fontSize: "24px", color: "#8260FE" },
                    })}
                  </Flex>
                </Flex>
                <Flex vertical>
                  <h3 style={{ margin: 0, fontWeight: "bold" }}>
                    {item.title}
                  </h3>
                  <Statistic
                    value={item.value}
                    valueStyle={{
                      color: "#AEB9E1",
                      fontSize: "20px",
                      fontFamily: "Lato",
                    }}
                  />
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>

        <Flex justify="space-between">
          <Col flex="2">
            <Card bordered={false} style={{ marginRight: 8 }}>
              {renderModal()}
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locales={allLocales}
                locale="id"
                events={
                  showQueue
                    ? showQueue.map((queue: any) => ({
                        title: `${queue.Reservation.patient_name}`,
                        start: dayjs
                          .utc(queue.Reservation.date_time)
                          .format("YYYY-MM-DD"),
                        extendedProps: {
                          patient_name: queue.Reservation.patient_name,
                          doctor_name: queue.Reservation.Schedule.doctor.name,
                          patient_phone: queue.Reservation.patient_phone,
                          patient_gender: queue.Reservation.patient_gender,
                          time: dayjs
                            .utc(queue.Reservation.date_time)
                            .format("HH:mm"),
                        },
                      }))
                    : []
                }
                eventClick={handleEventClick}
              />
            </Card>
          </Col>
          <Col flex="1">
            <Card title="Antrian Pasien" style={{ marginLeft: 8 }}>
              {showQueue && showQueue.length > 0 ? (
                showQueue.map((queue: any, index: any) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: 16,
                      borderBottom: "1px solid #eee",
                      paddingBottom: 16,
                    }}
                  >
                    <Row justify="space-between">
                      <Col>
                        <Avatar
                          style={{
                            backgroundColor: "#1890ff",
                            verticalAlign: "middle",
                            width: "40px",
                            height: "40px",
                            lineHeight: "50px",
                            fontSize: "13px",
                          }}
                        >
                          {queue.Reservation.no_reservation}
                        </Avatar>
                      </Col>
                      <Col>
                        <Title level={5}>
                          {queue.Reservation.patient_name}
                        </Title>
                        <p>{queue.Reservation.Schedule.doctor.name}</p>
                      </Col>
                      <p>
                        {dayjs.utc(queue.Reservation.date_time).format("HH:mm")}
                      </p>
                    </Row>
                  </div>
                ))
              ) : (
                <Alert message="Tidak ada antrian." type="info" showIcon />
              )}
            </Card>
          </Col>
        </Flex>
        <Select
          defaultValue={selectedYear}
          style={{ width: 120, marginTop: 20 }}
          onChange={(value) => setSelectedYear(value)}
        >
          {Array.from(
            new Array(20),
            (val, index) => dayjs().year() - index
          ).map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
        <Flex justify="space-between" style={{ marginTop: 20 }}>
          <Card style={{ flex: 1, marginRight: 10 }}>
            <Title level={3} style={{ textAlign: "center" }}>
              Jumlah Pasien {selectedYear}
            </Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={queuePerMonths}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis
                  allowDecimals={false}
                  domain={["dataMin - 1", "dataMax + 1"]}
                  label={{
                    value: "Jumlah",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="Jumlah Pasien"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  animationBegin={500}
                  animationDuration={2000}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card style={{ flex: 1, marginLeft: 10 }}>
            <Title level={3} style={{ textAlign: "center" }}>
              Jumlah Pendapatan {selectedYear}
            </Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenuePerMonths}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) =>
                    `${(value / 1000000).toFixed(1)} Jt`
                  }
                  domain={["dataMin", "dataMax"]}
                  label={{
                    value: "Total (Jt)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="Jumlah Pendapatan"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  animationBegin={500}
                  animationDuration={2000}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Flex>
      </div>
    </SWRConfig>
  );
}
