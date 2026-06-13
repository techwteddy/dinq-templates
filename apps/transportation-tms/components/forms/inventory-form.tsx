"use client";

interface InventoryFormProps {
  onSubmit: (formData: FormData) => void;
  defaultValues?: {
    name?: string;
    quantity?: number;
    unit?: string;
    reorder_level?: number;
  };
}

export function InventoryForm({ onSubmit, defaultValues }: InventoryFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-900"
        >
          Item Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-900"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            defaultValue={defaultValues?.quantity}
            required
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-900"
          >
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            defaultValue={defaultValues?.unit}
            required
            placeholder="e.g., liters, pieces, boxes"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="reorder_level"
          className="block text-sm font-medium text-gray-900"
        >
          Reorder Level
        </label>
        <input
          type="number"
          id="reorder_level"
          name="reorder_level"
          defaultValue={defaultValues?.reorder_level || 5}
          required
          min="1"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Alert when quantity falls below this level
        </p>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          {defaultValues ? "Update Item" : "Create Item"}
        </button>
      </div>
    </form>
  );
}




