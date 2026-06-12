"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getPublicUi, type PublicUiStrings } from "@/lib/i18n/public-ui";
import { LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n/types";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: PublicUiStrings;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (raw === "pt" || raw === "ko") {
        setLocaleState(raw);
        document.documentElement.dataset.locale = raw;
        document.documentElement.lang = raw === "pt" ? "pt-BR" : "ko";
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = next === "pt" ? "pt-BR" : "ko";
    document.documentElement.dataset.locale = next;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "ko";
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const t = useMemo(() => getPublicUi(locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (ctx == null) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
