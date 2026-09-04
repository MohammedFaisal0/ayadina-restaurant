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

export type SiteSettings = {
  id: string;
  logoUrl: string;
  faviconUrl: string;
  brandName: BilingualText;
  heroBgImageUrl: string;
  heroTitle: BilingualText;
  heroSubtitle: BilingualText;
  heroPrimaryCtaText: BilingualText;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: BilingualText;
  heroSecondaryCtaLink: string;
  quickInfoText: BilingualText;
  quickInfoLink: string;
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  aboutStory: BilingualText;
  openingHours: BilingualText;
  copyrightText: BilingualText;
  featuredTitle: BilingualText;
  featuredSubtitle: BilingualText;
  announcementTitle: BilingualText;
  announcementCta: BilingualText;
  aboutPageTitle: BilingualText;
  aboutPageSubtitle: BilingualText;
  aboutStoryTitle: BilingualText;
  aboutStoryImageUrl: string;
  aboutGalleryTitle: BilingualText;
  contactPageTitle: BilingualText;
  contactPageSubtitle: BilingualText;
  contactBranchesTitle: BilingualText;
  contactMapTitle: BilingualText;
  contactWhatsappCta: BilingualText;
};

export type Branch = {
  id: string;
  name: BilingualText;
  address: BilingualText;
  phone: string;
  mapEmbedUrl: string;
  directionsUrl: string;
  displayOrder: number;
  isMainBranch: boolean;
};

export type GalleryImage = {
  id: string;
  imageUrl: string;
  title: BilingualText;
  displayOrder: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type PublicSiteConfig = {
  settings: SiteSettings;
  branches: Branch[];
  gallery: GalleryImage[];
  legacy: Record<string, string>;
};

export const EMPTY_SITE_SETTINGS: SiteSettings = {
  id: "1",
  logoUrl: "/logo.png",
  faviconUrl: "/logo.png",
  brandName: { ar: "", en: "" },
  heroBgImageUrl: "",
  heroTitle: { ar: "", en: "" },
  heroSubtitle: { ar: "", en: "" },
  heroPrimaryCtaText: { ar: "", en: "" },
  heroPrimaryCtaLink: "/menu",
  heroSecondaryCtaText: { ar: "", en: "" },
  heroSecondaryCtaLink: "/menu",
  quickInfoText: { ar: "", en: "" },
  quickInfoLink: "/contact",
  contactEmail: "",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  aboutStory: { ar: "", en: "" },
  openingHours: { ar: "", en: "" },
  copyrightText: { ar: "", en: "" },
  featuredTitle: { ar: "", en: "" },
  featuredSubtitle: { ar: "", en: "" },
  announcementTitle: { ar: "", en: "" },
  announcementCta: { ar: "", en: "" },
  aboutPageTitle: { ar: "", en: "" },
  aboutPageSubtitle: { ar: "", en: "" },
  aboutStoryTitle: { ar: "", en: "" },
  aboutStoryImageUrl: "",
  aboutGalleryTitle: { ar: "", en: "" },
  contactPageTitle: { ar: "", en: "" },
  contactPageSubtitle: { ar: "", en: "" },
  contactBranchesTitle: { ar: "", en: "" },
  contactMapTitle: { ar: "", en: "" },
  contactWhatsappCta: { ar: "", en: "" },
};

export type SiteSettingsFormData = Omit<SiteSettings, "id">;
export type BranchFormData = Omit<Branch, "id">;
export type GalleryImageFormData = Omit<GalleryImage, "id">;
export type ContactMessageFormData = Pick<
  ContactMessage,
  "name" | "email" | "phone" | "subject" | "message"
>;


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
