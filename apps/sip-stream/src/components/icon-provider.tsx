'use client';

import { createContext, useContext } from 'react';

export const IconContext = createContext<string>('/icon-1.png');

export function useIcon() {
  return useContext(IconContext);
}

export function IconProvider({ children }: { children: React.ReactNode }) {
  return <IconContext.Provider value="/icon-1.png">{children}</IconContext.Provider>;
}
