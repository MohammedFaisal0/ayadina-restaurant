import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      where: { active: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error("GET /api/public/offers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
