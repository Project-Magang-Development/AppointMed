"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Form,
  Layout,
  Select,
  Tooltip,
  DatePicker,
  Button,
  Typography,
  Steps,
  Col,
  Row,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import FormItem from "antd/es/form/FormItem";
import Title from "antd/es/typography/Title";
const { Step } = Steps;
dayjs.extend(utc);

const { Option } = Select;
const { Content } = Layout;
const { Text } = Typography;

interface Doctor {
  doctor_id: string;
  name: string;
  specialist: string;
  no_sip: string;
  experiences: string;
  price: number;
}

interface ScheduleProps {
  apiKey: string;
}

interface Reservation {
  date_time: string;
  no_reservation: string;
  reservationNo: string;
}

interface TimeSlot {
  time: string;
  scheduleId: string;
  reservationNo: string;
}

const Schedules: React.FC<ScheduleProps> = () => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [times, setTimes] = useState<TimeSlot[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const apiBaseUrl = "https://4ae4-182-253-75-201.ngrok-free.app";
  // const apiBaseUrl = "http://localhost:3000";
  const apiKey =
    "56732a8c26bcc5816716e5eec86deea42d6c247774c749bdedd342eb68d533fd";

  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }).then((res) => res.json());

  const {
    data: doctors,
    error: doctorsError,
    isValidating: isLoadingDoctors,
  } = useSWR<Doctor[]>(`${apiBaseUrl}/api/doctor/showSpecialist`, fetcher);

  const {
    data: reservations,
    error: reservationsError,
    isValidating: isLoadingReservations,
  } = useSWR<Reservation[]>(
    `${apiBaseUrl}/api/reservation/showReservation`,
    fetcher
  );

  useEffect(() => {
    if (selectedSpecialist && doctors) {
      const filtered = doctors.filter(
        (doctor) => doctor.specialist === selectedSpecialist
      );
      setFilteredDoctors(filtered);
      setSelectedDoctorId("");
      setSelectedDoctorName("");
      setTimes([]);
      setSelectedDate(null);
    }
  }, [selectedSpecialist, doctors]);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      fetch(
        `${apiBaseUrl}/api/schedule/showTime?doctorId=${selectedDoctorId}&date=${formattedDate}`
      )
        .then((res) => res.json())
        .then((schedules) => {
          const timeSlots: TimeSlot[] = [];
          let reservationCounter = 1;

          if (schedules.length > 0) {
            schedules.forEach((schedule: any) => {
              const startTime = dayjs.utc(schedule.start_date);
              const endTime = dayjs.utc(schedule.end_date);
              let currentTime = startTime;

              while (currentTime.isBefore(endTime)) {
                const time = currentTime.format("HH:mm");

                // Check if this time is already reserved for the selected date
                const isReserved =
                  reservations &&
                  reservations.some(
                    (reservation) =>
                      dayjs.utc(reservation.date_time).format("HH:mm") ===
                        time &&
                      dayjs.utc(reservation.date_time).format("YYYY-MM-DD") ===
                        formattedDate
                  );

                if (!isReserved) {
                  let reservationNo = `A${reservationCounter
                    .toString()
                    .padStart(3, "0")}`;

                  while (
                    reservations!.some(
                      (reservation) =>
                        reservation.no_reservation === reservationNo
                    )
                  ) {
                    reservationCounter += 1;
                    reservationNo = `A${reservationCounter
                      .toString()
                      .padStart(3, "0")}`;
                  }

                  timeSlots.push({
                    time,
                    scheduleId: schedule.schedules_id,
                    reservationNo,
                  });

                  reservationCounter++;
                }

                currentTime = currentTime.add(10, "minute");
              }
            });
          }
          setTimes(timeSlots);
        })
        .catch(console.error);
    } else {
      setTimes([]);
    }
  }, [selectedDoctorId, selectedDate, reservations]);

  const handleOk = () => {
    if (selectedTime && selectedScheduleId && selectedDate) {
      const selectedSlot = times.find((slot) => slot.time === selectedTime);
      const reservationNo = selectedSlot ? selectedSlot.reservationNo : "";
      const utcDateTime = selectedDate
        ? selectedDate.format("YYYY-MM-DD") + " " + selectedTime
        : "";

      if (reservationNo) {
        const reservationUrl = `${apiBaseUrl}/reservation?scheduleId=${selectedScheduleId}&date_time=${utcDateTime}&apiKey=${apiKey}&no_reservation=${reservationNo}`;
        window.location.href = reservationUrl;
      } else {
        console.error("Reservation number is null or empty.");
      }
    }
  };

  const handleTimeChange = (value: string) => {
    const selectedSlot = times.find((slot) => slot.time === value);
    if (selectedSlot) {
      setSelectedScheduleId(selectedSlot.scheduleId);
      setSelectedTime(value);
    }
  };

  return (
    <div
      style={{
        // height: "auto",
        // minHeight: "100vh",
        // maxHeight: "120vh",
        marginTop: "5%",
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Form
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "800px",
          }}
          layout="vertical"
          onFinish={handleOk}
        >
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Steps size="small" current={0} style={{ marginBottom: "20px" }}>
              <Step title="Select Doctor" />
              <Step title="Fill Personal Data" />
              <Step title="Payment Process" />
              <Step title="Done" />
            </Steps>
          </Row>
          <Title
            level={2}
            style={{ marginBottom: "30px", textAlign: "center" }}
          >
            Quick Reservation
          </Title>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Choose Specialist:" name="specialist">
                <Select
                  showSearch
                  value={selectedSpecialist}
                  onChange={setSelectedSpecialist}
                  placeholder="Select a Specialist"
                  optionFilterProp="children"
                >
                  {Array.isArray(doctors) &&
                    Array.from(
                      new Set(doctors.map((doctor) => doctor.specialist))
                    ).map((specialist) => (
                      <Option key={specialist} value={specialist}>
                        {specialist}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Select Doctor:" name="doctor">
                <Select
                  showSearch
                  value={selectedDoctorName}
                  onChange={(value) => {
                    const selectedDoc = filteredDoctors.find(
                      (doctor) => doctor.name === value
                    );
                    if (selectedDoc) {
                      setSelectedDoctorId(selectedDoc.doctor_id);
                      setSelectedDoctorName(selectedDoc.name);
                    } else {
                      setSelectedDoctorId("");
                      setSelectedDoctorName("");
                    }
                  }}
                  placeholder="Select a Doctor"
                  optionFilterProp="children"
                  disabled={!filteredDoctors.length}
                >
                  {filteredDoctors.map((doctor) => (
                    <Option
                      key={doctor.doctor_id}
                      value={doctor.name}
                      label={doctor.name}
                    >
                      <Tooltip
                        title={`Nomor SIP: ${doctor.no_sip}, Pengalaman: ${
                          doctor.experiences
                        }, Harga: Rp. ${doctor.price.toLocaleString()}`}
                      >
                        <Text strong>{doctor.name}</Text>
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Select Date:" name="date">
                <DatePicker
                  format="YYYY-MM-DD"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  disabled={!selectedDoctorId}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Select Time:" name="time">
                <Select
                  value={selectedTime}
                  onChange={handleTimeChange}
                  placeholder="Select a Time Slot"
                  disabled={!selectedDate || !times.length}
                  style={{ width: "100%" }}
                >
                  {times.map((slot) => (
                    <Option key={slot.time} value={slot.time}>
                      {slot.time}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                height: "40px",
                backgroundColor:
                  selectedTime && selectedScheduleId && selectedDate
                    ? "#007E85"
                    : "#80BEC2",
                color: "white",
              }}
              disabled={!selectedTime || !selectedScheduleId || !selectedDate}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </div>
  );
};

export default Schedules;
