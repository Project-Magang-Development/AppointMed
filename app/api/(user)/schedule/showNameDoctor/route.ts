import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const schedules_id = url.searchParams.get("scheduleId")!;

    const schedule = await prisma.schedule.findUnique({
      where: { schedules_id },
      include: { doctors: { select: { name: true } } }, // Memilih hanya nama dokter
    });

    if (!schedule) {
      return new NextResponse(JSON.stringify({ error: "Schedule not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const doctorName = schedule.doctors?.name ?? "Unknown";

    return new NextResponse(JSON.stringify({ doctorName }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
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
