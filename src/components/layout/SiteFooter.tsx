"use client";

import Link from "next/link";
import { Clock, Phone } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";
import { routes } from "@/lib/paths";

export function SiteFooter() {
  const { t, dir } = useLocale();
  const year = new Date().getFullYear();
  const isRtl = dir === "rtl";

  return (
    <footer
      className="border-t px-4 py-8 sm:px-6 lg:px-8"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div
        dir="ltr"
        className={`mx-auto flex w-full max-w-7xl flex-col items-center gap-8 text-center md:items-start md:justify-between ${
          isRtl ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        <div
          className={`flex flex-col items-center gap-4 ${
            isRtl ? "md:flex-row md:items-start md:text-left" : "md:flex-row-reverse md:items-start md:text-right"
          }`}
        >
          <img
            src="/logo.png"
            alt="Ayadina Grills"
            className="h-14 w-14 shrink-0 rounded-full object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.3)] md:h-16 md:w-16"
          />
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-brand-gold">
              Ayadina Grills | مشويات أيادينا
            </p>
            <div
              className={`flex items-center justify-center gap-2 text-xs ${
                isRtl ? "md:justify-start" : "md:justify-end"
              }`}
              style={{ color: "var(--text-muted)" }}
            >
              <Clock className="size-3.5" />
              <span>{t.common.openingHours}: {t.common.hoursValue}</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © {year} Ayadina Grills. All rights reserved.
            </p>
          </div>
        </div>

        <div
          className={`flex flex-col items-center gap-3 ${
            isRtl ? "md:items-end md:text-right" : "md:items-start md:text-left"
          }`}
        >
          <div
            className={`flex flex-wrap justify-center gap-3 text-sm ${
              isRtl ? "md:justify-end" : "md:justify-start"
            }`}
          >
            {(isRtl
              ? [
                  { href: routes.contact, label: t.nav.contact },
                  { href: routes.about, label: t.nav.about },
                  { href: routes.offers, label: t.nav.offers },
                  { href: routes.menu, label: t.nav.menu },
                ]
              : [
                  { href: routes.menu, label: t.nav.menu },
                  { href: routes.offers, label: t.nav.offers },
                  { href: routes.about, label: t.nav.about },
                  { href: routes.contact, label: t.nav.contact },
                ]
            ).map(({ href, label }) => (
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
            className={`flex items-center justify-center gap-1.5 text-xs transition-colors duration-300 hover:text-brand-gold ${
              isRtl ? "md:justify-end" : "md:justify-start"
            }`}
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
