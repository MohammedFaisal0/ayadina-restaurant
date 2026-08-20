"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/locale-context";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { href: "/", key: "home" as const },
  { href: "/menu", key: "menu" as const },
  { href: "/offers", key: "offers" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { t, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isRtl = dir === "rtl";

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
            <span className="block truncate text-brand-gold">Ayadina Grills</span>
            <span
              className="block truncate text-xs sm:text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              مشويات أيادينا
            </span>
          </Link>

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
                    backgroundColor: isActive ? "var(--brand-gold, #F3A712)" : "transparent",
                    color: isActive ? "#0B0B0B" : "var(--text-secondary)",
                  }}
                >
                  {t.nav[key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex size-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:text-brand-gold"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
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
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileOpen ? "visible" : "invisible pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label={t.nav.closeMenu}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel - slides from the correct side based on dir */}
        <div
          className={`absolute inset-y-0 flex w-full max-w-sm flex-col shadow-2xl transition-all duration-300 ease-in-out ${
            isRtl
              ? `end-0 border-s ${mobileOpen ? "translate-x-0" : "translate-x-full"}`
              : `start-0 border-e ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
          }`}
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-page)",
          }}
        >
          <div
            className="flex items-center justify-between border-b px-4 py-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <p className="text-sm font-semibold text-brand-gold">Ayadina Grills</p>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full transition-colors"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
              aria-label={t.nav.closeMenu}
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Mobile navigation">
            {navLinks.map(({ href, key }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: isActive ? "var(--brand-gold, #F3A712)" : "transparent",
                    color: isActive ? "#0B0B0B" : "var(--text-secondary)",
                  }}
                >
                  {t.nav[key]}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
