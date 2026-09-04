"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { BilingualFields, TextField } from "@/components/admin/AdminFields";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { Modal } from "@/components/ui/Modal";
import { ModalActions } from "@/components/ui/ModalActions";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import type { Branch, BranchFormData } from "@/types/data";

function emptyBranch(displayOrder: number): BranchFormData {
  return {
    name: { ar: "", en: "" },
    address: { ar: "", en: "" },
    phone: "",
    mapEmbedUrl: "",
    directionsUrl: "",
    displayOrder,
    isMainBranch: false,
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

export function BranchesManagementContent({ embedded = false }: { embedded?: boolean }) {
  const { t, locale } = useLocale();
  const { branches, addBranch, updateBranch, deleteBranch, reorderBranches } = useData();
  const [modal, setModal] = useState<Branch | "new" | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const sorted = [...branches].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleReorder = async (id: string, direction: -1 | 1) => {
    const next = moveOrder(sorted, id, direction);
    if (!next) return;
    setBusyId(id);
    setActionError("");
    try {
      await reorderBranches(next);
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
      await deleteBranch(id);
    } catch {
      setActionError(t.admin.actionFailed);
    }
  };

  return (
    <div className={embedded ? "space-y-6" : "mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={embedded ? "text-lg font-semibold" : "text-2xl font-semibold"} style={{ color: "var(--text-primary)" }}>
          {t.admin.branchesManagement}
        </h2>
        <button
          type="button"
          onClick={() => setModal("new")}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-dark hover:bg-brand-gold-hover"
        >
          <Plus className="size-4" />
          {t.admin.addBranch}
        </button>
      </div>

      {actionError ? <p className="text-sm text-red-400">{actionError}</p> : null}

      {sorted.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t.admin.noBranches}</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((branch, index) => (
            <article
              key={branch.id}
              className="rounded-2xl border p-4 sm:p-5"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    {branch.name[locale]}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{branch.address[locale]}</p>
                  <p className="text-sm" dir="ltr" style={{ color: "var(--text-secondary)" }}>{branch.phone}</p>
                  {branch.isMainBranch ? (
                    <span className="inline-flex rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-medium text-brand-gold">
                      {t.admin.mainBranch}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={index === 0 || busyId === branch.id}
                    onClick={() => void handleReorder(branch.id, -1)}
                    className="inline-flex size-10 items-center justify-center rounded-full border disabled:opacity-40"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                    aria-label={t.admin.moveUp}
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === sorted.length - 1 || busyId === branch.id}
                    onClick={() => void handleReorder(branch.id, 1)}
                    className="inline-flex size-10 items-center justify-center rounded-full border disabled:opacity-40"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                    aria-label={t.admin.moveDown}
                  >
                    <ChevronDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(branch)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                  >
                    <Pencil className="size-3.5" />
                    {t.admin.editBranch}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(branch.id)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-red-500/40 px-4 text-sm text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                    {t.admin.deleteBranch}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <BranchModal
        open={modal !== null}
        branch={modal === "new" || modal === null ? null : modal}
        displayOrder={sorted.length + 1}
        onClose={() => setModal(null)}
        onCreate={addBranch}
        onUpdate={updateBranch}
      />
    </div>
  );
}

function BranchModal({
  open,
  branch,
  displayOrder,
  onClose,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  branch: Branch | null;
  displayOrder: number;
  onClose: () => void;
  onCreate: (input: BranchFormData) => Promise<void>;
  onUpdate: (id: string, input: Partial<BranchFormData>) => Promise<void>;
}) {
  const { t } = useLocale();
  const [form, setForm] = useState<BranchFormData>(emptyBranch(displayOrder));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(branch ?? emptyBranch(displayOrder));
      setError("");
    }
  }, [open, branch, displayOrder]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (branch) await onUpdate(branch.id, form);
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
      title={branch ? t.admin.editBranch : t.admin.addBranch}
      icon={<MapPin className="size-5" />}
      footer={
        <ModalActions formId="branch-form" onClose={onClose} saveLabel={t.admin.save} saving={saving} />
      }
    >
      <form id="branch-form" onSubmit={handleSubmit} className="space-y-4">
        <BilingualFields
          labelAr={t.admin.branchNameAr}
          labelEn={t.admin.branchNameEn}
          value={form.name}
          onChange={(name) => setForm({ ...form, name })}
          required
        />
        <BilingualFields
          labelAr={t.admin.branchAddressAr}
          labelEn={t.admin.branchAddressEn}
          value={form.address}
          onChange={(address) => setForm({ ...form, address })}
          multiline
        />
        <TextField label={t.admin.branchPhone} value={form.phone} onChange={(phone) => setForm({ ...form, phone })} dir="ltr" />
        <TextField label={t.admin.mapEmbedUrl} value={form.mapEmbedUrl} onChange={(mapEmbedUrl) => setForm({ ...form, mapEmbedUrl })} dir="ltr" />
        <TextField label={t.admin.directionsUrl} value={form.directionsUrl} onChange={(directionsUrl) => setForm({ ...form, directionsUrl })} dir="ltr" />
        <ToggleSwitch
          checked={form.isMainBranch}
          onChange={(isMainBranch) => setForm({ ...form, isMainBranch })}
          label={t.admin.mainBranch}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
      </form>
    </Modal>
  );
}
