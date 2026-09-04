"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  Edit3,
  Eye,
  EyeOff,
  Flame,
  FolderOpen,
  Home,
  Languages,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Star,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Modal } from "@/components/ui/Modal";
import { ModalActions } from "@/components/ui/ModalActions";
import { SmartImage } from "@/components/ui/SmartImage";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import {
  buildBilingualList,
  buildBilingualText,
} from "@/lib/translate";
import { getDishCopy, type Category, type CategoryFormData, type Dish, type DishFormData } from "@/types/data";

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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setNameAr(category?.name.ar ?? "");
      setSaving(false);
    }
  }, [open, category]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave({ name: await buildBilingualText(nameAr, category?.name.en, category?.name.ar) });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? t.admin.editCategory : t.admin.addCategory}
      icon={<FolderOpen className="size-5" />}
      footer={<ModalActions formId="category-form" onClose={onClose} saveLabel={t.admin.save} saving={saving} />}
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">
            {t.admin.categoryNameAr}
          </span>
          <input
            value={nameAr}
            onChange={(event) => setNameAr(event.target.value)}
            required
            disabled={saving}
            className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30 disabled:opacity-60"
            style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
          />
        </label>
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
          style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}
        >
          <Languages className="size-3.5 shrink-0" />
          {t.admin.englishAutoFilled}
        </div>
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const next = dish ?? emptyDishForm(categories[0]?.id ?? "");
      setForm(next);
      setIngredientsAr(next.ingredients.ar.join(", "));
      setAllergensAr(next.allergens.ar.join(", "));
      setError("");
      setSaving(false);
    }
  }, [open, dish, categories]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const arIngredients = parseList(ingredientsAr);
    const arAllergens = parseList(allergensAr);
    setError("");
    setSaving(true);
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
    } finally {
      setSaving(false);
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
    <Modal
      open={open}
      onClose={onClose}
      title={dish ? t.admin.editDish : t.admin.addDish}
      icon={<UtensilsCrossed className="size-5" />}
      size="xl"
      footer={<ModalActions formId="dish-form" onClose={onClose} saveLabel={t.admin.save} saving={saving} />}
    >
      <form id="dish-form" onSubmit={handleSubmit} className="space-y-5">
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
          {t.admin.englishAutoFilled}
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
      </form>
    </Modal>
  );
}

/* ─── Compact row controls ─── */

type IconType = typeof Flame;

/** Square icon toggle used for the per-row availability / featured switches. */
function IconToggle({
  checked,
  onClick,
  disabled,
  label,
  icon: Icon,
}: {
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  icon: IconType;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 disabled:cursor-wait disabled:opacity-40"
      style={{
        backgroundColor: checked ? "var(--brand-gold, #F3A712)" : "transparent",
        borderColor: checked ? "transparent" : "var(--border-default)",
        color: checked ? "#0B0B0B" : "var(--text-muted)",
      }}
    >
      {disabled ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
    </button>
  );
}

function IconAction({
  onClick,
  label,
  icon: Icon,
  danger = false,
}: {
  onClick: () => void;
  label: string;
  icon: IconType;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-80"
      style={{
        borderColor: danger ? "rgba(239, 68, 68, 0.4)" : "var(--border-default)",
        color: danger ? "#f87171" : "var(--text-secondary)",
      }}
    >
      <Icon className="size-4" />
    </button>
  );
}

type RowMenuItem = {
  key: string;
  label: string;
  icon: IconType;
  active?: boolean;
  danger?: boolean;
  onSelect: () => void;
};

/** Overflow menu keeping low-frequency actions (badges, delete) out of the row. */
function RowMenu({ label, items }: { label: string; items: RowMenuItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title={label}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200"
        style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
      >
        <MoreVertical className="size-4" />
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute end-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border p-1 shadow-xl"
            style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-card)" }}
          >
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors duration-200 hover:bg-black/10"
                style={{ color: item.danger ? "#f87171" : "var(--text-secondary)" }}
              >
                <item.icon
                  className="size-4 shrink-0"
                  style={item.active ? { color: "var(--brand-gold, #F3A712)" } : undefined}
                />
                <span className="flex-1">{item.label}</span>
                {item.active ? <Check className="size-3.5 text-brand-gold" /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

/* ─── Dish Row ─── */

type DishRowProps = {
  dish: Dish;
  categoryLabel: string;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: () => void;
  onToggleFeatured: () => void;
  onToggleBadge: (badge: "spicy" | "popular") => void;
};

function DishRow({
  dish,
  categoryLabel,
  busy,
  onEdit,
  onDelete,
  onToggleAvailable,
  onToggleFeatured,
  onToggleBadge,
}: DishRowProps) {
  const { t, locale } = useLocale();
  const copy = getDishCopy(dish, locale);

  return (
    <li
      className="hover-lift flex flex-wrap items-center gap-3 rounded-2xl border p-3 transition-colors duration-200 sm:flex-nowrap sm:gap-4"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-card)",
        opacity: dish.available ? 1 : 0.65,
      }}
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
        <SmartImage src={dish.image} alt={copy.name} fill sizes="80px" className="object-cover" />
        {dish.badges.length > 0 ? (
          <div className="absolute inset-x-1 bottom-1 flex flex-wrap gap-1">
            {dish.badges.map((badge) => (
              <span
                key={badge}
                title={badge === "spicy" ? t.common.spicy : t.common.popular}
                className="inline-flex size-5 items-center justify-center rounded-full bg-brand-gold text-brand-dark shadow-sm"
              >
                {badge === "spicy" ? <Flame className="size-3" /> : <Star className="size-3" />}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate font-semibold" style={{ color: "var(--text-primary)" }}>
            {copy.name}
          </h3>
          {!dish.available ? (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{
                borderColor: "var(--border-default)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-muted)",
              }}
            >
              <EyeOff className="size-3" />
              {t.admin.hidden}
            </span>
          ) : null}
        </div>
        <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
          {copy.shortDescription}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="font-bold text-brand-gold">
            {dish.price} {t.common.price}
          </span>
          <span style={{ color: "var(--border-default)" }}>·</span>
          <span className="truncate" style={{ color: "var(--text-muted)" }}>
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="flex basis-full items-center justify-end gap-1.5 sm:basis-auto">
        <IconToggle
          checked={dish.available}
          disabled={busy}
          onClick={onToggleAvailable}
          label={dish.available ? t.admin.visible : t.admin.hidden}
          icon={dish.available ? Eye : EyeOff}
        />
        <IconToggle
          checked={dish.featured}
          disabled={busy}
          onClick={onToggleFeatured}
          label={t.admin.featured}
          icon={Home}
        />
        <span className="mx-1 h-6 w-px" style={{ backgroundColor: "var(--border-subtle)" }} />
        <IconAction onClick={onEdit} label={t.admin.editDish} icon={Edit3} />
        <RowMenu
          label={t.admin.moreActions}
          items={[
            {
              key: "spicy",
              label: t.common.spicy,
              icon: Flame,
              active: dish.badges.includes("spicy"),
              onSelect: () => onToggleBadge("spicy"),
            },
            {
              key: "popular",
              label: t.common.popular,
              icon: Star,
              active: dish.badges.includes("popular"),
              onSelect: () => onToggleBadge("popular"),
            },
            {
              key: "delete",
              label: t.admin.deleteDish,
              icon: Trash2,
              danger: true,
              onSelect: onDelete,
            },
          ]}
        />
      </div>
    </li>
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const filteredDishes = dishes.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const copy = getDishCopy(item, locale);
    const matchesCategory = activeCategory === "all" || item.categoryId === activeCategory;
    const matchesSearch =
      query.length === 0 ||
      copy.name.toLowerCase().includes(query) ||
      item.name.ar.toLowerCase().includes(query) ||
      copy.shortDescription.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleCategorySave = async (data: CategoryFormData) => {
    if (categoryModal === "new") { await addCategory(data); return; }
    if (categoryModal) await updateCategory(categoryModal.id, data);
  };

  const handleDishSave = async (data: DishFormData) => {
    if (dishModal === "new") { await addDish(data); return; }
    if (dishModal) await updateDish(dishModal.id, data);
  };

  const runAction = async (dishId: string, action: () => Promise<unknown>) => {
    setBusyId(dishId);
    setActionError("");
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : t.admin.actionFailed);
    } finally {
      setBusyId(null);
    }
  };

  const toggleBadge = (dish: Dish, badge: "spicy" | "popular") => {
    const badges = dish.badges.includes(badge)
      ? dish.badges.filter((item) => item !== badge)
      : [...dish.badges, badge];
    void runAction(dish.id, () => updateDish(dish.id, { badges }));
  };

  const categoryLabel = (categoryId: string) =>
    categories.find((item) => item.id === categoryId)?.name[locale] ?? "—";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {t.admin.menuManagement}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategoryModal("new")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors duration-200"
            style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
          >
            <Plus className="size-4" />
            {t.admin.addCategory}
          </button>
          <button
            type="button"
            onClick={() => setDishModal("new")}
            disabled={categories.length === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark transition-colors duration-200 hover:bg-brand-gold-hover disabled:opacity-50"
          >
            <Plus className="size-4" />
            {t.admin.addDish}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none -mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-0.5">
          <CategoryChip
            label={t.menu.categories.all}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name[locale]}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="relative block flex-1 lg:w-72">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t.common.searchMenu}
              className="w-full rounded-full py-2.5 pe-4 ps-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ border: "1px solid var(--border-default)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
            />
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          </label>
          {activeCategory !== "all" ? (
            <>
              <IconAction
                label={t.admin.editCategory}
                icon={Edit3}
                onClick={() => {
                  const category = categories.find((item) => item.id === activeCategory);
                  if (category) setCategoryModal(category);
                }}
              />
              <IconAction
                label={t.admin.deleteCategory}
                icon={Trash2}
                danger
                onClick={() => {
                  if (!window.confirm(t.admin.confirmDelete)) return;
                  const target = activeCategory;
                  setActiveCategory("all");
                  void runAction(target, () => deleteCategory(target));
                }}
              />
            </>
          ) : null}
        </div>
      </div>

      {actionError ? (
        <p className="rounded-xl border border-red-500/40 px-4 py-3 text-sm text-red-400">{actionError}</p>
      ) : null}

      {filteredDishes.length === 0 ? (
        <p className="rounded-2xl border px-6 py-10 text-center text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}>
          {dishes.length === 0 ? t.admin.noDishes : t.common.noResults}
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredDishes.map((dish) => (
            <DishRow
              key={dish.id}
              dish={dish}
              categoryLabel={categoryLabel(dish.categoryId)}
              busy={busyId === dish.id}
              onEdit={() => setDishModal(dish)}
              onDelete={() => {
                if (window.confirm(t.admin.confirmDelete)) {
                  void runAction(dish.id, () => deleteDish(dish.id));
                }
              }}
              onToggleAvailable={() => void runAction(dish.id, () => toggleDishAvailability(dish.id))}
              onToggleFeatured={() =>
                void runAction(dish.id, () => updateDish(dish.id, { featured: !dish.featured }))
              }
              onToggleBadge={(badge) => toggleBadge(dish, badge)}
            />
          ))}
        </ul>
      )}

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

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200"
      style={{
        backgroundColor: active ? "var(--brand-gold, #F3A712)" : "var(--bg-card)",
        color: active ? "#0B0B0B" : "var(--text-secondary)",
        border: active ? "1px solid transparent" : "1px solid var(--border-default)",
      }}
    >
      {label}
    </button>
  );
}
