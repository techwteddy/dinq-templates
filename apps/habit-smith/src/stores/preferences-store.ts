"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PreferencesState = {
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  profilePublic: boolean;
  setTheme: (theme: "light" | "dark") => void;
  toggleNotifications: () => void;
  toggleProfilePublic: () => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "dark",
      notificationsEnabled: true,
      profilePublic: false,
      setTheme: (theme) => set({ theme }),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleProfilePublic: () => set((state) => ({ profilePublic: !state.profilePublic })),
    }),
    {
      name: "habitsmith-preferences-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
