"use client";

import { useEffect, useState } from "react";
import { X, Flame, Star, AlertTriangle } from "lucide-react";
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

  useEffect(() => {
    if (item) setDisplayItem(item);
  }, [item]);

  if (!displayItem) return null;

  const dish = getDishCopy(displayItem, locale);

  return (
    <Modal
      open={Boolean(item)}
      onClose={onClose}
      showCloseButton={false}
      size="lg"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          type="button"
          onClick={onClose}
          aria-label={t.buttons.close}
          className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-110 hover:border-brand-gold hover:text-brand-gold"
          style={{
            border: "1px solid var(--glass-border)",
            backgroundColor: "var(--glass-bg)",
            color: "var(--text-primary)",
          }}
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="modal-scroll space-y-3 p-4 sm:space-y-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <h2
              id="dish-modal-title"
              className="text-xl font-semibold leading-tight sm:text-2xl"
              style={{ color: "var(--text-primary)" }}
            >
              {dish.name}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {displayItem.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 px-2 py-0.5 text-xs font-medium text-brand-gold ring-1 ring-brand-gold/30"
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
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1"
                style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)", boxShadow: "inset 0 0 0 1px var(--border-default)" }}
              >
                {displayItem.calories} {t.common.kcal}
              </span>
            </div>
          </div>
          <p className="shrink-0 text-lg font-bold text-brand-gold">
            {displayItem.price} {t.common.price}
          </p>
        </div>

        <p
          className="text-sm leading-6 sm:text-[15px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {dish.description}
        </p>

        <div>
          <h3
            className="mb-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {t.common.ingredients}
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {dish.ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="rounded-full px-2.5 py-0.5 text-xs ring-1"
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
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3"
          >
            <h3 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <AlertTriangle className="size-3.5" />
              {t.common.allergens}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {dish.allergens.map((allergen) => (
                <li
                  key={allergen}
                  className="list-none rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-200"
                >
                  {allergen}
                </li>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] leading-5 text-amber-100/70">
              {t.common.allergenWarning}
            </p>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
