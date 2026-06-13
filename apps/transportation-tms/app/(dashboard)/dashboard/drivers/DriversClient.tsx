"use client";

import { useState } from "react";
import { Driver } from "@/lib/types";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { DriverForm } from "@/components/forms/driver-form";
import { DriverDetailView } from "@/components/driver-detail-view";
import { createDriver, updateDriver } from "@/app/actions/drivers";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/ui/alert-provider";

interface DriversClientProps {
  drivers: Driver[];
}

const ITEMS_PER_PAGE = 10;

export default function DriversClient({ drivers }: DriversClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useAlert();

  const handleAddSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await createDriver(formData);
      if (result.success) {
        showSuccess("Driver created successfully!", "Success");
        setIsAddModalOpen(false);
        router.refresh();
      } else {
        showError(result.error || "Failed to create driver", "Error");
      }
    } catch (error) {
      showError("An error occurred while creating the driver", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    if (!selectedDriver) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateDriver(selectedDriver.id, formData);
      if (result.success) {
        showSuccess("Driver updated successfully!", "Success");
        setIsEditModalOpen(false);
        setSelectedDriver(null);
        router.refresh();
      } else {
        showError(result.error || "Failed to update driver", "Error");
      }
    } catch (error) {
      showError("An error occurred while updating the driver", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsViewModalOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsEditModalOpen(true);
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.license_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 when search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search by name or license..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 whitespace-nowrap"
        >
          + Add Driver
        </button>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                License No
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
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12">
                  <EmptyState
                    title={searchQuery ? "No drivers found" : "No drivers yet"}
                    description={
                      searchQuery
                        ? "Try adjusting your search terms"
                        : "Get started by adding your first driver"
                    }
                    action={
                      searchQuery
                        ? undefined
                        : {
                            label: "+ Add Driver",
                            onClick: () => setIsAddModalOpen(true),
                          }
                    }
                  />
                </td>
              </tr>
            ) : (
              paginatedDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {driver.photo_url ? (
                        <img
                          src={driver.photo_url}
                          alt={driver.name}
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <Avatar name={driver.name} size="md" />
                      )}
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {driver.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {driver.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                      {driver.license_no}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <StatusBadge status={driver.status} type="driver" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleView(driver)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(driver)}
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
          totalItems={filteredDrivers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemName="drivers"
        />
      </div>

      {/* Add Driver Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        title="Add New Driver"
        size="md"
      >
        <DriverForm onSubmit={handleAddSubmit} />
      </Modal>

      {/* View Driver Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedDriver ? `Driver Details: ${selectedDriver.name}` : "Driver Details"}
        size="xl"
      >
        {selectedDriver && <DriverDetailView driver={selectedDriver} />}
      </Modal>

      {/* Edit Driver Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isSubmitting && setIsEditModalOpen(false)}
        title={selectedDriver ? `Edit Driver: ${selectedDriver.name}` : "Edit Driver"}
        size="md"
      >
        {selectedDriver && (
          <DriverForm
            onSubmit={handleEditSubmit}
            defaultValues={{
              name: selectedDriver.name,
              license_no: selectedDriver.license_no,
              status: selectedDriver.status,
              license_image_url: selectedDriver.license_image_url,
              photo_url: selectedDriver.photo_url,
            }}
          />
        )}
      </Modal>
    </>
  );
}
