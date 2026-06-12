"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/lib/translations";

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { lang } = useLanguage();
  const tr = t[lang].footer;

  useEffect(() => {
    const handleScroll = () => {
      const skillsSection = document.getElementById("skills");
      if (skillsSection) {
        setShowBackToTop(window.scrollY > skillsSection.offsetTop + skillsSection.offsetHeight);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 px-3 py-1.5 rounded-full bg-gray-700 text-gray-300 hover:bg-teal-700 hover:text-white transition-transform transform hover:scale-105 shadow-lg z-40"
          aria-label="Back to top"
        >
          <FontAwesomeIcon icon={faArrowUp} size="xl" className="align-middle" style={{ verticalAlign: "-0.15em" }} />
        </button>
      )}

      <footer
        className="py-6 px-4 text-center border-t"
        style={{ borderColor: "var(--card-border)", color: "var(--color-text-muted)" }}
      >
        <p className="text-sm mb-1">
          {tr.developed} <span className="text-teal-400">💚</span> {tr.by}{" "}
          <span className="font-semibold" style={{ color: "var(--color-text)" }}>Fernando Ghiberti</span>
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>
          © {new Date().getFullYear()} Fernando Ghiberti · {tr.builtWith}{" "}
          <span style={{ color: "var(--color-text)" }}>Next.js 15</span> · {tr.deployedOn}{" "}
          <span style={{ color: "var(--color-text)" }}>Vercel</span>
        </p>
      </footer>
    </>
  );
}
