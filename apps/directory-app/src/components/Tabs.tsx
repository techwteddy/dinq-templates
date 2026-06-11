"use client";

import React from "react";

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors focus:outline-none ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-700 bg-blue-50"
                : "border-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab content placeholder */}
      <div className="p-4 bg-white rounded-b-md border border-t-0 border-gray-200 mt-[-1px]">
        <p className="text-gray-500">Content for <span className="font-semibold">{activeTab}</span> (Placeholder)</p>
      </div>
    </div>
  );
} 