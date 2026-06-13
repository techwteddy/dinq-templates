"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  User,
  PlusCircle,
  LayoutGrid,
  Bot,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/collections", icon: LayoutGrid, label: "Collections" },
    { href: "/add", icon: PlusCircle, label: "Add Knowledge" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/chat", icon: Bot, label: "Ask AI" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-[#262626]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 bg-gradient-to-br from-[#E5C07B] to-[#C9B26A] rounded-lg flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-black" />
            </motion.div>
            <span className="text-xl font-bold text-[#F5F5F5] group-hover:text-[#E5C07B] transition-colors">
              KnowledgeVault
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[#E5C07B]"
                    : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md text-[#A1A1AA] hover:text-[#F5F5F5]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden mt-2 bg-[#0B0B0B] border-t border-[#262626] rounded-b-lg overflow-hidden"
          >
            <div className="flex flex-col px-4 py-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-[#E5C07B]"
                      : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
