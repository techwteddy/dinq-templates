"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import t from "@/lib/translations";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const tr = t[lang].nav;

  const links = [
    { name: tr.home, href: "#hero" },
    { name: tr.skills, href: "#skills" },
    { name: tr.projects, href: "#projects" },
    { name: tr.timeline, href: "#timeline" },
    { name: tr.contact, href: "#contact" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleScroll = (href: string) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 px-4 lg:px-8 text-gray-300 transition-colors duration-300"
      style={{ backgroundColor: "var(--nav-bg)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--card-border)" }}
    >
      <div className="max-w-7xl mx-auto py-3 flex justify-between items-center gap-2">
        {/* Logo */}
        <a
          href="#hero"
          className="text-base sm:text-xl font-bold text-transparent bg-clip-text truncate"
          style={{ backgroundImage: "var(--gradient-accent)" }}
          onClick={(e) => { e.preventDefault(); handleScroll("#hero"); }}
        >
          Ghiberti.dev
        </a>

        {/* Desktop menu */}
        <ul className="hidden lg:flex items-center space-x-6">
          {links.map(({ name, href }) => (
            <li key={name}>
              <a
                href={href}
                onClick={(e) => { e.preventDefault(); handleScroll(href); }}
                className="hover:text-teal-400 transition-colors text-sm font-medium"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>

        {/* Controls: lang toggle + theme toggle + mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div
            className="hidden sm:flex items-center gap-1 rounded-full px-1 py-1 text-xs font-semibold"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <button
              onClick={() => setLang("en")}
              aria-label="Switch to English"
              className={`px-2.5 py-1 rounded-full transition-all ${
                lang === "en"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              style={lang === "en" ? { background: "var(--gradient-accent)" } : {}}
            >
              EN
            </button>
            <button
              onClick={() => setLang("pt")}
              aria-label="Mudar para Português"
              className={`px-2.5 py-1 rounded-full transition-all ${
                lang === "pt"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              style={lang === "pt" ? { background: "var(--gradient-accent)" } : {}}
            >
              PT
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full text-gray-400 hover:text-teal-400 transition-colors"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="text-sm" />
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-xl"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile menu — absolute so it doesn't affect nav height or page scroll */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden absolute top-full left-0 w-full flex flex-col space-y-5 px-6 py-5"
          style={{
            backgroundColor: "var(--nav-bg)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--card-border)",
          }}
        >
          {links.map(({ name, href }) => (
            <a
              key={name}
              href={href}
              onClick={(e) => { e.preventDefault(); handleScroll(href); }}
              className="hover:text-teal-400 transition-colors text-sm font-medium"
            >
              {name}
            </a>
          ))}
          {/* Mobile lang + theme */}
          <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "var(--card-border)" }}>
            <button
              onClick={() => setLang("en")}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${lang === "en" ? "text-white" : "text-gray-400"}`}
              style={lang === "en" ? { background: "linear-gradient(135deg,#14b8a6,#3b82f6)" } : { background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
            >
              EN
            </button>
            <button
              onClick={() => setLang("pt")}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${lang === "pt" ? "text-white" : "text-gray-400"}`}
              style={lang === "pt" ? { background: "linear-gradient(135deg,#14b8a6,#3b82f6)" } : { background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
            >
              PT
            </button>
            <button
              onClick={toggleTheme}
              className="text-xs px-3 py-1.5 rounded-full font-semibold text-gray-400 hover:text-teal-400 transition"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
            >
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
