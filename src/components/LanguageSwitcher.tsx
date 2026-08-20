"use client";

import { Globe } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";

export function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useLocale();

  const label = locale === "ar" ? t.language.switchToEnglish : t.language.switchToArabic;

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={label}
      className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      style={{
        border: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-card)",
        color: "var(--text-secondary)",
      }}
    >
      <Globe className="size-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
