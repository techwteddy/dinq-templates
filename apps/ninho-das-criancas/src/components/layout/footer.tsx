"use client";

import Link from "next/link";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  const { locale, t } = useLocale();

  return (
    <footer
      className={cn(
        "border-t border-border/50 bg-gradient-to-b from-muted/20 via-muted/12 to-background text-sm text-muted-foreground",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md space-y-3">
            <p className="font-heading text-base font-semibold tracking-tight text-foreground">
              {(() => {
                const parts = t.footer.title.split(" · ");
                if (parts.length < 2) return t.footer.title;
                return (
                  <>
                    {parts[0]}
                    {" · "}
                    <span className="font-normal tracking-normal">
                      {parts.slice(1).join(" · ")}
                    </span>
                  </>
                );
              })()}
            </p>
            <p className="whitespace-pre-line text-keep-words leading-relaxed text-muted-foreground/95">
              {t.footer.description}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            <Link
              href="/admin/login"
              className="font-medium text-foreground/50 underline-offset-4 transition-colors hover:text-foreground/80 hover:underline"
            >
              {t.footer.adminLogin}
            </Link>
          </nav>
        </div>
        <p className="text-xs text-muted-foreground/90">
          © {new Date().getFullYear()}{" "}
          <span className="text-[calc(0.95em_+_4px)] tracking-normal text-muted-foreground">
            Ninho das Crianças
          </span>
          .{" "}
          {locale === "ko" ? (
            <span className="text-[calc(0.95em_+_4px)] tracking-normal">
              {t.footer.rights}
            </span>
          ) : (
            t.footer.rights
          )}
        </p>
      </div>
    </footer>
  );
}
