export type Locale = "ar" | "en";

export type BilingualText = Record<Locale, string>;

export type BilingualList = Record<Locale, string[]>;

export type DishBadge = "spicy" | "popular";

export type Category = {
  id: string;
  name: BilingualText;
};

export type Dish = {
  id: string;
  categoryId: string;
  price: number;
  calories: number;
  badges: DishBadge[];
  image: string;
  featured: boolean;
  available: boolean;
  name: BilingualText;
  shortDescription: BilingualText;
  description: BilingualText;
  ingredients: BilingualList;
  allergens: BilingualList;
};

export type Offer = {
  id: string;
  image: string;
  active: boolean;
  featuredOnHome: boolean;
  title: BilingualText;
  description: BilingualText;
  validPeriod: BilingualText;
};

export type AppData = {
  categories: Category[];
  dishes: Dish[];
  offers: Offer[];
};

export type DishFormData = Omit<Dish, "id">;

export type CategoryFormData = Omit<Category, "id">;

export type OfferFormData = Omit<Offer, "id">;

export function getLocalizedText(text: BilingualText, locale: Locale): string {
  return text[locale];
}

export function getLocalizedList(list: BilingualList, locale: Locale): string[] {
  return list[locale];
}

export function getDishCopy(dish: Dish, locale: Locale) {
  return {
    name: dish.name[locale],
    shortDescription: dish.shortDescription[locale],
    description: dish.description[locale],
    ingredients: dish.ingredients[locale],
    allergens: dish.allergens[locale],
  };
}

export function getOfferCopy(offer: Offer, locale: Locale) {
  return {
    title: offer.title[locale],
    description: offer.description[locale],
    validPeriod: offer.validPeriod[locale],
  };
}
