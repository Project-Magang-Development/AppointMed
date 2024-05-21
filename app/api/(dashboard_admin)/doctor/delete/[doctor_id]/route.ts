import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const doctor_id = pathnameParts[pathnameParts.length - 1];

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

    if (!doctor_id) {
      return new NextResponse(
        JSON.stringify({ error: "Please provide all required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const vehicle = await prisma.doctor.findUnique({
      where: { doctor_id: String(doctor_id) },
    });

    if (!vehicle || vehicle.merchant_id !== decoded.merchantId) {
      return new NextResponse(
        JSON.stringify({ error: "Vehicle not found or access denied" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await prisma.$transaction([
      prisma.schedule.deleteMany({
        where: { doctor_id: String(doctor_id) },
      }),
      prisma.doctor.delete({ where: { doctor_id: String(doctor_id) } }),
      prisma.merchant.update({
        where: { merchant_id: vehicle.merchant_id },
        data: { used_storage_vehicle: { decrement: 1 } },
      }),
    ]);

    return new NextResponse(
      JSON.stringify({
        message: "Vehicle deleted successfully",
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
    await prisma.$disconnect().catch((error) => {
      console.error("Error disconnecting from database:", error);
    });
  }
}
