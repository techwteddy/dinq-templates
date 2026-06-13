"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { Profile } from "@/lib/types/database";
export function AuthButton({ user }: { user: Profile | null }) {
  const supabase = createClient();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignIn = async (provider: "google" | "facebook") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // Close menu on click outside or scroll
  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    const handleScroll = () => setShowMenu(false);
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showMenu]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center rounded-full border border-stone p-1 hover:border-stone-dark hover:ring-2 hover:ring-amber/20 transition-all"
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-full"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-xs font-bold text-amber">
                {user.full_name[0]}
              </div>
            )}
          </button>

          {showMenu && (
              <div className="animate-slide-down absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-stone bg-warm-white shadow-xl shadow-bark/5" style={{ zIndex: 9999 }}>
                <div className="border-b border-stone/50 px-4 py-3">
                  <p className="text-sm font-semibold text-pine">{user.full_name}</p>
                  <p className="text-xs text-bark-light capitalize">{user.role.replace("_", " ")}</p>
                </div>
                <div className="py-1.5">
                  <a href={`/profile/${user.id}`} className="flex items-center gap-2.5 px-4 py-3 text-sm text-bark hover:bg-mist transition-colors">
                    <svg className="h-4 w-4 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    My Profile
                  </a>
                </div>
                <div className="border-t border-stone/50 py-1.5">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Sign Out
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => handleSignIn("google")}
        className="flex items-center gap-2 rounded-lg border border-stone bg-warm-white px-4 py-2 text-sm font-medium text-bark shadow-sm hover:border-stone-dark hover:shadow-md transition-all"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>
      <button
        onClick={() => handleSignIn("facebook")}
        className="flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#166FE5] hover:shadow-md transition-all"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>
    </div>
  );
}
