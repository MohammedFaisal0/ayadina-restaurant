"use client";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
};

export function ToggleSwitch({
  checked,
  onChange,
  label,
  id,
}: ToggleSwitchProps) {
  const switchId = id ?? label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
      style={{ backgroundColor: "var(--bg-surface)" }}
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
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          checked ? "bg-brand-gold" : "bg-zinc-600"
        }`}
      >
        <span
          className={`inline-block size-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            checked ? "translate-x-[22px] rtl:-translate-x-[22px]" : "translate-x-1 rtl:-translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
