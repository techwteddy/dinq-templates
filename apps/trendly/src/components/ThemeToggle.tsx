"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";
const STORAGE_KEY = "trendly-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-full px-4 py-3 flex items-center gap-4 text-base hover:bg-white/5"
      aria-label="Toggle dark/light theme"
    >
      {mounted && theme === "light" ? <Sun size={22} /> : <Moon size={22} />}
      <span>{mounted && theme === "light" ? "Light theme" : "Dark theme"}</span>
    </button>
  );
}
