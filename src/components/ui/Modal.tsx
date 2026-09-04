"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Optional lucide (or any) icon rendered in a gold-tinted badge beside the title. */
  icon?: ReactNode;
  children: ReactNode;
  /** Sticky bottom action bar (save/cancel, etc.). */
  footer?: ReactNode;
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
  icon,
  children,
  footer,
  size = "lg",
  showCloseButton = true,
  ariaLabelledBy,
  panelClassName = "",
  contentClassName = "p-6 space-y-5",
}: ModalProps) {
  const { t } = useLocale();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), 220);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panelRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    }, 30);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [mounted, onClose]);

  if (!portalReady || !mounted) return null;

  const sizeClass =
    size === "xl" ? "max-w-3xl" : size === "md" ? "max-w-lg" : "max-w-2xl";

  const labelledBy = ariaLabelledBy ?? (title ? titleId : undefined);

  // Portal to <body> so position:fixed is never trapped by ancestors with
  // transform/filter (e.g. .page-enter).
  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="modal-overlay absolute inset-0 bg-black/75 backdrop-blur-md"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
        aria-label={t.buttons.close}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`modal-panel relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-3xl shadow-2xl outline-none ${sizeClass} ${panelClassName}`}
        style={{
          border: "1px solid var(--modal-border)",
          backgroundColor: "var(--modal-panel)",
          color: "var(--text-primary)",
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(243,167,18,0.06)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {(title || icon || showCloseButton) ? (
          <div
            className="flex shrink-0 items-center justify-between gap-4 border-b px-5 py-4 sm:px-6"
            style={{
              borderColor: "var(--modal-border)",
              backgroundColor: "var(--modal-header-bg)",
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              {icon ? (
                <span
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl text-brand-gold"
                  style={{
                    backgroundColor: "var(--border-gold)",
                    boxShadow: "inset 0 0 0 1px var(--border-gold)",
                  }}
                >
                  {icon}
                </span>
              ) : null}
              {title ? (
                <h2
                  id={titleId}
                  className="truncate text-lg font-semibold tracking-tight sm:text-xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </h2>
              ) : (
                <span />
              )}
            </div>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                aria-label={t.buttons.close}
                className="inline-flex shrink-0 items-center justify-center rounded-full p-2.5 transition-all duration-200 ease-in-out"
                style={{
                  backgroundColor: "var(--modal-close-bg)",
                  color: "var(--text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--modal-close-hover)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--modal-close-bg)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                <X className="size-4" strokeWidth={2.25} />
              </button>
            ) : null}
          </div>
        ) : null}

        <div
          className={`modal-scroll custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain ${contentClassName}`}
        >
          {children}
        </div>

        {footer ? (
          <div
            className="modal-footer shrink-0 border-t px-5 py-4 sm:px-6"
            style={{
              borderColor: "var(--modal-border)",
              backgroundColor: "var(--modal-header-bg)",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
