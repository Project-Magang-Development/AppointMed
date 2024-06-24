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
}

interface Schedule {
  schedules_id: string;
  start_date: string;
  end_date: string;
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

export default function Home() {
  const [apiKey, setApiKey] = useState(
    "fd86d620febfa7ec759d3d640aaae4a8508e746862f6323ac293308878c98423"
  );
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [times, setTimes] = useState<TimeSlot[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");

  useEffect(() => {
    const key = document
      .querySelector("script[apiKey]")
      ?.getAttribute("apiKey");
    if (key) {
      setApiKey(key);
    }
  }, []);

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
  } = useSWR<Doctor[]>("/api/doctor/showSpecialist", fetcher);

  const {
    data: reservations,
    error: reservationsError,
    isValidating: isLoadingReservations,
  } = useSWR<Reservation[]>("/api/reservation/showReservation", fetcher);

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
        `/api/schedule/showTime?doctorId=${selectedDoctorId}&date=${formattedDate}`
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
        const reservationUrl = `http://localhost:3000/reservation?scheduleId=${selectedScheduleId}&date_time=${utcDateTime}&apiKey=${apiKey}&no_reservation=${reservationNo}`;
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
    <div>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
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
          <Form.Item label="Choose a specialist:" name="specialist">
            <Select
              showSearch
              value={selectedSpecialist}
              onChange={setSelectedSpecialist}
              placeholder="Select a Specialist"
              optionFilterProp="children"
            >
              {doctors && doctors.length > 0 ? (
                Array.from(
                  new Set(doctors.map((doctor) => doctor.specialist))
                ).map((specialist) => (
                  <Option key={specialist} value={specialist}>
                    {specialist}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  No Specialists Available
                </Option>
              )}
            </Select>
          </Form.Item>
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
                    title={`Nomor SIP: ${doctor.no_sip}, Pengalaman: ${doctor.experiences}`}
                  >
                    <Text strong>{doctor.name}</Text>
                  </Tooltip>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Date:" name="date">
            <DatePicker
              format="YYYY-MM-DD"
              value={selectedDate}
              onChange={setSelectedDate}
              disabled={!selectedDoctorId}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Select Time:" name="time">
            <Select
              showSearch
              value={selectedTime}
              onChange={handleTimeChange}
              placeholder="Select a Time"
              optionFilterProp="children"
              disabled={!times.length}
              style={{ width: "100%" }}
            >
              {times.map((slot, index) => (
                <Option key={index} value={slot.time}>
                  {slot.time}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <FormItem>
            <Button
              style={{
                color: "#FFFF",
                backgroundColor: "#007E85",
                width: "100%",
                marginTop: "20px",
              }}
              htmlType="submit"
              block
            >
              Lanjut
            </Button>
          </FormItem>
          <h1
            style={{
              textAlign: "center",
              fontWeight: "normal",
              fontSize: "1rem",
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#007E85",
            }}
          >
            Powered By AppointMed
          </h1>
        </Form>
      </Content>
    </div>
  );
}
