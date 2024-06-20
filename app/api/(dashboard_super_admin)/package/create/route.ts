import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    const body = await req.json();
    const {
      package_name,
      package_description,
      package_tag,
      package_price,
      package_feature,
      count_order,
      count_doctor,
      duration,
    } = body;
    let featureList = [];
    if (package_feature) {
      featureList = package_feature.split(", ");
    }
    if (
      !package_name ||
      package_description == null ||
      package_feature == null ||
      package_price == null ||
      duration == null
    ) {
      return new NextResponse(
        JSON.stringify({
          error: "Please provide all required fields",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const newPackage = await prisma.package.create({
      data: {
        package_name,
        package_description,
        package_price,
        package_feature,
        package_tag,
        count_order: count_order,
        count_doctor: count_doctor,
        duration,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Package created successfully",
        vehicle: newPackage,
        features: featureList,
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
