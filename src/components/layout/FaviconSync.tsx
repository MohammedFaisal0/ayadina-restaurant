"use client";

import { useEffect } from "react";
import { useData } from "@/context/DataContext";
import { resolveSiteIconUrl } from "@/lib/site-icon";

function withCacheBust(url: string): string {
  const stamp = Date.now().toString(36);
  return url.includes("?") ? `${url}&v=${stamp}` : `${url}?v=${stamp}`;
}

function mimeFor(url: string): string {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".ico")) return "image/x-icon";
  return "image/png";
}

/**
 * Syncs the browser tab icon with CMS settings.
 * Updates every existing icon <link> (including Next metadata ones) so the
 * browser does not keep a stale /favicon.ico or /logo.png ahead of the CMS URL.
 */
export function FaviconSync() {
  const { siteSettings } = useData();
  const iconUrl = resolveSiteIconUrl(siteSettings);

  useEffect(() => {
    const href = withCacheBust(iconUrl);
    const type = mimeFor(iconUrl);
    const rels = ["icon", "shortcut icon", "apple-touch-icon"] as const;

    for (const rel of rels) {
      const links = document.head.querySelectorAll<HTMLLinkElement>(
        `link[rel="${rel}"]`,
      );

      if (links.length > 0) {
        links.forEach((link) => {
          link.type = type;
          // Prefer sizes that browsers actually pick for tabs when multiple icons exist.
          if (rel === "icon" && !link.sizes?.length) {
            link.setAttribute("sizes", "any");
          }
          if (link.getAttribute("href") !== href) {
            link.setAttribute("href", href);
          }
        });
        continue;
      }

      const link = document.createElement("link");
      link.rel = rel;
      link.type = type;
      if (rel === "icon") link.setAttribute("sizes", "any");
      link.href = href;
      document.head.appendChild(link);
    }
  }, [iconUrl]);

  return null;
}
