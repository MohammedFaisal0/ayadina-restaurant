"use client";

import { useEffect, useState } from "react";
import { Phone, MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/ui/SectionHeading";
import { isRestaurantOpen, PRIMARY_PHONE, WHATSAPP_NUMBER } from "@/data/site";
import { useLocale } from "@/i18n/locale-context";

export function QuickInfoStrip() {
  const { t } = useLocale();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const isOpen = isRestaurantOpen(now);

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
          <p
            className="text-sm font-semibold sm:text-base"
            style={{ color: "var(--text-primary)" }}
          >
            {t.home.quickInfoTitle}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              isOpen={isOpen}
              openLabel={t.common.openNow}
              closedLabel={t.common.closed}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t.common.openingHours}: {t.common.hoursValue}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <a
            href={`tel:${PRIMARY_PHONE}`}
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
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <MessageSquare className="size-4" />
            {t.buttons.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
