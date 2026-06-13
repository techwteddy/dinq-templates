"use client";

import { useState } from "react";
import Link from "next/link";
import { InventoryItem } from "@/lib/types";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { InventoryForm } from "@/components/forms/inventory-form";
import { createInventoryItem } from "@/app/actions/inventory";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/ui/alert-provider";

interface InventoryClientProps {
  items: InventoryItem[];
}

const ITEMS_PER_PAGE = 10;

export default function InventoryClient({ items }: InventoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useAlert();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await createInventoryItem(formData);
      if (result.success) {
        showSuccess("Inventory item created successfully!", "Success");
        setIsModalOpen(false);
        router.refresh();
      } else {
        showError(result.error || "Failed to create item", "Error");
      }
    } catch (error) {
      showError("An error occurred while creating the item", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 when search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const getStockPercentage = (item: InventoryItem) => {
    const percentage = (item.quantity / (item.reorder_level * 2)) * 100;
    return Math.min(percentage, 100);
  };

  const getStockColor = (item: InventoryItem) => {
    if (item.quantity < item.reorder_level) return "bg-red-500";
    if (item.quantity < item.reorder_level * 1.5) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 whitespace-nowrap"
        >
          + Add Item
        </button>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Stock Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12">
                  <EmptyState
                    title={searchQuery ? "No items found" : "No inventory items yet"}
                    description={
                      searchQuery
                        ? "Try adjusting your search terms"
                        : "Get started by adding your first inventory item"
                    }
                    action={
                      searchQuery
                        ? undefined
                        : {
                            label: "+ Add Item",
                            onClick: () => setIsModalOpen(true),
                          }
                    }
                  />
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const isLowStock = item.quantity < item.reorder_level;
                const percentage = getStockPercentage(item);
                const colorClass = getStockColor(item);

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            Reorder at: {item.reorder_level} {item.unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{item.quantity} {item.unit}</span>
                          <span>{Math.round(percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${colorClass}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {isLowStock ? (
                        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-3">
                      <Link
                        href={`/dashboard/inventory/${item.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/inventory/${item.id}/restock`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredItems.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemName="items"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Add New Item"
        size="md"
      >
        <InventoryForm onSubmit={handleSubmit} />
      </Modal>
    </>
  );
}

