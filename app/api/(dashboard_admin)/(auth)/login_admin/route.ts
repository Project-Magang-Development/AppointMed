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

    if (!merchantPendingPayment) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const merchant = await prisma.merchant.findFirst({
      where: {
        merchant_email: email,
      },
      select: {
        status_subscriber: true,
        merchant_id: true,
        api_key: true,
        password: true,
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: "User not found or not active" },
        { status: 404 }
      );
    }

    if (merchant.status_subscriber !== "Aktif") {
      return NextResponse.json(
        { error: "The subscription period has expired" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, merchant.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        merchant_company: merchantPendingPayment.klinik_name,
        merchantId: merchant.merchant_id,
        email: merchantPendingPayment.merchant_email,
        merchant_name: merchantPendingPayment.merchant_name,
        api_key: merchant.api_key,
      },
      process.env.JWT_SECRET as string
    );

    return NextResponse.json({ token });
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
