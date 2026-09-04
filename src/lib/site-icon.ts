import type { SiteSettings } from "@/types/data";

/**
 * Prefer CMS favicon; skip the legacy broken default `/favicon.ico`
 * (file was never shipped in /public) and fall back to logo.
 */
export function resolveSiteIconUrl(
  settings: Pick<SiteSettings, "faviconUrl" | "logoUrl">,
): string {
  const favicon = settings.faviconUrl?.trim() ?? "";
  if (favicon && favicon !== "/favicon.ico") return favicon;
  const logo = settings.logoUrl?.trim() ?? "";
  return logo || "/logo.png";
}
