"use client";

import Link from "next/link";
import { Clock, Phone } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";

export function SiteFooter() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t px-4 py-8 sm:px-6 lg:px-8"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-brand-gold">
            Ayadina Grills | مشويات أيادينا
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <Clock className="size-3.5" />
            <span>{t.common.openingHours}: {t.common.hoursValue}</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {year} Ayadina Grills. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-wrap gap-3 text-sm">
            {[
              { href: "/menu", label: t.nav.menu },
              { href: "/offers", label: t.nav.offers },
              { href: "/about", label: t.nav.about },
              { href: "/contact", label: t.nav.contact },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors duration-300 hover:text-brand-gold"
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </Link>
            ))}
          </div>
          <a
            href="tel:+966112345678"
            className="flex items-center gap-1.5 text-xs transition-colors duration-300 hover:text-brand-gold"
            style={{ color: "var(--text-muted)" }}
          >
            <Phone className="size-3" />
            <span dir="ltr" className="unicode-bidi-isolate">+966 11 234 5678</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
