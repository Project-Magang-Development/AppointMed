import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const year = pathnameParts[pathnameParts.length - 1];

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
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!year || isNaN(Number(year))) {
      return new NextResponse(
        JSON.stringify({ error: "Please provide a valid year" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const queues = await prisma.queue.findMany({
      where: {
        merchant_id: decoded.merchantId,
        Reservation: {
          date_time: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        Reservation: true,
      },
    });

    const queuesPerMonth = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
    }));

    queues.forEach((queue) => {
      const month = queue.Reservation.date_time.getMonth(); // 0-based index (0 for January, 11 for December)
      queuesPerMonth[month].count += 1;
    });

    // No need to filter, just return the full array
    return new NextResponse(JSON.stringify(queuesPerMonth), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error accessing database:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
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
