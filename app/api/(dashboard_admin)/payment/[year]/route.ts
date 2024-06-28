import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const year = parseInt(pathnameParts[pathnameParts.length - 1]);

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

    if (!year) {
      return new NextResponse(
        JSON.stringify({ error: "Please provide a year" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const payments = await prisma.payment.findMany({
      where: {
        status: "PAID",
        AND: [
          { merchant_id: decoded.merchantId },
          { payment_date: { gte: startDate, lt: endDate } },
        ],
      },
    });

    const paymentsPerMonth = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      amount: 0,
    }));

    payments.forEach((payment) => {
      const month = payment.payment_date?.getMonth();
      if (month !== undefined) {
        paymentsPerMonth[month].amount += payment.amount;
      }
    });

    return new NextResponse(JSON.stringify(paymentsPerMonth), {
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
