'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface DashboardContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  breadcrumbs: Array<{ label: string; href: string }>;
  setBreadcrumbs: (crumbs: Array<{ label: string; href: string }>) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigateTo: (page: string, crumbs?: Array<{ label: string; href: string }>) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; href: string }>>([
    { label: 'Dashboard', href: '/admin/dashboard' },
  ]);

  const navigateTo = useCallback((page: string, crumbs?: Array<{ label: string; href: string }>) => {
    setCurrentPage(page);
    if (crumbs) {
      setBreadcrumbs(crumbs);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        breadcrumbs,
        setBreadcrumbs,
        sidebarOpen,
        setSidebarOpen,
        navigateTo,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
