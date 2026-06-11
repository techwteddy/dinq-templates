"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ShoppingCart, Menu, X } from "lucide-react";
import CoffeeLogo from "./icons/CoffeeLogo";
import { useCartStore } from "@/store/cartStore";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  // openForPathname stores which pathname the menu was opened on.
  // The drawer is considered open only when this matches the current pathname.
  // When the user navigates, pathname changes → they no longer match → drawer
  // is closed. No setState in effects, no ref access during render.
  const [openForPathname, setOpenForPathname] = useState(null);

  const menuOpen = openForPathname === pathname;

  const openMenu = () => setOpenForPathname(pathname);
  const closeMenu = () => setOpenForPathname(null);
  const toggleMenu = () => (menuOpen ? closeMenu() : openMenu());

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <header className="w-full relative z-50">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <CoffeeLogo className="text-gray-900" />
          <span className="hidden sm:inline font-semibold text-lg text-gray-900">
            Brew-Bite Cafe
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative text-sm font-medium transition-colors",
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-900",
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-6 rounded-full bg-orange-500" />
                )}
              </Link>
            );
          })}

          <CartIcon totalItems={totalItems} pathname={pathname} />
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <CartIcon totalItems={totalItems} pathname={pathname} />

          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={closeMenu}
          />

          {/* Slide-down panel */}
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50 md:hidden">
            <nav className="flex flex-col px-6 py-4 gap-1">
              {[...navLinks, { href: "/cart", label: "Cart" }].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "py-3 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors",
                      isActive
                        ? "text-orange-500"
                        : "text-gray-700 hover:text-gray-900",
                    )}
                  >
                    {link.label}
                    {link.href === "/cart" && totalItems > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-orange-500 text-white text-[10px] font-bold px-1">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

function CartIcon({ totalItems, pathname }) {
  const isActive = pathname === "/cart";
  return (
    <Link
      href="/cart"
      className={clsx(
        "relative flex items-center text-sm font-medium transition-colors",
        isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900",
      )}
      aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
    >
      <ShoppingCart size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
      {isActive && (
        <span className="hidden md:block absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-6 rounded-full bg-orange-500" />
      )}
    </Link>
  );
}
