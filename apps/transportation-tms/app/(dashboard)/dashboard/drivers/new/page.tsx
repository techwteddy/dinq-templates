import { createDriver } from "@/app/actions/drivers";
import { redirect } from "next/navigation";

export default function NewDriverPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createDriver(formData);
    if (result.success) {
      redirect("/dashboard/drivers");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Add New Driver</h1>
      <form action={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="license_no"
            className="block text-sm font-medium text-gray-700"
          >
            License Number
          </label>
          <input
            type="text"
            id="license_no"
            name="license_no"
            required
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="available">Available</option>
            <option value="on_trip">On Trip</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Create Driver
          </button>
          <a
            href="/dashboard/drivers"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}



