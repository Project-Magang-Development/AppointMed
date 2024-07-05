import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import nodemailer from "nodemailer";
import "dayjs/locale/id";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.locale("id");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      schedules_id,
      apiKey,
      date_time,
      patient_name,
      patient_phone,
      patient_gender,
      patient_email,
      no_reservation,
      patient_address,
      external_id,
      total_amount,
    } = body;

    if (
      !schedules_id ||
      !apiKey ||
      !date_time ||
      !patient_name ||
      !patient_phone ||
      !patient_gender ||
      !patient_email ||
      !no_reservation ||
      !patient_address ||
      !external_id ||
      !total_amount
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const merchant = await prisma.merchant.findUnique({
      where: { api_key: apiKey },
      include: {
        package: true
      }
    });

    if (!merchant) {
      return new NextResponse(
        JSON.stringify({ error: "Merchant not found or inactive" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (
      merchant.package.count_order !== null &&
      merchant.used_storage_order >= merchant.package.count_order
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Order limit exceeded" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const schedule = await prisma.schedule.findUnique({
      where: { schedules_id },
      include: { doctor: true },
    });

    if (!schedule) {
      return new NextResponse(JSON.stringify({ error: "Schedule not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dateTime = dayjs.utc(date_time, "YYYY-MM-DD HH:mm").toISOString();
    const time = dayjs.utc(date_time, "HH:mm").toISOString();

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        schedules_id,
        date_time: dateTime,
      },
    });

    if (existingReservation) {
      return new NextResponse(
        JSON.stringify({ error: "A reservation already exists at this time" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const createdReservation = await prisma.reservation.create({
      data: {
        schedules_id,
        no_reservation,
        date_time: dateTime,
        patient_name,
        patient_email,
        patient_gender,
        patient_address,
        patient_phone,
        merchant_id: merchant?.merchant_id,
        external_id,
        total_amount,
      },
      include: {
        Schedule: {
          include: {
            doctor: true,
          },
        },
      },
    });

    await prisma.merchant.update({
      where: { merchant_id: merchant!.merchant_id },
      data: { used_storage_order: { increment: 1 } },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Schedule created successfully",
        data: createdReservation,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
