"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

const PERIODS = [3, 6, 12, 24] as const;

export function PeriodSelector({ current }: { current: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function onSelect(months: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (months === 12) {
      params.delete("period");
    } else {
      params.set("period", String(months));
    }
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <div className="inline-flex items-center rounded-md border border-border bg-muted p-0.5" aria-busy={pending}>
      {PERIODS.map((m) => {
        const active = m === current;
        return (
          <button
            key={m}
            type="button"
            onClick={() => onSelect(m)}
            disabled={pending}
            className={
              "px-2.5 py-1 text-xs font-medium rounded-sm transition-colors " +
              (active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
            aria-pressed={active}
          >
            {m}m
          </button>
        );
      })}
    </div>
  );
}
