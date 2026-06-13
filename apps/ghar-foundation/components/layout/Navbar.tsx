"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const languages = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "de", label: "DE" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("navigation");
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
    setLangOpen(false);
  };

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <nav className="w-full bg-background border-b-2 border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end h-20 pb-3">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image src="/images/GahrLogo.svg" alt="GHAR Organization" width={120} height={60} priority />
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}/about`} className="text-primary hover:text-[#2A2A2A] transition-colors text-sm font-medium">{t("about")}</Link>
            <Link href={`/${locale}/projects`} className="text-primary hover:text-[#2A2A2A] transition-colors text-sm font-medium">{t("projects")}</Link>
            <Link href={`/${locale}/volunteer`} className="text-primary hover:text-[#2A2A2A] transition-colors text-sm font-medium">{t("volunteer")}</Link>
            <Link href={`/${locale}/contact`} className="text-primary hover:text-[#2A2A2A] transition-colors text-sm font-medium">{t("contact")}</Link>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-primary hover:text-[#2A2A2A] transition-colors p-1"><Search size={18} /></button>
            <span className="text-gray-300">|</span>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-primary hover:text-[#2A2A2A] transition-colors text-sm font-medium"
              >
                {currentLang.label}
                <ChevronDown size={14} />
              </button>
              {langOpen && (
                <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded shadow-md z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        locale === lang.code ? "text-primary font-semibold" : "text-dark"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/donate`} className="bg-secondary hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-semibold transition-colors ml-2">
              {t("donateNow")}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 text-dark" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href={`/${locale}/about`} className="text-dark hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>{t("about")}</Link>
          <Link href={`/${locale}/projects`} className="text-dark hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>{t("projects")}</Link>
          <Link href={`/${locale}/volunteer`} className="text-dark hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>{t("volunteer")}</Link>
          <Link href={`/${locale}/contact`} className="text-dark hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>{t("contact")}</Link>
          <div className="flex gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { switchLanguage(lang.code); setMenuOpen(false); }}
                className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                  locale === lang.code ? "bg-primary text-white" : "text-dark hover:text-primary"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <Link href={`/${locale}/donate`} className="bg-secondary text-white px-5 py-2 rounded text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>
            {t("donateNow")}
          </Link>
        </div>
      )}
    </nav>
  );
}