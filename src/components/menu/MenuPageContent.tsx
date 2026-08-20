"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/ui/SectionHeading";
import { DishCard } from "@/components/menu/DishCard";
import { DishModal } from "@/components/menu/DishModal";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { getDishCopy, type Dish } from "@/types/data";

export function MenuPageContent() {
  const { t, locale } = useLocale();
  const { availableDishes, categories } = useData();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return availableDishes.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.categoryId === activeCategory;
      const dish = getDishCopy(item, locale);
      const matchesSearch =
        query.length === 0 ||
        dish.name.toLowerCase().includes(query) ||
        dish.shortDescription.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, availableDishes, locale, searchQuery]);

  return (
    <>
      <PageHero title={t.menu.pageTitle} subtitle={t.menu.pageSubtitle} />

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: activeCategory === "all" ? "var(--brand-gold, #F3A712)" : "var(--bg-card)",
                  color: activeCategory === "all" ? "#0B0B0B" : "var(--text-secondary)",
                  border: activeCategory === "all" ? "none" : "1px solid var(--border-default)",
                }}
              >
                {t.menu.categories.all}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className="shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: activeCategory === category.id ? "var(--brand-gold, #F3A712)" : "var(--bg-card)",
                    color: activeCategory === category.id ? "#0B0B0B" : "var(--text-secondary)",
                    border: activeCategory === category.id ? "none" : "1px solid var(--border-default)",
                  }}
                >
                  {category.name[locale]}
                </button>
              ))}
            </div>

            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">{t.common.searchMenu}</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t.common.searchMenu}
                className="w-full rounded-full py-3 pe-4 ps-11 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                style={{
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                }}
              />
              <Search
                className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
                aria-hidden
              />
            </label>
          </div>

          {filteredItems.length === 0 ? (
            <p
              className="rounded-2xl border px-6 py-10 text-center text-sm"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-muted)",
              }}
            >
              {t.common.noResults}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {filteredItems.map((item) => (
                <DishCard key={item.id} item={item} onSelect={setSelectedDish} />
              ))}
            </div>
          )}
        </div>
      </section>

      <DishModal item={selectedDish} onClose={() => setSelectedDish(null)} />
    </>
  );
}
