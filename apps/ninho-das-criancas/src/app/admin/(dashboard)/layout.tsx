import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const adminNav = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/posts", label: "게시글" },
  { href: "/admin/content", label: "후원 정보" },
  { href: "/admin/media", label: "미디어" },
] as const;

export default function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[60vh] border-b border-border/50 bg-gradient-to-b from-muted/20 to-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:flex-row sm:gap-10 sm:px-6">
        <aside className="shrink-0 rounded-2xl border border-border/50 bg-card/60 p-4 shadow-soft sm:w-52 sm:self-start">
          <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
            어린이 둥지
          </p>
          <p className="text-xs text-muted-foreground">Admin</p>
          <nav className="mt-4 flex flex-col gap-0.5" aria-label="관리자 메뉴">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors",
                  "hover:bg-muted/70 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-border/50 pt-4">
            <AdminLogoutButton />
          </div>
        </aside>
        <div className="min-w-0 flex-1 rounded-2xl border border-border/50 bg-card/40 p-5 shadow-soft sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
