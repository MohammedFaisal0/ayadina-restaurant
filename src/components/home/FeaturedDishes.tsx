"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { getDishCopy } from "@/types/data";
import { routes } from "@/lib/paths";
import { bilingualOr } from "@/lib/cms-copy";

export function FeaturedDishes() {
  const { t, locale, dir } = useLocale();
  const { featuredDishes, siteSettings } = useData();

  if (featuredDishes.length === 0) return null;

  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <SectionHeading
          title={bilingualOr(siteSettings.featuredTitle, locale, t.home.featuredTitle)}
          subtitle={bilingualOr(siteSettings.featuredSubtitle, locale, t.home.featuredSubtitle)}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {featuredDishes.slice(0, 3).map((item) => {
            const dish = getDishCopy(item, locale);

            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-brand-gold/5"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SmartImage
                    src={item.image}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute start-3 top-3 rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold text-brand-dark">
                    {t.common.featured}
                  </span>
                </div>
                <div className="space-y-2 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {dish.name}
                    </h3>
                    <p className="shrink-0 text-sm font-bold text-brand-gold">
                      {item.price} {t.common.price}
                    </p>
                  </div>
                  <p
                    className="text-sm leading-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {dish.shortDescription}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href={routes.menu}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-all duration-300 ease-in-out hover:border-brand-gold hover:text-brand-gold"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            {t.buttons.viewMenu}
            <Arrow className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
