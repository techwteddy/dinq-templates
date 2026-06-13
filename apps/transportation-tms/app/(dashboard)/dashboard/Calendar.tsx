"use client";

import { Reservation } from "@/lib/types";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from "date-fns";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { ReservationDetailView } from "@/components/reservation-detail-view";
import { ReservationForm } from "@/components/forms/reservation-form";
import DailyDriverSchedule from "@/components/daily-driver-schedule";
import { getReservation, updateReservation, getReservationsByDate } from "@/app/actions/reservations";
import { getAvailableVehicles, getAvailableDrivers } from "@/app/actions/availability";
import { toGMT8, nowGMT8, formatToDatetimeLocal } from "@/lib/date-utils";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/ui/alert-provider";

interface CalendarProps {
  reservations: Reservation[];
}

export default function Calendar({ reservations }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(nowGMT8());
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduleReservations, setScheduleReservations] = useState<Reservation[]>([]);
  const [loadingReservation, setLoadingReservation] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [loadingEditData, setLoadingEditData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useAlert();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getReservationsForDay = (day: Date) => {
    return reservations.filter((reservation) => {
      const reservationDate = toGMT8(reservation.start_time);
      return isSameDay(reservationDate, day);
    });
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(nowGMT8());
  };

  const handleReservationClick = async (reservationId: string) => {
    setLoadingReservation(true);
    setIsViewModalOpen(true);
    try {
      const reservation = await getReservation(reservationId);
      setSelectedReservation(reservation);
    } catch (error) {
      console.error("Failed to load reservation:", error);
      showError("Failed to load reservation details", "Error");
    } finally {
      setLoadingReservation(false);
    }
  };

  const handleEditClick = async () => {
    if (!selectedReservation) return;
    
    setLoadingEditData(true);
    setIsEditModalOpen(true);
    setIsViewModalOpen(false);
    
    try {
      // Fetch available vehicles and drivers for the reservation time range
      const [vehicles, drivers] = await Promise.all([
        getAvailableVehicles(selectedReservation.start_time, selectedReservation.end_time),
        getAvailableDrivers(selectedReservation.start_time, selectedReservation.end_time),
      ]);

      // Include the current vehicle and driver in the available lists
      const allVehicles = selectedReservation.vehicle
        ? [...vehicles, selectedReservation.vehicle]
        : vehicles;
      const allDrivers = selectedReservation.driver
        ? [...drivers, selectedReservation.driver]
        : drivers;

      setAvailableVehicles(allVehicles);
      setAvailableDrivers(allDrivers);
    } catch (error) {
      console.error("Failed to load edit data:", error);
      showError("Failed to load edit form data", "Error");
      setIsEditModalOpen(false);
    } finally {
      setLoadingEditData(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    if (!selectedReservation) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateReservation(selectedReservation.id, formData);
      if (result.success) {
        showSuccess("Reservation updated successfully!", "Success");
        setIsEditModalOpen(false);
        setSelectedReservation(null);
        router.refresh();
      } else {
        showError(result.error || "Failed to update reservation", "Error");
      }
    } catch (error) {
      console.error("Failed to update reservation:", error);
      showError("Failed to update reservation", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateClick = async (day: Date, event: React.MouseEvent) => {
    // Don't trigger if clicking on a reservation button
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }

    setLoadingSchedule(true);
    setIsScheduleModalOpen(true);
    setSelectedDate(day);
    
    try {
      const reservations = await getReservationsByDate(day.toISOString());
      setScheduleReservations(reservations);
    } catch (error) {
      console.error("Failed to load schedule:", error);
      showError("Failed to load daily schedule", "Error");
      setIsScheduleModalOpen(false);
    } finally {
      setLoadingSchedule(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={previousMonth}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ←
          </button>
          <button
            onClick={nextMonth}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day) => {
            const dayReservations = getReservationsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth ? "bg-gray-50" : ""
                }`}
                onClick={(e) => handleDateClick(day, e)}
                title="Click to view daily schedule"
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className={`text-sm font-medium ${
                      !isCurrentMonth
                        ? "text-gray-400"
                        : isTodayDate
                        ? "text-blue-600 font-bold"
                        : "text-gray-900"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  {dayReservations.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(day, e);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      title="View daily schedule"
                    >
                      📋
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {dayReservations.slice(0, 3).map((reservation) => (
                    <button
                      key={reservation.id}
                      onClick={() => handleReservationClick(reservation.id)}
                      className="w-full text-left"
                    >
                      <div
                        className="text-xs p-1 rounded bg-blue-100 hover:bg-blue-200 border-l-2 border-blue-500 cursor-pointer"
                        title={`${reservation.department_name} - ${reservation.destination}`}
                      >
                        <div className="font-medium text-blue-900 truncate">
                          {format(toGMT8(reservation.start_time), "h:mm a")}
                        </div>
                        <div className="text-blue-700 truncate">
                          {reservation.department_name}
                        </div>
                        {reservation.vehicle && (
                          <div className="text-blue-600 truncate text-[10px]">
                            {reservation.vehicle.plate_number}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  {dayReservations.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayReservations.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 px-6 py-3 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-l-2 border-blue-500 rounded"></div>
              <span className="text-gray-600">Reservation</span>
            </div>
          </div>
          <Link
            href="/dashboard/reservations/new"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            + New Reservation
          </Link>
        </div>
      </div>

      {/* View Reservation Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedReservation(null);
        }}
        title={selectedReservation ? `Reservation Details: ${selectedReservation.department_name}` : "Reservation Details"}
        size="xl"
      >
        {loadingReservation ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading reservation details...</div>
          </div>
        ) : selectedReservation ? (
          <ReservationDetailView 
            reservation={selectedReservation} 
            onEdit={handleEditClick}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            Reservation not found
          </div>
        )}
      </Modal>

      {/* Edit Reservation Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isSubmitting && !loadingEditData && setIsEditModalOpen(false)}
        title={selectedReservation ? `Edit Reservation: ${selectedReservation.department_name}` : "Edit Reservation"}
        size="xl"
      >
        {loadingEditData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading edit form...</div>
          </div>
        ) : selectedReservation ? (
          <ReservationForm
            onSubmit={handleEditSubmit}
            availableVehicles={availableVehicles}
            availableDrivers={availableDrivers}
            defaultValues={{
              department_name: selectedReservation.department_name,
              requestor_name: selectedReservation.requestor_name,
              purpose: selectedReservation.purpose,
              departure_area: selectedReservation.departure_area,
              destination: selectedReservation.destination,
              start_time: formatToDatetimeLocal(selectedReservation.start_time),
              end_time: formatToDatetimeLocal(selectedReservation.end_time),
              vehicle_id: selectedReservation.vehicle_id || undefined,
              driver_id: selectedReservation.driver_id || undefined,
              approval_letter_url: selectedReservation.approval_letter_url,
            }}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            Reservation not found
          </div>
        )}
      </Modal>

      {/* Daily Schedule Modal */}
      {isScheduleModalOpen && selectedDate && (
        <DailyDriverSchedule
          date={selectedDate}
          reservations={scheduleReservations}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setSelectedDate(null);
            setScheduleReservations([]);
          }}
        />
      )}
    </div>
  );
}

