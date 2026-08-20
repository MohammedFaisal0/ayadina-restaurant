"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { defaultLocale, dictionaries } from "@/i18n";
import type { Dictionary, Locale } from "@/i18n/types";

const LOCALE_STORAGE_KEY = "ayadina-locale";
const LOCALE_EVENT = "ayadina-locale-change";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
  dir: "rtl" | "ltr";
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function subscribe(onStoreChange: () => void) {
  window.addEventListener(LOCALE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(LOCALE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getLocaleSnapshot(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);

  return stored === "ar" || stored === "en" ? stored : defaultLocale;
}

function getServerSnapshot(): Locale {
  return defaultLocale;
}

function persistLocale(locale: Locale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  window.dispatchEvent(new Event(LOCALE_EVENT));
}

function applyDocumentLocale(locale: Locale) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
  document.documentElement.dataset.locale = locale;
  document.documentElement.classList.add("locale-transition");
  document.body.classList.add("locale-transition");
  document.body.classList.toggle("font-arabic", locale === "ar");
  document.body.classList.toggle("font-body", locale === "en");
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerSnapshot,
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    persistLocale(locale === "ar" ? "en" : "ar");
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: dictionaries[locale],
      dir,
    }),
    [dir, locale, setLocale, toggleLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}
