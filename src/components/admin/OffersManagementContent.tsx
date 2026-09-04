"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Languages, Calendar, Tag } from "lucide-react";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Modal } from "@/components/ui/Modal";
import { ModalActions } from "@/components/ui/ModalActions";
import { SmartImage } from "@/components/ui/SmartImage";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { buildBilingualText } from "@/lib/translate";
import { getOfferCopy, type Offer, type OfferFormData } from "@/types/data";

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
  onSave: (data: OfferFormData) => Promise<void>;
};

function OfferFormModal({ open, offer, onClose, onSave }: OfferModalProps) {
  const { t } = useLocale();
  const [form, setForm] = useState<OfferFormData>(offer ?? emptyOfferForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(offer ?? emptyOfferForm());
      setSaving(false);
      setError("");
    }
  }, [open, offer]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        title: await buildBilingualText(form.title.ar, offer?.title.en, offer?.title.ar),
        description: await buildBilingualText(form.description.ar, offer?.description.en, offer?.description.ar),
        validPeriod: await buildBilingualText(form.validPeriod.ar, offer?.validPeriod.en, offer?.validPeriod.ar),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.admin.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={offer ? t.admin.editOffer : t.admin.addOffer}
      icon={<Tag className="size-5" />}
      size="xl"
      footer={
        <ModalActions formId="offer-form" onClose={onClose} saveLabel={t.admin.save} saving={saving} />
      }
    >
      <form id="offer-form" onSubmit={handleSubmit} className="space-y-5">
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
          {t.admin.englishAutoFilled}
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

        {error ? <p className="text-xs text-red-400">{error}</p> : null}
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
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const handleOfferSave = async (data: OfferFormData) => {
    if (offerModal === "new") {
      await addOffer(data);
      return;
    }
    if (offerModal) await updateOffer(offerModal.id, data);
  };

  const runToggle = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setActionError("");
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : t.admin.actionFailed);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {t.admin.offersManagement}
        </h1>
        <button
          type="button"
          onClick={() => setOfferModal("new")}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark hover:bg-brand-gold-hover"
        >
          <Plus className="size-4" />
          {t.admin.addOffer}
        </button>
      </div>

      {actionError ? (
        <p className="rounded-xl border border-red-500/40 px-4 py-3 text-sm text-red-400">{actionError}</p>
      ) : null}

      {offers.length === 0 ? (
        <p
          className="rounded-2xl border px-4 py-8 text-center text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}
        >
          {t.admin.noOffers}
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {offers.map((offer) => {
            const copy = getOfferCopy(offer, locale);
            const busy = busyId === offer.id;
            return (
              <article
                key={offer.id}
                className="hover-lift overflow-hidden rounded-2xl border"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                <div className="relative aspect-video">
                  <SmartImage src={offer.image} alt={copy.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className={`absolute start-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${offer.active ? "bg-brand-gold text-brand-dark" : "bg-black/60 text-white"}`}>
                    {offer.active ? t.admin.active : t.admin.inactive}
                  </span>
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{copy.title}</h3>
                  <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>{copy.description}</p>
                  <p className="inline-flex items-center gap-1.5 text-sm text-brand-gold">
                    <Calendar className="size-3.5" />
                    {t.common.validUntil}: {copy.validPeriod}
                  </p>
                  <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-subtle)" }}>
                    <ToggleSwitch
                      checked={offer.active}
                      loading={busy}
                      onChange={() => void runToggle(offer.id, () => toggleOfferActive(offer.id))}
                      label={offer.active ? t.admin.active : t.admin.inactive}
                    />
                    <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
                    <ToggleSwitch
                      checked={offer.featuredOnHome}
                      loading={busy}
                      onChange={() => void runToggle(offer.id, () => toggleOfferFeaturedOnHome(offer.id))}
                      label={t.admin.showOnHome}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setOfferModal(offer)}
                      className="inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs"
                      style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                    >
                      <Pencil className="size-3" />
                      {t.admin.editOffer}
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (window.confirm(t.admin.confirmDelete)) void deleteOffer(offer.id); }}
                      className="inline-flex min-h-9 items-center gap-1 rounded-full border border-red-500/40 px-3 text-xs text-red-400"
                    >
                      <Trash2 className="size-3" />
                      {t.admin.deleteOffer}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <OfferFormModal
        open={offerModal !== null}
        offer={offerModal === "new" ? null : offerModal}
        onClose={() => setOfferModal(null)}
        onSave={handleOfferSave}
      />
    </div>
  );
}
