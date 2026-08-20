"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { getOfferCopy } from "@/types/data";
import type { Offer } from "@/types/data";

const AUTOPLAY_MS = 5_000;

export function AnnouncementTeaser() {
  const { t, locale } = useLocale();
  const { homeAnnouncements } = useData();

  const offers = useMemo(
    () => homeAnnouncements.filter((o) => o.image),
    [homeAnnouncements],
  );

  if (offers.length === 0) return null;
  if (offers.length === 1) return <StaticBanner offer={offers[0]} />;

  return <Carousel offers={offers} />;
}

/* ── Single-offer static banner ── */

function StaticBanner({ offer }: { offer: Offer }) {
  const { t, locale } = useLocale();
  const copy = getOfferCopy(offer, locale);

  return (
    <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
      <div className="mx-auto w-full max-w-7xl">
        <div
          className="overflow-hidden rounded-2xl border transition-all duration-300"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[220px] sm:min-h-[280px]">
              <SmartImage
                src={offer.image}
                alt={copy.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60 lg:bg-gradient-to-t" />
            </div>

            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand-gold" />
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">
                  {t.home.announcementTitle}
                </p>
              </div>
              <h2
                className="text-2xl font-semibold sm:text-3xl"
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
              <Link
                href="/offers"
                className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/20"
              >
                {t.home.announcementCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Multi-offer carousel ── */

function Carousel({ offers }: { offers: Offer[] }) {
  const { t, locale } = useLocale();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = offers.length;
  const isRtl = locale === "ar";

  const go = useCallback(
    (delta: number) => {
      setCurrent((prev) => (prev + delta + count) % count);
    },
    [count],
  );

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  /* Auto-play */
  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, count]);

  /* Keyboard navigation */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(isRtl ? 1 : -1);
      if (e.key === "ArrowRight") go(isRtl ? -1 : 1);
    },
    [go, isRtl],
  );

  return (
    <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
      <div className="mx-auto w-full max-w-7xl">
        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-300"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-card)",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-label={t.home.announcementTitle}
          aria-roledescription="carousel"
        >
          {/* Slides track */}
          <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ transform: `translateX(${isRtl ? current : -current}00%)` }}>
            {offers.map((offer) => {
              const copy = getOfferCopy(offer, locale);
              return (
                <div
                  key={offer.id}
                  className="w-full shrink-0"
                  role="group"
                  aria-roledescription="slide"
                >
                  <div className="grid lg:grid-cols-2">
                    <div className="relative min-h-[220px] sm:min-h-[280px]">
                      <SmartImage
                        src={offer.image}
                        alt={copy.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60 lg:bg-gradient-to-t" />
                    </div>

                    <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-brand-gold" />
                        <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">
                          {t.home.announcementTitle}
                        </p>
                      </div>
                      <h2
                        className="text-2xl font-semibold sm:text-3xl"
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
                      <Link
                        href="/offers"
                        className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/20"
                      >
                        {t.home.announcementCta}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          <NavArrow
            direction="prev"
            isRtl={isRtl}
            onClick={() => go(isRtl ? 1 : -1)}
          />
          <NavArrow
            direction="next"
            isRtl={isRtl}
            onClick={() => go(isRtl ? -1 : 1)}
          />

          {/* Pagination dots */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {offers.map((offer, i) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${i + 1}`}
                className="size-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === current ? "var(--brand-gold, #F3A712)" : "rgba(255,255,255,0.4)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Arrow button ── */

function NavArrow({
  direction,
  isRtl,
  onClick,
}: {
  direction: "prev" | "next";
  isRtl: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev"
    ? (isRtl ? ChevronRight : ChevronLeft)
    : (isRtl ? ChevronLeft : ChevronRight);

  const posClass = direction === "prev"
    ? "start-2 rtl:start-auto rtl:end-2"
    : "end-2 rtl:end-auto rtl:start-2";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${posClass}`}
      style={{
        backgroundColor: "var(--glass-bg, rgba(0,0,0,0.5))",
        border: "1px solid var(--glass-border, rgba(255,255,255,0.15))",
        color: "var(--text-primary)",
        backdropFilter: "blur(8px)",
      }}
      aria-label={direction === "prev" ? "Previous" : "Next"}
    >
      <Icon className="size-5" />
    </button>
  );
}
