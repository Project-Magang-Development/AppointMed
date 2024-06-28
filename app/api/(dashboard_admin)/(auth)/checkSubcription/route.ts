import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { message } from "antd";

export async function POST(req: Request) {
  try {
    const tokenHeader = req.headers.get("Authorization");
    const token = tokenHeader?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Token not provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        merchantId: string;
        email: string;
        merchant_company: string;
      };
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { merchant_id: decoded.merchantId },
    });

    if (!merchant) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentDate = new Date();
    const startOfDay = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (merchant.end_date) {
      const end_date = startOfDay(new Date(merchant.end_date));
      const threeDaysBeforeEndDate = new Date(end_date);
      threeDaysBeforeEndDate.setDate(threeDaysBeforeEndDate.getDate() - 3);
      const twoDaysBeforeEndDate = new Date(end_date);
      twoDaysBeforeEndDate.setDate(twoDaysBeforeEndDate.getDate() - 2);
      const oneDayBeforeEndDate = new Date(end_date);
      oneDayBeforeEndDate.setDate(oneDayBeforeEndDate.getDate() - 1);

      if (
        currentDate >= threeDaysBeforeEndDate &&
        currentDate < twoDaysBeforeEndDate &&
        merchant.status_subscriber === "Aktif"
      ) {
        return NextResponse.json({
          message: "Langganan akan berakhir dalam 3 hari",
        });
      }

      if (
        currentDate >= twoDaysBeforeEndDate &&
        currentDate < oneDayBeforeEndDate &&
        merchant.status_subscriber === "Aktif"
      ) {
        return NextResponse.json({
          message: "Langganan akan berakhir dalam 2 hari",
        });
      }

      if (
        currentDate >= oneDayBeforeEndDate &&
        currentDate < end_date &&
        merchant.status_subscriber === "Aktif"
      ) {
        return NextResponse.json({
          message: "Langganan akan berakhir dalam 1 hari",
        });
      }
    }

    if (merchant.end_date && currentDate >= new Date(merchant.end_date)) {
      await prisma.merchant.update({
        where: { merchant_id: decoded.merchantId },
        data: { status_subscriber: "Non Aktif" },
      });

      return NextResponse.json({
        message: "Langganan sudah berakhir.",
      });
    }

    return NextResponse.json({
      status: 200,
    });
  } finally {
    await prisma.$disconnect();
  }
}
