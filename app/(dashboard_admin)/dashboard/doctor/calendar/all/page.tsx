"use client";

import { Row, Col, Card, Spin } from "antd";
import useSWR from "swr";
import DoctorSchedule from "./DoctorComponent";
import Cookies from "js-cookie";

const fetcher = (url: any) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

function CalendarAll() {
  const { data: doctors, error } = useSWR("/api/doctor/show", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!doctors) return <Spin tip="Loading..." />;

  return (
    <Row gutter={16}>
      {doctors.map((doctor: any) => (
        <Col span={8} key={doctor.doctor_id}>
          <Card>
            <DoctorSchedule doctor={doctor} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default CalendarAll;
