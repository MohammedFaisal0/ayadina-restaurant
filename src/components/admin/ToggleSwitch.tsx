"use client";

import { Loader2 } from "lucide-react";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function ToggleSwitch({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  loading = false,
}: ToggleSwitchProps) {
  const switchId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  const busy = disabled || loading;

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
      style={{ backgroundColor: "var(--bg-surface)", opacity: busy ? 0.75 : 1 }}
    >
      <label
        htmlFor={switchId}
        className="cursor-pointer text-sm font-medium select-none"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </label>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-busy={loading}
        disabled={busy}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] disabled:cursor-wait ${
          checked ? "bg-brand-gold" : "bg-zinc-600"
        }`}
      >
        {loading ? (
          <Loader2 className="absolute inset-0 m-auto size-3.5 animate-spin text-white" />
        ) : (
          <span
            className={`inline-block size-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              checked ? "translate-x-[22px] rtl:-translate-x-[22px]" : "translate-x-1 rtl:-translate-x-1"
            }`}
          />
        )}
      </button>
    </div>
  );
}
