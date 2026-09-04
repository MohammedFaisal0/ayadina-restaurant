import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { parseReorderItems, setExclusiveMainBranch } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const branches = await prisma.branch.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(branches);
  } catch (error) {
    console.error("GET /api/branches error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
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

    if (!nameAr || !nameEn) {
      return NextResponse.json(
        { error: "nameAr and nameEn are required" },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.create({
      data: {
        nameAr,
        nameEn,
        addressAr: addressAr ?? "",
        addressEn: addressEn ?? "",
        phone: phone ?? "",
        mapEmbedUrl: mapEmbedUrl ?? "",
        directionsUrl: directionsUrl ?? "",
        displayOrder: displayOrder ?? 0,
        isMainBranch: Boolean(isMainBranch),
      },
    });

    if (branch.isMainBranch) {
      await setExclusiveMainBranch(branch.id);
      return NextResponse.json(
        await prisma.branch.findUniqueOrThrow({ where: { id: branch.id } }),
        { status: 201 }
      );
    }

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error("POST /api/branches error:", error);
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
        prisma.branch.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    const branches = await prisma.branch.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(branches);
  } catch (error) {
    console.error("PUT /api/branches error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
