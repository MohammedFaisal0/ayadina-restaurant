"use client";

import { Flame, Star } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { useLocale } from "@/i18n/locale-context";
import { getDishCopy, type Dish } from "@/types/data";

type DishCardProps = {
  item: Dish;
  onSelect: (item: Dish) => void;
};

export function DishCard({ item, onSelect }: DishCardProps) {
  const { locale, t } = useLocale();
  const dish = getDishCopy(item, locale);

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group w-full overflow-hidden rounded-2xl border text-start transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-brand-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
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
        {item.badges.length > 0 ? (
          <div className="absolute start-3 top-3 flex flex-wrap gap-2">
            {item.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-full bg-brand-gold/90 px-2.5 py-1 text-xs font-medium text-brand-dark backdrop-blur-sm"
              >
                {badge === "spicy" ? (
                  <Flame className="size-3" />
                ) : (
                  <Star className="size-3" />
                )}
                {badge === "spicy" ? t.common.spicy : t.common.popular}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-3 p-4 sm:p-5">
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
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
          style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}
        >
          <Flame className="size-3" />
          {t.common.calories}: {item.calories} {t.common.kcal}
        </div>
      </div>
    </button>
  );
}
