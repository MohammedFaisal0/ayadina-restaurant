import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { setExclusiveMainBranch } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const branch = await prisma.branch.findUnique({
      where: { id: Number(id) },
    });
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }
    return NextResponse.json(branch);
  } catch (error) {
    console.error("GET /api/branches/[id] error:", error);
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
    const branchId = Number(id);
    const body = await request.json();
    const {
      nameAr,
      nameEn,
      addressAr,
      addressEn,
      phone,
      mapEmbedUrl,
      directionsUrl,
      displayOrder,
      isMainBranch,
    } = body;

    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        ...(nameAr !== undefined && { nameAr }),
        ...(nameEn !== undefined && { nameEn }),
        ...(addressAr !== undefined && { addressAr }),
        ...(addressEn !== undefined && { addressEn }),
        ...(phone !== undefined && { phone }),
        ...(mapEmbedUrl !== undefined && { mapEmbedUrl }),
        ...(directionsUrl !== undefined && { directionsUrl }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isMainBranch !== undefined && { isMainBranch: Boolean(isMainBranch) }),
      },
    });

    if (isMainBranch === true) {
      await setExclusiveMainBranch(branchId);
      return NextResponse.json(
        await prisma.branch.findUniqueOrThrow({ where: { id: branchId } })
      );
    }

    return NextResponse.json(branch);
  } catch (error) {
    console.error("PUT /api/branches/[id] error:", error);
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
    await prisma.branch.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/branches/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
