"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import Image from "next/image";
import BecomeClientDialog from "@/components/dialogs/become-a-client";
import Logo from "@/public/logo.png";
import Magnetic from "@/components/ui/magnetic";

export default function Header() {
  const router = useRouter();
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const [showClientDialog, setShowClientDialog] = useState(false);

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setActiveSection("Home");
    setTimeOfLastClick(Date.now());
  };

  const handleLinkClick = (sectionName: string) => {
    setActiveSection(sectionName as typeof activeSection);
    setTimeOfLastClick(Date.now());
  };

  return (
    <header className="hidden lg:block z-[999] relative" role="banner">
      {/* Header Background - Desktop rounded pill */}
      <motion.div
        className="fixed top-6 left-1/2 h-[2.5rem] w-[90%] max-w-[42rem] rounded-full border border-white/40 bg-stone-100/95 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] dark:bg-gray-950/75 dark:border-black/40"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      />

      {/* Logo */}
      <motion.div
        className="fixed top-6 left-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="p-2">
          <Magnetic>
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 h-[2.5rem] px-4 rounded-full bg-transparent border-2 border-gray-800/40 hover:border-gray-800/60 dark:border-white/40 dark:hover:border-white/60 backdrop-blur-[0.5rem] text-gray-800 dark:text-white font-semibold text-base transition-all hover:scale-105 active:scale-95"
              aria-label="Sakia Labs - Go to home"
            >
              <Image
                src={Logo}
                alt="Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span>Sakia Labs</span>
            </button>
          </Magnetic>
        </div>
      </motion.div>

      {/* Navigation - Desktop */}
      <nav 
        className="fixed top-6 left-1/2 -translate-x-1/2 h-[2.5rem] flex items-center"
        aria-label="Main navigation"
      >
        <ul className="flex items-center justify-center gap-5 text-[0.8rem] font-medium text-gray-500">
          {links.map((link) => (
            <motion.li
              className="flex items-center justify-center relative"
              key={link.hash}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Link
                className={clsx(
                  "flex items-center justify-center px-3.5 py-1 hover:text-gray-950 transition-colors duration-200 dark:text-gray-500 dark:hover:text-gray-300 relative z-10",
                  {
                    "text-black dark:text-white font-semibold":
                      activeSection === link.name,
                  }
                )}
                href={link.hash}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(link.hash.slice(1));
                  if (element) {
                    const yOffset = -100;
                    const y =
                      element.getBoundingClientRect().top +
                      window.scrollY +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                    handleLinkClick(link.name);
                  } else {
                    // If element doesn't exist (e.g., on 404 page), navigate to homepage with hash
                    router.push(`/${link.hash}`);
                  }
                }}
                aria-current={activeSection === link.name ? "page" : undefined}
              >
                {link.name}
              </Link>
              {link.name === activeSection && (
                <motion.span
                  className="bg-blue-100/80 rounded-full absolute inset-0 dark:bg-blue-400/20"
                  layoutId="activeSection"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                  }}
                  aria-hidden="true"
                />
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Right side buttons container */}
      <motion.div
        className="fixed top-6 right-4 h-[2.5rem] flex items-center gap-2"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Partner Button - Desktop */}
        <div className="p-2">
          <Magnetic>
            <button
              onClick={() => setShowClientDialog(true)}
              className="flex items-center justify-center px-4 py-2 rounded-full bg-stone-100/95 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] dark:bg-gray-950/75 text-gray-600 hover:text-gray-950 transition dark:hover:text-gray-300 h-[2.5rem] border border-white/40 dark:border-black/40 text-sm whitespace-nowrap hover:scale-105 active:scale-95"
            >
              Request a consultation
            </button>
          </Magnetic>
        </div>
      </motion.div>

      {/* Client Dialog */}
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
