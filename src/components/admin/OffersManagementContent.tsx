"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, Languages } from "lucide-react";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { buildBilingualText } from "@/lib/translate";
import type { Offer, OfferFormData } from "@/types/data";

function emptyOfferForm(): OfferFormData {
  return {
    image: "",
    active: true,
    featuredOnHome: false,
    title: { ar: "", en: "" },
    description: { ar: "", en: "" },
    validPeriod: { ar: "", en: "" },
  };
}

type OfferModalProps = {
  open: boolean;
  offer: Offer | null;
  onClose: () => void;
  onSave: (data: OfferFormData) => void;
};

function OfferFormModal({ open, offer, onClose, onSave }: OfferModalProps) {
  const { t } = useLocale();
  const [form, setForm] = useState<OfferFormData>(offer ?? emptyOfferForm());

  useEffect(() => {
    if (open) setForm(offer ?? emptyOfferForm());
  }, [open, offer]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave({
      ...form,
      title: buildBilingualText(form.title.ar, offer?.title.en),
      description: buildBilingualText(form.description.ar, offer?.description.en),
      validPeriod: buildBilingualText(form.validPeriod.ar, offer?.validPeriod.en),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={offer ? t.admin.editOffer : t.admin.addOffer} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Text fields — Arabic only */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Content (Arabic)
          </p>
          <label className="block space-y-1.5">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.offerTitleAr}</span>
            <input
              value={form.title.ar}
              onChange={(event) => setForm((c) => ({ ...c, title: { ...c.title, ar: event.target.value } }))}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
          </label>
          <label className="block space-y-1.5">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.offerDescriptionAr}</span>
            <textarea
              value={form.description.ar}
              onChange={(event) => setForm((c) => ({ ...c, description: { ...c.description, ar: event.target.value } }))}
              rows={3}
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
          </label>
          <label className="block space-y-1.5">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">{t.admin.validPeriodAr}</span>
            <input
              value={form.validPeriod.ar}
              onChange={(event) => setForm((c) => ({ ...c, validPeriod: { ...c.validPeriod, ar: event.target.value } }))}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
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

        {/* Image + Toggles — compact 2-col */}
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload
            value={form.image}
            onChange={(value) => setForm((c) => ({ ...c, image: value }))}
            required
          />
          <div
            className="overflow-hidden rounded-xl border self-start"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <ToggleSwitch
              checked={form.active}
              onChange={(active) => setForm((c) => ({ ...c, active }))}
              label={form.active ? t.admin.active : t.admin.inactive}
            />
            <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
            <ToggleSwitch
              checked={form.featuredOnHome}
              onChange={(featuredOnHome) => setForm((c) => ({ ...c, featuredOnHome }))}
              label={t.admin.showOnHome}
            />
          </div>
        </div>

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
            {t.admin.save}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function OffersManagementContent() {
  const { t, locale } = useLocale();
  const {
    offers, addOffer, updateOffer, deleteOffer,
    toggleOfferActive, toggleOfferFeaturedOnHome,
  } = useData();
  const [offerModal, setOfferModal] = useState<Offer | null | "new">(null);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {t.admin.offersManagement}
        </h2>
        <button
          type="button"
          onClick={() => setOfferModal("new")}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover"
        >
          <Plus className="size-4" />
          {t.admin.addOffer}
        </button>
      </div>

      {offers.length === 0 ? (
        <p
          className="rounded-2xl border px-4 py-8 text-center text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}
        >
          {t.admin.noOffers}
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="rounded-2xl border p-5"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {offer.title[locale]}
              </h3>
              <p
                className="mt-2 text-sm leading-7"
                style={{ color: "var(--text-muted)" }}
              >
                {offer.description[locale]}
              </p>
              <p className="mt-2 text-xs text-brand-gold">
                {t.common.validUntil}: {offer.validPeriod[locale]}
              </p>

              <div
                className="mt-4 overflow-hidden rounded-xl border"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <ToggleSwitch
                  checked={offer.active}
                  onChange={() => toggleOfferActive(offer.id)}
                  label={offer.active ? t.admin.active : t.admin.inactive}
                />
                <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
                <ToggleSwitch
                  checked={offer.featuredOnHome}
                  onChange={() => toggleOfferFeaturedOnHome(offer.id)}
                  label={t.admin.showOnHome}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setOfferModal(offer)}
                  className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors duration-300 hover:text-brand-gold"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                >
                  <Pencil className="size-3" />
                  {t.admin.editOffer}
                </button>
                <button
                  type="button"
                  onClick={() => { if (window.confirm(t.admin.confirmDelete)) deleteOffer(offer.id); }}
                  className="flex items-center gap-1 rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-400"
                >
                  <Trash2 className="size-3" />
                  {t.admin.deleteOffer}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <OfferFormModal
        open={offerModal !== null}
        offer={offerModal === "new" ? null : offerModal}
        onClose={() => setOfferModal(null)}
        onSave={(data) => {
          if (offerModal === "new") { addOffer(data); return; }
          if (offerModal) updateOffer(offerModal.id, data);
        }}
      />
    </div>
  );
}
