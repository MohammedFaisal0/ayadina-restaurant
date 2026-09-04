"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { BilingualFields } from "@/components/admin/AdminFields";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Modal } from "@/components/ui/Modal";
import { ModalActions } from "@/components/ui/ModalActions";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import type { GalleryImage, GalleryImageFormData } from "@/types/data";

function emptyImage(displayOrder: number): GalleryImageFormData {
  return {
    imageUrl: "",
    title: { ar: "", en: "" },
    displayOrder,
  };
}

function moveOrder<T extends { id: string; displayOrder: number }>(
  items: T[],
  id: string,
  direction: -1 | 1,
) {
  const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder);
  const index = sorted.findIndex((item) => item.id === id);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= sorted.length) return null;
  const swapped = [...sorted];
  [swapped[index], swapped[next]] = [swapped[next], swapped[index]];
  return swapped.map((item, order) => ({ id: item.id, displayOrder: order + 1 }));
}

export function GalleryManagementContent({ embedded = false }: { embedded?: boolean }) {
  const { t, locale } = useLocale();
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage, reorderGalleryImages } = useData();
  const [modal, setModal] = useState<GalleryImage | "new" | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const sorted = [...galleryImages].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleReorder = async (id: string, direction: -1 | 1) => {
    const next = moveOrder(sorted, id, direction);
    if (!next) return;
    setBusyId(id);
    setActionError("");
    try {
      await reorderGalleryImages(next);
    } catch {
      setActionError(t.admin.actionFailed);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.admin.confirmDelete)) return;
    setActionError("");
    try {
      await deleteGalleryImage(id);
    } catch {
      setActionError(t.admin.actionFailed);
    }
  };

  return (
    <div className={embedded ? "space-y-6" : "mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={embedded ? "text-lg font-semibold" : "text-2xl font-semibold"} style={{ color: "var(--text-primary)" }}>
          {t.admin.galleryManagement}
        </h2>
        <button
          type="button"
          onClick={() => setModal("new")}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark hover:bg-brand-gold-hover"
        >
          <Plus className="size-4" />
          {t.admin.addGalleryImage}
        </button>
      </div>

      {actionError ? <p className="text-sm text-red-400">{actionError}</p> : null}

      {sorted.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t.admin.noGalleryImages}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((image, index) => (
            <article
              key={image.id}
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.imageUrl} alt={image.title[locale] || t.admin.galleryPhoto} className="h-40 w-full object-cover" />
              <div className="space-y-3 p-4">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {image.title[locale] || "—"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={index === 0 || busyId === image.id}
                    onClick={() => void handleReorder(image.id, -1)}
                    className="inline-flex size-9 items-center justify-center rounded-full border disabled:opacity-40"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                    aria-label={t.admin.moveUp}
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === sorted.length - 1 || busyId === image.id}
                    onClick={() => void handleReorder(image.id, 1)}
                    className="inline-flex size-9 items-center justify-center rounded-full border disabled:opacity-40"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                    aria-label={t.admin.moveDown}
                  >
                    <ChevronDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(image)}
                    className="inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                  >
                    <Pencil className="size-3.5" />
                    {t.admin.editGalleryImage}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(image.id)}
                    className="inline-flex min-h-9 items-center gap-1 rounded-full border border-red-500/40 px-3 text-xs text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                    {t.admin.deleteGalleryImage}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <GalleryModal
        open={modal !== null}
        image={modal === "new" || modal === null ? null : modal}
        displayOrder={sorted.length + 1}
        onClose={() => setModal(null)}
        onCreate={addGalleryImage}
        onUpdate={updateGalleryImage}
      />
    </div>
  );
}

function GalleryModal({
  open,
  image,
  displayOrder,
  onClose,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  image: GalleryImage | null;
  displayOrder: number;
  onClose: () => void;
  onCreate: (input: GalleryImageFormData) => Promise<void>;
  onUpdate: (id: string, input: Partial<GalleryImageFormData>) => Promise<void>;
}) {
  const { t } = useLocale();
  const [form, setForm] = useState<GalleryImageFormData>(emptyImage(displayOrder));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(image ?? emptyImage(displayOrder));
      setError("");
    }
  }, [open, image, displayOrder]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.imageUrl) {
      setError(t.admin.uploadFailed);
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (image) await onUpdate(image.id, form);
      else await onCreate(form);
      onClose();
    } catch {
      setError(t.admin.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={image ? t.admin.editGalleryImage : t.admin.addGalleryImage}
      icon={<ImageIcon className="size-5" />}
      footer={
        <ModalActions formId="gallery-form" onClose={onClose} saveLabel={t.admin.save} saving={saving} />
      }
    >
      <form id="gallery-form" onSubmit={handleSubmit} className="space-y-4">
        <ImageUpload
          label={t.admin.galleryPhoto}
          value={form.imageUrl}
          onChange={(imageUrl) => setForm({ ...form, imageUrl })}
          required
        />
        <BilingualFields
          labelAr={t.admin.galleryTitleAr}
          labelEn={t.admin.galleryTitleEn}
          value={form.title}
          onChange={(title) => setForm({ ...form, title })}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
      </form>
    </Modal>
  );
}
