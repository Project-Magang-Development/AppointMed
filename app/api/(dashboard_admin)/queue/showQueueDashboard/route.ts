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
        headers: { "Content-Type": "application/json" },
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


    const now = dayjs().utc().add(8, "hours").toISOString();
    const todayEnd = dayjs().utc().endOf("day").toISOString();


    const queues = await prisma.queue.findMany({
      take: 5,
      where: {
        merchant_id: decoded.merchantId,
        has_arrived: true,
        Reservation: {
          date_time: {

            gte: now,
            lte: todayEnd,

          },
        },
      },
      include: {
        Reservation: {
          select: {
            no_reservation: true,
            date_time: true,
            patient_name: true,
            patient_phone: true,
            patient_gender: true,
            Schedule: {
              select: {
                doctor: {
                  select: {
                    name: true,
                  },
                },
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
      headers: { "Content-Type": "application/json" },
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
