"use client";

import { Calendar } from "lucide-react";
import { PageHero } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { getOfferCopy } from "@/types/data";

export function OffersPageContent() {
  const { t, locale } = useLocale();
  const { activeOffers } = useData();

  return (
    <>
      <PageHero title={t.offers.pageTitle} subtitle={t.offers.pageSubtitle} />

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-6 sm:grid-cols-2 lg:gap-8">
          {activeOffers.length === 0 ? (
            <p
              className="col-span-full rounded-2xl border px-6 py-10 text-center text-sm"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-muted)",
              }}
            >
              {t.admin.noOffers}
            </p>
          ) : (
            activeOffers.map((offer) => {
              const copy = getOfferCopy(offer, locale);

              return (
                <article
                  key={offer.id}
                  className="overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  <div className="relative aspect-[16/9]">
                    <SmartImage
                      src={offer.image}
                      alt={copy.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="space-y-3 p-5 sm:p-6">
                    <h2
                      className="text-xl font-semibold sm:text-2xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {copy.title}
                    </h2>
                    <p
                      className="text-sm leading-7 sm:text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {copy.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-brand-gold sm:text-sm">
                      <Calendar className="size-3.5" />
                      {t.common.validUntil}: {copy.validPeriod}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
