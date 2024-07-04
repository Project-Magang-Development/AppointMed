import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
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

    const body = await req.json();
    const { name, specialist, practice_days, price, email, experiences, no_phone, no_sip, imageUrl } = body;

    if (!name || !specialist || !practice_days || !price || !email || !experiences || !no_phone || !no_sip || !imageUrl) {
      return new NextResponse(
        JSON.stringify({
          error: "Please provide all required fields and the image size",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const merchant = await prisma.merchant.findUnique({
      where: { merchant_id: decoded.merchantId },
      include: { package: true, doctors: true },
    });

    if (!merchant) {
      return new NextResponse(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (
      merchant.package.count_doctor !== null &&
      merchant.used_storage_vehicle >= merchant.package.count_doctor
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Doctor limit exceeded" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        specialist,
        practiceDays: practice_days,
        price,
        email,
        experiences,
        no_phone: no_phone,
        no_sip: no_sip,
        imageUrl,
        merchant_id: decoded.merchantId,
      },
    });


    const updatedMerchant = await prisma.merchant.update({
      where: { merchant_id: decoded.merchantId },
      data: { used_storage_vehicle: { increment: 1 } },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Doctor created successfully",
        vehicle: newDoctor,
        updatedStorage: updatedMerchant.used_storage_vehicle,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error or Invalid Token" }),
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
