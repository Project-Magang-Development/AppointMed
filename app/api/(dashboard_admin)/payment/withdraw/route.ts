import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  if (req.method !== "PUT") {
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

    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchant.findUnique({
      where: { merchant_id: decoded.merchantId },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    if (merchant.available_balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Catat expense dan perbarui available_balance
    try {
      const expense = await prisma.expense.create({
        data: {
          merchant_id: decoded.merchantId,
          amount,
        },
      });

      await prisma.merchant.update({
        where: { merchant_id: decoded.merchantId },
        data: {
          available_balance: {
            decrement: amount,
          },
        },
      });

      console.log("Expense recorded successfully:", expense);
    } catch (expenseError) {
      console.error("Failed to record expense:", expenseError);
      return NextResponse.json(
        { error: "Failed to record expense" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Balance updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing payout:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
