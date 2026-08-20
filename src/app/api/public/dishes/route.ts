import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      where: { available: true },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error("GET /api/public/dishes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
