"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, PlusSquare, Heart, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn, avatarFor } from "@/lib/utils";
import { HomeFill, ZapFill, PlusFill, HeartFill } from "@/components/NavIcons";

type Props = { username: string; avatarUrl: string | null };

type Tab = {
  href: string;
  match: (p: string) => boolean;
  icon: LucideIcon;
  iconFill: (props: { size?: number }) => React.ReactElement;
  label: string;
};

const TABS: Tab[] = [
  { href: "/feed", match: (p) => p === "/feed" || p.startsWith("/feed/"), icon: Home, iconFill: HomeFill, label: "Home" },
  { href: "/proof", match: (p) => p === "/proof" || p.startsWith("/proof/"), icon: Zap, iconFill: ZapFill, label: "Proof" },
  { href: "/new", match: (p) => p === "/new" || p.startsWith("/new/"), icon: PlusSquare, iconFill: PlusFill, label: "Post" },
  { href: "/likes", match: (p) => p === "/likes" || p.startsWith("/likes/"), icon: Heart, iconFill: HeartFill, label: "Activity" },
];

export function BottomNav({ username, avatarUrl }: Props) {
  const pathname = usePathname();
  const isProfile = pathname === "/profile" || pathname.startsWith("/u/");
  // Five visible tabs (TABS + profile). Index of the active one drives the slider.
  const activeIdx = (() => {
    const i = TABS.findIndex((t) => t.match(pathname));
    if (i >= 0) return i;
    if (isProfile) return TABS.length;
    return -1;
  })();

  return (
    <>
      {/* Inline SVG defs so any icon can use stroke="url(#brandGrad)". */}
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff7a45" />
            <stop offset="50%" stopColor="#f72585" />
            <stop offset="100%" stopColor="#7209b7" />
          </linearGradient>
        </defs>
      </svg>

      <nav className="floating-nav has-slider z-40">
        {/* Sliding gradient pill behind the active tab. */}
        <span
          className="nav-slider"
          aria-hidden
          style={{
            // 5 equal columns; pill is 44px wide centered in the active column.
            left: activeIdx >= 0 ? `calc(${activeIdx * 20}% + (20% - 44px) / 2 + 8px)` : "-100px",
            opacity: activeIdx >= 0 ? 1 : 0,
          }}
        />
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.match(pathname);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-label={t.label}
              className="nav-item"
            >
              <span className={cn("nav-pill", active && "is-active")}>
                {active ? (
                  <t.iconFill size={24} />
                ) : (
                  <Icon size={24} strokeWidth={2} className="text-white/85" />
                )}
              </span>
            </Link>
          );
        })}
        <Link href="/profile" aria-label="Profile" className="nav-item">
          <span className={cn("nav-pill", isProfile && "is-active")}>
            <span
              className={cn(
                "rounded-full overflow-hidden w-7 h-7 inline-block",
                isProfile && "ring-2 ring-white"
              )}
            >
              <Image
                src={avatarFor(username, avatarUrl)}
                alt="me"
                width={28}
                height={28}
                unoptimized
                className="w-full h-full object-cover"
              />
            </span>
          </span>
        </Link>
      </nav>
    </>
  );
}
