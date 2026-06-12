"use client";

import { useEffect } from "react";

import { usePreferencesStore } from "@/stores/preferences-store";

export function ThemeSync() {
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
}
