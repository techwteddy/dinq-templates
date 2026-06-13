import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuthButton } from "@/components/auth/AuthButton";
import { MessagesBadge } from "@/components/messages/MessagesBadge";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";
import { GradientButton } from "@/components/ui/GradientButton";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let unreadCount = 0;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;

    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .neq("sender_id", user.id)
      .is("read_at", null);
    unreadCount = count ?? 0;
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-stone/60 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/images/app-icon.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg transition-transform group-hover:scale-105"
            />
            <span className="font-[family-name:var(--font-display)] text-xl text-pine tracking-tight">
              BaguioRentals
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink href="/">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Home
            </NavLink>
            <NavLink href="/listings" exact>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Browse
            </NavLink>
            {profile?.role === "property_owner" && (
              <>
                <NavLink href="/listings/new" exact>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Post a Listing
                </NavLink>
                <NavLink href="/my-listings" alsoMatch={["/listings"]} alsoMatchExclude={["/listings/new"]}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  My Listings
                </NavLink>
              </>
            )}
            {profile && (
              <NavLink href="/saved">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Saved
              </NavLink>
            )}
            {profile && (
              <MessagesBadge userId={profile.id} initialCount={unreadCount} variant="nav" />
            )}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/about">
            <GradientButton>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              About
            </GradientButton>
          </Link>
          <AuthButton user={profile} />
        </div>

        <MobileMenu user={profile} />
      </div>
    </nav>
  );
}
