"use client";

import { MapPin, Phone, MessageSquare, Navigation } from "lucide-react";
import { PageHero } from "@/components/ui/SectionHeading";
import { branches, WHATSAPP_NUMBER } from "@/data/site";
import { useLocale } from "@/i18n/locale-context";

export function ContactPageContent() {
  const { t } = useLocale();

  return (
    <>
      <PageHero title={t.contact.pageTitle} subtitle={t.contact.pageSubtitle} />

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-6">
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {t.contact.branchesTitle}
            </h2>

            <div className="space-y-4">
              {branches.map((branch) => {
                const copy = t.branches[branch.id];

                return (
                  <article
                    key={branch.id}
                    className="rounded-2xl border p-5 sm:p-6"
                    style={{
                      borderColor: "var(--border-subtle)",
                      backgroundColor: "var(--bg-card)",
                    }}
                  >
                    <h3
                      className="flex items-center gap-2 text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <MapPin className="size-5 text-brand-gold" />
                      {copy.name}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-7"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {copy.address}
                    </p>
                    <p
                      className="mt-3 flex items-center gap-1.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Phone className="size-3.5" />
                      {t.common.phone}:{" "}
                      <a
                        href={`tel:${branch.phone}`}
                        className="font-medium text-brand-gold hover:text-brand-gold-hover"
                      >
                        <span dir="ltr" className="unicode-bidi-isolate">{branch.phone}</span>
                      </a>
                    </p>
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-brand-gold hover:text-brand-gold-hover"
                    >
                      <Navigation className="size-4" />
                      {t.buttons.getDirections}
                    </a>
                  </article>
                );
              })}
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 sm:w-auto"
            >
              <MessageSquare className="size-4" />
              {t.contact.whatsappCta}
            </a>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {t.contact.mapTitle}
            </h2>
            <div
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <iframe
                title={t.contact.mapTitle}
                src="https://maps.google.com/maps?q=Riyadh%20Saudi%20Arabia&z=11&output=embed"
                className="h-[280px] w-full sm:h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
