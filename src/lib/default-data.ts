import { menuItems, offers as staticOffers } from "@/data/site";
import ar from "@/i18n/dictionaries/ar.json";
import en from "@/i18n/dictionaries/en.json";
import type { AppData } from "@/types/data";

export function createDefaultAppData(): AppData {
  const categories: AppData["categories"] = [
    { id: "grills", name: { en: "Grills", ar: "المشويات" } },
    { id: "appetizers", name: { en: "Appetizers", ar: "المقبلات" } },
    { id: "pastries", name: { en: "Pastries", ar: "المعجنات" } },
    { id: "drinks", name: { en: "Drinks", ar: "المشروبات" } },
  ];

  const dishes: AppData["dishes"] = menuItems.map((item) => {
    const enDish = en.dishes[item.id as keyof typeof en.dishes];
    const arDish = ar.dishes[item.id as keyof typeof ar.dishes];

    return {
      id: item.id,
      categoryId: item.category,
      price: item.price,
      calories: item.calories,
      badges: item.badges,
      image: item.image,
      featured: item.featured ?? false,
      available: true,
      name: { en: enDish.name, ar: arDish.name },
      shortDescription: {
        en: enDish.shortDescription,
        ar: arDish.shortDescription,
      },
      description: { en: enDish.description, ar: arDish.description },
      ingredients: { en: enDish.ingredients, ar: arDish.ingredients },
      allergens: { en: enDish.allergens, ar: arDish.allergens },
    };
  });

  const offers: AppData["offers"] = staticOffers.map((offer, index) => {
    const enOffer = en.offersList[offer.id as keyof typeof en.offersList];
    const arOffer = ar.offersList[offer.id as keyof typeof ar.offersList];

    return {
      id: offer.id,
      image: offer.image,
      active: true,
      featuredOnHome: index === 0,
      title: { en: enOffer.title, ar: arOffer.title },
      description: { en: enOffer.description, ar: arOffer.description },
      validPeriod: { en: enOffer.validPeriod, ar: arOffer.validPeriod },
    };
  });

  return { categories, dishes, offers };
}

export const DEFAULT_APP_DATA: AppData = createDefaultAppData();
