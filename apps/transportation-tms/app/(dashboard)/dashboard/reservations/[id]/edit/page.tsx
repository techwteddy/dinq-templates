import { getReservation, updateReservation } from "@/app/actions/reservations";
import { getAvailableVehicles, getAvailableDrivers } from "@/app/actions/availability";
import { ReservationForm } from "@/components/forms/reservation-form";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { formatToDatetimeLocal } from "@/lib/date-utils";

export default async function EditReservationPage({
  params,
}: {
  params: { id: string };
}) {
  const reservation = await getReservation(params.id);

  if (!reservation) {
    notFound();
  }

  // Get available vehicles and drivers for the reservation time range
  const availableVehicles = await getAvailableVehicles(
    reservation.start_time,
    reservation.end_time
  );
  const availableDrivers = await getAvailableDrivers(
    reservation.start_time,
    reservation.end_time
  );

  // Include the current vehicle and driver in the available lists
  const allVehicles = reservation.vehicle
    ? [...availableVehicles, reservation.vehicle]
    : availableVehicles;
  const allDrivers = reservation.driver
    ? [...availableDrivers, reservation.driver]
    : availableDrivers;

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await updateReservation(params.id, formData);
    if (result.success) {
      redirect("/dashboard/reservations");
    } else {
      console.error(result.error);
    }
  }

  // Format datetime-local values in GMT+8
  const startTimeLocal = formatToDatetimeLocal(reservation.start_time);
  const endTimeLocal = formatToDatetimeLocal(reservation.end_time);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Edit Reservation</h1>
      <ReservationForm
        onSubmit={handleSubmit}
        availableVehicles={allVehicles}
        availableDrivers={allDrivers}
        defaultValues={{
          department_name: reservation.department_name,
          requestor_name: reservation.requestor_name,
          purpose: reservation.purpose,
          departure_area: reservation.departure_area,
          destination: reservation.destination,
          start_time: startTimeLocal,
          end_time: endTimeLocal,
          vehicle_id: reservation.vehicle_id || undefined,
          driver_id: reservation.driver_id || undefined,
          approval_letter_url: reservation.approval_letter_url,
        }}
      />
    </div>
  );
}



