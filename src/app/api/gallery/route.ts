import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { parseReorderItems } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const gallery = await prisma.galleryImage.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { imageUrl, titleAr, titleEn, displayOrder } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: {
        imageUrl,
        titleAr: titleAr ?? "",
        titleEn: titleEn ?? "",
        displayOrder: displayOrder ?? 0,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const items = parseReorderItems(body?.reorder ?? body?.items);
    if (!items) {
      return NextResponse.json(
        { error: "reorder array with { id, displayOrder } is required" },
        { status: 400 }
      );
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.galleryImage.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    const gallery = await prisma.galleryImage.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error("PUT /api/gallery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
