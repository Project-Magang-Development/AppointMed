import React, { useEffect, useState } from "react";
import { TimePicker, Button, Space, notification, Divider } from "antd";
import useSWR from "swr";
import Cookies from "js-cookie";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Title from "antd/es/typography/Title";

dayjs.extend(utc);

interface Schedule {
  schedules_id: string;
  start: string | null;
  end: string | null;
}

interface Doctor {
  imageUrl: string;
  doctor_id: string;
  name: string;
  specialist: string;
  practiceDays: string;
}

interface DoctorScheduleProps {
  doctor: Doctor;
}

interface DoctorSchedules {
  [day: string]: Schedule;
}

const fetcher = (url: any) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

const DoctorSchedule: React.FC<DoctorScheduleProps> = ({ doctor }) => {
  const { data: scheduleData, mutate } = useSWR(
    `/api/schedule/show/${doctor.doctor_id}`,
    fetcher
  );
  const [schedules, setSchedules] = useState<DoctorSchedules>({});

  useEffect(() => {
    if (scheduleData && Array.isArray(scheduleData)) {
      const normalizedSchedules: DoctorSchedules = {};
      scheduleData.forEach((item: any) => {
        const trimmedDay = item.day.trim();
        normalizedSchedules[trimmedDay] = {
          schedules_id: item.schedules_id,
          start: item.start_date,
          end: item.end_date,
        };
      });
      setSchedules(normalizedSchedules);
    } else {
      console.error("Invalid schedule data:", scheduleData);
    }
  }, [scheduleData]);

  const handleTimeChange = (
    timeString: string | string[],
    day: string,
    type: "start" | "end"
  ) => {
    const updatedSchedules = { ...schedules };
    const trimmedDay = day.trim();
    const timeStringValue = Array.isArray(timeString)
      ? timeString[0]
      : timeString;

    const currentDate = new Date().toISOString().slice(0, 10);
    updatedSchedules[trimmedDay] = {
      ...(updatedSchedules[trimmedDay] || {}),
      [type]: `${currentDate}T${timeStringValue}:00.000Z`,
    };
    setSchedules(updatedSchedules);
  };

  const saveSchedule = async () => {
    try {
      const promises = Object.entries(schedules).map(
        async ([day, { schedules_id, start, end }]) => {
          const isUpdate = Boolean(schedules_id);
          const url = isUpdate
            ? `/api/schedule/update/${schedules_id}`
            : "/api/schedule/create";
          const method = isUpdate ? "PUT" : "POST";
          const body = JSON.stringify({
            doctor_id: doctor.doctor_id,
            day: day,
            start: start,
            end: end,
          });

          const response = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body,
          });

          if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`Failed for ${day}: ${errorResponse}`);
          }

          const result = await response.json();
          return { day, isUpdate, success: true };
        }
      );

      const results = await Promise.all(promises);

      const successDays = results.filter(({ success }) => success);
      const errorDays = results.filter(({ success }) => !success);

      if (errorDays.length > 0) {
        const errorMessages = errorDays.map(({ day }) => day).join(", ");
        throw new Error(`Failed for ${errorMessages}`);
      }

      if (successDays.length > 0) {
        const successDaysList = successDays.map(({ day }) => day);
        const successMessages = `Jadwal pada hari ${successDaysList.join(
          ", "
        )} ${
          successDays.length === 1
            ? "telah berhasil"
            : "telah berhasil diperbarui"
        }`;
        notification.success({
          message: "Jadwal Berhasil Diproses",
          description: successMessages,
        });
      }

      await mutate();
    } catch (error) {
      console.error("Failed to save schedule:", error);
      notification.error({
        message: "Error Processing Schedule",
        description: `Failed to process schedules}`,
      });
    }
  };

  const practiceDays = doctor.practiceDays.split(", ");

  return (
    <>
      <div>
        <Image
          src={doctor.imageUrl}
          alt={doctor.name}
          width={200}
          height={200}
          layout="responsive"
        />
        <Title
          level={4}
          style={{ textAlign: "center", marginTop: 15, marginBlock: 0 }}
        >
          {doctor.name}
        </Title>
        <Title
          level={4}
          style={{
            textAlign: "center",
            marginTop: 10,
            marginBottom: 10,
            marginBlock: 0,
          }}
        >
          {doctor.specialist}
        </Title>
        <Divider/>
        {practiceDays.map((day) => (
          <div
            key={day.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
              marginTop: 10,
            }}
          >
            <p style={{ width: 100, margin: 0 }}>{day.trim()}:</p>
            <Space>
              <TimePicker
                value={
                  schedules[day.trim()]?.start
                    ? dayjs.utc(schedules[day.trim()].start)
                    : null
                }
                format="HH:mm"
                onChange={(time, timeString) =>
                  handleTimeChange(timeString, day.trim(), "start")
                }
              />
              <p> s/d </p>
              <TimePicker
                value={
                  schedules[day.trim()]?.end
                    ? dayjs.utc(schedules[day.trim()].end)
                    : null
                }
                format="HH:mm"
                onChange={(time, timeString) =>
                  handleTimeChange(timeString, day.trim(), "end")
                }
              />
            </Space>
          </div>
        ))}
        <Divider/>
        <Button
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={saveSchedule}
        >
          Set Jadwal
        </Button>
      </div>
    </>
  );
};

export default DoctorSchedule;
