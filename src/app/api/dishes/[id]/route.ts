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
    const dish = await prisma.dish.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }
    return NextResponse.json(dish);
  } catch (error) {
    console.error("GET /api/dishes/[id] error:", error);
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

    const dish = await prisma.dish.update({
      where: { id: Number(id) },
      data: {
        ...(body.categoryId !== undefined && { categoryId: Number(body.categoryId) }),
        ...(body.nameAr !== undefined && { nameAr: body.nameAr }),
        ...(body.nameEn !== undefined && { nameEn: body.nameEn }),
        ...(body.shortDescAr !== undefined && { shortDescAr: body.shortDescAr }),
        ...(body.shortDescEn !== undefined && { shortDescEn: body.shortDescEn }),
        ...(body.descriptionAr !== undefined && { descriptionAr: body.descriptionAr }),
        ...(body.descriptionEn !== undefined && { descriptionEn: body.descriptionEn }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.calories !== undefined && { calories: Number(body.calories) }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.available !== undefined && { available: body.available }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.badges !== undefined && { badges: body.badges }),
        ...(body.ingredientsAr !== undefined && { ingredientsAr: body.ingredientsAr }),
        ...(body.ingredientsEn !== undefined && { ingredientsEn: body.ingredientsEn }),
        ...(body.allergensAr !== undefined && { allergensAr: body.allergensAr }),
        ...(body.allergensEn !== undefined && { allergensEn: body.allergensEn }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
      },
    });

    return NextResponse.json(dish);
  } catch (error) {
    console.error("PUT /api/dishes/[id] error:", error);
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
    await prisma.dish.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/dishes/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
