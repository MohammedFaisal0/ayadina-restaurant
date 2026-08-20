"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { DEFAULT_APP_DATA } from "@/lib/default-data";
import {
  DATA_CHANGE_EVENT,
  DATA_STORAGE_KEY,
  createId,
  emitDataChange,
} from "@/lib/storage";
import type {
  AppData,
  Category,
  CategoryFormData,
  Dish,
  DishFormData,
  Offer,
  OfferFormData,
} from "@/types/data";

type DataContextValue = {
  data: AppData;
  categories: Category[];
  dishes: Dish[];
  offers: Offer[];
  availableDishes: Dish[];
  activeOffers: Offer[];
  featuredDishes: Dish[];
  homeAnnouncements: Offer[];
  addCategory: (input: CategoryFormData) => void;
  updateCategory: (id: string, input: Partial<CategoryFormData>) => void;
  deleteCategory: (id: string) => void;
  addDish: (input: DishFormData) => void;
  updateDish: (id: string, input: Partial<DishFormData>) => void;
  deleteDish: (id: string) => void;
  toggleDishAvailability: (id: string) => void;
  addOffer: (input: OfferFormData) => void;
  updateOffer: (id: string, input: Partial<OfferFormData>) => void;
  deleteOffer: (id: string) => void;
  toggleOfferActive: (id: string) => void;
  toggleOfferFeaturedOnHome: (id: string) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

const DEFAULT_SNAPSHOT_RAW = JSON.stringify(DEFAULT_APP_DATA);

let cachedSnapshot: AppData = DEFAULT_APP_DATA;
let cachedSnapshotRaw: string | null = DEFAULT_SNAPSHOT_RAW;

function syncSnapshotFromStorage(): AppData {
  const raw = localStorage.getItem(DATA_STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(DATA_STORAGE_KEY, DEFAULT_SNAPSHOT_RAW);
    cachedSnapshot = DEFAULT_APP_DATA;
    cachedSnapshotRaw = DEFAULT_SNAPSHOT_RAW;
    return cachedSnapshot;
  }

  if (raw === cachedSnapshotRaw) {
    return cachedSnapshot;
  }

  try {
    cachedSnapshot = JSON.parse(raw) as AppData;
    cachedSnapshotRaw = raw;
    return cachedSnapshot;
  } catch {
    localStorage.setItem(DATA_STORAGE_KEY, DEFAULT_SNAPSHOT_RAW);
    cachedSnapshot = DEFAULT_APP_DATA;
    cachedSnapshotRaw = DEFAULT_SNAPSHOT_RAW;
    return cachedSnapshot;
  }
}

function subscribeData(onStoreChange: () => void) {
  window.addEventListener(DATA_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(DATA_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getDataSnapshot(): AppData {
  return syncSnapshotFromStorage();
}

function getDataServerSnapshot(): AppData {
  return DEFAULT_APP_DATA;
}

function persistData(data: AppData) {
  const raw = JSON.stringify(data);
  localStorage.setItem(DATA_STORAGE_KEY, raw);
  cachedSnapshot = data;
  cachedSnapshotRaw = raw;
  emitDataChange();
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const data = useSyncExternalStore(
    subscribeData,
    getDataSnapshot,
    getDataServerSnapshot,
  );

  const addCategory = useCallback((input: CategoryFormData) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      categories: [...current.categories, { id: createId("cat"), ...input }],
    });
  }, []);

  const updateCategory = useCallback(
    (id: string, input: Partial<CategoryFormData>) => {
      const current = getDataSnapshot();
      persistData({
        ...current,
        categories: current.categories.map((category) =>
          category.id === id ? { ...category, ...input } : category,
        ),
      });
    },
    [],
  );

  const deleteCategory = useCallback((id: string) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      categories: current.categories.filter((category) => category.id !== id),
      dishes: current.dishes.filter((dish) => dish.categoryId !== id),
    });
  }, []);

  const addDish = useCallback((input: DishFormData) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      dishes: [...current.dishes, { id: createId("dish"), ...input }],
    });
  }, []);

  const updateDish = useCallback((id: string, input: Partial<DishFormData>) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      dishes: current.dishes.map((dish) =>
        dish.id === id ? { ...dish, ...input } : dish,
      ),
    });
  }, []);

  const deleteDish = useCallback((id: string) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      dishes: current.dishes.filter((dish) => dish.id !== id),
    });
  }, []);

  const toggleDishAvailability = useCallback((id: string) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      dishes: current.dishes.map((dish) =>
        dish.id === id ? { ...dish, available: !dish.available } : dish,
      ),
    });
  }, []);

  const addOffer = useCallback((input: OfferFormData) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      offers: [...current.offers, { id: createId("offer"), ...input }],
    });
  }, []);

  const updateOffer = useCallback((id: string, input: Partial<OfferFormData>) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      offers: current.offers.map((offer) =>
        offer.id === id ? { ...offer, ...input } : offer,
      ),
    });
  }, []);

  const deleteOffer = useCallback((id: string) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      offers: current.offers.filter((offer) => offer.id !== id),
    });
  }, []);

  const toggleOfferActive = useCallback((id: string) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      offers: current.offers.map((offer) =>
        offer.id === id ? { ...offer, active: !offer.active } : offer,
      ),
    });
  }, []);

  const toggleOfferFeaturedOnHome = useCallback((id: string) => {
    const current = getDataSnapshot();
    persistData({
      ...current,
      offers: current.offers.map((offer) =>
        offer.id === id ? { ...offer, featuredOnHome: !offer.featuredOnHome } : offer,
      ),
    });
  }, []);

  const availableDishes = useMemo(
    () => data.dishes.filter((dish) => dish.available),
    [data.dishes],
  );

  const activeOffers = useMemo(
    () => data.offers.filter((offer) => offer.active),
    [data.offers],
  );

  const featuredDishes = useMemo(
    () => availableDishes.filter((dish) => dish.featured),
    [availableDishes],
  );

  const homeAnnouncements = useMemo(
    () => activeOffers.filter((offer) => offer.featuredOnHome),
    [activeOffers],
  );

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      categories: data.categories,
      dishes: data.dishes,
      offers: data.offers,
      availableDishes,
      activeOffers,
      featuredDishes,
      homeAnnouncements,
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
      data,
      availableDishes,
      activeOffers,
      featuredDishes,
      homeAnnouncements,
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
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }

  return context;
}
