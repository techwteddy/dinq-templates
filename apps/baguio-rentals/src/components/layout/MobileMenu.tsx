"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import type { Profile } from "@/lib/types/database";

export function MobileMenu({ user }: { user: Profile | null }) {
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignIn = async (provider: "google" | "facebook") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  };

  // Close menu on route change
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close menu when clicking a link to the current page
  const handleNavClick = (href: string) => {
    if (pathname === href) setOpen(false);
  };

  const isActivePath = (href: string) => pathname === href;

  const mobileNavClass = (href: string) =>
    `flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
      isActivePath(href)
        ? "text-pine"
        : "text-bark hover:bg-mist"
    }`;

  const mobileIconClass = (href: string) =>
    `h-5 w-5 ${isActivePath(href) ? "text-pine" : "text-bark-light"}`;

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2.5 text-bark hover:bg-mist transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          )}
        </svg>
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 top-[72px] z-[999] flex flex-col bg-cream md:hidden">
          <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => handleNavClick("/")}
                className={mobileNavClass("/")}
              >
                <svg className={mobileIconClass("/")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Home
              </Link>
              <Link
                href="/listings"
                onClick={() => handleNavClick("/listings")}
                className={mobileNavClass("/listings")}
              >
                <svg className={mobileIconClass("/listings")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Browse Listings
              </Link>
              {user?.role === "property_owner" && (
                <>
                  <Link
                    href="/listings/new"
                    onClick={() => handleNavClick("/listings/new")}
                    className={mobileNavClass("/listings/new")}
                  >
                    <svg className={mobileIconClass("/listings/new")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Post a Listing
                  </Link>
                  <Link
                    href="/my-listings"
                    onClick={() => handleNavClick("/my-listings")}
                    className={mobileNavClass("/my-listings")}
                  >
                    <svg className={mobileIconClass("/my-listings")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    My Listings
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link
                    href="/saved"
                    onClick={() => handleNavClick("/saved")}
                    className={mobileNavClass("/saved")}
                  >
                    <svg className={mobileIconClass("/saved")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Saved
                  </Link>
                  <Link
                    href="/messages"
                    onClick={() => handleNavClick("/messages")}
                    className={mobileNavClass("/messages")}
                  >
                    <svg className={mobileIconClass("/messages")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Messages
                  </Link>
                </>
              )}
            </nav>

            {/* About link — pinned to bottom of nav */}
            <div className="mt-auto pt-6">
              <Link
                href="/about"
                onClick={() => handleNavClick("/about")}
                className="rotating-gradient relative flex items-center justify-center gap-2.5 rounded-[50px] px-5 py-3.5 text-sm font-semibold text-bark after:content-[''] after:block after:absolute after:bg-cream after:inset-[2px] after:rounded-[48px] after:z-[1]"
                style={{ '--r': '0deg' } as React.CSSProperties}
              >
                <svg className="relative z-[2] h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                <span className="relative z-[2]">About BaguioRentals</span>
              </Link>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-stone/60 px-6 py-5">
            {user ? (
              <div className="flex items-center justify-between">
                <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-full ring-2 ring-stone/40"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pine text-sm font-bold text-amber ring-2 ring-stone/40">
                      {user.full_name[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-pine">{user.full_name}</p>
                    <p className="text-xs text-bark-light capitalize">{user.role.replace("_", " ")}</p>
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleSignIn("google")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-stone bg-warm-white px-4 py-3 text-sm font-medium text-bark shadow-sm hover:border-stone-dark transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
                <button
                  onClick={() => handleSignIn("facebook")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#166FE5] transition-all"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Sign in with Facebook
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
