import { prisma } from "@/lib/prisma";

export const DEFAULT_RESTAURANT_SLUG = "ayadina";

/**
 * Ensures the default Ayadina restaurant row exists and returns its id.
 * Required because dishes/categories/offers enforce a NOT NULL restaurant_id FK.
 */
export async function getOrCreateDefaultRestaurantId(): Promise<string> {
  const existing = await prisma.restaurant.findUnique({
    where: { slug: DEFAULT_RESTAURANT_SLUG },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.restaurant.create({
    data: {
      slug: DEFAULT_RESTAURANT_SLUG,
      nameAr: "مشويات أيادينا",
      nameEn: "Ayadina Grills",
      phone: "+966112345678",
      whatsapp: "966500000000",
      openingHours: "Daily · 12:00 PM – 12:00 AM",
      locationAr: "الرياض",
      locationEn: "Riyadh",
      aboutStoryAr: "",
      aboutStoryEn: "",
      aboutVisionAr: "",
      aboutVisionEn: "",
      aboutValuesAr: [],
      aboutValuesEn: [],
      galleryImages: [],
      branches: [],
    },
    select: { id: true },
  });
  return created.id;
}
