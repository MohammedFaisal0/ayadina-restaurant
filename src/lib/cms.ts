import { prisma } from "@/lib/prisma";
import type { Prisma, SiteSetting } from "@prisma/client";

export const SITE_SETTING_ID = 1;

export const defaultSiteSettingCreate: Prisma.SiteSettingUncheckedCreateInput = {
  id: SITE_SETTING_ID,
};

const SITE_SETTING_KEYS = [
  "logoUrl",
  "faviconUrl",
  "brandNameAr",
  "brandNameEn",
  "heroBgImageUrl",
  "heroTitleAr",
  "heroTitleEn",
  "heroSubtitleAr",
  "heroSubtitleEn",
  "heroPrimaryCtaTextAr",
  "heroPrimaryCtaTextEn",
  "heroPrimaryCtaLink",
  "heroSecondaryCtaTextAr",
  "heroSecondaryCtaTextEn",
  "heroSecondaryCtaLink",
  "quickInfoTextAr",
  "quickInfoTextEn",
  "quickInfoLink",
  "contactEmail",
  "instagramUrl",
  "facebookUrl",
  "tiktokUrl",
  "aboutStoryAr",
  "aboutStoryEn",
  "openingHoursAr",
  "openingHoursEn",
  "copyrightTextAr",
  "copyrightTextEn",
  "featuredTitleAr",
  "featuredTitleEn",
  "featuredSubtitleAr",
  "featuredSubtitleEn",
  "announcementTitleAr",
  "announcementTitleEn",
  "announcementCtaAr",
  "announcementCtaEn",
  "aboutPageTitleAr",
  "aboutPageTitleEn",
  "aboutPageSubtitleAr",
  "aboutPageSubtitleEn",
  "aboutStoryTitleAr",
  "aboutStoryTitleEn",
  "aboutStoryImageUrl",
  "aboutGalleryTitleAr",
  "aboutGalleryTitleEn",
  "contactPageTitleAr",
  "contactPageTitleEn",
  "contactPageSubtitleAr",
  "contactPageSubtitleEn",
  "contactBranchesTitleAr",
  "contactBranchesTitleEn",
  "contactMapTitleAr",
  "contactMapTitleEn",
  "contactWhatsappCtaAr",
  "contactWhatsappCtaEn",
] as const;

export type SiteSettingUpdateInput = Partial<
  Pick<SiteSetting, (typeof SITE_SETTING_KEYS)[number]>
>;

export function pickSiteSettingUpdates(body: Record<string, unknown>): Prisma.SiteSettingUpdateInput {
  const data: Prisma.SiteSettingUpdateInput = {};
  for (const key of SITE_SETTING_KEYS) {
    if (body[key] === undefined || body[key] === null) continue;
    data[key] = String(body[key]);
  }
  return data;
}

export async function getOrCreateSiteSetting(): Promise<SiteSetting> {
  const existing = await prisma.siteSetting.findUnique({
    where: { id: SITE_SETTING_ID },
  });
  if (existing) return existing;

  try {
    return await prisma.siteSetting.create({ data: defaultSiteSettingCreate });
  } catch {
    const raced = await prisma.siteSetting.findUnique({
      where: { id: SITE_SETTING_ID },
    });
    if (raced) return raced;
    throw new Error("Unable to load site settings");
  }
}

export function siteSettingToLegacyMap(row: SiteSetting): Record<string, string> {
  return {
    restaurant_name_ar: row.brandNameAr,
    restaurant_name_en: row.brandNameEn,
    site_name_ar: row.brandNameAr,
    site_name_en: row.brandNameEn,
    site_logo_url: row.logoUrl,
    contact_email: row.contactEmail,
    opening_hours_ar: row.openingHoursAr,
    opening_hours_en: row.openingHoursEn,
  };
}

export async function setExclusiveMainBranch(branchId: number) {
  await prisma.$transaction([
    prisma.branch.updateMany({
      where: { isMainBranch: true, NOT: { id: branchId } },
      data: { isMainBranch: false },
    }),
    prisma.branch.update({
      where: { id: branchId },
      data: { isMainBranch: true },
    }),
  ]);
}

export type ReorderItem = { id: number; displayOrder: number };

export function parseReorderItems(value: unknown): ReorderItem[] | null {
  if (!Array.isArray(value)) return null;
  const items: ReorderItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") return null;
    const id = Number((entry as { id?: unknown }).id);
    const displayOrder = Number((entry as { displayOrder?: unknown }).displayOrder);
    if (!Number.isInteger(id) || !Number.isFinite(displayOrder)) return null;
    items.push({ id, displayOrder });
  }
  return items;
}
