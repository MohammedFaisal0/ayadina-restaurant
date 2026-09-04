import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const image = await prisma.galleryImage.findUnique({
      where: { id: Number(id) },
    });
    if (!image) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }
    return NextResponse.json(image);
  } catch (error) {
    console.error("GET /api/gallery/[id] error:", error);
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
    const { imageUrl, titleAr, titleEn, displayOrder } = body;

    const image = await prisma.galleryImage.update({
      where: { id: Number(id) },
      data: {
        ...(imageUrl !== undefined && { imageUrl }),
        ...(titleAr !== undefined && { titleAr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(displayOrder !== undefined && { displayOrder }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("PUT /api/gallery/[id] error:", error);
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
    await prisma.galleryImage.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
