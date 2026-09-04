"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Sun, Moon, Phone, MessageSquare } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/locale-context";
import { useTheme } from "@/context/ThemeContext";
import { useData } from "@/context/DataContext";
import { bilingualOr, textOr } from "@/lib/cms-copy";
import { routes } from "@/lib/paths";
import { toTelHref, toWhatsAppHref } from "@/lib/phone";

const navLinks = [
  { href: routes.home, key: "home" as const },
  { href: routes.menu, key: "menu" as const },
  { href: routes.offers, key: "offers" as const },
  { href: routes.about, key: "about" as const },
  { href: routes.contact, key: "contact" as const },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { t, dir, locale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { siteSettings, branches } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const logoUrl = textOr(siteSettings.logoUrl, "/logo.png");
  const brandEn = textOr(siteSettings.brandName.en, "Ayadina Grills");
  const brandAr = textOr(siteSettings.brandName.ar, "مشويات أيادينا");
  const brandPrimary = locale === "ar" ? brandAr : brandEn;
  const whatsappCta = bilingualOr(
    siteSettings.contactWhatsappCta,
    locale,
    t.contact.sendWhatsapp,
  );

  const mainBranch =
    branches.find((b) => b.isMainBranch && b.phone.trim()) ??
    branches.find((b) => b.phone.trim());
  const branchPhone = mainBranch?.phone.trim() ?? "";

  const isRtl = dir === "rtl";
  const closeMenu = () => setMobileOpen(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const drawer = portalReady
    ? createPortal(
        <div
          id="mobile-nav"
          className={`fixed inset-0 z-[100] lg:hidden ${
            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!mobileOpen}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
              mobileOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label={t.nav.closeMenu}
            onClick={closeMenu}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.openMenu}
            className={`absolute inset-y-0 flex w-[min(100%,22rem)] flex-col overflow-hidden shadow-2xl transition-transform duration-300 ease-out ${
              isRtl
                ? `end-0 rounded-s-3xl border-s ${mobileOpen ? "translate-x-0" : "translate-x-full"}`
                : `start-0 rounded-e-3xl border-e ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
            }`}
            style={{
              borderColor: "var(--modal-border)",
              backgroundColor: "var(--modal-panel)",
            }}
          >
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4"
              style={{ borderColor: "var(--modal-border)" }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={logoUrl}
                  alt={brandPrimary}
                  className="h-10 w-10 shrink-0 rounded-full object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.3)]"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-gold">
                    {brandPrimary}
                  </p>
                  <p
                    className="truncate text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {locale === "ar" ? brandEn : brandAr}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:text-brand-gold"
                style={{
                  backgroundColor: "var(--modal-close-bg)",
                  color: "var(--text-secondary)",
                }}
                aria-label={t.nav.closeMenu}
                onClick={closeMenu}
              >
                <X className="size-5" />
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-5"
              aria-label="Mobile navigation"
            >
              {navLinks.map(({ href, key }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className="rounded-2xl px-4 py-3.5 text-lg font-semibold transition-all duration-200 active:scale-[0.98]"
                    style={{
                      backgroundColor: isActive
                        ? "var(--brand-gold, #F3A712)"
                        : "transparent",
                      color: isActive ? "#0B0B0B" : "var(--text-primary)",
                    }}
                  >
                    {t.nav[key]}
                  </Link>
                );
              })}
            </nav>

            <div
              className="shrink-0 space-y-4 border-t px-5 py-5"
              style={{ borderColor: "var(--modal-border)" }}
            >
              <div className="flex items-center justify-center gap-3">
                <LanguageSwitcher />
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                  }
                  className="inline-flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:text-brand-gold"
                  style={{
                    border: "1px solid var(--border-default)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {theme === "dark" ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                </button>
              </div>

              {branchPhone ? (
                <div className="flex flex-col gap-2">
                  <a
                    href={toTelHref(branchPhone)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border text-sm font-medium transition-colors hover:border-brand-gold hover:text-brand-gold"
                    style={{
                      borderColor: "var(--border-default)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Phone className="size-4" />
                    <span dir="ltr" className="unicode-bidi-isolate">
                      {branchPhone}
                    </span>
                  </a>
                  <a
                    href={toWhatsAppHref(branchPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                  >
                    <MessageSquare className="size-4" />
                    {whatsappCta}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ease-in-out"
        style={{
          borderColor: "var(--glass-border)",
          backgroundColor: "var(--glass-bg)",
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="min-w-0 text-sm font-semibold transition-colors hover:text-brand-gold sm:text-base"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={logoUrl}
                alt={brandEn}
                className="h-9 w-9 shrink-0 rounded-full object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.3)] sm:h-11 sm:w-11"
              />
              <div className="min-w-0">
                <span className="block truncate text-brand-gold">{brandEn}</span>
                <span
                  className="block truncate text-xs sm:text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {brandAr}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop inline links — hidden on mobile */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map(({ href, key }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: isActive
                      ? "var(--brand-gold, #F3A712)"
                      : "transparent",
                    color: isActive ? "#0B0B0B" : "var(--text-secondary)",
                  }}
                >
                  {t.nav[key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:contents">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                }
                className="inline-flex size-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:text-brand-gold"
                style={{
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                }}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            </div>

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:text-brand-gold lg:hidden"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {drawer}
    </>
  );
}
