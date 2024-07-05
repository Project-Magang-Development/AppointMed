import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export async function GET(req: Request) {
  try {
    const tokenHeader = req.headers.get("Authorization");
    const token = tokenHeader?.split(" ")[1];

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Token not provided" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        merchantId: string;
      };
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const date = url.searchParams.get("date");

    const formattedDate = date
      ? dayjs.utc(date).format("YYYY-MM-DD")
      : dayjs().utc().format("YYYY-MM-DD");

    const startOfDay = dayjs.utc(formattedDate).startOf("day").toDate();
    const endOfDay = dayjs.utc(formattedDate).endOf("day").toDate();

    const queues = await prisma.queue.findMany({
      where: {
        merchant_id: decoded.merchantId,
        Reservation: {
          date_time: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      },
      include: {
        Reservation: {
          include: {
            Schedule: {
              include: {
                doctor: true,
              },
            },
          },
        },
      },
      orderBy: {
        Reservation: {
          date_time: "asc",
        },
      },
    });

    return new NextResponse(JSON.stringify(queues), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error or Invalid Token" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
