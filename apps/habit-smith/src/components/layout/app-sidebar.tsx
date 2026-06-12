"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  Crown,
  Home,
  Medal,
  Settings,
  Sparkles,
  Target,
  Users,
  UserRound,
} from "lucide-react";

import { dashboardNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

const icons = {
  Overview: Home,
  Habits: Target,
  Analytics: ChartNoAxesCombined,
  Social: Users,
  Leaderboard: Medal,
  Profile: UserRound,
  Settings,
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-700/70 bg-slate-950/70 p-6 backdrop-blur lg:block">
      <Link href="/" className="mb-10 flex items-center gap-3">
        <div className="grid h-10 w-10 place-content-center rounded-xl bg-cyan-400 text-slate-950">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold tracking-tight text-slate-100">HabitSmith</p>
          <p className="text-xs text-slate-400">Forge better routines</p>
        </div>
      </Link>

      <nav className="space-y-1">
        {dashboardNavItems.map((item) => {
          const Icon = icons[item.label as keyof typeof icons];
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-cyan-400 text-slate-950 shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-xl">
        <p className="text-sm font-semibold">Go Premium</p>
        <p className="mt-1 text-xs text-slate-300">
          Unlock advanced analytics and social accountability tools.
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950"
        >
          <Crown className="h-3.5 w-3.5" />
          Upgrade Plan
        </Link>
      </div>
    </aside>
  );
}
