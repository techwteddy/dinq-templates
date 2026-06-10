"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useTheme } from "@/context/theme-context";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { BsMoon, BsSun } from "react-icons/bs";
import BecomeClientDialog from "@/components/dialogs/become-a-client";

export default function MobileNav() {
  const router = useRouter();
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveSection("Home");
    setTimeOfLastClick(Date.now());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showMenu) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showMenu]);

  return (
    <header className="lg:hidden z-[999] relative" role="banner">
      {/* Mobile header pill - responsive and centered */}
      <div className="fixed top-3 left-0 right-0 px-3 sm:px-6 md:px-12">
        <motion.div
          className="max-w-[400px] sm:max-w-[500px] md:max-w-[600px] h-[2.75rem] sm:h-[3rem] rounded-full border border-white/40 bg-stone-100/95 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] dark:bg-gray-950/75 dark:border-black/40 flex items-center justify-between px-3 sm:px-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
        {/* Logo */}
        <motion.button
          onClick={handleLogoClick}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-800 dark:text-gray-200 font-semibold text-sm hover:opacity-80 transition"
          aria-label="Sakia Labs - Go to home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Image src={Logo} alt="Logo" width={20} height={20} className="w-5 h-5" />
          <span>Sakia Labs</span>
        </motion.button>

        {/* Buttons - smaller and responsive */}
        <motion.div
          className="flex items-center gap-1 sm:gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="w-7 h-7 rounded-full bg-white dark:bg-gray-900 border border-black/5 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm flex-shrink-0"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              key={theme}
            >
              {theme === "light" ? <BsSun size={12} /> : <BsMoon size={12} />}
            </motion.div>
          </motion.button>

          {/* Burger */}
          <motion.button
            onClick={() => setShowMenu(!showMenu)}
            className="w-7 h-7 rounded-full bg-white dark:bg-gray-900 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-sm flex-shrink-0"
            aria-label={showMenu ? "Close menu" : "Open menu"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex flex-col gap-0.5 w-2.5">
              <motion.span
                animate={showMenu ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full"
              />
              <motion.span
                animate={showMenu ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full"
              />
              <motion.span
                animate={showMenu ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full"
              />
            </div>
          </motion.button>
        </motion.div>
        </motion.div>
      </div>

      {/* Dropdown - responsive and centered */}
      <AnimatePresence>
        {showMenu && (
          <div className="fixed top-[3.5rem] sm:top-[3.75rem] left-0 right-0 px-3 sm:px-6 md:px-12">
            <motion.div
              ref={menuRef}
              className="max-w-[400px] sm:max-w-[500px] md:max-w-[600px] rounded-2xl border border-white/40 bg-stone-100/95 shadow-xl shadow-black/[0.1] backdrop-blur-[0.5rem] dark:bg-gray-950/95 dark:border-black/40 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <div className="p-2.5 sm:p-3">
              <nav className="flex flex-col gap-0.5">
                {links.map((link, index) => (
                  <motion.div
                    key={link.hash}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      href={link.hash}
                      className={clsx(
                        "block py-2.5 px-3 text-sm font-medium rounded-xl transition-all relative",
                        activeSection === link.name
                          ? "text-gray-900 dark:text-white font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(link.hash.slice(1));
                        if (element) {
                          const y = element.getBoundingClientRect().top + window.scrollY - 80;
                          window.scrollTo({ top: y, behavior: "smooth" });
                          setActiveSection(link.name);
                          setTimeOfLastClick(Date.now());
                        } else {
                          // If element doesn't exist (e.g., on 404 page), navigate to homepage with hash
                          router.push(`/${link.hash}`);
                        }
                        setShowMenu(false);
                      }}
                    >
                      {link.name}
                      {link.name === activeSection && (
                        <motion.span
                          className="bg-blue-600/30 rounded-xl absolute inset-0 -z-10 dark:bg-blue-400/20"
                          layoutId="activeSectionMobile"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-2.5 pt-2.5 border-t border-black/5 dark:border-white/10">
                <button
                  onClick={() => {
                    setShowClientDialog(true);
                    setShowMenu(false);
                  }}
                  className="w-full py-2.5 px-3 bg-stone-100/95 dark:bg-gray-950/75 text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-gray-100 rounded-xl font-semibold text-sm border border-white/40 dark:border-black/40 transition-all shadow-lg shadow-black/[0.03]"
                >
                  Request a consultation
                </button>
              </div>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dialog */}
      <AnimatePresence>
        {showClientDialog && (
          <BecomeClientDialog
            onClose={() => setShowClientDialog(false)}
            initialPackage={""}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
