"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
  showCloseButton?: boolean;
  ariaLabelledBy?: string;
  panelClassName?: string;
  contentClassName?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "lg",
  showCloseButton = true,
  ariaLabelledBy,
  panelClassName = "",
  contentClassName = "p-5 sm:p-6",
}: ModalProps) {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), 350);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const sizeClass =
    size === "xl"
      ? "max-w-3xl"
      : size === "md"
        ? "max-w-lg"
        : "max-w-2xl";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy ?? (title ? "modal-title" : undefined)}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        aria-label={t.buttons.close}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`modal-scroll relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl shadow-2xl backdrop-blur-xl sm:rounded-3xl ${sizeClass} ${panelClassName}`}
        style={{
          border: "1px solid var(--glass-border)",
          backgroundColor: "var(--glass-bg)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(24px) scale(0.96)",
          transition:
            "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {(title || showCloseButton) && (
          <div
            className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b px-5 py-4 backdrop-blur-md sm:px-6"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--glass-bg)",
            }}
          >
            {title ? (
              <h2
                id="modal-title"
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h2>
            ) : (
              <span />
            )}
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                aria-label={t.buttons.close}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:scale-110 hover:border-brand-gold hover:text-brand-gold"
                style={{
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                }}
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        )}

        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
