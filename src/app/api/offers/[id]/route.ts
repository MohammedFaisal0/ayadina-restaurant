import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offer = await prisma.offer.findUnique({
      where: { id: Number(id) },
    });
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    return NextResponse.json(offer);
  } catch (error) {
    console.error("GET /api/offers/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await request.json();

    const offer = await prisma.offer.update({
      where: { id: Number(id) },
      data: {
        ...(body.titleAr !== undefined && { titleAr: body.titleAr }),
        ...(body.titleEn !== undefined && { titleEn: body.titleEn }),
        ...(body.descriptionAr !== undefined && { descriptionAr: body.descriptionAr }),
        ...(body.descriptionEn !== undefined && { descriptionEn: body.descriptionEn }),
        ...(body.validPeriodAr !== undefined && { validPeriodAr: body.validPeriodAr }),
        ...(body.validPeriodEn !== undefined && { validPeriodEn: body.validPeriodEn }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.featuredOnHome !== undefined && { featuredOnHome: body.featuredOnHome }),
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("PUT /api/offers/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    await prisma.offer.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/offers/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
