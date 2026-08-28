"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, Flame, Star, Languages } from "lucide-react";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import {
  buildBilingualList,
  buildBilingualText,
} from "@/lib/translate";
import type { Category, CategoryFormData, Dish, DishFormData } from "@/types/data";

function parseList(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function emptyDishForm(categoryId: string): DishFormData {
  return {
    categoryId,
    price: 0,
    calories: 0,
    badges: [],
    image: "",
    featured: false,
    available: true,
    name: { ar: "", en: "" },
    shortDescription: { ar: "", en: "" },
    description: { ar: "", en: "" },
    ingredients: { ar: [], en: [] },
    allergens: { ar: [], en: [] },
  };
}

/* ─── Category Modal ─── */

type CategoryModalProps = {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (data: CategoryFormData) => Promise<void>;
};

function CategoryModal({ open, category, onClose, onSave }: CategoryModalProps) {
  const { t } = useLocale();
  const [nameAr, setNameAr] = useState(category?.name.ar ?? "");

  useEffect(() => {
    if (open) setNameAr(category?.name.ar ?? "");
  }, [open, category]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSave({ name: await buildBilingualText(nameAr, category?.name.en, category?.name.ar) });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={category ? t.admin.editCategory : t.admin.addCategory}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">
            {t.admin.categoryNameAr}
          </span>
          <input
            value={nameAr}
            onChange={(event) => setNameAr(event.target.value)}
            required
            className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
            style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
          />
        </label>
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
          style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}
        >
          <Languages className="size-3.5 shrink-0" />
          English auto-filled on save
        </div>
        <ModalActions onClose={onClose} saveLabel={t.admin.save} />
      </form>
    </Modal>
  );
}

/* ─── Dish Form Modal ─── */

type DishFormModalProps = {
  open: boolean;
  dish: Dish | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: DishFormData) => Promise<void>;
};

function DishFormModal({ open, dish, categories, onClose, onSave }: DishFormModalProps) {
  const { t } = useLocale();
  const [form, setForm] = useState<DishFormData>(dish ?? emptyDishForm(categories[0]?.id ?? ""));
  const [ingredientsAr, setIngredientsAr] = useState(dish?.ingredients.ar.join(", ") ?? "");
  const [allergensAr, setAllergensAr] = useState(dish?.allergens.ar.join(", ") ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const next = dish ?? emptyDishForm(categories[0]?.id ?? "");
      setForm(next);
      setIngredientsAr(next.ingredients.ar.join(", "));
      setAllergensAr(next.allergens.ar.join(", "));
      setError("");
    }
  }, [open, dish, categories]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const arIngredients = parseList(ingredientsAr);
    const arAllergens = parseList(allergensAr);
    setError("");
    try {
      await onSave({
        ...form,
        name: await buildBilingualText(form.name.ar, dish?.name.en, dish?.name.ar),
        shortDescription: await buildBilingualText(
          form.shortDescription.ar,
          dish?.shortDescription.en,
          dish?.shortDescription.ar,
        ),
        description: await buildBilingualText(form.description.ar, dish?.description.en, dish?.description.ar),
        ingredients: await buildBilingualList(arIngredients, dish?.ingredients.en, dish?.ingredients.ar),
        allergens: await buildBilingualList(arAllergens, dish?.allergens.en, dish?.allergens.ar),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    }
  };

  const toggleBadge = (badge: "spicy" | "popular") => {
    setForm((c) => ({
      ...c,
      badges: c.badges.includes(badge)
        ? c.badges.filter((b) => b !== badge)
        : [...c.badges, badge],
    }));
  };

  return (
    <Modal open={open} onClose={onClose} title={dish ? t.admin.editDish : t.admin.addDish} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <ImageUpload
          value={form.image}
          onChange={(value) => setForm((c) => ({ ...c, image: value }))}
          required
        />

        {/* Text fields — Arabic only */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Content (Arabic)
          </p>
          <label className="block space-y-1.5">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.dishNameAr}</span>
            <input
              value={form.name.ar}
              onChange={(event) => setForm((c) => ({ ...c, name: { ...c.name, ar: event.target.value } }))}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
          </label>
          <label className="block space-y-1.5">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.shortDescriptionAr}</span>
            <input
              value={form.shortDescription.ar}
              onChange={(event) => setForm((c) => ({ ...c, shortDescription: { ...c.shortDescription, ar: event.target.value } }))}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
          </label>
          <label className="block space-y-1.5">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.descriptionAr}</span>
            <textarea
              value={form.description.ar}
              onChange={(event) => setForm((c) => ({ ...c, description: { ...c.description, ar: event.target.value } }))}
              rows={2}
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
          </label>
          <label className="block space-y-1.5">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.ingredientsAr}</span>
            <textarea
              value={ingredientsAr}
              onChange={(event) => setIngredientsAr(event.target.value)}
              rows={2}
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
            <span style={{ color: "var(--text-muted)" }} className="text-xs">{t.admin.commaSeparated}</span>
          </label>
          <label className="block space-y-1.5">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.allergensAr}</span>
            <textarea
              value={allergensAr}
              onChange={(event) => setAllergensAr(event.target.value)}
              rows={2}
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
            <span style={{ color: "var(--text-muted)" }} className="text-xs">{t.admin.commaSeparated}</span>
          </label>
        </div>

        {/* Auto-translate notice */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
          style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}
        >
          <Languages className="size-3.5 shrink-0" />
          English fields auto-translated on save
        </div>

        {/* Compact 2-column grid for controls */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Details
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.selectCategory}</span>
              <select
                value={form.categoryId}
                onChange={(event) => setForm((c) => ({ ...c, categoryId: event.target.value }))}
                className="w-full rounded-xl border px-4 py-2.5 text-sm"
                style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name.ar}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5">
                <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.price}</span>
                <input
                  type="number"
                  value={String(form.price)}
                  onChange={(event) => setForm((c) => ({ ...c, price: Number(event.target.value) || 0 }))}
                  required
                  className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                  style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                />
              </label>
              <label className="block space-y-1.5">
                <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.calories}</span>
                <input
                  type="number"
                  value={String(form.calories)}
                  onChange={(event) => setForm((c) => ({ ...c, calories: Number(event.target.value) || 0 }))}
                  required
                  className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                  style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Badges + Toggles in 2-col */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.badges}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleBadge("spicy")}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: form.badges.includes("spicy") ? "var(--brand-gold, #F3A712)" : "transparent",
                  color: form.badges.includes("spicy") ? "#0B0B0B" : "var(--text-secondary)",
                  border: form.badges.includes("spicy") ? "none" : "1px solid var(--border-default)",
                }}
              >
                <Flame className="size-3.5" />
                {t.common.spicy}
              </button>
              <button
                type="button"
                onClick={() => toggleBadge("popular")}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: form.badges.includes("popular") ? "var(--brand-gold, #F3A712)" : "transparent",
                  color: form.badges.includes("popular") ? "#0B0B0B" : "var(--text-secondary)",
                  border: form.badges.includes("popular") ? "none" : "1px solid var(--border-default)",
                }}
              >
                <Star className="size-3.5" />
                {t.common.popular}
              </button>
            </div>
          </div>
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <ToggleSwitch
              checked={form.featured}
              onChange={(featured) => setForm((c) => ({ ...c, featured }))}
              label={t.admin.featured}
            />
            <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
            <ToggleSwitch
              checked={form.available}
              onChange={(available) => setForm((c) => ({ ...c, available }))}
              label={t.admin.available}
            />
          </div>
        </div>

        {error ? <p className="text-xs text-red-400">{error}</p> : null}

        <ModalActions onClose={onClose} saveLabel={t.admin.save} />
      </form>
    </Modal>
  );
}

/* ─── Main Content ─── */

export function MenuManagementContent() {
  const { t, locale } = useLocale();
  const {
    categories, dishes, addCategory, updateCategory, deleteCategory,
    addDish, updateDish, deleteDish, toggleDishAvailability,
  } = useData();

  const [categoryModal, setCategoryModal] = useState<Category | null | "new">(null);
  const [dishModal, setDishModal] = useState<Dish | null | "new">(null);
  const [saving, setSaving] = useState(false);

  const handleCategorySave = async (data: CategoryFormData) => {
    setSaving(true);
    try {
      if (categoryModal === "new") { await addCategory(data); return; }
      if (categoryModal) await updateCategory(categoryModal.id, data);
    } finally { setSaving(false); }
  };

  const handleDishSave = async (data: DishFormData) => {
    setSaving(true);
    try {
      if (dishModal === "new") { await addDish(data); return; }
      if (dishModal) await updateDish(dishModal.id, data);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {t.admin.categories}
          </h2>
          <button
            type="button"
            onClick={() => setCategoryModal("new")}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover"
          >
            <Plus className="size-4" />
            {t.admin.addCategory}
          </button>
        </div>

        {categories.length === 0 ? (
          <p
            className="rounded-2xl border px-4 py-8 text-center text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}
          >
            {t.admin.noCategories}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.id}
                className="rounded-2xl border p-4"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                <h3 style={{ color: "var(--text-primary)" }} className="font-medium">
                  {category.name[locale]}
                </h3>
                <p style={{ color: "var(--text-muted)" }} className="mt-1 text-xs">
                  {category.name.ar} · {category.name.en}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCategoryModal(category)}
                    className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors duration-300 hover:text-brand-gold"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                  >
                    <Pencil className="size-3" />
                    {t.admin.editCategory}
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (window.confirm(t.admin.confirmDelete)) deleteCategory(category.id); }}
                    className="flex items-center gap-1 rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-400"
                  >
                    <Trash2 className="size-3" />
                    {t.admin.deleteCategory}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {t.admin.dishes}
          </h2>
          <button
            type="button"
            onClick={() => setDishModal("new")}
            disabled={categories.length === 0}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out hover:bg-brand-gold-hover"
          >
            <Plus className="size-4" />
            {t.admin.addDish}
          </button>
        </div>

        {dishes.length === 0 ? (
          <p
            className="rounded-2xl border px-4 py-8 text-center text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}
          >
            {t.admin.noDishes}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border-subtle)" }}>
            <table className="min-w-full text-sm">
              <thead style={{ backgroundColor: "var(--bg-surface)" }}>
                <tr>
                  <th className="px-4 py-3 text-start" style={{ color: "var(--text-muted)" }}>{t.admin.dishNameEn}</th>
                  <th className="px-4 py-3 text-start" style={{ color: "var(--text-muted)" }}>{t.admin.price}</th>
                  <th className="px-4 py-3 text-start" style={{ color: "var(--text-muted)" }}>{t.admin.available}</th>
                  <th className="px-4 py-3 text-start" style={{ color: "var(--text-muted)" }}>{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id} className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
                    <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>{dish.name[locale]}</td>
                    <td className="px-4 py-3 text-brand-gold">{dish.price} {t.common.price}</td>
                    <td className="px-4 py-3">
                      <ToggleSwitch
                        checked={dish.available}
                        onChange={() => toggleDishAvailability(dish.id)}
                        label={dish.available ? t.admin.visible : t.admin.hidden}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setDishModal(dish)}
                          className="flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors duration-300 hover:text-brand-gold"
                          style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                        >
                          <Pencil className="size-3" />
                          {t.admin.editDish}
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (window.confirm(t.admin.confirmDelete)) deleteDish(dish.id); }}
                          className="flex items-center gap-1 rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-400"
                        >
                          <Trash2 className="size-3" />
                          {t.admin.deleteDish}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <CategoryModal
        open={categoryModal !== null}
        category={categoryModal === "new" ? null : categoryModal}
        onClose={() => setCategoryModal(null)}
        onSave={handleCategorySave}
      />

      <DishFormModal
        open={dishModal !== null}
        dish={dishModal === "new" ? null : dishModal}
        categories={categories}
        onClose={() => setDishModal(null)}
        onSave={handleDishSave}
      />
    </div>
  );
}

/* ─── Shared Helpers ─── */

function ModalActions({ onClose, saveLabel }: { onClose: () => void; saveLabel: string }) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex min-h-10 items-center justify-center rounded-full border px-5 text-sm transition-colors duration-300"
        style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
      >
        {t.admin.cancel}
      </button>
      <button
        type="submit"
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover"
      >
        <Check className="size-4" />
        {saveLabel}
      </button>
    </div>
  );
}
