"use client";

import { cn } from "@/lib/utils";

import { useLocale } from "@/components/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/types";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border/70 bg-muted/40 p-0.5 text-sm font-normal backdrop-blur-sm",
        className
      )}
      role="group"
      aria-label={t.nav.langSwitchAria}
    >
      {(["ko", "pt"] as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "min-w-[2.25rem] rounded-full px-2.5 py-1 transition-colors",
            locale === code
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {code === "ko" ? t.nav.langSwitchKo : t.nav.langSwitchPt}
        </button>
      ))}
    </div>
  );
}
