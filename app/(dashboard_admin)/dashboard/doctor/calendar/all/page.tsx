"use client";

import { Row, Col, Card, Alert, Divider, Input } from "antd";
import useSWR from "swr";
import DoctorSchedule from "./DoctorComponent";
import Cookies from "js-cookie";
import TableSkeleton from "@/app/components/tableSkeleton";
import Title from "antd/es/typography/Title";
import { useMemo, useState } from "react";

interface Doctor {
  name: string;
  specialist: string;
}

const fetcher = (url: any) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

function CalendarAll() {
  const { data: doctors, error } = useSWR("/api/doctor/show", fetcher);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) return [];
    return doctors.filter(
      (doctor: Doctor) =>
        doctor.name.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.specialist.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [doctors, searchText]);

  if (error) return <div>Failed to load</div>;
  if (!doctors) return <TableSkeleton />;


  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3}>Jadwal Dokter</Title>
        <Input
          placeholder="Cari Dokter..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "100%", maxWidth: "300px" }}
        />
      </div>
      <Divider />
      <Row gutter={16}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor: any) => (
            <Col span={8} key={doctor.doctor_id}>
              <Card>
                <DoctorSchedule doctor={doctor} />
              </Card>
            </Col>
          ))
        ) : (
          <Alert message="Tidak Ada data dokter" type="info" />
        )}
      </Row>
    </>
  );
}

export default CalendarAll;
