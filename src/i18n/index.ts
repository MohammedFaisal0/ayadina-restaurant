import ar from "./dictionaries/ar.json";
import en from "./dictionaries/en.json";
import type { Dictionary, Locale } from "./types";

export const dictionaries: Record<Locale, Dictionary> = {
  ar,
  en,
};

export const defaultLocale: Locale = "ar";

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary, Locale };
