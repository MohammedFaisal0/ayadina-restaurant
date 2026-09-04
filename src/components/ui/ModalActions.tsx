"use client";

import type { ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";

type ModalActionsProps = {
  onClose: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saving?: boolean;
  /** When set, the primary button submits this form from the sticky footer. */
  formId?: string;
  onSave?: () => void;
  /** Extra actions rendered before cancel/save (e.g. delete). */
  leading?: ReactNode;
  primaryDisabled?: boolean;
};

export function ModalSecondaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border px-5 text-sm font-medium transition-all duration-200 disabled:opacity-50 ${className}`}
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-surface)",
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}

export function ModalPrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  form,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  form?: string;
  className?: string;
}) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={`modal-btn-primary inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-dark transition-all duration-200 hover:bg-brand-gold-hover disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

/** Shared sticky-footer cancel + save pattern for admin forms. */
export function ModalActions({
  onClose,
  saveLabel,
  cancelLabel,
  saving = false,
  formId,
  onSave,
  leading,
  primaryDisabled = false,
}: ModalActionsProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
      {leading ? <div className="me-auto flex flex-wrap gap-2">{leading}</div> : null}
      <ModalSecondaryButton onClick={onClose} disabled={saving}>
        {cancelLabel ?? t.admin.cancel}
      </ModalSecondaryButton>
      <ModalPrimaryButton
        type={formId || !onSave ? "submit" : "button"}
        form={formId}
        onClick={onSave}
        disabled={saving || primaryDisabled}
      >
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        {saving ? t.admin.saving : (saveLabel ?? t.admin.save)}
      </ModalPrimaryButton>
    </div>
  );
}
