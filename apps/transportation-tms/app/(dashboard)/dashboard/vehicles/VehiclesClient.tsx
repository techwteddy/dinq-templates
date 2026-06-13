"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/types";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { VehicleForm } from "@/components/forms/vehicle-form";
import { VehicleDetailView } from "@/components/vehicle-detail-view";
import { createVehicle, updateVehicle } from "@/app/actions/vehicles";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/ui/alert-provider";

interface VehiclesClientProps {
  vehicles: Vehicle[];
}

const ITEMS_PER_PAGE = 10;

export default function VehiclesClient({ vehicles }: VehiclesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useAlert();

  const handleAddSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await createVehicle(formData);
      if (result.success) {
        showSuccess("Vehicle created successfully!", "Success");
        setIsAddModalOpen(false);
        router.refresh();
      } else {
        showError(result.error || "Failed to create vehicle", "Error");
      }
    } catch (error) {
      showError("An error occurred while creating the vehicle", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    if (!selectedVehicle) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateVehicle(selectedVehicle.id, formData);
      if (result.success) {
        showSuccess("Vehicle updated successfully!", "Success");
        setIsEditModalOpen(false);
        setSelectedVehicle(null);
        router.refresh();
      } else {
        showError(result.error || "Failed to update vehicle", "Error");
      }
    } catch (error) {
      showError("An error occurred while updating the vehicle", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewModalOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.plate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vehicle.vehicle_type && vehicle.vehicle_type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Reset to page 1 when search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search by plate number or type..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 whitespace-nowrap"
        >
          + Add Vehicle
        </button>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Assigned Driver
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
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <EmptyState
                    title={searchQuery ? "No vehicles found" : "No vehicles yet"}
                    description={
                      searchQuery
                        ? "Try adjusting your search terms"
                        : "Get started by adding your first vehicle"
                    }
                    action={
                      searchQuery
                        ? undefined
                        : {
                            label: "+ Add Vehicle",
                            onClick: () => setIsAddModalOpen(true),
                          }
                    }
                  />
                </td>
              </tr>
            ) : (
              paginatedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {vehicle.plate_number}
                        </div>
                        <div className="text-xs text-gray-500">Vehicle ID: {vehicle.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {vehicle.vehicle_type || "Not specified"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 text-gray-400 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {vehicle.capacity} passengers
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {vehicle.assigned_driver ? (
                      <div className="flex items-center">
                        {vehicle.assigned_driver.photo_url ? (
                          <img
                            src={vehicle.assigned_driver.photo_url}
                            alt={vehicle.assigned_driver.name}
                            className="h-6 w-6 rounded-full object-cover border border-gray-200 mr-2"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium mr-2">
                            {vehicle.assigned_driver.name.substring(0, 1).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm">{vehicle.assigned_driver.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Unassigned</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <StatusBadge status={vehicle.status} type="vehicle" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleView(vehicle)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredVehicles.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemName="vehicles"
        />
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        title="Add New Vehicle"
        size="md"
      >
        <VehicleForm onSubmit={handleAddSubmit} />
      </Modal>

      {/* View Vehicle Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedVehicle ? `Vehicle Details: ${selectedVehicle.plate_number}` : "Vehicle Details"}
        size="xl"
      >
        {selectedVehicle && <VehicleDetailView vehicle={selectedVehicle} />}
      </Modal>

      {/* Edit Vehicle Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isSubmitting && setIsEditModalOpen(false)}
        title={selectedVehicle ? `Edit Vehicle: ${selectedVehicle.plate_number}` : "Edit Vehicle"}
        size="md"
      >
        {selectedVehicle && (
          <VehicleForm
            onSubmit={handleEditSubmit}
            defaultValues={{
              plate_number: selectedVehicle.plate_number,
              vehicle_type: selectedVehicle.vehicle_type,
              capacity: selectedVehicle.capacity,
              status: selectedVehicle.status,
              or_image_url: selectedVehicle.or_image_url,
              cr_image_url: selectedVehicle.cr_image_url,
            }}
          />
        )}
      </Modal>
    </>
  );
}
