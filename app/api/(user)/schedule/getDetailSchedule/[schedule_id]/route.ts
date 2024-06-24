import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { schedule_id: string } }
) {
  const schedule_id = params.schedule_id;

  try {
    const detailSchedule = await prisma.schedule.findUnique({
      where: {
        schedules_id: schedule_id,
      },
      include: {
        doctor: {
          select: {
            name: true,
            price: true,
          }
        },
      }
    });

    return NextResponse.json({
      detailSchedule,
      status: 200,
    });
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
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
