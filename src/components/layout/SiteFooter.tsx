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

function FooterNav({ className = "" }: { className?: string }) {
  const { t } = useLocale();
  return (
    <nav
      aria-label="Footer"
      className={`flex flex-wrap justify-center gap-3 text-sm ${className}`}
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
  );
}

function WorkingHours({
  hours,
  className = "",
}: {
  hours: string;
  className?: string;
}) {
  const { t } = useLocale();
  return (
    <div
      className={`flex items-center gap-2 text-xs ${className}`}
      style={{ color: "var(--text-muted)" }}
    >
      <Clock className="size-3.5 shrink-0" />
      <span>
        {t.common.openingHours}: {hours}
      </span>
    </div>
  );
}

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
  const copyrightLine = `© ${year} ${brandEn}. ${copyright}`;

  const mainBranch =
    branches.find((b) => b.isMainBranch && b.phone.trim()) ??
    branches.find((b) => b.phone.trim());
  const branchPhone = mainBranch?.phone.trim() ?? "";

  const logoClass =
    "shrink-0 rounded-full object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.3)]";

  return (
    <footer
      className="border-t px-4 py-8 sm:px-6 lg:px-8"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div dir={dir} className="mx-auto w-full max-w-7xl">
        {/* ── Mobile: stacked centered column ── */}
        <div className="flex flex-col items-center gap-4 text-center text-sm sm:hidden">
          <img
            src={logoUrl}
            alt={brandLabel}
            className={`h-14 w-14 ${logoClass}`}
          />
          <WorkingHours hours={hours} className="justify-center" />
          <FooterNav />
          <SocialIconRow branchPhone={branchPhone} />
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {copyrightLine}
          </p>
        </div>

        {/* ── Desktop: brand start / links end ── */}
        <div className="hidden items-start justify-between gap-8 sm:flex">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={logoUrl}
              alt={brandLabel}
              className={`h-16 w-16 ${logoClass}`}
            />
            <div className="min-w-0 space-y-1.5 text-start">
              <WorkingHours hours={hours} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {copyrightLine}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <FooterNav className="gap-x-4" />
            <SocialIconRow branchPhone={branchPhone} />
          </div>
        </div>
      </div>
    </footer>
  );
}
