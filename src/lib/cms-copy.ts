import type { BilingualText, Locale } from "@/types/data";
import { routes } from "@/lib/paths";

export function textOr(value: string | undefined, fallback: string): string {
  return value?.trim() ? value : fallback;
}

export function bilingualOr(
  value: BilingualText | undefined,
  locale: Locale,
  fallback: string,
): string {
  return textOr(value?.[locale], fallback);
}

/** Maps a CMS-authored public path onto the app's opaque route slugs. */
export function resolvePublicLink(href: string): string {
  const path = href.trim() || "/";
  if (path === "/" || path === routes.home) return routes.home;
  if (path === "/menu" || path === routes.menu) return routes.menu;
  if (path === "/offers" || path === routes.offers) return routes.offers;
  if (path === "/about" || path === routes.about) return routes.about;
  if (path === "/contact" || path === routes.contact) return routes.contact;
  return path;
}
