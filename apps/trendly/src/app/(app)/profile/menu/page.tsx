import Link from "next/link";
import { Archive, Clock, Bookmark, Users, Settings, UserPlus, QrCode, X, Users2, ShieldCheck } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsButton } from "@/components/NotificationsButton";

export default async function ProfileMenuPage() {
  const [user, supabase] = await Promise.all([getCachedUser(), createClient()]);
  const { data: me } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user!.id)
    .single();

  const items: Array<{
    icon: typeof Archive;
    label: string;
    href?: string;
  }> = [
    { icon: Users2, label: "Connections", href: "/connections" },
    { icon: ShieldCheck, label: "Collab Lock", href: "/collabs" },
    { icon: Archive, label: "Archive", href: "/archive" },
    { icon: Clock, label: "Your Activity" },
    { icon: QrCode, label: "Nametag" },
    { icon: Bookmark, label: "Saved", href: "/saved" },
    { icon: Users, label: "Close Friends" },
    { icon: UserPlus, label: "Discover People", href: "/search" },
  ];

  return (
    <>
      <header className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <span className="font-semibold">{me?.username}</span>
        <Link href="/profile" aria-label="Close"><X size={26} /></Link>
      </header>
      <ul className="py-2">
        {items.map(({ icon: Icon, label, href }) => {
          const inner = (
            <>
              <Icon size={22} />
              <span>{label}</span>
            </>
          );
          return (
            <li key={label}>
              {href ? (
                <Link
                  href={href}
                  className="px-4 py-3 flex items-center gap-4 text-base hover:bg-white/5"
                >
                  {inner}
                </Link>
              ) : (
                <div className="px-4 py-3 flex items-center gap-4 text-base">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-auto border-t border-[color:var(--color-border)] py-2">
        <NotificationsButton />
        <ThemeToggle />
        <Link href="#" className="px-4 py-3 flex items-center gap-4 text-base">
          <Settings size={22} />
          <span>Settings</span>
        </Link>
        <form action={signOut}>
          <button className="w-full px-4 py-3 flex items-center gap-4 text-base text-[color:var(--color-danger)]">
            Log out
          </button>
        </form>
      </div>
    </>
  );
}
