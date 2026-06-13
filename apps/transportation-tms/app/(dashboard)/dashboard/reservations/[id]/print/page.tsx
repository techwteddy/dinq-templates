import { getReservation } from "@/app/actions/reservations";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";
import "./print-styles.css";
import { formatGMT8 } from "@/lib/date-utils";

export default async function PrintTripTicketPage({
  params,
}: {
  params: { id: string };
}) {
  const reservation = await getReservation(params.id);

  if (!reservation) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      {/* THE TICKET CONTAINER */}
      <div className="w-[210mm] min-h-[297mm] bg-white border shadow-lg p-10 print:w-full print:h-full print:shadow-none print:border-none print:m-0 print:absolute print:top-0 print:left-0 print:z-50 text-black ticket-container">
        <div className="border-2 border-black p-8 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold mb-4 uppercase text-center text-black">
            Trip Ticket
          </h1>

          <div className="space-y-4 text-black">
            <div className="flex justify-between border-b border-black pb-2">
              <span className="font-bold text-black">Driver:</span>
              <span className="text-black">{reservation.driver?.name || "N/A"}</span>
            </div>

            <div className="flex justify-between border-b border-black pb-2">
              <span className="font-bold text-black">Date:</span>
              <span className="text-black">
                {formatGMT8(reservation.start_time, "MMMM dd, yyyy")}
              </span>
            </div>

            <div className="flex justify-between border-b border-black pb-2">
              <span className="font-bold text-black">Department:</span>
              <span className="text-black">{reservation.department_name}</span>
            </div>

            <div className="flex justify-between border-b border-black pb-2">
              <span className="font-bold text-black">Requestor:</span>
              <span className="text-black">{reservation.requestor_name}</span>
            </div>

            <div className="py-2 border-b border-black">
              <div className="font-bold mb-1 text-black">Purpose:</div>
              <div className="text-sm text-black">{reservation.purpose}</div>
            </div>

            <div className="py-2 border-b border-black">
              <div className="font-bold mb-1 text-black">Route:</div>
              <div className="text-black">
                [{reservation.departure_area}] <span className="mx-2">to</span> [
                {reservation.destination}]
              </div>
            </div>

            <div className="flex justify-between pt-2 border-b border-black pb-2">
              <div className="text-black">
                <span className="font-bold text-black">Departure:</span>{" "}
                {formatGMT8(reservation.start_time, "h:mm a")}
              </div>
              <div className="text-black">
                <span className="font-bold text-black">Return:</span>{" "}
                {formatGMT8(reservation.end_time, "h:mm a")}
              </div>
            </div>

            {reservation.vehicle && (
              <div className="flex justify-between border-t border-black pt-2 mt-2">
                <span className="font-bold text-black">Vehicle:</span>
                <span className="text-black">{reservation.vehicle.plate_number}</span>
                {reservation.vehicle.vehicle_type && (
                  <span className="text-sm text-black ml-2">
                    ({reservation.vehicle.vehicle_type})
                  </span>
                )}
              </div>
            )}

            {reservation.driver && (
              <div className="flex justify-between border-t border-black pt-2 mt-2">
                <span className="font-bold text-black">Driver License:</span>
                <span className="text-black">{reservation.driver.license_no}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-black text-center text-xs text-black">
            <p>This is an official trip ticket. Please present to the driver.</p>
          </div>
        </div>
      </div>

      {/* THE PRINT BUTTON (Hidden when printing) */}
      <div className="mt-8 print:hidden">
        <PrintButton reservation={reservation} />
      </div>
    </div>
  );
}



