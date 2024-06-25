import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const merchantPendingPayment =
      await prisma.merchantPendingPayment.findFirst({
        where: {
          merchant_email: email,
        },
      });

    const merchant = await prisma.merchant.findUnique({
      where: {
        merchant_email: email,
        status_subscriber: "Aktif",
      },
      select: {
        merchant_id: true,
        merchant_email: true,
        password: true,
        api_key: true,
      },
    });

    if (!merchant) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, merchant.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        merchantId: merchant.merchant_id,

        merchant_name: merchantPendingPayment?.merchant_name,
        email: merchant.merchant_email,
        merchant_company: merchantPendingPayment?.klinik_name,

        api_key: merchant.api_key,
      },
      process.env.JWT_SECRET as string
    );

    return NextResponse.json({ token, apiKey: merchant.api_key });
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
