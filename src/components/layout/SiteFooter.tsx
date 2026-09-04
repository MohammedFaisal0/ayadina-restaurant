"use client";

import Link from "next/link";
import { Clock, MessageSquare, Phone } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";
import { useData } from "@/context/DataContext";
import { SocialIconRow } from "@/components/ui/SocialLinks";
import { bilingualOr, textOr } from "@/lib/cms-copy";
import { routes } from "@/lib/paths";
import { toTelHref, toWhatsAppHref } from "@/lib/phone";

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
  const brandPrimary = locale === "ar" ? brandAr : brandEn;
  const brandSecondary = locale === "ar" ? brandEn : brandAr;
  const hours = bilingualOr(siteSettings.openingHours, locale, t.common.hoursValue);
  const about = bilingualOr(siteSettings.aboutStory, locale, "");
  const copyright = bilingualOr(
    siteSettings.copyrightText,
    locale,
    "All rights reserved",
  );
  const whatsappCta = bilingualOr(
    siteSettings.contactWhatsappCta,
    locale,
    t.contact.sendWhatsapp,
  );

  const mainBranch =
    branches.find((b) => b.isMainBranch && b.phone.trim()) ??
    branches.find((b) => b.phone.trim());
  const branchPhone = mainBranch?.phone.trim() ?? "";

  // dir={dir} makes the first column sit on the start edge:
  // RTL → right (logo/about/hours), LTR → left. Links land on the opposite side.
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
        className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-start"
      >
        {/* Brand / about / hours — start side */}
        <div className="flex max-w-md flex-col items-center gap-4 md:flex-row md:items-start">
          <img
            src={logoUrl}
            alt={brandPrimary}
            className="h-14 w-14 shrink-0 rounded-full object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.3)] md:h-16 md:w-16"
          />
          <div className="space-y-2">
            <div>
              <p className="text-sm font-semibold text-brand-gold">{brandPrimary}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {brandSecondary}
              </p>
            </div>
            {about ? (
              <p
                className="line-clamp-3 text-xs leading-5"
                style={{ color: "var(--text-secondary)" }}
              >
                {about}
              </p>
            ) : null}
            <div
              className="flex items-center justify-center gap-2 text-xs md:justify-start"
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

        {/* Quick links / social / branch contact — end side */}
        <div className="flex flex-col items-center gap-3 md:items-end">
          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm md:justify-end"
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

          <SocialIconRow
            omit={["phone", "whatsapp"]}
            className="justify-center md:justify-end"
          />

          {branchPhone ? (
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
              <a
                href={toTelHref(branchPhone)}
                className="inline-flex items-center gap-1.5 text-xs transition-colors duration-300 hover:text-brand-gold"
                style={{ color: "var(--text-muted)" }}
              >
                <Phone className="size-3" />
                <span dir="ltr" className="unicode-bidi-isolate">
                  {branchPhone}
                </span>
              </a>
              <a
                href={toWhatsAppHref(branchPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/15 px-2.5 py-1 text-xs font-medium text-emerald-500 transition-colors hover:bg-emerald-600/25"
              >
                <MessageSquare className="size-3" />
                {whatsappCta}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
