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
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
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

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const merchants = await prisma.merchantPendingPayment.findMany({
      where: {
        status: "PAID",
        payment_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const bookingsPerMonth = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      amount: 0,
    }));

    merchants.forEach((merchant) => {
      if (merchant.payment_date) {
        const month = new Date(merchant.payment_date).getMonth(); // 0-based index (0 for January, 11 for December)
        const merchantYear = new Date(merchant.payment_date).getFullYear(); // Get the year of the payment_date
        if (merchantYear.toString() === year) {
          bookingsPerMonth[month].amount += merchant.amount; // Accumulate the amount for the corresponding month
        }
      }
    });

    return new NextResponse(JSON.stringify(bookingsPerMonth), {
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
