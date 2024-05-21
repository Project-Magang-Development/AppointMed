import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc"; // Ensure you use the UTC plugin if dealing with UTC dates

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc); // Use UTC to avoid timezone issues if your dates are stored in UTC

type DayMap = {
  [key in
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"]: string;
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const doctor_id = url.searchParams.get("doctorId");
    const dateString = url.searchParams.get("date");

    if (!doctor_id || !dateString) {
      return new Response(
        JSON.stringify({ error: "Doctor ID or Date not provided" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const date = dayjs(dateString);
    if (!date.isValid()) {
      return new Response(JSON.stringify({ error: "Invalid date format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dayOfWeekEnglish = date.format("dddd") as keyof DayMap;
    const dayMap: DayMap = {
      Sunday: "Minggu",
      Monday: "Senin",
      Tuesday: "Selasa",
      Wednesday: "Rabu",
      Thursday: "Kamis",
      Friday: "Jumat",
      Saturday: "Sabtu",
    };
    const dayOfWeekIndonesian = dayMap[dayOfWeekEnglish];

    const schedules = await prisma.schedule.findMany({
      where: {
        doctor_id: doctor_id,
        day: dayOfWeekIndonesian,
      },
      select: {
        schedules_id: true,
        merchant_id: true,
        doctor_id: true,
        start_date: true,
        end_date: true,
        day: true,
      },
      orderBy: {
        start_date: "asc",
      },
    });

    return new Response(JSON.stringify(schedules), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error accessing database:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
