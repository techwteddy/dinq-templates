"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  className,
  activeClassName,
  inactiveClassName,
  children,
}: {
  href: string;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link href={href} className={cn(className, active ? activeClassName : inactiveClassName)}>
      {children}
    </Link>
  );
}
