import type {
  Branch,
  BranchFormData,
  Category,
  CategoryFormData,
  ContactMessage,
  ContactMessageFormData,
  Dish,
  DishFormData,
  GalleryImage,
  GalleryImageFormData,
  Offer,
  OfferFormData,
  PublicSiteConfig,
  SiteSettings,
  SiteSettingsFormData,
} from "@/types/data";
import { AUTH_STORAGE_KEY, emitAuthChange } from "@/lib/storage";
import { isAdminPath, routes } from "@/lib/paths";

export const SWRKeys = {
  categories: "/api/public/categories",
  dishes: "/api/public/dishes",
  offers: "/api/public/offers",
  settings: "/api/public/settings",
  adminCategories: "/api/categories",
  adminDishes: "/api/dishes",
  adminOffers: "/api/offers",
  adminSettings: "/api/settings",
  adminBranches: "/api/branches",
  adminGallery: "/api/gallery",
  adminContact: "/api/contact",
  publicContact: "/api/public/contact",
} as const;

export type {
  Branch,
  BranchFormData,
  ContactMessage,
  ContactMessageFormData,
  GalleryImage,
  GalleryImageFormData,
  PublicSiteConfig,
  SiteSettings,
  SiteSettingsFormData,
};

export type AuthSession = { token: string; username: string; role: string };

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}

/**
 * Drops a session the server has rejected. Only bounces to the login screen from
 * an admin page, so a background request on a public page can't hijack a visitor.
 */
export function handleExpiredSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChange();
  const { pathname } = window.location;
  if (isAdminPath(pathname) && pathname !== routes.adminLogin) {
    window.location.assign(routes.adminLogin);
  }
}

async function apiFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...init, headers });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // keep statusText fallback
    }
    // A 401 without a token is a failed login, not an expired session.
    if (response.status === 401 && token) handleExpiredSession();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

interface DbCategory {
  id: number;
  nameAr: string;
  nameEn: string;
  displayOrder: number;
}

interface DbDish {
  id: number;
  categoryId: number;
  nameAr: string;
  nameEn: string;
  shortDescAr: string;
  shortDescEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: string | number;
  calories: number;
  imageUrl: string;
  available: boolean;
  featured: boolean;
  badges: string;
  ingredientsAr: unknown;
  ingredientsEn: unknown;
  allergensAr: unknown;
  allergensEn: unknown;
  displayOrder: number;
}

interface DbOffer {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  validPeriodAr: string;
  validPeriodEn: string;
  imageUrl: string;
  active: boolean;
  featuredOnHome: boolean;
}

interface DbSiteSetting {
  id: number;
  logoUrl: string;
  faviconUrl: string;
  brandNameAr: string;
  brandNameEn: string;
  heroBgImageUrl: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  heroPrimaryCtaTextAr: string;
  heroPrimaryCtaTextEn: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaTextAr: string;
  heroSecondaryCtaTextEn: string;
  heroSecondaryCtaLink: string;
  quickInfoTextAr: string;
  quickInfoTextEn: string;
  quickInfoLink: string;
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  aboutStoryAr: string;
  aboutStoryEn: string;
  openingHoursAr: string;
  openingHoursEn: string;
  copyrightTextAr: string;
  copyrightTextEn: string;
  featuredTitleAr?: string;
  featuredTitleEn?: string;
  featuredSubtitleAr?: string;
  featuredSubtitleEn?: string;
  announcementTitleAr?: string;
  announcementTitleEn?: string;
  announcementCtaAr?: string;
  announcementCtaEn?: string;
  aboutPageTitleAr?: string;
  aboutPageTitleEn?: string;
  aboutPageSubtitleAr?: string;
  aboutPageSubtitleEn?: string;
  aboutStoryTitleAr?: string;
  aboutStoryTitleEn?: string;
  aboutStoryImageUrl?: string;
  aboutGalleryTitleAr?: string;
  aboutGalleryTitleEn?: string;
  contactPageTitleAr?: string;
  contactPageTitleEn?: string;
  contactPageSubtitleAr?: string;
  contactPageSubtitleEn?: string;
  contactBranchesTitleAr?: string;
  contactBranchesTitleEn?: string;
  contactMapTitleAr?: string;
  contactMapTitleEn?: string;
  contactWhatsappCtaAr?: string;
  contactWhatsappCtaEn?: string;
}

interface DbBranch {
  id: number;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  mapEmbedUrl: string;
  directionsUrl: string;
  displayOrder: number;
  isMainBranch: boolean;
}

interface DbGalleryImage {
  id: number;
  imageUrl: string;
  titleAr: string;
  titleEn: string;
  displayOrder: number;
}

interface DbContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface DbPublicSiteConfig {
  settings: DbSiteSetting;
  branches: DbBranch[];
  gallery: DbGalleryImage[];
  legacy: Record<string, string>;
}

function jsonToStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function mapCategory(row: DbCategory): Category {
  return {
    id: String(row.id),
    name: { ar: row.nameAr, en: row.nameEn },
  };
}

export function mapDish(row: DbDish): Dish {
  return {
    id: String(row.id),
    categoryId: String(row.categoryId),
    price: Number(row.price),
    calories: Number(row.calories),
    badges: row.badges
      .split(",")
      .map((badge) => badge.trim())
      .filter((badge): badge is "spicy" | "popular" => badge === "spicy" || badge === "popular"),
    image: row.imageUrl,
    featured: row.featured,
    available: row.available,
    name: { ar: row.nameAr, en: row.nameEn },
    shortDescription: { ar: row.shortDescAr, en: row.shortDescEn },
    description: { ar: row.descriptionAr, en: row.descriptionEn },
    ingredients: { ar: jsonToStringList(row.ingredientsAr), en: jsonToStringList(row.ingredientsEn) },
    allergens: { ar: jsonToStringList(row.allergensAr), en: jsonToStringList(row.allergensEn) },
  };
}

export function mapSiteSettings(row: DbSiteSetting): SiteSettings {
  return {
    id: String(row.id),
    logoUrl: row.logoUrl,
    faviconUrl: row.faviconUrl,
    brandName: { ar: row.brandNameAr, en: row.brandNameEn },
    heroBgImageUrl: row.heroBgImageUrl,
    heroTitle: { ar: row.heroTitleAr, en: row.heroTitleEn },
    heroSubtitle: { ar: row.heroSubtitleAr, en: row.heroSubtitleEn },
    heroPrimaryCtaText: { ar: row.heroPrimaryCtaTextAr, en: row.heroPrimaryCtaTextEn },
    heroPrimaryCtaLink: row.heroPrimaryCtaLink,
    heroSecondaryCtaText: { ar: row.heroSecondaryCtaTextAr, en: row.heroSecondaryCtaTextEn },
    heroSecondaryCtaLink: row.heroSecondaryCtaLink,
    quickInfoText: { ar: row.quickInfoTextAr, en: row.quickInfoTextEn },
    quickInfoLink: row.quickInfoLink,
    contactEmail: row.contactEmail,
    instagramUrl: row.instagramUrl,
    facebookUrl: row.facebookUrl,
    tiktokUrl: row.tiktokUrl,
    aboutStory: { ar: row.aboutStoryAr, en: row.aboutStoryEn },
    openingHours: { ar: row.openingHoursAr, en: row.openingHoursEn },
    copyrightText: { ar: row.copyrightTextAr, en: row.copyrightTextEn },
    featuredTitle: { ar: row.featuredTitleAr ?? "", en: row.featuredTitleEn ?? "" },
    featuredSubtitle: { ar: row.featuredSubtitleAr ?? "", en: row.featuredSubtitleEn ?? "" },
    announcementTitle: { ar: row.announcementTitleAr ?? "", en: row.announcementTitleEn ?? "" },
    announcementCta: { ar: row.announcementCtaAr ?? "", en: row.announcementCtaEn ?? "" },
    aboutPageTitle: { ar: row.aboutPageTitleAr ?? "", en: row.aboutPageTitleEn ?? "" },
    aboutPageSubtitle: { ar: row.aboutPageSubtitleAr ?? "", en: row.aboutPageSubtitleEn ?? "" },
    aboutStoryTitle: { ar: row.aboutStoryTitleAr ?? "", en: row.aboutStoryTitleEn ?? "" },
    aboutStoryImageUrl: row.aboutStoryImageUrl ?? "",
    aboutGalleryTitle: { ar: row.aboutGalleryTitleAr ?? "", en: row.aboutGalleryTitleEn ?? "" },
    contactPageTitle: { ar: row.contactPageTitleAr ?? "", en: row.contactPageTitleEn ?? "" },
    contactPageSubtitle: { ar: row.contactPageSubtitleAr ?? "", en: row.contactPageSubtitleEn ?? "" },
    contactBranchesTitle: { ar: row.contactBranchesTitleAr ?? "", en: row.contactBranchesTitleEn ?? "" },
    contactMapTitle: { ar: row.contactMapTitleAr ?? "", en: row.contactMapTitleEn ?? "" },
    contactWhatsappCta: { ar: row.contactWhatsappCtaAr ?? "", en: row.contactWhatsappCtaEn ?? "" },
  };
}

export function mapBranch(row: DbBranch): Branch {
  return {
    id: String(row.id),
    name: { ar: row.nameAr, en: row.nameEn },
    address: { ar: row.addressAr, en: row.addressEn },
    phone: row.phone,
    mapEmbedUrl: row.mapEmbedUrl,
    directionsUrl: row.directionsUrl,
    displayOrder: row.displayOrder,
    isMainBranch: row.isMainBranch,
  };
}

export function mapGalleryImage(row: DbGalleryImage): GalleryImage {
  return {
    id: String(row.id),
    imageUrl: row.imageUrl,
    title: { ar: row.titleAr, en: row.titleEn },
    displayOrder: row.displayOrder,
  };
}

export function mapContactMessage(row: DbContactMessage): ContactMessage {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    isRead: row.isRead,
    createdAt: row.createdAt,
  };
}

export function mapOffer(row: DbOffer): Offer {
  return {
    id: String(row.id),
    image: row.imageUrl,
    active: row.active,
    featuredOnHome: row.featuredOnHome,
    title: { ar: row.titleAr, en: row.titleEn },
    description: { ar: row.descriptionAr, en: row.descriptionEn },
    validPeriod: { ar: row.validPeriodAr, en: row.validPeriodEn },
  };
}

export function categoryToPayload(input: CategoryFormData | Partial<CategoryFormData>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (input.name !== undefined) {
    payload.nameAr = input.name.ar;
    payload.nameEn = input.name.en;
  }
  return payload;
}

export function dishToPayload(input: DishFormData | Partial<DishFormData>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (input.categoryId !== undefined) payload.categoryId = Number(input.categoryId);
  if (input.price !== undefined) payload.price = input.price;
  if (input.calories !== undefined) payload.calories = input.calories;
  if (input.image !== undefined) payload.imageUrl = input.image;
  if (input.featured !== undefined) payload.featured = input.featured;
  if (input.available !== undefined) payload.available = input.available;
  if (input.badges !== undefined) payload.badges = input.badges.join(",");
  if (input.name !== undefined) {
    payload.nameAr = input.name.ar;
    payload.nameEn = input.name.en;
  }
  if (input.shortDescription !== undefined) {
    payload.shortDescAr = input.shortDescription.ar;
    payload.shortDescEn = input.shortDescription.en;
  }
  if (input.description !== undefined) {
    payload.descriptionAr = input.description.ar;
    payload.descriptionEn = input.description.en;
  }
  if (input.ingredients !== undefined) {
    payload.ingredientsAr = input.ingredients.ar;
    payload.ingredientsEn = input.ingredients.en;
  }
  if (input.allergens !== undefined) {
    payload.allergensAr = input.allergens.ar;
    payload.allergensEn = input.allergens.en;
  }
  return payload;
}

export function siteSettingsToPayload(
  input: SiteSettingsFormData | Partial<SiteSettingsFormData>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (input.logoUrl !== undefined) payload.logoUrl = input.logoUrl;
  if (input.faviconUrl !== undefined) payload.faviconUrl = input.faviconUrl;
  if (input.heroBgImageUrl !== undefined) payload.heroBgImageUrl = input.heroBgImageUrl;
  if (input.heroPrimaryCtaLink !== undefined) payload.heroPrimaryCtaLink = input.heroPrimaryCtaLink;
  if (input.heroSecondaryCtaLink !== undefined) payload.heroSecondaryCtaLink = input.heroSecondaryCtaLink;
  if (input.quickInfoLink !== undefined) payload.quickInfoLink = input.quickInfoLink;
  if (input.contactEmail !== undefined) payload.contactEmail = input.contactEmail;
  if (input.instagramUrl !== undefined) payload.instagramUrl = input.instagramUrl;
  if (input.facebookUrl !== undefined) payload.facebookUrl = input.facebookUrl;
  if (input.tiktokUrl !== undefined) payload.tiktokUrl = input.tiktokUrl;
  if (input.brandName !== undefined) {
    payload.brandNameAr = input.brandName.ar;
    payload.brandNameEn = input.brandName.en;
  }
  if (input.heroTitle !== undefined) {
    payload.heroTitleAr = input.heroTitle.ar;
    payload.heroTitleEn = input.heroTitle.en;
  }
  if (input.heroSubtitle !== undefined) {
    payload.heroSubtitleAr = input.heroSubtitle.ar;
    payload.heroSubtitleEn = input.heroSubtitle.en;
  }
  if (input.heroPrimaryCtaText !== undefined) {
    payload.heroPrimaryCtaTextAr = input.heroPrimaryCtaText.ar;
    payload.heroPrimaryCtaTextEn = input.heroPrimaryCtaText.en;
  }
  if (input.heroSecondaryCtaText !== undefined) {
    payload.heroSecondaryCtaTextAr = input.heroSecondaryCtaText.ar;
    payload.heroSecondaryCtaTextEn = input.heroSecondaryCtaText.en;
  }
  if (input.quickInfoText !== undefined) {
    payload.quickInfoTextAr = input.quickInfoText.ar;
    payload.quickInfoTextEn = input.quickInfoText.en;
  }
  if (input.aboutStory !== undefined) {
    payload.aboutStoryAr = input.aboutStory.ar;
    payload.aboutStoryEn = input.aboutStory.en;
  }
  if (input.openingHours !== undefined) {
    payload.openingHoursAr = input.openingHours.ar;
    payload.openingHoursEn = input.openingHours.en;
  }
  if (input.copyrightText !== undefined) {
    payload.copyrightTextAr = input.copyrightText.ar;
    payload.copyrightTextEn = input.copyrightText.en;
  }
  if (input.featuredTitle !== undefined) {
    payload.featuredTitleAr = input.featuredTitle.ar;
    payload.featuredTitleEn = input.featuredTitle.en;
  }
  if (input.featuredSubtitle !== undefined) {
    payload.featuredSubtitleAr = input.featuredSubtitle.ar;
    payload.featuredSubtitleEn = input.featuredSubtitle.en;
  }
  if (input.announcementTitle !== undefined) {
    payload.announcementTitleAr = input.announcementTitle.ar;
    payload.announcementTitleEn = input.announcementTitle.en;
  }
  if (input.announcementCta !== undefined) {
    payload.announcementCtaAr = input.announcementCta.ar;
    payload.announcementCtaEn = input.announcementCta.en;
  }
  if (input.aboutPageTitle !== undefined) {
    payload.aboutPageTitleAr = input.aboutPageTitle.ar;
    payload.aboutPageTitleEn = input.aboutPageTitle.en;
  }
  if (input.aboutPageSubtitle !== undefined) {
    payload.aboutPageSubtitleAr = input.aboutPageSubtitle.ar;
    payload.aboutPageSubtitleEn = input.aboutPageSubtitle.en;
  }
  if (input.aboutStoryTitle !== undefined) {
    payload.aboutStoryTitleAr = input.aboutStoryTitle.ar;
    payload.aboutStoryTitleEn = input.aboutStoryTitle.en;
  }
  if (input.aboutStoryImageUrl !== undefined) payload.aboutStoryImageUrl = input.aboutStoryImageUrl;
  if (input.aboutGalleryTitle !== undefined) {
    payload.aboutGalleryTitleAr = input.aboutGalleryTitle.ar;
    payload.aboutGalleryTitleEn = input.aboutGalleryTitle.en;
  }
  if (input.contactPageTitle !== undefined) {
    payload.contactPageTitleAr = input.contactPageTitle.ar;
    payload.contactPageTitleEn = input.contactPageTitle.en;
  }
  if (input.contactPageSubtitle !== undefined) {
    payload.contactPageSubtitleAr = input.contactPageSubtitle.ar;
    payload.contactPageSubtitleEn = input.contactPageSubtitle.en;
  }
  if (input.contactBranchesTitle !== undefined) {
    payload.contactBranchesTitleAr = input.contactBranchesTitle.ar;
    payload.contactBranchesTitleEn = input.contactBranchesTitle.en;
  }
  if (input.contactMapTitle !== undefined) {
    payload.contactMapTitleAr = input.contactMapTitle.ar;
    payload.contactMapTitleEn = input.contactMapTitle.en;
  }
  if (input.contactWhatsappCta !== undefined) {
    payload.contactWhatsappCtaAr = input.contactWhatsappCta.ar;
    payload.contactWhatsappCtaEn = input.contactWhatsappCta.en;
  }
  return payload;
}

export function branchToPayload(input: BranchFormData | Partial<BranchFormData>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (input.phone !== undefined) payload.phone = input.phone;
  if (input.mapEmbedUrl !== undefined) payload.mapEmbedUrl = input.mapEmbedUrl;
  if (input.directionsUrl !== undefined) payload.directionsUrl = input.directionsUrl;
  if (input.displayOrder !== undefined) payload.displayOrder = input.displayOrder;
  if (input.isMainBranch !== undefined) payload.isMainBranch = input.isMainBranch;
  if (input.name !== undefined) {
    payload.nameAr = input.name.ar;
    payload.nameEn = input.name.en;
  }
  if (input.address !== undefined) {
    payload.addressAr = input.address.ar;
    payload.addressEn = input.address.en;
  }
  return payload;
}

export function galleryImageToPayload(
  input: GalleryImageFormData | Partial<GalleryImageFormData>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (input.imageUrl !== undefined) payload.imageUrl = input.imageUrl;
  if (input.displayOrder !== undefined) payload.displayOrder = input.displayOrder;
  if (input.title !== undefined) {
    payload.titleAr = input.title.ar;
    payload.titleEn = input.title.en;
  }
  return payload;
}

export function offerToPayload(input: OfferFormData | Partial<OfferFormData>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (input.image !== undefined) payload.imageUrl = input.image;
  if (input.active !== undefined) payload.active = input.active;
  if (input.featuredOnHome !== undefined) payload.featuredOnHome = input.featuredOnHome;
  if (input.title !== undefined) {
    payload.titleAr = input.title.ar;
    payload.titleEn = input.title.en;
  }
  if (input.description !== undefined) {
    payload.descriptionAr = input.description.ar;
    payload.descriptionEn = input.description.en;
  }
  if (input.validPeriod !== undefined) {
    payload.validPeriodAr = input.validPeriod.ar;
    payload.validPeriodEn = input.validPeriod.en;
  }
  return payload;
}

export async function fetchCategories(): Promise<Category[]> {
  const rows = await apiFetch<DbCategory[]>(SWRKeys.categories);
  return rows.map(mapCategory);
}

export async function fetchDishes(): Promise<Dish[]> {
  const rows = await apiFetch<DbDish[]>(SWRKeys.dishes);
  return rows.map(mapDish);
}

export async function fetchOffers(): Promise<Offer[]> {
  const rows = await apiFetch<DbOffer[]>(SWRKeys.offers);
  return rows.map(mapOffer);
}

export async function fetchSettings(): Promise<PublicSiteConfig> {
  const payload = await apiFetch<DbPublicSiteConfig>(SWRKeys.settings);
  return {
    settings: mapSiteSettings(payload.settings),
    branches: payload.branches.map(mapBranch),
    gallery: payload.gallery.map(mapGalleryImage),
    legacy: payload.legacy ?? {},
  };
}

export async function fetchLegacySettings(): Promise<Record<string, string>> {
  const config = await fetchSettings();
  return config.legacy;
}

export async function fetchAllCategories(): Promise<Category[]> {
  const rows = await apiFetch<DbCategory[]>(SWRKeys.adminCategories);
  return rows.map(mapCategory);
}

export async function fetchAllDishes(): Promise<Dish[]> {
  const rows = await apiFetch<DbDish[]>(SWRKeys.adminDishes);
  return rows.map(mapDish);
}

export async function fetchAllOffers(): Promise<Offer[]> {
  const rows = await apiFetch<DbOffer[]>(SWRKeys.adminOffers);
  return rows.map(mapOffer);
}

export async function createCategory(input: CategoryFormData): Promise<Category> {
  const row = await apiFetch<DbCategory>(SWRKeys.adminCategories, {
    method: "POST",
    body: JSON.stringify(categoryToPayload(input)),
  });
  return mapCategory(row);
}

export async function updateCategory(id: string, input: CategoryFormData | Partial<CategoryFormData>): Promise<Category> {
  const row = await apiFetch<DbCategory>(`${SWRKeys.adminCategories}/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryToPayload(input)),
  });
  return mapCategory(row);
}

export async function deleteCategoryApi(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`${SWRKeys.adminCategories}/${id}`, { method: "DELETE" });
}

export async function createDish(input: DishFormData): Promise<Dish> {
  const row = await apiFetch<DbDish>(SWRKeys.adminDishes, {
    method: "POST",
    body: JSON.stringify(dishToPayload(input)),
  });
  return mapDish(row);
}

export async function updateDish(id: string, input: Partial<DishFormData>): Promise<Dish> {
  const row = await apiFetch<DbDish>(`${SWRKeys.adminDishes}/${id}`, {
    method: "PUT",
    body: JSON.stringify(dishToPayload(input)),
  });
  return mapDish(row);
}

export async function deleteDishApi(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`${SWRKeys.adminDishes}/${id}`, { method: "DELETE" });
}

export async function toggleDishAvailabilityApi(id: string, available: boolean): Promise<Dish> {
  const row = await apiFetch<DbDish>(`${SWRKeys.adminDishes}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ available }),
  });
  return mapDish(row);
}

export async function createOffer(input: OfferFormData): Promise<Offer> {
  const row = await apiFetch<DbOffer>(SWRKeys.adminOffers, {
    method: "POST",
    body: JSON.stringify(offerToPayload(input)),
  });
  return mapOffer(row);
}

export async function updateOffer(id: string, input: Partial<OfferFormData>): Promise<Offer> {
  const row = await apiFetch<DbOffer>(`${SWRKeys.adminOffers}/${id}`, {
    method: "PUT",
    body: JSON.stringify(offerToPayload(input)),
  });
  return mapOffer(row);
}

export async function deleteOfferApi(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`${SWRKeys.adminOffers}/${id}`, { method: "DELETE" });
}

export async function toggleOfferActiveApi(id: string, active: boolean): Promise<Offer> {
  const row = await apiFetch<DbOffer>(`${SWRKeys.adminOffers}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ active }),
  });
  return mapOffer(row);
}

export async function toggleOfferFeaturedOnHomeApi(id: string, featuredOnHome: boolean): Promise<Offer> {
  const row = await apiFetch<DbOffer>(`${SWRKeys.adminOffers}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ featuredOnHome }),
  });
  return mapOffer(row);
}

export async function fetchAdminSettings(): Promise<SiteSettings> {
  const row = await apiFetch<DbSiteSetting>(SWRKeys.adminSettings);
  return mapSiteSettings(row);
}

export async function updateSiteSettings(
  input: SiteSettingsFormData | Partial<SiteSettingsFormData>
): Promise<SiteSettings> {
  const row = await apiFetch<DbSiteSetting>(SWRKeys.adminSettings, {
    method: "PUT",
    body: JSON.stringify(siteSettingsToPayload(input)),
  });
  return mapSiteSettings(row);
}

export async function fetchAllBranches(): Promise<Branch[]> {
  const rows = await apiFetch<DbBranch[]>(SWRKeys.adminBranches);
  return rows.map(mapBranch);
}

export async function createBranch(input: BranchFormData): Promise<Branch> {
  const row = await apiFetch<DbBranch>(SWRKeys.adminBranches, {
    method: "POST",
    body: JSON.stringify(branchToPayload(input)),
  });
  return mapBranch(row);
}

export async function updateBranch(id: string, input: Partial<BranchFormData>): Promise<Branch> {
  const row = await apiFetch<DbBranch>(`${SWRKeys.adminBranches}/${id}`, {
    method: "PUT",
    body: JSON.stringify(branchToPayload(input)),
  });
  return mapBranch(row);
}

export async function deleteBranchApi(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`${SWRKeys.adminBranches}/${id}`, { method: "DELETE" });
}

export async function reorderBranchesApi(
  items: { id: string; displayOrder: number }[]
): Promise<Branch[]> {
  const rows = await apiFetch<DbBranch[]>(SWRKeys.adminBranches, {
    method: "PUT",
    body: JSON.stringify({
      reorder: items.map((item) => ({ id: Number(item.id), displayOrder: item.displayOrder })),
    }),
  });
  return rows.map(mapBranch);
}

export async function fetchAllGalleryImages(): Promise<GalleryImage[]> {
  const rows = await apiFetch<DbGalleryImage[]>(SWRKeys.adminGallery);
  return rows.map(mapGalleryImage);
}

export async function createGalleryImage(input: GalleryImageFormData): Promise<GalleryImage> {
  const row = await apiFetch<DbGalleryImage>(SWRKeys.adminGallery, {
    method: "POST",
    body: JSON.stringify(galleryImageToPayload(input)),
  });
  return mapGalleryImage(row);
}

export async function updateGalleryImage(
  id: string,
  input: Partial<GalleryImageFormData>
): Promise<GalleryImage> {
  const row = await apiFetch<DbGalleryImage>(`${SWRKeys.adminGallery}/${id}`, {
    method: "PUT",
    body: JSON.stringify(galleryImageToPayload(input)),
  });
  return mapGalleryImage(row);
}

export async function deleteGalleryImageApi(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`${SWRKeys.adminGallery}/${id}`, { method: "DELETE" });
}

export async function reorderGalleryImagesApi(
  items: { id: string; displayOrder: number }[]
): Promise<GalleryImage[]> {
  const rows = await apiFetch<DbGalleryImage[]>(SWRKeys.adminGallery, {
    method: "PUT",
    body: JSON.stringify({
      reorder: items.map((item) => ({ id: Number(item.id), displayOrder: item.displayOrder })),
    }),
  });
  return rows.map(mapGalleryImage);
}

export async function submitContactMessage(
  input: ContactMessageFormData
): Promise<{ success: boolean; id: number }> {
  return apiFetch<{ success: boolean; id: number }>(SWRKeys.publicContact, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const rows = await apiFetch<DbContactMessage[]>(SWRKeys.adminContact);
  return rows.map(mapContactMessage);
}

export async function markContactMessageReadApi(
  id: string,
  isRead = true
): Promise<ContactMessage> {
  const row = await apiFetch<DbContactMessage>(`${SWRKeys.adminContact}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isRead }),
  });
  return mapContactMessage(row);
}

export async function deleteContactMessageApi(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`${SWRKeys.adminContact}/${id}`, { method: "DELETE" });
}

export async function loginApi(username: string, password: string): Promise<AuthSession> {
  return apiFetch<AuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
