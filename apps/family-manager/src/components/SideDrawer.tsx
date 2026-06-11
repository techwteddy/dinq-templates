"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navAreas } from "@/config/navigation";

const AREA_ACCENTS: Record<string, string> = {
  "/": "bg-peach/20",
  "/calendar": "bg-lavender/20",
  "/supermarket": "bg-sage/20",
  "/chores": "bg-peach/20",
  "/home-projects": "bg-honey/20",
};

export default function SideDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="p-2 -ml-2 rounded-xl hover:bg-peach/20 transition-colors"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-card shadow-2xl transform transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-card-border">
          <span className="font-semibold text-lg">My Family Genius</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-xl hover:bg-peach/20 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              pathname === "/"
                ? `${AREA_ACCENTS["/"]} font-medium`
                : "hover:bg-peach/10"
            }`}
          >
            <span>🏠</span>
            <span>Home</span>
          </Link>
          {navAreas.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                pathname === area.href
                  ? `${AREA_ACCENTS[area.href] ?? "bg-peach/20"} font-medium`
                  : "hover:bg-peach/10"
              }`}
            >
              <span>{area.icon}</span>
              <span>{area.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
