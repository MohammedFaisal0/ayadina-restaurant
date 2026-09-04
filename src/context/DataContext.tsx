"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import useSWR, { mutate } from "swr";
import { DEFAULT_APP_DATA } from "@/lib/default-data";
import { useAuth } from "@/context/AuthContext";
import {
  SWRKeys,
  fetchCategories,
  fetchDishes,
  fetchOffers,
  fetchAllDishes,
  fetchAllOffers,
  fetchSettings,
  fetchContactMessages as apiFetchContactMessages,
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
  updateSiteSettings as apiUpdateSiteSettings,
  createBranch as apiCreateBranch,
  updateBranch as apiUpdateBranch,
  deleteBranchApi,
  reorderBranchesApi,
  createGalleryImage as apiCreateGalleryImage,
  updateGalleryImage as apiUpdateGalleryImage,
  deleteGalleryImageApi,
  reorderGalleryImagesApi,
  deleteContactMessageApi,
  markContactMessageReadApi,
} from "@/lib/api";
import type {
  Branch,
  BranchFormData,
  Category,
  CategoryFormData,
  ContactMessage,
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
import { EMPTY_SITE_SETTINGS } from "@/types/data";

type DataContextValue = {
  data: { categories: Category[]; dishes: Dish[]; offers: Offer[] };
  categories: Category[];
  dishes: Dish[];
  offers: Offer[];
  siteSettings: SiteSettings;
  branches: Branch[];
  galleryImages: GalleryImage[];
  contactMessages: ContactMessage[];
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
  updateSiteSettings: (input: Partial<SiteSettingsFormData>) => Promise<void>;
  addBranch: (input: BranchFormData) => Promise<void>;
  updateBranch: (id: string, input: Partial<BranchFormData>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  reorderBranches: (items: { id: string; displayOrder: number }[]) => Promise<void>;
  addGalleryImage: (input: GalleryImageFormData) => Promise<void>;
  updateGalleryImage: (id: string, input: Partial<GalleryImageFormData>) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  reorderGalleryImages: (items: { id: string; displayOrder: number }[]) => Promise<void>;
  fetchContactMessages: () => Promise<void>;
  markContactMessageRead: (id: string, isRead?: boolean) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

function revalidateCms() {
  void mutate(SWRKeys.settings);
}

/** Keep public + admin dish caches in sync after an admin write. */
function revalidateDishes(activeKey: string) {
  void mutate(activeKey);
  if (activeKey !== SWRKeys.dishes) void mutate(SWRKeys.dishes);
  if (activeKey !== SWRKeys.adminDishes) void mutate(SWRKeys.adminDishes);
}

function revalidateOffers(activeKey: string) {
  void mutate(activeKey);
  if (activeKey !== SWRKeys.offers) void mutate(SWRKeys.offers);
  if (activeKey !== SWRKeys.adminOffers) void mutate(SWRKeys.adminOffers);
}

const EMPTY_CMS_CONFIG: PublicSiteConfig = {
  settings: EMPTY_SITE_SETTINGS,
  branches: [],
  gallery: [],
  legacy: {},
};

/**
 * Removes the row from the cached list right away, then rolls the list back and
 * rethrows if the server rejects the delete.
 */
function optimisticRemove<T extends { id: string }>(
  key: string,
  id: string,
  request: Promise<unknown>,
) {
  const without = (current?: T[]) => (current ?? []).filter((item) => item.id !== id);
  return mutate<T[]>(
    key,
    async (current) => {
      await request;
      return without(current);
    },
    { optimisticData: without, rollbackOnError: true, revalidate: true },
  );
}

/** Patches one row in a cached list immediately; rolls back if the request fails. */
function optimisticPatch<T extends { id: string }>(
  key: string,
  id: string,
  patch: Partial<T>,
  request: Promise<unknown>,
) {
  const apply = (current?: T[]) =>
    (current ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item));
  return mutate<T[]>(
    key,
    async (current) => {
      await request;
      return apply(current);
    },
    { optimisticData: apply, rollbackOnError: true, revalidate: true },
  );
}

/** Same rollback behaviour for rows nested inside the cached CMS config. */
function optimisticCmsRemove(
  request: Promise<unknown>,
  remove: (config: PublicSiteConfig) => PublicSiteConfig,
) {
  const without = (current?: PublicSiteConfig) =>
    current ? remove(current) : EMPTY_CMS_CONFIG;
  return mutate<PublicSiteConfig>(
    SWRKeys.settings,
    async (current) => {
      await request;
      return without(current);
    },
    { optimisticData: without, rollbackOnError: true, revalidate: true },
  );
}

/** Optimistically merges site settings; rolls back on error. */
function optimisticSiteSettings(
  patch: Partial<SiteSettingsFormData>,
  request: Promise<unknown>,
) {
  const apply = (current?: PublicSiteConfig): PublicSiteConfig => {
    if (!current) {
      return {
        ...EMPTY_CMS_CONFIG,
        settings: { ...EMPTY_SITE_SETTINGS, ...patch, id: EMPTY_SITE_SETTINGS.id },
      };
    }
    return {
      ...current,
      settings: { ...current.settings, ...patch },
    };
  };
  return mutate<PublicSiteConfig>(
    SWRKeys.settings,
    async (current) => {
      await request;
      return apply(current);
    },
    { optimisticData: apply, rollbackOnError: true, revalidate: true },
  );
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Public routes filter out hidden dishes/inactive offers. Admin must see everything.
  const dishesKey = isAuthenticated ? SWRKeys.adminDishes : SWRKeys.dishes;
  const offersKey = isAuthenticated ? SWRKeys.adminOffers : SWRKeys.offers;

  const { data: catData, isLoading: catLoading } = useSWR(
    SWRKeys.categories,
    fetchCategories,
    { fallbackData: DEFAULT_APP_DATA.categories, revalidateOnFocus: true },
  );
  const { data: dishData, isLoading: dishLoading } = useSWR(
    dishesKey,
    isAuthenticated ? fetchAllDishes : fetchDishes,
    { fallbackData: DEFAULT_APP_DATA.dishes, revalidateOnFocus: true },
  );
  const { data: offerData, isLoading: offerLoading } = useSWR(
    offersKey,
    isAuthenticated ? fetchAllOffers : fetchOffers,
    { fallbackData: DEFAULT_APP_DATA.offers, revalidateOnFocus: true },
  );
  const { data: cmsData, isLoading: cmsLoading } = useSWR(
    SWRKeys.settings,
    fetchSettings,
    { revalidateOnFocus: true },
  );
  const { data: contactData } = useSWR(
    isAuthenticated ? SWRKeys.adminContact : null,
    apiFetchContactMessages,
    // An expired token would otherwise retry-loop against the protected route.
    { revalidateOnFocus: true, shouldRetryOnError: false },
  );

  const categories = catData ?? DEFAULT_APP_DATA.categories;
  const dishes = dishData ?? DEFAULT_APP_DATA.dishes;
  const offers = offerData ?? DEFAULT_APP_DATA.offers;
  const siteSettings = cmsData?.settings ?? EMPTY_SITE_SETTINGS;
  const branches = cmsData?.branches ?? [];
  const galleryImages = cmsData?.gallery ?? [];
  const contactMessages = contactData ?? [];
  const isLoading = catLoading || dishLoading || offerLoading || cmsLoading;

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
    await optimisticPatch<Category>(SWRKeys.categories, id, input, apiUpdateCategory(id, input));
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await optimisticRemove<Category>(SWRKeys.categories, id, deleteCategoryApi(id));
    // Deleting a category cascades to its dishes.
    revalidateDishes(dishesKey);
  }, [dishesKey]);

  const addDish = useCallback(async (input: DishFormData) => {
    await apiCreateDish(input);
    revalidateDishes(dishesKey);
  }, [dishesKey]);

  const updateDish = useCallback(async (id: string, input: Partial<DishFormData>) => {
    await optimisticPatch<Dish>(dishesKey, id, input, apiUpdateDish(id, input));
    if (dishesKey !== SWRKeys.dishes) void mutate(SWRKeys.dishes);
  }, [dishesKey]);

  const deleteDish = useCallback(async (id: string) => {
    await optimisticRemove<Dish>(dishesKey, id, deleteDishApi(id));
    if (dishesKey !== SWRKeys.dishes) void mutate(SWRKeys.dishes);
  }, [dishesKey]);

  const toggleDishAvailability = useCallback(async (id: string) => {
    const dish = dishes.find((d) => d.id === id);
    if (!dish) return;
    const available = !dish.available;
    await optimisticPatch<Dish>(
      dishesKey,
      id,
      { available },
      toggleDishAvailabilityApi(id, available),
    );
    // Public menu must drop/restore the dish without waiting for focus revalidation.
    if (dishesKey !== SWRKeys.dishes) void mutate(SWRKeys.dishes);
  }, [dishes, dishesKey]);

  const addOffer = useCallback(async (input: OfferFormData) => {
    await apiCreateOffer(input);
    revalidateOffers(offersKey);
  }, [offersKey]);

  const updateOffer = useCallback(async (id: string, input: Partial<OfferFormData>) => {
    await optimisticPatch<Offer>(offersKey, id, input, apiUpdateOffer(id, input));
    if (offersKey !== SWRKeys.offers) void mutate(SWRKeys.offers);
  }, [offersKey]);

  const deleteOffer = useCallback(async (id: string) => {
    await optimisticRemove<Offer>(offersKey, id, deleteOfferApi(id));
    if (offersKey !== SWRKeys.offers) void mutate(SWRKeys.offers);
  }, [offersKey]);

  const toggleOfferActive = useCallback(async (id: string) => {
    const offer = offers.find((o) => o.id === id);
    if (!offer) return;
    const active = !offer.active;
    await optimisticPatch<Offer>(
      offersKey,
      id,
      { active },
      toggleOfferActiveApi(id, active),
    );
    if (offersKey !== SWRKeys.offers) void mutate(SWRKeys.offers);
  }, [offers, offersKey]);

  const toggleOfferFeaturedOnHome = useCallback(async (id: string) => {
    const offer = offers.find((o) => o.id === id);
    if (!offer) return;
    const featuredOnHome = !offer.featuredOnHome;
    await optimisticPatch<Offer>(
      offersKey,
      id,
      { featuredOnHome },
      toggleOfferFeaturedOnHomeApi(id, featuredOnHome),
    );
    if (offersKey !== SWRKeys.offers) void mutate(SWRKeys.offers);
  }, [offers, offersKey]);

  const updateSiteSettings = useCallback(async (input: Partial<SiteSettingsFormData>) => {
    await optimisticSiteSettings(input, apiUpdateSiteSettings(input));
  }, []);

  const addBranch = useCallback(async (input: BranchFormData) => {
    await apiCreateBranch(input);
    revalidateCms();
  }, []);

  const updateBranch = useCallback(async (id: string, input: Partial<BranchFormData>) => {
    await apiUpdateBranch(id, input);
    revalidateCms();
  }, []);

  const deleteBranch = useCallback(async (id: string) => {
    await optimisticCmsRemove(deleteBranchApi(id), (config) => ({
      ...config,
      branches: config.branches.filter((branch) => branch.id !== id),
    }));
  }, []);

  const reorderBranches = useCallback(async (items: { id: string; displayOrder: number }[]) => {
    await reorderBranchesApi(items);
    revalidateCms();
  }, []);

  const addGalleryImage = useCallback(async (input: GalleryImageFormData) => {
    await apiCreateGalleryImage(input);
    revalidateCms();
  }, []);

  const updateGalleryImage = useCallback(async (id: string, input: Partial<GalleryImageFormData>) => {
    await apiUpdateGalleryImage(id, input);
    revalidateCms();
  }, []);

  const deleteGalleryImage = useCallback(async (id: string) => {
    await optimisticCmsRemove(deleteGalleryImageApi(id), (config) => ({
      ...config,
      gallery: config.gallery.filter((image) => image.id !== id),
    }));
  }, []);

  const reorderGalleryImages = useCallback(async (items: { id: string; displayOrder: number }[]) => {
    await reorderGalleryImagesApi(items);
    revalidateCms();
  }, []);

  const fetchContactMessages = useCallback(async () => {
    await mutate(SWRKeys.adminContact);
  }, []);

  const markContactMessageRead = useCallback(async (id: string, isRead = true) => {
    await markContactMessageReadApi(id, isRead);
    await mutate(SWRKeys.adminContact);
  }, []);

  const deleteContactMessage = useCallback(async (id: string) => {
    await optimisticRemove<ContactMessage>(
      SWRKeys.adminContact,
      id,
      deleteContactMessageApi(id),
    );
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      data: { categories, dishes, offers },
      categories,
      dishes,
      offers,
      siteSettings,
      branches,
      galleryImages,
      contactMessages,
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
      updateSiteSettings,
      addBranch,
      updateBranch,
      deleteBranch,
      reorderBranches,
      addGalleryImage,
      updateGalleryImage,
      deleteGalleryImage,
      reorderGalleryImages,
      fetchContactMessages,
      markContactMessageRead,
      deleteContactMessage,
    }),
    [
      categories, dishes, offers,
      siteSettings, branches, galleryImages, contactMessages,
      availableDishes, activeOffers, featuredDishes, homeAnnouncements,
      isLoading,
      addCategory, updateCategory, deleteCategory,
      addDish, updateDish, deleteDish, toggleDishAvailability,
      addOffer, updateOffer, deleteOffer, toggleOfferActive, toggleOfferFeaturedOnHome,
      updateSiteSettings, addBranch, updateBranch, deleteBranch, reorderBranches,
      addGalleryImage, updateGalleryImage, deleteGalleryImage, reorderGalleryImages,
      fetchContactMessages, markContactMessageRead, deleteContactMessage,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}
