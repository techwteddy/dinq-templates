import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Wallet,
  LineChart,
  Tags,
  Repeat,
} from "lucide-react";
import { NavLink } from "@/components/nav-link";
import { ThemeCycleButton } from "@/components/theme-cycle-button";
import { LogoutButton } from "@/components/logout-button";
import { APP_NAME } from "@/lib/constants";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/income", label: "Income", icon: TrendingUp },
  { href: "/expenses", label: "Expenses", icon: TrendingDown },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/cash-flow", label: "Cash flow", icon: LineChart },
  { href: "/categories", label: "Categories", icon: Tags },
];

const DESKTOP_BASE = "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors";
const DESKTOP_ACTIVE = "bg-primary text-primary-foreground";
const DESKTOP_INACTIVE = "text-muted-foreground hover:bg-accent hover:text-foreground";

const MOBILE_BASE = "flex flex-col items-center gap-1 px-4 py-3 text-xs shrink-0 border-b-2";
const MOBILE_ACTIVE = "border-primary text-foreground";
const MOBILE_INACTIVE = "border-transparent text-muted-foreground";

export function SideNav({ userEmail }: { userEmail: string }) {
  return (
    <aside className="hidden md:flex md:flex-col w-60 border-r bg-background">
      <div className="h-14 flex items-center gap-2 px-4 border-b">
        <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
          {APP_NAME.charAt(0)}
        </div>
        <span className="font-semibold text-sm truncate">{APP_NAME}</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={href}
            href={href}
            className={DESKTOP_BASE}
            activeClassName={DESKTOP_ACTIVE}
            inactiveClassName={DESKTOP_INACTIVE}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t space-y-2">
        <p className="text-xs text-muted-foreground truncate px-1">{userEmail}</p>
        <ThemeCycleButton />
        <LogoutButton />
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden flex items-center overflow-x-auto no-scrollbar border-b bg-background">
      <div className="flex flex-1 overflow-x-auto no-scrollbar">
        {NAV.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={href}
            href={href}
            className={MOBILE_BASE}
            activeClassName={MOBILE_ACTIVE}
            inactiveClassName={MOBILE_INACTIVE}
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
      <ThemeCycleButton variant="icon" />
    </nav>
  );
}
