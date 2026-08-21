"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import useSWR, { mutate } from "swr";
import { DEFAULT_APP_DATA } from "@/lib/default-data";
import {
  SWRKeys,
  fetchCategories,
  fetchDishes,
  fetchOffers,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategoryApi,
  createDish as apiCreateDish,
  updateDish as apiUpdateDish,
  deleteDishApi,
  toggleDishAvailabilityApi,
  createOffer as apiCreateOffer,
  updateOffer as apiUpdateOffer,
  deleteOfferApi,
  toggleOfferActiveApi,
  toggleOfferFeaturedOnHomeApi,
} from "@/lib/api";
import type {
  Category,
  CategoryFormData,
  Dish,
  DishFormData,
  Offer,
  OfferFormData,
} from "@/types/data";

type DataContextValue = {
  data: { categories: Category[]; dishes: Dish[]; offers: Offer[] };
  categories: Category[];
  dishes: Dish[];
  offers: Offer[];
  availableDishes: Dish[];
  activeOffers: Offer[];
  featuredDishes: Dish[];
  homeAnnouncements: Offer[];
  isLoading: boolean;
  addCategory: (input: CategoryFormData) => Promise<void>;
  updateCategory: (id: string, input: Partial<CategoryFormData>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addDish: (input: DishFormData) => Promise<void>;
  updateDish: (id: string, input: Partial<DishFormData>) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
  toggleDishAvailability: (id: string) => Promise<void>;
  addOffer: (input: OfferFormData) => Promise<void>;
  updateOffer: (id: string, input: Partial<OfferFormData>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  toggleOfferActive: (id: string) => Promise<void>;
  toggleOfferFeaturedOnHome: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { data: catData, isLoading: catLoading } = useSWR(
    SWRKeys.categories,
    fetchCategories,
    { fallbackData: DEFAULT_APP_DATA.categories, revalidateOnFocus: true },
  );
  const { data: dishData, isLoading: dishLoading } = useSWR(
    SWRKeys.dishes,
    fetchDishes,
    { fallbackData: DEFAULT_APP_DATA.dishes, revalidateOnFocus: true },
  );
  const { data: offerData, isLoading: offerLoading } = useSWR(
    SWRKeys.offers,
    fetchOffers,
    { fallbackData: DEFAULT_APP_DATA.offers, revalidateOnFocus: true },
  );

  const categories = catData ?? DEFAULT_APP_DATA.categories;
  const dishes = dishData ?? DEFAULT_APP_DATA.dishes;
  const offers = offerData ?? DEFAULT_APP_DATA.offers;
  const isLoading = catLoading || dishLoading || offerLoading;

  const availableDishes = useMemo(
    () => dishes.filter((d) => d.available),
    [dishes],
  );
  const activeOffers = useMemo(
    () => offers.filter((o) => o.active),
    [offers],
  );
  const featuredDishes = useMemo(
    () => availableDishes.filter((d) => d.featured),
    [availableDishes],
  );
  const homeAnnouncements = useMemo(
    () => activeOffers.filter((o) => o.featuredOnHome),
    [activeOffers],
  );

  const addCategory = useCallback(async (input: CategoryFormData) => {
    await apiCreateCategory(input);
    mutate(SWRKeys.categories);
  }, []);

  const updateCategory = useCallback(async (id: string, input: Partial<CategoryFormData>) => {
    await apiUpdateCategory(id, input);
    mutate(SWRKeys.categories);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await deleteCategoryApi(id);
    mutate(SWRKeys.categories);
    mutate(SWRKeys.dishes);
  }, []);

  const addDish = useCallback(async (input: DishFormData) => {
    await apiCreateDish(input);
    mutate(SWRKeys.dishes);
  }, []);

  const updateDish = useCallback(async (id: string, input: Partial<DishFormData>) => {
    await apiUpdateDish(id, input);
    mutate(SWRKeys.dishes);
  }, []);

  const deleteDish = useCallback(async (id: string) => {
    await deleteDishApi(id);
    mutate(SWRKeys.dishes);
  }, []);

  const toggleDishAvailability = useCallback(async (id: string) => {
    const dish = dishes.find((d) => d.id === id);
    if (dish) await toggleDishAvailabilityApi(id, !dish.available);
    mutate(SWRKeys.dishes);
  }, [dishes]);

  const addOffer = useCallback(async (input: OfferFormData) => {
    await apiCreateOffer(input);
    mutate(SWRKeys.offers);
  }, []);

  const updateOffer = useCallback(async (id: string, input: Partial<OfferFormData>) => {
    await apiUpdateOffer(id, input);
    mutate(SWRKeys.offers);
  }, []);

  const deleteOffer = useCallback(async (id: string) => {
    await deleteOfferApi(id);
    mutate(SWRKeys.offers);
  }, []);

  const toggleOfferActive = useCallback(async (id: string) => {
    const offer = offers.find((o) => o.id === id);
    if (offer) await toggleOfferActiveApi(id, !offer.active);
    mutate(SWRKeys.offers);
  }, [offers]);

  const toggleOfferFeaturedOnHome = useCallback(async (id: string) => {
    const offer = offers.find((o) => o.id === id);
    if (offer) await toggleOfferFeaturedOnHomeApi(id, !offer.featuredOnHome);
    mutate(SWRKeys.offers);
  }, [offers]);

  const value = useMemo<DataContextValue>(
    () => ({
      data: { categories, dishes, offers },
      categories,
      dishes,
      offers,
      availableDishes,
      activeOffers,
      featuredDishes,
      homeAnnouncements,
      isLoading,
      addCategory,
      updateCategory,
      deleteCategory,
      addDish,
      updateDish,
      deleteDish,
      toggleDishAvailability,
      addOffer,
      updateOffer,
      deleteOffer,
      toggleOfferActive,
      toggleOfferFeaturedOnHome,
    }),
    [
      categories, dishes, offers,
      availableDishes, activeOffers, featuredDishes, homeAnnouncements,
      isLoading,
      addCategory, updateCategory, deleteCategory,
      addDish, updateDish, deleteDish, toggleDishAvailability,
      addOffer, updateOffer, deleteOffer, toggleOfferActive, toggleOfferFeaturedOnHome,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}
