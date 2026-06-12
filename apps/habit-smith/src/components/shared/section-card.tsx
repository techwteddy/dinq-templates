import type { ReactNode } from "react";

export function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
