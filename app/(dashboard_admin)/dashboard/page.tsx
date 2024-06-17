"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";
import { Row, Col, Card, Statistic, Alert, Typography, Flex, Modal, Spin, Avatar, Table } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";

dayjs.extend(utc);

const { Title } = Typography;

interface EventDetails {
  patient_name: string;
  doctor_name: string;
  patient_phone: string;
  patient_gender: string
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
  const { data: countData, error: countError } = useSWR(
    "/api/reservation/countPatient",
    fetcher
  );
  const {
    data: showQueue,
    error: showQueueError,
    mutate,
  } = useSWR("/api/queue/showQueueDashboard", fetcher);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);

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

if(countData == null || showQueue == null) return <Spin tip="Loading..." />

  const stats = [
    {
      title: "TOTAL PASIEN",
      value: countData,
      icon: <UserOutlined />,
    },
    {
      title: "WAKTU HARI INI",
      value: currentTime.toLocaleTimeString("en-GB", { hourCycle: "h23" }),
      icon: <ClockCircleOutlined />,
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        {stats.map((item, index) => (
          <Col span={6} key={index}>
            <Card
              bordered={false}
              bodyStyle={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ margin: 0, fontWeight: "bold", color: "gray" }}>
                  {item.title}
                </h3>
                {React.cloneElement(item.icon, {
                  style: { fontSize: "24px", color: "#8260FE" },
                })}
              </div>
              <div
                style={{
                  alignSelf: "flex-start",
                  margin: "10px 0 0",
                  width: "100%",
                }}
              >
                <Statistic
                  value={item.value}
                  valueStyle={{
                    color: "black",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
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
                        doctor_name: queue.Reservation.Schedule.doctors.name,
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
                      <Title level={5}>{queue.Reservation.patient_name}</Title>
                      <p>{queue.Reservation.Schedule.doctors.name}</p>
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
    </div>
  );
}