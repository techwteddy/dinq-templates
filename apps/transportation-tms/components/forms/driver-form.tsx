"use client";

import { useState } from "react";

interface DriverFormProps {
  onSubmit: (formData: FormData) => void;
  defaultValues?: {
    name?: string;
    license_no?: string;
    status?: string;
    license_image_url?: string | null;
    photo_url?: string | null;
  };
}

export function DriverForm({ onSubmit, defaultValues }: DriverFormProps) {
  const [licensePreview, setLicensePreview] = useState<string | null>(defaultValues?.license_image_url || null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(defaultValues?.photo_url || null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-900"
        >
          Driver Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="license_no"
          className="block text-sm font-medium text-gray-900"
        >
          License Number
        </label>
        <input
          type="text"
          id="license_no"
          name="license_no"
          defaultValue={defaultValues?.license_no}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-900"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={defaultValues?.status || "available"}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="available">Available</option>
          <option value="on_trip">On Trip</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="license_image"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Driver&apos;s License
          </label>
          <input
            type="file"
            id="license_image"
            name="license_image"
            accept="image/*"
            onChange={handleLicenseChange}
            className="hidden"
          />
          <label
            htmlFor="license_image"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Upload License
          </label>
          {(licensePreview || defaultValues?.license_image_url) && (
            <div className="mt-2">
              <img
                src={licensePreview || defaultValues?.license_image_url || ""}
                alt="License Preview"
                className="h-48 w-full object-contain rounded border border-gray-300 bg-gray-50"
              />
              {defaultValues?.license_image_url && !licensePreview && (
                <p className="mt-1 text-xs text-gray-500">Current document</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Driver&apos;s Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <label
            htmlFor="photo"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Upload Photo
          </label>
          {(photoPreview || defaultValues?.photo_url) && (
            <div className="mt-2">
              <img
                src={photoPreview || defaultValues?.photo_url || ""}
                alt="Photo Preview"
                className="h-48 w-full object-contain rounded border border-gray-300 bg-gray-50"
              />
              {defaultValues?.photo_url && !photoPreview && (
                <p className="mt-1 text-xs text-gray-500">Current photo</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          {defaultValues ? "Update Driver" : "Create Driver"}
        </button>
      </div>
    </form>
  );
}

