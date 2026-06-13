"use client";

import { useState } from "react";

export function MobileFilterToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 lg:hidden"
      >
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-semibold text-gray-900">Filters</span>
        </div>
        <svg className={`h-5 w-5 text-bark-light transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* Mobile: collapsible */}
      <div className={`lg:hidden ${open ? "mt-3" : "hidden"}`}>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          {children}
        </div>
      </div>

      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        <div className="sticky top-20 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 font-semibold text-gray-900">Filters</h2>
          {children}
        </div>
      </div>
    </>
  );
}
