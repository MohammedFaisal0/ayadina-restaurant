"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { getOfferCopy } from "@/types/data";
import type { Offer } from "@/types/data";
import { routes } from "@/lib/paths";
import { bilingualOr } from "@/lib/cms-copy";

const AUTOPLAY_MS = 5_000;
const SWIPE_THRESHOLD_PX = 48;

/** CMS-driven eyebrow + CTA labels, falling back to the static dictionary. */
function useAnnouncementCopy() {
  const { t, locale } = useLocale();
  const { siteSettings } = useData();
  return {
    title: bilingualOr(siteSettings.announcementTitle, locale, t.home.announcementTitle),
    cta: bilingualOr(siteSettings.announcementCta, locale, t.home.announcementCta),
  };
}

export function AnnouncementTeaser() {
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
  const { locale } = useLocale();
  const announcement = useAnnouncementCopy();
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
            <div className="relative min-h-[240px] sm:min-h-[280px]">
              <SmartImage
                src={offer.image}
                alt={copy.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60 lg:bg-gradient-to-t" />
            </div>

            <div className="flex flex-col justify-center gap-4 p-6 pb-8 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand-gold" />
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">
                  {announcement.title}
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
                href={routes.offers}
                className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/20"
              >
                {announcement.cta}
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
  const { locale } = useLocale();
  const announcement = useAnnouncementCopy();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

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

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(isRtl ? 1 : -1);
      if (e.key === "ArrowRight") go(isRtl ? -1 : 1);
    },
    [go, isRtl],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore primary button only for mouse; touch/pen always ok
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerStartX.current = e.clientX;
    didSwipe.current = false;
    setPaused(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current == null) return;
    if (Math.abs(e.clientX - pointerStartX.current) > 12) {
      didSwipe.current = true;
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current == null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) {
      // LTR: swipe left → next; RTL: swipe left → previous (natural reading)
      if (isRtl) {
        go(dx > 0 ? 1 : -1);
      } else {
        go(dx < 0 ? 1 : -1);
      }
    }

    setPaused(false);
  };

  const onPointerCancel = () => {
    pointerStartX.current = null;
    setPaused(false);
  };

  /** Block accidental link clicks after a drag/swipe. */
  const onClickCapture = (e: React.MouseEvent) => {
    if (didSwipe.current) {
      e.preventDefault();
      e.stopPropagation();
      didSwipe.current = false;
    }
  };

  return (
    <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
      <div className="mx-auto w-full max-w-7xl">
        <div
          className="relative cursor-grab overflow-hidden rounded-2xl border transition-all duration-300 active:cursor-grabbing"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-card)",
            touchAction: "pan-y",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            if (pointerStartX.current == null) setPaused(false);
          }}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClickCapture={onClickCapture}
          tabIndex={0}
          role="region"
          aria-label={announcement.title}
          aria-roledescription="carousel"
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              transform: `translateX(${isRtl ? current : -current}00%)`,
            }}
          >
            {offers.map((offer) => {
              const copy = getOfferCopy(offer, locale);
              return (
                <div
                  key={offer.id}
                  className="w-full shrink-0 select-none"
                  role="group"
                  aria-roledescription="slide"
                >
                  <div className="grid lg:grid-cols-2">
                    <div className="relative min-h-[240px] sm:min-h-[280px]">
                      <SmartImage
                        src={offer.image}
                        alt={copy.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="pointer-events-none object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60 lg:bg-gradient-to-t" />
                    </div>

                    <div className="flex flex-col justify-center gap-4 p-6 pb-8 sm:gap-5 sm:p-8 lg:p-10">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-brand-gold" />
                        <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">
                          {announcement.title}
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

                      <div className="flex flex-col items-start gap-5">
                        <Link
                          href={routes.offers}
                          className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/20"
                        >
                          {announcement.cta}
                        </Link>

                        {/* Dots sit cleanly under the CTA (~20px via gap-5) */}
                        <div
                          className="flex items-center gap-2"
                          role="tablist"
                          aria-label="Slides"
                        >
                          {offers.map((item, i) => (
                            <button
                              key={item.id}
                              type="button"
                              role="tab"
                              aria-selected={i === current}
                              aria-label={`${i + 1}`}
                              onClick={() => goTo(i)}
                              className="size-2.5 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor:
                                  i === current
                                    ? "var(--brand-gold, #F3A712)"
                                    : "var(--border-default)",
                                transform: i === current ? "scale(1.25)" : "scale(1)",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
