export type Locale = "ar" | "en";

export type DishTranslation = {
  name: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  allergens: string[];
};

export type OfferTranslation = {
  title: string;
  description: string;
  validPeriod: string;
};

export type BranchTranslation = {
  name: string;
  address: string;
};

export type Dictionary = {
  nav: {
    home: string;
    menu: string;
    offers: string;
    about: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
  };
  buttons: {
    orderNow: string;
    viewMenu: string;
    viewOffers: string;
    callNow: string;
    whatsapp: string;
    close: string;
    getDirections: string;
  };
  common: {
    openNow: string;
    closed: string;
    openingHours: string;
    hoursValue: string;
    calories: string;
    kcal: string;
    search: string;
    searchMenu: string;
    noResults: string;
    spicy: string;
    popular: string;
    ingredients: string;
    allergens: string;
    allergenWarning: string;
    price: string;
    validUntil: string;
    featured: string;
    learnMore: string;
    phone: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    quickInfoTitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    announcementTitle: string;
    announcementCta: string;
  };
  menu: {
    pageTitle: string;
    pageSubtitle: string;
    categories: {
      all: string;
      grills: string;
      appetizers: string;
      pastries: string;
      drinks: string;
    };
  };
  offers: {
    pageTitle: string;
    pageSubtitle: string;
  };
  about: {
    pageTitle: string;
    pageSubtitle: string;
    storyTitle: string;
    storyBody: string;
    valuesTitle: string;
    values: string[];
    galleryTitle: string;
  };
  contact: {
    pageTitle: string;
    pageSubtitle: string;
    mapTitle: string;
    branchesTitle: string;
    whatsappCta: string;
  };
  language: {
    switchToArabic: string;
    switchToEnglish: string;
  };
  dishes: Record<string, DishTranslation>;
  offersList: Record<string, OfferTranslation>;
  branches: Record<string, BranchTranslation>;
  announcements: {
    teaserTitle: string;
    teaserDescription: string;
  };
  admin: {
    loginTitle: string;
    loginSubtitle: string;
    username: string;
    password: string;
    loginButton: string;
    invalidCredentials: string;
    dashboardTitle: string;
    menuManagement: string;
    offersManagement: string;
    logout: string;
    categories: string;
    dishes: string;
    addCategory: string;
    editCategory: string;
    deleteCategory: string;
    addDish: string;
    editDish: string;
    deleteDish: string;
    categoryNameAr: string;
    categoryNameEn: string;
    dishNameAr: string;
    dishNameEn: string;
    shortDescriptionAr: string;
    shortDescriptionEn: string;
    descriptionAr: string;
    descriptionEn: string;
    ingredientsAr: string;
    ingredientsEn: string;
    allergensAr: string;
    allergensEn: string;
    selectCategory: string;
    imageUrl: string;
    price: string;
    calories: string;
    badges: string;
    featured: string;
    available: string;
    hidden: string;
    visible: string;
    save: string;
    cancel: string;
    confirmDelete: string;
    actions: string;
    addOffer: string;
    editOffer: string;
    deleteOffer: string;
    offerTitleAr: string;
    offerTitleEn: string;
    offerDescriptionAr: string;
    offerDescriptionEn: string;
    validPeriodAr: string;
    validPeriodEn: string;
    active: string;
    inactive: string;
    showOnHome: string;
    noCategories: string;
    noDishes: string;
    noOffers: string;
    backToSite: string;
    allCategories: string;
    commaSeparated: string;
    uploadImage: string;
    dragDropHint: string;
    browseFiles: string;
    changeImage: string;
    optionalImageUrl: string;
    uploadPreview: string;
    uploadInvalidType: string;
    uploadTooLarge: string;
    uploadFailed: string;
    uploading: string;
  };
};
