import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {

     const apiKeyHeader = req.headers.get("Authorization");
     const apiKey = apiKeyHeader?.split(" ")[1];

     console.log(apiKey);

     if (!apiKey) {
       return new Response(JSON.stringify({ error: "API key not provided" }), {
         status: 401,
         headers: { "Content-Type": "application/json" },
       });
     }

     const merchant = await prisma.merchant.findUnique({
       where: { api_key: apiKey },
     });

     if (!merchant) {
       return new Response(
         JSON.stringify({ error: "Merchant not found or inactive" }),
         {
           status: 404,
           headers: { "Content-Type": "application/json" },
         }
       );
     }

    const reservations = await prisma.reservation.findMany({
      where: {
        merchant_id: merchant.merchant_id,
      },
      orderBy: {
        reservation_id: "desc",
      },
      select: {
          date_time: true,
          no_reservation: true,
      }
    });

    return new NextResponse(JSON.stringify(reservations), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
