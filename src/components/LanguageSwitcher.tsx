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
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      style={{
        border: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-card)",
        color: "var(--text-secondary)",
      }}
    >
      <Globe className="size-4" />
    </button>
  );
}
