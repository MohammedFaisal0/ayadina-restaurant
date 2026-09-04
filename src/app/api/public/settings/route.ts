import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSiteSetting, siteSettingToLegacyMap } from "@/lib/cms";
import { getOrCreateDefaultRestaurantId } from "@/lib/restaurant";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const restaurantId = await getOrCreateDefaultRestaurantId();
    const [settings, branches, gallery, legacyRows] = await Promise.all([
      getOrCreateSiteSetting(),
      prisma.branch.findMany({ orderBy: { displayOrder: "asc" } }),
      prisma.galleryImage.findMany({ orderBy: { displayOrder: "asc" } }),
      prisma.setting.findMany({ where: { restaurantId } }),
    ]);

    const legacy: Record<string, string> = siteSettingToLegacyMap(settings);
    for (const row of legacyRows) {
      legacy[row.key] = row.value;
    }

    return NextResponse.json({ settings, branches, gallery, legacy });
  } catch (error) {
    console.error("GET /api/public/settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
