import type { Category, CategoryFormData, Dish, DishFormData, Offer, OfferFormData } from "@/types/data";
import { AUTH_STORAGE_KEY } from "@/lib/storage";

export const SWRKeys = {
  categories: "/api/public/categories",
  dishes: "/api/public/dishes",
  offers: "/api/public/offers",
  settings: "/api/public/settings",
  adminCategories: "/api/categories",
  adminDishes: "/api/dishes",
  adminOffers: "/api/offers",
} as const;

export type AuthSession = { token: string; username: string; role: string };

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
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

export async function fetchSettings(): Promise<Record<string, string>> {
  return apiFetch<Record<string, string>>(SWRKeys.settings);
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

export async function loginApi(username: string, password: string): Promise<AuthSession> {
  return apiFetch<AuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
