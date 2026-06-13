"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  matchPrefix,
  alsoMatch,
  alsoMatchExclude,
  exact,
}: {
  href: string;
  children: React.ReactNode;
  matchPrefix?: string;
  alsoMatch?: string[];
  alsoMatchExclude?: string[];
  exact?: boolean;
}) {
  const pathname = usePathname();
  const prefix = matchPrefix ?? href.split("#")[0];
  const primaryMatch = prefix === "/"
    ? pathname === "/"
    : exact
      ? pathname === prefix
      : pathname === prefix || pathname.startsWith(prefix + "/");
  const excluded = alsoMatchExclude?.some((p) => pathname === p || pathname.startsWith(p + "/")) ?? false;
  const secondaryMatch = !excluded && (alsoMatch?.some((p) => pathname.startsWith(p + "/")) ?? false);
  const isActive = primaryMatch || secondaryMatch;

  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-all ${
        isActive
          ? "text-pine"
          : "text-bark-light hover:text-pine"
      }`}
    >
      {children}
    </Link>
  );
}
