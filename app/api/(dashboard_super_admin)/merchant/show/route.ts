import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("merchant_email");
    const tokenHeader = req.headers.get("Authorization");
    const token = tokenHeader?.split(" ")[1];

    if (email) {
      if (!email) {
        return new NextResponse(
          JSON.stringify({ error: "Email not provided" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const merchant: any = await prisma.merchantPendingPayment.findMany({
        where: {
          merchant_email: email,
        },
        include: {
          MerchantPayment: {
            include: {
              Merchant: true,
            },
          },
          package: true,
        },
      });

      if (!merchant) {
        return new NextResponse(
          JSON.stringify({ error: "Merchant not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new NextResponse(JSON.stringify(merchant), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (token) {
      const merchant = await prisma.merchant.findMany({
        orderBy: {
          merchant_id: "desc",
        },
        include: {
          MerchantPayment: {
            include: {
              MerchantPendingPayment: {
                include: {
                  package: true,
                },
              },
            },
          },
        },
      });

      return new NextResponse(JSON.stringify(merchant), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // If neither email nor token is provided, return error
      return new NextResponse(
        JSON.stringify({ error: "Token or Email not provided" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
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
