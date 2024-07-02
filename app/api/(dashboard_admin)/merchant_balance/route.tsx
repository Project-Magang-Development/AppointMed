import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const tokenHeader = req.headers.get("authorization");
    const token = tokenHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Token not provided" },
        { status: 401 }
      );
    }

    let decoded: { merchantId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        merchantId: string;
      };
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get("month") || "0"); // Default to January if not provided
    const year = parseInt(
      url.searchParams.get("year") || new Date().getFullYear().toString()
    ); // Default to current year

    const startDate = new Date(year, month, 1); // Start of the specified month
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // End of the specified month

    const income = await prisma.income.findMany({
      where: {
        merchant_id: decoded.merchantId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        created_at: true,
      },
    });

    const expense = await prisma.expense.findMany({
      where: {
        merchant_id: decoded.merchantId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        created_at: true,
      },
    });

    const merchant = await prisma.merchant.findUnique({
      where: { merchant_id: decoded.merchantId },
      select: { available_balance: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    const formatDataByMonth = (data: any[]) => {
      return data.reduce((acc, item) => {
        const month = item.created_at.getMonth();
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += item.amount;
        return acc;
      }, {});
    };

    const incomeByMonth = formatDataByMonth(income);
    const expenseByMonth = formatDataByMonth(expense);

    return NextResponse.json(
      {
        incomeByMonth,
        expenseByMonth,
        balance: merchant.available_balance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error fetching income, expense, and balance by month:",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch income, expense, and balance by month" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
