import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);



export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const schedules_id = pathnameParts[pathnameParts.length - 1];

  try {
    const tokenHeader = req.headers.get("Authorization");
    const token = tokenHeader?.split(" ")[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Token not provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      merchantId: string;
    };
    const body = await req.json();
    const { doctor_id, day, start, end } = body;


    if (!doctor_id || !day || !start || !end) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const startDate = dayjs.utc(start).toDate();
    const endDate = dayjs.utc(end).toDate();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid date formats" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updateSchedule = await prisma.schedule.update({
      where: { schedules_id },
      data: {
        doctor_id,
          day: day,
          start_date: startDate,
          end_date: endDate,
          merchant_id: decoded.merchantId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Schedule updated successfully",
        schedule: updateSchedule,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error or Invalid Token" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
