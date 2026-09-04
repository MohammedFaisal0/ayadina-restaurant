"use client";

import { useState } from "react";
import { AlertTriangle, Flame, Star, UtensilsCrossed } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { SmartImage } from "@/components/ui/SmartImage";
import { useLocale } from "@/i18n/locale-context";
import { getDishCopy, type Dish } from "@/types/data";

type DishModalProps = {
  item: Dish | null;
  onClose: () => void;
};

export function DishModal({ item, onClose }: DishModalProps) {
  const { locale, t } = useLocale();
  const [displayItem, setDisplayItem] = useState<Dish | null>(item);

  // Keep last dish for exit animation while `item` is null.
  if (item != null && item !== displayItem) {
    setDisplayItem(item);
  }

  if (!displayItem) return null;

  const dish = getDishCopy(displayItem, locale);

  return (
    <Modal
      open={Boolean(item)}
      onClose={onClose}
      size="lg"
      icon={<UtensilsCrossed className="size-5" />}
      title={dish.name}
      ariaLabelledBy="dish-modal-title"
      panelClassName="overflow-hidden"
      contentClassName="p-0"
    >
      <div className="relative h-48 w-full sm:h-56">
        <SmartImage
          src={displayItem.image}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, 672px"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <h2 id="dish-modal-title" className="sr-only">
              {dish.name}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {displayItem.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 px-2.5 py-1 text-xs font-medium text-brand-gold ring-1 ring-brand-gold/30"
                >
                  {badge === "spicy" ? (
                    <Flame className="size-3" />
                  ) : (
                    <Star className="size-3" />
                  )}
                  {badge === "spicy" ? t.common.spicy : t.common.popular}
                </span>
              ))}
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1"
                style={{
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-surface)",
                  boxShadow: "inset 0 0 0 1px var(--border-default)",
                }}
              >
                {displayItem.calories} {t.common.kcal}
              </span>
            </div>
          </div>
          <p className="shrink-0 text-lg font-bold text-brand-gold sm:text-xl">
            {displayItem.price} {t.common.price}
          </p>
        </div>

        <p className="text-sm leading-6 sm:text-[15px]" style={{ color: "var(--text-secondary)" }}>
          {dish.description}
        </p>

        <div>
          <h3
            className="mb-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {t.common.ingredients}
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {dish.ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="rounded-full px-2.5 py-1 text-xs ring-1"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                  boxShadow: "inset 0 0 0 1px var(--border-default)",
                }}
              >
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {dish.allergens.length > 0 ? (
          <div
            className="rounded-2xl border p-3.5"
            style={{ borderColor: "var(--border-gold)", backgroundColor: "var(--border-gold)" }}
          >
            <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand-gold">
              <AlertTriangle className="size-3.5" />
              {t.common.allergens}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {dish.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="rounded-full px-2.5 py-1 text-xs font-medium text-brand-gold"
                  style={{ backgroundColor: "var(--bg-surface)" }}
                >
                  {allergen}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-5 text-brand-gold opacity-80">
              {t.common.allergenWarning}
            </p>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
