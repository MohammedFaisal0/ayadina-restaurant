"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ExternalLink,
  Home,
  LogOut,
  Menu,
  Moon,
  Phone,
  Settings,
  Sun,
  Tag,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/i18n/locale-context";
import { useTheme } from "@/context/ThemeContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { routes } from "@/lib/paths";

const adminLinks = [
  { href: routes.adminSettings, key: "generalSettings" as const, icon: Settings },
  { href: routes.adminHome, key: "homePageCms" as const, icon: Home },
  { href: routes.adminMenu, key: "menuManagement" as const, icon: UtensilsCrossed },
  { href: routes.adminOffers, key: "offersManagement" as const, icon: Tag },
  { href: routes.adminAbout, key: "aboutPageCms" as const, icon: BookOpen },
  { href: routes.adminContact, key: "contactPageCms" as const, icon: Phone },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t, dir } = useLocale();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const isRtl = dir === "rtl";

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navLinkStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? "var(--brand-gold, #F3A712)" : "transparent",
    color: isActive ? "#0B0B0B" : "var(--text-secondary)",
  });

  const drawer =
    portalReady &&
    createPortal(
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileOpen ? "visible" : "invisible pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label={t.nav.closeMenu}
          onClick={closeMobile}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.admin.dashboardTitle}
          className={`absolute inset-y-0 flex w-full max-w-sm flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
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
            <div>
              <p className="text-sm font-semibold text-brand-gold">Ayadina Admin</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {t.admin.dashboardTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={closeMobile}
              aria-label={t.nav.closeMenu}
              className="inline-flex size-10 items-center justify-center rounded-full transition-colors"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Admin">
            {adminLinks.map(({ href, key, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300"
                  style={navLinkStyle(isActive)}
                >
                  <Icon className="size-4 shrink-0" />
                  {t.admin[key]}
                </Link>
              );
            })}
          </nav>

          <div
            className="space-y-3 border-t p-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <Link
              href="/"
              onClick={closeMobile}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors hover:text-brand-gold"
              style={{ color: "var(--text-muted)" }}
            >
              <ExternalLink className="size-3.5" />
              {t.admin.backToSite}
            </Link>
            <button
              type="button"
              onClick={() => {
                closeMobile();
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
            >
              <LogOut className="size-3.5" />
              {t.admin.logout}
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden w-64 shrink-0 border-e lg:block"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <div
            className="mb-6 space-y-1 border-b pb-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <p className="text-sm font-semibold text-brand-gold">Ayadina Admin</p>
            <p style={{ color: "var(--text-muted)" }} className="text-xs">
              {t.admin.dashboardTitle}
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {adminLinks.map(({ href, key, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out"
                  style={navLinkStyle(isActive)}
                >
                  <Icon className="size-4" />
                  {t.admin[key]}
                </Link>
              );
            })}
          </nav>

          <div
            className="mt-auto space-y-3 border-t pt-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex size-9 items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:text-brand-gold"
                style={{
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                }}
                aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors duration-300 hover:text-brand-gold"
              style={{ color: "var(--text-muted)" }}
            >
              <ExternalLink className="size-3.5" />
              {t.admin.backToSite}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-all duration-300 ease-in-out hover:border-red-400/50 hover:bg-red-500/10"
            >
              <LogOut className="size-3.5" />
              {t.admin.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar — no horizontal scrolling tabs */}
      <div
        className="border-b lg:hidden"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t.nav.openMenu}
              aria-expanded={mobileOpen}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:text-brand-gold"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
            >
              <Menu className="size-5" />
            </button>
            <p className="truncate text-sm font-semibold text-brand-gold">Ayadina Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex size-9 items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:text-brand-gold"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {drawer}
    </>
  );
}
