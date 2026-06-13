import { createReservation } from "@/app/actions/reservations";
import { getAvailableVehicles, getAvailableDrivers } from "@/app/actions/availability";
import { ReservationForm } from "@/components/forms/reservation-form";
import { redirect } from "next/navigation";

export default async function NewReservationPage() {
  // Get all available vehicles and drivers initially
  // The final availability check will happen on form submit
  const availableVehicles = await getAvailableVehicles();
  const availableDrivers = await getAvailableDrivers();

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createReservation(formData);
    if (result.success) {
      redirect("/dashboard/reservations");
    } else {
      // Handle error - in a real app, you'd want to show this to the user
      console.error(result.error);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">New Reservation</h1>
      <ReservationForm
        onSubmit={handleSubmit}
        availableVehicles={availableVehicles}
        availableDrivers={availableDrivers}
      />
    </div>
  );
}

