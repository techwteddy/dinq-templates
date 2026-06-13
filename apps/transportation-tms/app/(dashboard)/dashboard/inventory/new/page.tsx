import { createInventoryItem } from "@/app/actions/inventory";
import { redirect } from "next/navigation";

export default function NewInventoryItemPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createInventoryItem(formData);
    if (result.success) {
      redirect("/dashboard/inventory");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Add New Inventory Item</h1>
      <form action={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Item Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Engine Oil"
          />
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Initial Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="0"
            defaultValue="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Liters, Pieces, Bottles"
          />
        </div>

        <div>
          <label
            htmlFor="reorder_level"
            className="block text-sm font-medium text-gray-700"
          >
            Reorder Level
          </label>
          <input
            type="number"
            id="reorder_level"
            name="reorder_level"
            min="0"
            defaultValue="5"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            System will alert when stock drops below this level
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Create Item
          </button>
          <a
            href="/dashboard/inventory"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}



