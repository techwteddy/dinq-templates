"use client";

import { useState } from "react";
import Link from "next/link";
import { Reservation } from "@/lib/types";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { ReservationForm } from "@/components/forms/reservation-form";
import { ReservationDetailView } from "@/components/reservation-detail-view";
import { createReservation, getReservation } from "@/app/actions/reservations";
import { getAvailableVehicles, getAvailableDrivers } from "@/app/actions/availability";
import { isPast, isFuture } from "date-fns";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/ui/alert-provider";
import { formatGMT8, toGMT8, nowGMT8 } from "@/lib/date-utils";

interface ReservationsClientProps {
  reservations: Reservation[];
  availableVehicles: Array<{ id: string; plate_number: string; capacity: number }>;
  availableDrivers: Array<{ id: string; name: string; license_no: string }>;
}

type TabType = "all" | "upcoming" | "completed";

const ITEMS_PER_PAGE = 10;

export default function ReservationsClient({ 
  reservations, 
  availableVehicles, 
  availableDrivers 
}: ReservationsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [loadingReservation, setLoadingReservation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useAlert();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await createReservation(formData);
      if (result.success) {
        showSuccess("Reservation created successfully!", "Success");
        setIsModalOpen(false);
        router.refresh();
      } else {
        showError(result.error || "Failed to create reservation", "Error");
      }
    } catch (error) {
      showError("An error occurred while creating the reservation", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const now = nowGMT8();

  const filterByTab = (reservation: Reservation) => {
    const endTime = toGMT8(reservation.end_time);
    const startTime = toGMT8(reservation.start_time);

    if (activeTab === "upcoming") {
      return isFuture(startTime);
    }
    if (activeTab === "completed") {
      return isPast(endTime);
    }
    return true; // all
  };

  const filteredReservations = reservations
    .filter(filterByTab)
    .filter(
      (reservation) =>
        reservation.department_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.requestor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Reset to page 1 when search query or tab changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

  const upcomingCount = reservations.filter((r) => isFuture(toGMT8(r.start_time))).length;
  const completedCount = reservations.filter((r) => isPast(toGMT8(r.end_time))).length;

  const tabs = [
    { id: "all" as TabType, label: "All", count: reservations.length },
    { id: "upcoming" as TabType, label: "Upcoming", count: upcomingCount },
    { id: "completed" as TabType, label: "Completed", count: completedCount },
  ];

  const handleViewReservation = async (reservationId: string) => {
    setLoadingReservation(true);
    setIsViewModalOpen(true);
    try {
      const reservation = await getReservation(reservationId);
      setSelectedReservation(reservation);
    } catch (error) {
      showError("Failed to load reservation details", "Error");
      setIsViewModalOpen(false);
    } finally {
      setLoadingReservation(false);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search reservations..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 whitespace-nowrap"
        >
          + New Reservation
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 rounded-full px-2.5 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Requestor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Date/Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12">
                  <EmptyState
                    title={searchQuery ? "No reservations found" : "No reservations yet"}
                    description={
                      searchQuery
                        ? "Try adjusting your search terms"
                        : "Get started by creating your first reservation"
                    }
                    action={
                      searchQuery
                        ? undefined
                        : {
                            label: "+ New Reservation",
                            onClick: () => setIsModalOpen(true),
                          }
                    }
                  />
                </td>
              </tr>
            ) : (
              paginatedReservations.map((reservation) => {
                const startTime = toGMT8(reservation.start_time);
                const endTime = toGMT8(reservation.end_time);
                const isUpcoming = isFuture(startTime);
                const isCompleted = isPast(endTime);
                const isActive = !isUpcoming && !isCompleted;

                return (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {reservation.department_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {reservation.requestor_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="truncate">{reservation.departure_area}</span>
                        <svg
                          className="mx-2 h-4 w-4 text-gray-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <span className="truncate">{reservation.destination}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="font-medium text-gray-900">
                        {formatGMT8(reservation.start_time, "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatGMT8(reservation.start_time, "h:mm a")} - {formatGMT8(reservation.end_time, "h:mm a")}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {reservation.vehicle?.plate_number || (
                        <span className="text-gray-400 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {isActive && (
                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Active
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Upcoming
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleViewReservation(reservation.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredReservations.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemName="reservations"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="New Reservation"
        size="xl"
      >
        <ReservationForm
          onSubmit={handleSubmit}
          availableVehicles={availableVehicles}
          availableDrivers={availableDrivers}
        />
      </Modal>

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
          <ReservationDetailView reservation={selectedReservation} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            Reservation not found
          </div>
        )}
      </Modal>
    </>
  );
}

