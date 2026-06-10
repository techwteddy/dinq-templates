"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { SectionName } from "@/lib/types";

type ActiveSectionContextProviderProps = {
  children: React.ReactNode;
};

type ActiveSectionContextType = {
  activeSection: SectionName;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
  timeOfLastClick: number;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
  sectionRefs: {
    [K in SectionName]?: React.RefObject<HTMLElement>;
  };
  setSectionRef: (
    sectionName: SectionName,
    ref: React.RefObject<HTMLElement>
  ) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextType | null>(
  null
);

export default function ActiveSectionContextProvider({
  children,
}: ActiveSectionContextProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionName>("Home");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0);
  const [sectionRefs, setSectionRefs] = useState<
    ActiveSectionContextType["sectionRefs"]
  >({});

  const setSectionRef = useCallback(
    (sectionName: SectionName, ref: React.RefObject<HTMLElement>) => {
      setSectionRefs((prev) => ({ ...prev, [sectionName]: ref }));
    },
    []
  );

  return (
    <ActiveSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
        sectionRefs,
        setSectionRef,
      }}
    >
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSectionContext() {
  const context = useContext(ActiveSectionContext);
  if (context === null) {
    throw new Error(
      "useActiveSectionContext must be used within an ActiveSectionContextProvider"
    );
  }
  return context;
}
