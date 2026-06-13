"use client";

import { InventoryItem } from "@/lib/types";
import Link from "next/link";

interface LowStockAlertProps {
  lowStockItems: InventoryItem[];
}

export default function LowStockAlert({ lowStockItems }: LowStockAlertProps) {
  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center mb-3">
          <svg
            className="h-5 w-5 text-red-600 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium leading-6 text-red-900">
            Low Stock Warning
          </h3>
        </div>

        <div className="space-y-2">
          {lowStockItems.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-3 rounded border border-red-200"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-red-600">
                  {item.quantity} {item.unit} left (Reorder at: {item.reorder_level})
                </p>
              </div>
              <Link
                href={`/dashboard/inventory/${item.id}/restock`}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
              >
                Restock
              </Link>
            </div>
          ))}
        </div>

        {lowStockItems.length > 5 && (
          <div className="mt-3 text-center">
            <Link
              href="/dashboard/inventory"
              className="text-sm font-medium text-red-700 hover:text-red-900"
            >
              View all {lowStockItems.length} low stock items →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}




