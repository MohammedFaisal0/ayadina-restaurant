import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getOrCreateDefaultRestaurantId } from "@/lib/restaurant";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dishes = await prisma.dish.findMany({
      orderBy: { displayOrder: "asc" },
      include: { category: true },
    });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error("GET /api/dishes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const {
      categoryId, nameAr, nameEn,
      shortDescAr, shortDescEn,
      descriptionAr, descriptionEn,
      price, calories, imageUrl,
      available, featured, badges,
      ingredientsAr, ingredientsEn,
      allergensAr, allergensEn,
      displayOrder,
    } = body;

    if (!categoryId || !nameAr || !nameEn) {
      return NextResponse.json(
        { error: "categoryId, nameAr, and nameEn are required" },
        { status: 400 }
      );
    }

    const restaurantId = await getOrCreateDefaultRestaurantId();

    const dish = await prisma.dish.create({
      data: {
        restaurantId,
        categoryId: Number(categoryId),
        nameAr,
        nameEn,
        shortDescAr: shortDescAr ?? "",
        shortDescEn: shortDescEn ?? "",
        descriptionAr: descriptionAr ?? "",
        descriptionEn: descriptionEn ?? "",
        price: price ?? 0,
        calories: calories ?? 0,
        imageUrl: imageUrl ?? "",
        available: available ?? true,
        featured: featured ?? false,
        badges: badges ?? "",
        ingredientsAr: ingredientsAr ?? [],
        ingredientsEn: ingredientsEn ?? [],
        allergensAr: allergensAr ?? [],
        allergensEn: allergensEn ?? [],
        displayOrder: displayOrder ?? 0,
      },
    });

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error("POST /api/dishes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
