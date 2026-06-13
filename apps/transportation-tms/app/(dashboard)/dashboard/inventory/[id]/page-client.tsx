"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Modal } from "@/components/ui/modal";
import { RestockForm } from "@/components/forms/restock-form";
import { ConsumeForm } from "@/components/forms/consume-form";
import { restockItem, consumeItem } from "@/app/actions/inventory";
import { useAlert } from "@/components/ui/alert-provider";
import type { InventoryItem, InventoryLog, Vehicle } from "@/lib/types";

interface InventoryItemPageProps {
  item: InventoryItem;
  logs: InventoryLog[];
  vehicles: Vehicle[];
}

export default function InventoryItemPageClient({
  item: initialItem,
  logs: initialLogs,
  vehicles,
}: InventoryItemPageProps) {
  const [item] = useState(initialItem);
  const [logs] = useState(initialLogs);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useAlert();

  const isLowStock = item.quantity <= item.reorder_level;

  const handleRestock = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await restockItem(item.id, formData);
      if (result.success) {
        showSuccess("Item restocked successfully!", "Success");
        setIsRestockModalOpen(false);
        router.refresh();
      } else {
        showError(result.error || "Failed to restock item", "Error");
      }
    } catch (error) {
      showError("An error occurred while restocking", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsume = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await consumeItem(item.id, formData);
      if (result.success) {
        showSuccess("Item used successfully!", "Success");
        setIsConsumeModalOpen(false);
        router.refresh();
      } else {
        showError(result.error || "Failed to use item", "Error");
      }
    } catch (error) {
      showError("An error occurred while using the item", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsRestockModalOpen(true)}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            Restock
          </button>
          <button
            onClick={() => setIsConsumeModalOpen(true)}
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
          >
            Use Item
          </button>
        </div>
      </div>

      {isLowStock && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Low Stock Warning
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Current stock ({item.quantity} {item.unit}) is below reorder
                  level ({item.reorder_level} {item.unit})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Current Quantity
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {item.quantity} {item.unit}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Reorder Level
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {item.reorder_level} {item.unit}
                </dd>
              </div>

              {item.last_restocked_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Restocked
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(
                      new Date(item.last_restocked_at),
                      "MMMM dd, yyyy 'at' h:mm a"
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Transaction History
            </h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                        No transaction history yet
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {format(
                            new Date(log.created_at),
                            "MMM dd, yyyy 'at' h:mm a"
                          )}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                            log.change_amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {log.change_amount > 0 ? "+" : ""}
                          {log.change_amount} {item.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.notes || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Restock Modal */}
      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => !isSubmitting && setIsRestockModalOpen(false)}
        title={`Restock: ${item.name}`}
        size="md"
      >
        <RestockForm
          onSubmit={handleRestock}
          currentQuantity={item.quantity}
          unit={item.unit}
        />
      </Modal>

      {/* Consume Modal */}
      <Modal
        isOpen={isConsumeModalOpen}
        onClose={() => !isSubmitting && setIsConsumeModalOpen(false)}
        title={`Use Item: ${item.name}`}
        size="md"
      >
        <ConsumeForm
          onSubmit={handleConsume}
          currentQuantity={item.quantity}
          unit={item.unit}
          vehicles={vehicles}
        />
      </Modal>
    </div>
  );
}




