"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/ui/SectionHeading";
import { isRestaurantOpen } from "@/data/site";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { bilingualOr } from "@/lib/cms-copy";
import { routes } from "@/lib/paths";
import { toTelHref, toWhatsAppHref } from "@/lib/phone";

export function QuickInfoStrip() {
  const { t, locale } = useLocale();
  const { siteSettings, branches } = useData();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const isOpen = isRestaurantOpen(now);
  const mainBranch =
    branches.find((b) => b.isMainBranch && b.phone.trim()) ??
    branches.find((b) => b.phone.trim());
  const phone = mainBranch?.phone.trim() ?? "";
  const whatsappCta = bilingualOr(
    siteSettings.contactWhatsappCta,
    locale,
    t.contact.sendWhatsapp,
  );

  return (
    <section
      className="border-y"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold sm:text-base" style={{ color: "var(--text-primary)" }}>
            {bilingualOr(siteSettings.quickInfoText, locale, t.home.quickInfoTitle)}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              isOpen={isOpen}
              openLabel={t.common.openNow}
              closedLabel={t.common.closed}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t.common.openingHours}: {bilingualOr(siteSettings.openingHours, locale, t.common.hoursValue)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {phone ? (
            <>
              <a
                href={toTelHref(phone)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-all duration-300 ease-in-out hover:border-brand-gold hover:text-brand-gold"
                style={{
                  borderColor: "var(--border-default)",
                  backgroundColor: "var(--bg-page)",
                  color: "var(--text-primary)",
                }}
              >
                <Phone className="size-4" />
                {t.buttons.callNow}
              </a>
              <a
                href={toWhatsAppHref(phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <MessageSquare className="size-4" />
                {whatsappCta}
              </a>
            </>
          ) : (
            <Link
              href={routes.contact}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark transition-all duration-300 hover:bg-brand-gold-hover"
            >
              {t.nav.contact}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
