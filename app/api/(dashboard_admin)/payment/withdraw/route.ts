import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
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

    const { amount, reference_id } = await req.json();

    if (!amount || !reference_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Simpan transaksi dengan status PENDING
    const payout = await prisma.payout.create({
      data: {
        reference_id,
        merchant_id: decoded.merchantId,
        amount,
        status: "PENDING",
      },
    });

    console.log("Payout transaction created:", payout);

    return NextResponse.json(
      { message: "Payout initiated successfully", payout },
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
