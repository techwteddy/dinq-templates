"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

type ThemeCtx = { theme: Theme; setTheme: (t: Theme) => void; resolved: "light" | "dark" };

const Ctx = createContext<ThemeCtx>({ theme: "system", setTheme: () => {}, resolved: "light" });

export function useTheme() {
  return useContext(Ctx);
}

function getSystemPref(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyClass(resolved: "light" | "dark") {
  const el = document.documentElement;
  if (resolved === "dark") el.classList.add("dark");
  else el.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  // Read the saved theme after mount. localStorage is unavailable during SSR, so we
  // intentionally sync state once here; the inline <head> script prevents any flash.
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const t = saved && ["light", "dark", "system"].includes(saved) ? saved : "system";
    const r = t === "system" ? getSystemPref() : t;
    /* eslint-disable react-hooks/set-state-in-effect */
    setThemeState(t);
    setResolved(r);
    /* eslint-enable react-hooks/set-state-in-effect */
    applyClass(r);
  }, []);

  // Listen for system preference changes.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange() {
      if (theme === "system") {
        const r = getSystemPref();
        setResolved(r);
        applyClass(r);
      }
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    const r = t === "system" ? getSystemPref() : t;
    setResolved(r);
    applyClass(r);
  }, []);

  return <Ctx value={{ theme, setTheme, resolved }}>{children}</Ctx>;
}
