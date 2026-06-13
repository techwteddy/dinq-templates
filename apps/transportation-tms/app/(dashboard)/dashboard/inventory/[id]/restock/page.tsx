import { getInventoryItem, restockItem } from "@/app/actions/inventory";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function RestockItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getInventoryItem(params.id);

  if (!item) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await restockItem(params.id, formData);
    if (result.success) {
      redirect(`/dashboard/inventory/${params.id}`);
    } else {
      console.error(result.error);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">
        Restock: {item.name}
      </h1>
      <form action={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount to Add
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            min="1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Current stock: {item.quantity} {item.unit}
          </p>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Restocked from supplier"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            Restock Item
          </button>
          <a
            href={`/dashboard/inventory/${params.id}`}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}



