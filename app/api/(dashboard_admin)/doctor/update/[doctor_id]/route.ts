import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split("/");
    const doctor_id = pathnameParts[pathnameParts.length - 1];

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
    const {
      name,
      specialist,
      practice_days,
      price,
      email,
      experiences,
      no_phone,
      no_sip,
      imageUrl,
    } = body;

    if (
      !name ||
      !specialist ||
      !practice_days ||
      !price ||
      !email ||
      !experiences ||
      !no_phone ||
      !no_sip ||
      !imageUrl
    ) {
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

    const doctor = await prisma.doctor.findUnique({
      where: { doctor_id: String(doctor_id) },
    });

    if (!doctor || doctor.merchant_id !== decoded.merchantId) {
      return new NextResponse(
        JSON.stringify({ error: "Doctor not found or access denied" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { doctor_id },
      data: {
        name,
        specialist,
        practiceDays: practice_days,
        price,
        email,
        experiences,
        no_phone,
        no_sip,
        imageUrl,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Doctor updated successfully",
        doctor: updatedDoctor,
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

