"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useLocale } from "@/i18n/locale-context";
import { isAdminPath } from "@/lib/paths";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dir, locale } = useLocale();
  const isAdminRoute = isAdminPath(pathname);

  if (isAdminRoute) {
    return (
      <div
        dir={dir}
        data-locale={locale}
        className="locale-transition flex min-h-screen flex-col transition-all duration-300 ease-in-out"
      >
        <div key={pathname} className="page-enter flex min-h-screen flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      data-locale={locale}
      className="locale-transition flex min-h-screen flex-col transition-all duration-300 ease-in-out"
    >
      <SiteHeader />
      <main key={pathname} className="page-enter flex-1 transition-all duration-300 ease-in-out">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
