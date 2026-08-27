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
};

export function isAdminPath(pathname: string): boolean {
  return (
    pathname === routes.adminLogin ||
    pathname === routes.adminDashboard ||
    pathname === routes.adminMenu ||
    pathname === routes.adminOffers ||
    pathname.startsWith("/admin")
  );
}
