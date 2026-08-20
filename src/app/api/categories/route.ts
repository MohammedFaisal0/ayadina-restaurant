import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { dishes: true } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { nameAr, nameEn, displayOrder } = body;

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "nameAr and nameEn are required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        nameAr,
        nameEn,
        displayOrder: displayOrder ?? 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
