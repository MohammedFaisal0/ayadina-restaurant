"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tag, Sun, Moon, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/i18n/locale-context";
import { useTheme } from "@/context/ThemeContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { routes } from "@/lib/paths";

const adminLinks = [
  { href: routes.adminMenu, key: "menuManagement" as const, icon: LayoutDashboard },
  { href: routes.adminOffers, key: "offersManagement" as const, icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
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
                  style={{
                    backgroundColor: isActive ? "var(--brand-gold, #F3A712)" : "transparent",
                    color: isActive ? "#0B0B0B" : "var(--text-secondary)",
                  }}
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

      <div
        className="border-b lg:hidden"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="text-sm font-semibold text-brand-gold">Ayadina Admin</p>
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
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          {adminLinks.map(({ href, key, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium sm:text-sm transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: isActive ? "var(--brand-gold, #F3A712)" : "var(--bg-page)",
                  color: isActive ? "#0B0B0B" : "var(--text-secondary)",
                  border: isActive ? "none" : "1px solid var(--border-default)",
                }}
              >
                <Icon className="size-3.5" />
                {t.admin[key]}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-red-500/40 px-4 py-2 text-xs font-medium text-red-400 sm:text-sm"
          >
            <LogOut className="size-3.5" />
            {t.admin.logout}
          </button>
        </nav>
      </div>
    </>
  );
}
