/**
 * Opaque public URLs shown in the address bar.
 * This is path obscurity only — it is not encryption and does not hide API routes.
 */
export const routes = {
  home: "/",
  menu: "/p/9f3a7c1e8d2b4a60e5c91f72",
  offers: "/p/2b8e4d0c7a1f93e6d5b82014",
  about: "/p/6d1c9a4e0f7b82c3e1a54790",
  contact: "/p/a4e7b2c9d0f18365e8c2147b",
  adminLogin: "/p/c8f0e1d4a7b69325e0c1d84a",
  adminDashboard: "/p/1e9c4b7a2d0f83e6c5a19280",
  adminMenu: "/p/5a2d8e1c0b7f9463e4c1a0d2",
  adminOffers: "/p/7b3f9e2a1c8d4056e9f2b1c4",
  adminSettings: "/p/8c4e1a9b2f7d6035e1c8a4b7",
  adminHome: "/p/4f8a2c1e9d0b7365e3a1c8d2",
  adminAbout: "/p/6b9e3d2a8c1f4057e5b2a9c0",
  adminContact: "/p/1c8f5d3a7e0b4926e6a3d1c8",
} as const;

export const opaqueToInternal: Record<string, string> = {
  [routes.menu]: "/menu",
  [routes.offers]: "/offers",
  [routes.about]: "/about",
  [routes.contact]: "/contact",
  [routes.adminLogin]: "/admin/login",
  [routes.adminDashboard]: "/admin/dashboard",
  [routes.adminMenu]: "/admin/dashboard/menu",
  [routes.adminOffers]: "/admin/dashboard/offers",
  [routes.adminSettings]: "/admin/dashboard/settings",
  [routes.adminHome]: "/admin/dashboard/home",
  [routes.adminAbout]: "/admin/dashboard/about",
  [routes.adminContact]: "/admin/dashboard/contact",
};

export const internalToOpaque: Record<string, string> = {
  "/menu": routes.menu,
  "/offers": routes.offers,
  "/about": routes.about,
  "/contact": routes.contact,
  "/admin/login": routes.adminLogin,
  "/admin/dashboard": routes.adminDashboard,
  "/admin/dashboard/menu": routes.adminMenu,
  "/admin/dashboard/offers": routes.adminOffers,
  "/admin/dashboard/settings": routes.adminSettings,
  "/admin/dashboard/home": routes.adminHome,
  "/admin/dashboard/about": routes.adminAbout,
  "/admin/dashboard/contact": routes.adminContact,
};

export function isAdminPath(pathname: string): boolean {
  return (
    pathname === routes.adminLogin ||
    pathname === routes.adminDashboard ||
    pathname === routes.adminMenu ||
    pathname === routes.adminOffers ||
    pathname === routes.adminSettings ||
    pathname === routes.adminHome ||
    pathname === routes.adminAbout ||
    pathname === routes.adminContact ||
    pathname.startsWith("/admin")
  );
}