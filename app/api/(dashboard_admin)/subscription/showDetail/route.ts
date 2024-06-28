import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
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
        merchantEmail: string;
      };
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const subscriptionDetail = await prisma.merchantPendingPayment.findMany({
      where: {
        merchant_email: decoded.merchantEmail,
        status: "PAID",
      },
      select: {
        invoice_id: true,
        package_name: true,
        package_id: true,
        payment_date: true,
        amount: true,
        package: {
          select: {
            duration: true,
          },
        },
      },
    });

    return NextResponse.json({ status: 200, subscriptionDetail });
  } finally {
    await prisma.$disconnect();
  }
}
