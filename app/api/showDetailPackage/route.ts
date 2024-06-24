//menggunakan searchParams
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    //useSearchParams untuk mendapatkan package_id
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get("package_id");

    if (!packageId) {
      return NextResponse.json(
        { error: "package_id tidak ditemukan di query params" },
        { status: 400 }
      );
    }

    // Query ke database menggunakan Prisma
    const packageData = await prisma.package.findUnique({
      where: {
        package_id: packageId,
      },
    });
    if (!packageData) {
      return NextResponse.json(
        { error: "Package tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(packageData);
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil package:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil package" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
