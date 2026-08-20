import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error("GET /api/offers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const {
      titleAr, titleEn,
      descriptionAr, descriptionEn,
      validPeriodAr, validPeriodEn,
      imageUrl, active, featuredOnHome,
    } = body;

    if (!titleAr || !titleEn) {
      return NextResponse.json(
        { error: "titleAr and titleEn are required" },
        { status: 400 }
      );
    }

    const offer = await prisma.offer.create({
      data: {
        titleAr,
        titleEn,
        descriptionAr: descriptionAr ?? "",
        descriptionEn: descriptionEn ?? "",
        validPeriodAr: validPeriodAr ?? "",
        validPeriodEn: validPeriodEn ?? "",
        imageUrl: imageUrl ?? "",
        active: active ?? true,
        featuredOnHome: featuredOnHome ?? false,
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("POST /api/offers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
