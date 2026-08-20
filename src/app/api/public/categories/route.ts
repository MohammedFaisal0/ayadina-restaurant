import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/public/categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
