import { getVehicle, updateVehicle } from "@/app/actions/vehicles";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function EditVehiclePage({
  params,
}: {
  params: { id: string };
}) {
  const vehicle = await getVehicle(params.id);

  if (!vehicle) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await updateVehicle(params.id, formData);
    if (result.success) {
      redirect("/dashboard/vehicles");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Edit Vehicle</h1>
      <form action={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label
            htmlFor="plate_number"
            className="block text-sm font-medium text-gray-700"
          >
            Plate Number
          </label>
          <input
            type="text"
            id="plate_number"
            name="plate_number"
            defaultValue={vehicle.plate_number}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="capacity"
            className="block text-sm font-medium text-gray-700"
          >
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            defaultValue={vehicle.capacity}
            required
            min="1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={vehicle.status}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Update Vehicle
          </button>
          <a
            href="/dashboard/vehicles"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}



