"use client";

import { Sparkles } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { galleryImages } from "@/data/site";
import { useLocale } from "@/i18n/locale-context";

export function AboutPageContent() {
  const { t } = useLocale();

  return (
    <>
      <PageHero title={t.about.pageTitle} subtitle={t.about.pageSubtitle} />

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading title={t.about.storyTitle} />
          <p
            className="text-sm leading-8 sm:text-base lg:pt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.about.storyBody}
          </p>
        </div>
      </section>

      <section
        className="border-y px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <SectionHeading title={t.about.valuesTitle} />
          <ul className="grid gap-4 sm:grid-cols-2">
            {t.about.values.map((value) => (
              <li
                key={value}
                className="rounded-2xl border p-5 text-sm leading-7 sm:text-base"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                }}
              >
                <Sparkles className="me-2 inline size-4 text-brand-gold" aria-hidden />
                {value}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <SectionHeading title={t.about.galleryTitle} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  index === 0 ? "col-span-2 aspect-[16/9] lg:col-span-2" : "aspect-square"
                }`}
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <SmartImage
                  src={image}
                  alt={`${t.about.galleryTitle} ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
