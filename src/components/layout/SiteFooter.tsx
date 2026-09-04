"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";
import { useData } from "@/context/DataContext";
import { SocialIconRow } from "@/components/ui/SocialLinks";
import { bilingualOr, textOr } from "@/lib/cms-copy";
import { routes } from "@/lib/paths";

const navItems = [
  { href: routes.home, key: "home" as const },
  { href: routes.menu, key: "menu" as const },
  { href: routes.offers, key: "offers" as const },
  { href: routes.about, key: "about" as const },
  { href: routes.contact, key: "contact" as const },
];

export function SiteFooter() {
  const { t, dir, locale } = useLocale();
  const { siteSettings, branches } = useData();
  const year = new Date().getFullYear();

  const logoUrl = textOr(siteSettings.logoUrl, "/logo.png");
  const brandEn = textOr(siteSettings.brandName.en, "Ayadina Grills");
  const brandAr = textOr(siteSettings.brandName.ar, "مشويات أيادينا");
  const brandLabel = locale === "ar" ? brandAr : brandEn;
  const hours = bilingualOr(siteSettings.openingHours, locale, t.common.hoursValue);
  const copyright = bilingualOr(
    siteSettings.copyrightText,
    locale,
    "All rights reserved",
  );

  const mainBranch =
    branches.find((b) => b.isMainBranch && b.phone.trim()) ??
    branches.find((b) => b.phone.trim());
  const branchPhone = mainBranch?.phone.trim() ?? "";

  // dir={dir}: first column = start (RTL right / LTR left), second = end (opposite).
  return (
    <footer
      className="border-t px-4 py-8 sm:px-6 lg:px-8"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div
        dir={dir}
        className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-between"
      >
        {/* Logo + hours + copyright — start side; text mirrors beside logo via dir */}
        <div className="flex items-center gap-3 text-start sm:gap-4">
          <img
            src={logoUrl}
            alt={brandLabel}
            className="h-14 w-14 shrink-0 rounded-full object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.3)] md:h-16 md:w-16"
          />
          <div className="min-w-0 space-y-1.5">
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <Clock className="size-3.5 shrink-0" />
              <span>
                {t.common.openingHours}: {hours}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © {year} {brandEn}. {copyright}
            </p>
          </div>
        </div>

        {/* Quick links + social icons centered beneath — end side */}
        <div className="flex w-full max-w-md flex-col items-center gap-3 md:w-auto">
          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm"
          >
            {navItems.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors duration-300 hover:text-brand-gold"
                style={{ color: "var(--text-muted)" }}
              >
                {t.nav[key]}
              </Link>
            ))}
          </nav>

          <SocialIconRow branchPhone={branchPhone} />
        </div>
      </div>
    </footer>
  );
}
