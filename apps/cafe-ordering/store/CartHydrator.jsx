// store/CartHydrator.jsx
"use client";

import { useEffect } from "react";
import { useCartStore } from "./cartStore";

const STORAGE_KEY = "brew-bite-cart";

export function CartHydrator() {
  const setItems = useCartStore((s) => s.setItems);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // Corrupted data — wipe it so the app doesn't crash on every load
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [setItems]);

  return null;
}
