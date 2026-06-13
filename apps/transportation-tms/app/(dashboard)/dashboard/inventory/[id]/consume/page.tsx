import { getInventoryItem, consumeItem } from "@/app/actions/inventory";
import { getVehicles } from "@/app/actions/vehicles";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function ConsumeItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getInventoryItem(params.id);
  const vehicles = await getVehicles();

  if (!item) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await consumeItem(params.id, formData);
    if (result.success) {
      redirect(`/dashboard/inventory/${params.id}`);
    } else {
      console.error(result.error);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">
        Use Item: {item.name}
      </h1>
      <form action={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount to Use
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            min="1"
            max={item.quantity}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Available: {item.quantity} {item.unit}
          </p>
        </div>

        <div>
          <label
            htmlFor="vehicle_id"
            className="block text-sm font-medium text-gray-700"
          >
            Vehicle (Optional)
          </label>
          <select
            id="vehicle_id"
            name="vehicle_id"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate_number}
              </option>
            ))}
          </select>
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
            placeholder="e.g., Oil change for vehicle"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
          >
            Use Item
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



