"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { MotionConfig } from "framer-motion";

interface AccessibilityContextProps {
  animationsDisabled: boolean;
  setAnimationsDisabled: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps>({
  animationsDisabled: false,
  setAnimationsDisabled: () => {},
});

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [animationsDisabled, setAnimationsDisabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("ac-no-animations");
    
    if (saved !== null) {
      const isDisabled = saved === "true";
      setAnimationsDisabled(isDisabled);
      if (isDisabled) {
        document.documentElement.classList.add("ac-no-animations");
      }
    } else {
      // Автовизначення характеристик для слабких/бюджетних пристроїв
      let shouldDisable = false;

      // 1. Оперативна пам'ять пристрою (RAM) <= 3GB ( navigator.deviceMemory )
      const ram = (navigator as any).deviceMemory;
      if (ram !== undefined && ram <= 3) {
        shouldDisable = true;
      }

      // 2. Кількість ядер процесора <= 4 ( navigator.hardwareConcurrency )
      const cores = navigator.hardwareConcurrency;
      if (cores !== undefined && cores <= 4) {
        shouldDisable = true;
      }

      // 3. Режим заощадження даних ( saveData )
      const conn = (navigator as any).connection;
      if (conn !== undefined && conn.saveData === true) {
        shouldDisable = true;
      }

      // 4. Системне налаштування «Зменшення руху» ( reduced motion ) в ОС
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        shouldDisable = true;
      }

      if (shouldDisable) {
        setAnimationsDisabled(true);
        localStorage.setItem("ac-no-animations", "true");
        document.documentElement.classList.add("ac-no-animations");
      }
    }
  }, []);

  const toggleAnimations = (disabled: boolean) => {
    setAnimationsDisabled(disabled);
    localStorage.setItem("ac-no-animations", disabled ? "true" : "false");
    if (disabled) {
      document.documentElement.classList.add("ac-no-animations");
    } else {
      document.documentElement.classList.remove("ac-no-animations");
    }
  };

  return (
    <AccessibilityContext.Provider value={{ animationsDisabled, setAnimationsDisabled: toggleAnimations }}>
      <MotionConfig reducedMotion={animationsDisabled ? "always" : "user"}>
        {children}
      </MotionConfig>
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);
