'use client';

import React from 'react';
import { DashboardProvider } from '@/lib/dashboard-context';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin Layout Wrapper
 * Wraps all admin pages with necessary providers and context
 * Usage: Wrap your admin page or layout with this component
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}
