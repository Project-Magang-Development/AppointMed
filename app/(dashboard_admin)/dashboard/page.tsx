"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate, SWRConfig } from "swr";
import Cookies from "js-cookie";
import {
  Tooltip as Detail,
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
  message,
  Divider,
  InputNumber,
  Input,
  Form,
  Button,
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
import {
  ClockCircleOutlined,
  UserOutlined,
  ArrowRightOutlined,
  BookOutlined,
  CarOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/id";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import DashboardSkeleton from "@/app/components/dashboardSkeleton";
import { useForm } from "antd/es/form/Form";
import { useMerchantEmail, useMerchantName } from "@/app/hooks/useLogin";
import axios from "axios";
import moment from "moment";

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

// ? Payout Bank options
const bankOptions = [
  { code: "ID_ALADIN", name: "Bank Aladin Syariah" },
  { code: "ID_ALLO", name: "Allo Bank Indonesia" },
  { code: "ID_AMAR", name: "Bank Amar Indonesia" },
  { code: "ID_ANZ", name: "Bank ANZ Indonesia" },
  { code: "ID_ARTHA", name: "Bank Artha Graha International" },
  { code: "ID_BALI", name: "Bank Pembangunan Daerah Bali" },
  { code: "ID_BAML", name: "Bank of America Merill-Lynch" },
  { code: "ID_BANTEN", name: "Bank Pembangunan Daerah Banten" },
  { code: "ID_BCA", name: "Bank Central Asia (BCA)" },
  { code: "ID_BCA_DIGITAL", name: "Bank Central Asia Digital" },
  { code: "ID_BCA_SYR", name: "Bank Central Asia (BCA) Syariah" },
  { code: "ID_BENGKULU", name: "Bank Pembangunan Daerah Bengkulu" },
  { code: "ID_BISNIS_INTERNASIONAL", name: "Bank Bisnis Internasional" },
  { code: "ID_BJB", name: "Bank BJB" },
  { code: "ID_BJB_SYR", name: "Bank BJB Syariah" },
  { code: "ID_BNC", name: "Bank Neo Commerce" },
  { code: "ID_BNI", name: "Bank Negara Indonesia (BNI)" },
  { code: "ID_BNP_PARIBAS", name: "Bank BNP Paribas" },
  { code: "ID_BOC", name: "Bank of China (BOC)" },
  { code: "ID_BRI", name: "Bank Rakyat Indonesia (BRI)" },
  { code: "ID_BSI", name: "Bank Syariah Indonesia (BSI)" },
  { code: "ID_BTN", name: "Bank Tabungan Negara (BTN)" },
];

// ? Data Type for the value
interface FormValue {
  banks: string;
  rekening: string;
  amount: number;
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
  const { data: showQueueCalendar, error: showQueueCalendarError } = useSWR(
    "/api/queue/showQueueCalendar",
    fetcher
  );
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
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const currentMonth = dayjs().format("MMMM");
  const currentYear = dayjs().year();
  const currentMonthYearSentence = ` ${currentMonth} - ${currentYear}`;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm<FormValue>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const merchantName = useMerchantName();
  const merchantEmail = useMerchantEmail();
  const [balance, setBalance] = useState(0);
  const [incomeByMonth, setIncomeByMonth] = useState<Record<number, number>>(
    {}
  );
  const [expenseByMonth, setExpenseByMonth] = useState<Record<number, number>>(
    {}
  );

  // ? finance report logic
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Current month by default
  const fetchBalance = async (month: any, year: any) => {
    const token = Cookies.get("token");
    const response = await fetch(
      `/api/merchant_balance?month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("Response data:", data);
      setIncomeByMonth(data.incomeByMonth);
      setExpenseByMonth(data.expenseByMonth);
      setBalance(data.balance || 0); // Ensure consistency with property name
    } else {
      console.error("Failed to fetch balance");
    }
  };

  useEffect(() => {
    fetchBalance(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent({
      patient_name: clickInfo.event.extendedProps.patient_name,
      doctor_name: clickInfo.event.extendedProps.doctor_name,
      patient_phone: clickInfo.event.extendedProps.patient_phone,
      patient_gender: clickInfo.event.extendedProps.patient_gender,
      time: clickInfo.event.extendedProps.time,
    });
    setIsReportModalVisible(true);
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
        open={isReportModalVisible}
        onOk={() => setIsReportModalVisible(false)}
        onCancel={() => setIsReportModalVisible(false)}
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleMonthChange = (value: any) => {
    setSelectedMonth(value);
  };
  const handleYearChange = (year: any) => {
    setSelectedYear(year);
  };
  const selectedMonthIncome = incomeByMonth[selectedMonth] || 0;
  const selectedMonthExpense = expenseByMonth[selectedMonth] || 0;
  const selectedMonthDifference = selectedMonthIncome - selectedMonthExpense;

  //? xendit payout function
  const performPayout = async (formValue: FormValue) => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    if (!secretKey) {
      throw Error("Tidak ada API Key Xendit");
    }

    const endpoint = "https://api.xendit.co/v2/payouts";
    const basicAuthHeader = `Basic ${Buffer.from(secretKey + ":").toString(
      "base64"
    )}`;

    const generateId = () => {
      return Math.random().toString(36).substring(2, 9);
    };

    try {
      // Get available_balance from your server
      const token = Cookies.get("token");
      const merchantResponse = await fetch("/api/merchant_balance", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!merchantResponse.ok) {
        throw new Error("Failed to fetch merchant data");
      }

      const merchantData = await merchantResponse.json();
      const availableBalance = merchantData.available_balance;

      // Check if available_balance is less than payout amount
      const payoutAmount = Number(formValue.amount);
      if (availableBalance < payoutAmount) {
        message.error("Saldo anda tidak cukup");
        return; // Stop the function execution if balance is insufficient
      }

      const payoutData = {
        reference_id: generateId(),
        channel_code: formValue.banks,
        channel_properties: {
          account_number: formValue.rekening,
          account_holder_name: merchantName,
        },
        amount: payoutAmount, // Use available_balance as the payout amount
        description: "Pencairan Dana",
        currency: "IDR",
        receipt_notification: {
          // TODO: sesuaikan email nya
          email_to: [merchantEmail],
        },
      };

      const response = await axios.post(endpoint, payoutData, {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
          "Idempotency-Key": generateId(), // Ensure unique idempotency key
        },
      });
      message.success({ content: "Pencairan Dana Berhasil", duration: 6 });

      console.log("Payout successful:", response.data);

      // Update available_balance on your server
      const updateResponse = await fetch("/api/payment/withdraw", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: payoutAmount }),
      });

      if (!updateResponse.ok) {
        message.error("Gagal melakukan update balance");
        throw new Error("Failed to update balance");
      }
      await fetchBalance(selectedMonth, selectedYear);
      setIsReportModalVisible(false);
      setConfirmLoading(false);
    } catch (error) {
      console.error("Failed to perform payout:", error);
      throw new Error("Failed to perform payout");
    }
  };

  const handleOk = async () => {
    try {
      const formValue = form.getFieldsValue();
      console.log("Form Value:", formValue);

      setConfirmLoading(true);
      form.resetFields();
      await performPayout(formValue);
      setIsReportModalVisible(false);
      setConfirmLoading(false);
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const minimumWithdrawalAmount = 10000; //minimal penarikan dalam Rp

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
      title: "Antrian Hari Ini",
      value: totalPatient,
      icon: <img src="/icons/antrian.svg" alt="" />,
    },
    {
      title: "Pendapatan",
      value: `Rp. ${totalRevenue.toLocaleString()}`,
      icon: <img src="/icons/pendapatan.svg" alt="" />,
      hasButton: true,
    },
  ];

  return (
    <SWRConfig>
      <>
        <Modal
          title="Laporan Keuangan"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={confirmLoading}
          okButtonProps={{ disabled: isButtonDisabled }}
        >
          <Divider
            orientation="left"
            orientationMargin={0}
            style={{
              marginBlock: "1rem",
              color: "gray",
              fontWeight: "normal",
              fontSize: "0.9rem",
            }}
          >
            Saldo
          </Divider>

          <Flex
            gap={15}
            justify="start"
            align="center"
            style={{ marginBottom: "0.5rem" }}
          >
            <DollarCircleOutlined style={{ fontSize: "1.3rem" }} />
            <p style={{ fontWeight: "bold", fontSize: "1rem" }}>
              Rp {balance.toLocaleString("id-ID")}
            </p>
          </Flex>
          <Divider
            orientation="left"
            orientationMargin={0}
            style={{
              marginBlock: "1rem",
              color: "gray",
              fontWeight: "normal",
              fontSize: "0.9rem",
            }}
          >
            Riwayat
          </Divider>

          <Flex gap={10} style={{ marginBottom: "0.5rem" }}>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: 120 }}
            >
              {monthNames.map((month, index) => (
                <Option value={index} key={index}>
                  {month}
                </Option>
              ))}
            </Select>
            <Select value={selectedYear} onChange={handleYearChange}>
              {Array.from({ length: 10 }, (_, i) => moment().year() - i).map(
                (year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                )
              )}
            </Select>
          </Flex>
          {/* <p>{currentMonthYearSentence}</p> */}

          <Flex
            vertical
            gap={10}
            style={{
              border: "1px solid #E6E6E6",
              borderRadius: "10px",
              padding: "0.5rem",
            }}
          >
            <Flex justify="space-around" align="center">
              <Flex gap={20} align="center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    height: "3rem",
                    width: "3rem",
                    borderRadius: "50%",
                    marginBottom: "0.5rem",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%" // Mengatur lebar SVG menjadi 100% dari lebar div
                    height="100%" // Mengatur tinggi SVG menjadi 100% dari tinggi div
                    viewBox="0 0 24 24"
                    fill="#45e64d"
                  >
                    <g>
                      <path d="M12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z" />
                      <polygon points="13 13.586 13 8 11 8 11 13.586 8.707 11.293 7.293 12.707 12 17.414 16.707 12.707 15.293 11.293 13 13.586" />
                    </g>
                  </svg>
                </div>
                <Flex vertical>
                  <p style={{ color: "gray" }}>Pemasukan</p>
                  <ul>
                    <li>Rp {selectedMonthIncome.toLocaleString("id-ID")}</li>
                  </ul>
                </Flex>
              </Flex>
              <Flex gap={20} align="center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    height: "3rem",
                    width: "3rem",
                    borderRadius: "50%",
                    marginBottom: "0.5rem",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%" // Mengatur lebar SVG menjadi 100% dari lebar div
                    height="100%" // Mengatur tinggi SVG menjadi 100% dari tinggi div
                    viewBox="0 0 24 24"
                    fill="red"
                    style={{ transform: "rotate(180deg)" }}
                  >
                    <g>
                      <path d="M12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z" />
                      <polygon points="13 13.586 13 8 11 8 11 13.586 8.707 11.293 7.293 12.707 12 17.414 16.707 12.707 15.293 11.293 13 13.586" />
                    </g>
                  </svg>
                </div>
                <Flex vertical>
                  <p style={{ color: "gray" }}>Pengeluaran</p>
                  <ul>
                    <li>Rp {selectedMonthExpense.toLocaleString("id-ID")}</li>
                  </ul>
                </Flex>
              </Flex>
            </Flex>
            <Flex vertical justify="center" align="center">
              <p style={{ color: "gray" }}>Selisih</p>
              <p>Rp {selectedMonthDifference.toLocaleString("id-ID")}</p>
            </Flex>
          </Flex>
          <Divider
            orientation="left"
            orientationMargin={0}
            style={{
              marginBlock: "0.5rem",
              color: "black",
              fontWeight: "normal",
              fontSize: "0.9rem",
            }}
          >
            Pencairan Dana
          </Divider>
          <Flex vertical>
            <p style={{ color: "#B4B4B4", marginBottom: "0.5rem" }}>
              Cairkan dana hasil pendapatan yang telah diterima ke rekening
              bank.
            </p>
            <Form form={form}>
              <Form.Item name="banks" rules={[{ message: "Please input!" }]}>
                <Select placeholder="Pilih bank">
                  {bankOptions.map((bank) => (
                    <Select.Option key={bank.code} value={bank.code}>
                      {bank.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="rekening"
                rules={[{ required: true, message: "Please input your Name!" }]}
              >
                <Input
                  prefix={<CreditCardOutlined />}
                  placeholder="Masukan No Rekening"
                />
              </Form.Item>
              <Form.Item
                name="amount"
                style={{ width: "100%" }}
                rules={[
                  { required: true, message: "Minimal penarikan Rp 10,000" },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (Number(value) > balance) {
                        setIsButtonDisabled(true);
                        return Promise.reject("Saldo anda tidak cukup");
                      }
                      setIsButtonDisabled(false);
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber<number>
                  style={{ width: "100%" }}
                  prefix="Rp "
                  placeholder="Masukan Jumlah Uang"
                  min={minimumWithdrawalAmount}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                  }
                  onChange={(value) => {
                    const amountValue = Number(value);
                    if (amountValue > balance) {
                      form.setFields([
                        {
                          name: "amount",
                          errors: ["Tidak Boleh melebihi total pendapatan"],
                        },
                      ]);
                    }
                    // Check if button should be disabled
                    const hasErrors = form
                      .getFieldsError()
                      .some(({ errors }) => errors.length > 0);
                    setIsButtonDisabled(hasErrors || !amountValue);
                  }}
                />
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
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
                        fontSize: "19px",
                        fontFamily: "Lato",
                      }}
                    />
                    {/* //?Button Pencairan Dana */}
                    {item.hasButton && (
                      <Detail title="Laporan Keuangan">
                        <Button
                          size="small"
                          icon={<ArrowRightOutlined />}
                          style={{ backgroundColor: "white" }}
                          onClick={showModal}
                        />
                      </Detail>
                    )}
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
                    showQueueCalendar
                      ? showQueueCalendar.map((queue: any) => ({
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
                          {dayjs
                            .utc(queue.Reservation.date_time)
                            .format("HH:mm")}
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
              <Title
                level={3}
                style={{ textAlign: "center", color: "#007e85" }}
              >
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
                    stroke="#007e85"
                    activeDot={{ r: 8 }}
                    animationBegin={500}
                    animationDuration={2000}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card style={{ flex: 1, marginLeft: 10 }}>
              <Title
                level={3}
                style={{ textAlign: "center", color: "#007e85" }}
              >
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
                    stroke="#007e85"
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
      </>
    </SWRConfig>
  );
}
