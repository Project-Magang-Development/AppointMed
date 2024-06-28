import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ status: 400, error: "Email is required" });
    }

    const merchant = await prisma.merchantPendingPayment.findFirst({
      where: {
        merchant_email: String(email),
      },
    });

    if (!merchant) {
      return NextResponse.json({ status: 404, error: "Merchant not found" });
    }

    return NextResponse.json({ status: 200, data: merchant });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
