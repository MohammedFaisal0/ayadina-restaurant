"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useLocale } from "@/i18n/locale-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dir, locale } = useLocale();
  const isAdminRoute = pathname.startsWith("/admin");

  const shell = (
    <div
      dir={dir}
      data-locale={locale}
      className="locale-transition flex min-h-screen flex-col transition-all duration-300 ease-in-out"
    >
      {children}
    </div>
  );

  if (isAdminRoute) return shell;

  return (
    <div
      dir={dir}
      data-locale={locale}
      className="locale-transition flex min-h-screen flex-col transition-all duration-300 ease-in-out"
    >
      <SiteHeader />
      <main className="flex-1 transition-all duration-300 ease-in-out">{children}</main>
      <SiteFooter />
    </div>
  );
}
