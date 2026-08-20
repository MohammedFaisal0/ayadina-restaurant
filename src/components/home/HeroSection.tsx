"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(11,11,11,0.55), rgba(11,11,11,0.92)), url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-transparent to-[var(--bg-page)]/40" />

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:min-h-[75vh] sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl space-y-5">
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-brand-gold" />
            <p className="text-xs uppercase tracking-[0.25em] text-brand-gold sm:text-sm">
              Ayadina Grills
            </p>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-6xl">
            {t.home.heroTitle}
          </h1>
          <p className="max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
            {t.home.heroSubtitle}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-8 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/20 sm:text-base"
          >
            {t.buttons.orderNow}
          </Link>
          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center justify-center rounded-full border px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-brand-gold hover:text-brand-gold sm:text-base"
            style={{ borderColor: "var(--glass-border)", backgroundColor: "var(--glass-bg)" }}
          >
            {t.buttons.viewMenu}
          </Link>
        </div>
      </div>
    </section>
  );
}
