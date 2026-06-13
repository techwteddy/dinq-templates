"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import { MapView } from "./MapView";
import { PROPERTY_TYPES, BARANGAYS } from "@/lib/utils/constants";
import type { Listing, ListingImage } from "@/lib/types/database";

type ListingFormProps = {
  userId: string;
  listing?: Listing & { listing_images: ListingImage[] };
  action: (formData: FormData) => Promise<{ error?: string; id?: string }>;
};

export function ListingForm({ userId, listing, action }: ListingFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formValid, setFormValid] = useState(!!listing);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(listing?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(listing?.longitude ?? null);
  const [imagePaths, setImagePaths] = useState<string[]>(
    listing?.listing_images?.map((img) => img.storage_path) ?? []
  );

  const isEditing = !!listing;
  const listingId = listing?.id ?? crypto.randomUUID();

  // Store initial values for comparison (edit mode only)
  const initialValues = useRef({
    latitude: listing?.latitude ?? null,
    longitude: listing?.longitude ?? null,
    imagePaths: listing?.listing_images?.map((img) => img.storage_path) ?? [],
  });

  const checkFormValid = useCallback((images: string[] = imagePaths) => {
    if (!formRef.current) return;
    const valid = formRef.current.checkValidity() && images.length > 0;
    setFormValid(valid);
  }, [imagePaths]);

  const checkForChanges = useCallback(() => {
    if (!isEditing || !formRef.current) return;
    const form = formRef.current;
    const fields: [string, string | undefined][] = [
      ["title", listing.title],
      ["description", listing.description],
      ["property_type", listing.property_type],
      ["price_monthly", String(listing.price_monthly)],
      ["bedrooms", String(listing.bedrooms)],
      ["bathrooms", String(listing.bathrooms)],
      ["area_sqm", listing.area_sqm ? String(listing.area_sqm) : ""],
      ["availability", listing.availability],
      ["furnished", listing.furnished],
      ["pet_friendly", listing.pet_friendly ? "yes" : "no"],
      ["parking", listing.parking ? "yes" : "no"],
      ["address_line", listing.address_line],
      ["barangay", listing.barangay],
    ];

    const formChanged = fields.some(([name, original]) => {
      const formData = new FormData(form);
      return formData.get(name) !== original;
    });

    const coordsChanged =
      latitude !== initialValues.current.latitude ||
      longitude !== initialValues.current.longitude;

    const imagesChanged =
      JSON.stringify(imagePaths) !== JSON.stringify(initialValues.current.imagePaths);

    setHasChanges(formChanged || coordsChanged || imagesChanged);
  }, [isEditing, listing, latitude, longitude, imagePaths]);

  const handleCancel = () => {
    if (isEditing ? hasChanges : hasAnyInput()) {
      setShowCancelModal(true);
      return;
    }
    router.back();
  };

  const hasAnyInput = () => {
    if (!formRef.current) return false;
    const form = formRef.current;
    const title = (form.elements.namedItem("title") as HTMLInputElement)?.value;
    const desc = (form.elements.namedItem("description") as HTMLTextAreaElement)?.value;
    return !!(title || desc || imagePaths.length > 0 || latitude || longitude);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imagePaths.length === 0) {
      setError("Please upload at least 1 photo.");
      return;
    }
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("id", listingId);
    formData.set("latitude", latitude?.toString() ?? "");
    formData.set("longitude", longitude?.toString() ?? "");
    formData.set("image_paths", JSON.stringify(imagePaths));

    const result = await action(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push(`/listings/${result.id}`);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} onChange={() => { checkForChanges(); checkFormValid(); }} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          required
          defaultValue={listing?.title}
          placeholder="e.g., Cozy 2BR Apartment near Session Road"
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={listing?.description}
          placeholder="Describe the property, amenities, nearby landmarks..."
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>

      {/* Type + Price */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-bark">
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            name="property_type"
            required
            defaultValue={listing?.property_type ?? ""}
            className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
          >
            <option value="" disabled>Select type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-bark">
            Monthly Rent (PHP) <span className="text-red-500">*</span>
          </label>
          <input
            name="price_monthly"
            type="number"
            required
            min="0"
            step="100"
            defaultValue={listing?.price_monthly}
            placeholder="e.g., 8000"
            className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
          />
        </div>
      </div>

      {/* Bedrooms + Bathrooms + Area */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-bark">
            Bedrooms <span className="text-red-500">*</span>
          </label>
          <input
            name="bedrooms"
            type="number"
            required
            min="0"
            defaultValue={listing?.bedrooms ?? 0}
            className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
          />
          <p className="mt-1 text-xs text-bark-light">If unit is studio, put 0</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-bark">
            Bathrooms <span className="text-red-500">*</span>
          </label>
          <input
            name="bathrooms"
            type="number"
            required
            min="0"
            defaultValue={listing?.bathrooms ?? 0}
            className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bark">
            Area (sqm) <span className="text-red-500">*</span>
          </label>
          <input
            name="area_sqm"
            type="number"
            required
            min="1"
            step="0.5"
            defaultValue={listing?.area_sqm ?? ""}
            className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Availability Status <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex flex-wrap gap-3">
          {[
            { value: "available", label: "Available", color: "border-emerald-300 bg-emerald-50 text-emerald-700 peer-checked:ring-2 peer-checked:ring-emerald-500" },
            { value: "reserved", label: "Reserved", color: "border-amber-300 bg-amber-50 text-amber-700 peer-checked:ring-2 peer-checked:ring-amber-500" },
            { value: "occupied", label: "Occupied", color: "border-red-300 bg-red-50 text-red-700 peer-checked:ring-2 peer-checked:ring-red-500" },
          ].map(({ value, color, label }) => (
            <label key={value} className="relative cursor-pointer">
              <input
                type="radio"
                name="availability"
                value={value}
                defaultChecked={listing ? listing.availability === value : value === "available"}
                className="peer sr-only"
              />
              <span className={`block rounded-lg border px-4 py-2 text-sm font-medium transition-all ${color}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Furnished Status */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Furnishing <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex flex-wrap gap-3">
          {[
            { value: "unfurnished", label: "Unfurnished" },
            { value: "semi_furnished", label: "Semi-furnished" },
            { value: "fully_furnished", label: "Fully Furnished" },
          ].map(({ value, label }) => (
            <label key={value} className="relative cursor-pointer">
              <input
                type="radio"
                name="furnished"
                value={value}
                defaultChecked={listing ? listing.furnished === value : value === "unfurnished"}
                className="peer sr-only"
              />
              <span className="block rounded-lg border border-stone px-4 py-2 text-sm font-medium text-bark-light transition-all peer-checked:border-blue-400 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-2 peer-checked:ring-blue-500">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Pet-friendly */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Pet-friendly <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex gap-3">
          {[
            { value: "yes", label: "Yes", color: "peer-checked:border-emerald-400 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:ring-2 peer-checked:ring-emerald-500" },
            { value: "no", label: "No", color: "peer-checked:border-red-400 peer-checked:bg-red-50 peer-checked:text-red-700 peer-checked:ring-2 peer-checked:ring-red-500" },
          ].map(({ value, label, color }) => (
            <label key={value} className="relative cursor-pointer">
              <input
                type="radio"
                name="pet_friendly"
                value={value}
                defaultChecked={listing ? (value === "yes") === listing.pet_friendly : value === "no"}
                className="peer sr-only"
              />
              <span className={`block rounded-lg border border-stone px-5 py-2 text-sm font-medium text-bark-light transition-all ${color}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Dedicated Parking */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Dedicated Parking <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex gap-3">
          {[
            { value: "yes", label: "Yes", color: "peer-checked:border-emerald-400 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:ring-2 peer-checked:ring-emerald-500" },
            { value: "no", label: "No", color: "peer-checked:border-red-400 peer-checked:bg-red-50 peer-checked:text-red-700 peer-checked:ring-2 peer-checked:ring-red-500" },
          ].map(({ value, label, color }) => (
            <label key={value} className="relative cursor-pointer">
              <input
                type="radio"
                name="parking"
                value={value}
                defaultChecked={listing ? (value === "yes") === listing.parking : value === "no"}
                className="peer sr-only"
              />
              <span className={`block rounded-lg border border-stone px-5 py-2 text-sm font-medium text-bark-light transition-all ${color}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          name="address_line"
          required
          defaultValue={listing?.address_line}
          placeholder="e.g., 123 Session Road"
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>

      {/* Barangay */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Barangay <span className="text-red-500">*</span>
        </label>
        <select
          name="barangay"
          required
          defaultValue={listing?.barangay ?? ""}
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        >
          <option value="" disabled>Select barangay</option>
          {BARANGAYS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Location on Map
        </label>
        <p className="mb-2 text-xs text-bark-light">Click the map to set the property location</p>
        <MapView
          latitude={latitude}
          longitude={longitude}
          interactive
          onLocationSelect={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
            setHasChanges(true);
          }}
        />
        {latitude && longitude && (
          <p className="mt-1 text-xs text-bark-light">
            Selected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        )}
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-bark">
          Photos <span className="text-red-500">*</span>
        </label>
        <div className="mt-2">
          <ImageUploader
            userId={userId}
            listingId={listingId}
            existingImages={listing?.listing_images?.map((img) => ({
              storage_path: img.storage_path,
              preview_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${img.storage_path}`,
            })) ?? []}
            onImagesChange={(images) => {
              const paths = images.map((img) => img.storage_path);
              setImagePaths(paths);
              checkFormValid(paths);
              if (isEditing) {
                setHasChanges(
                  JSON.stringify(paths) !== JSON.stringify(initialValues.current.imagePaths)
                );
              }
            }}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting || !formValid || (isEditing && !hasChanges)}
          className="rounded-lg bg-pine px-6 py-3 text-sm font-medium text-amber hover:bg-pine-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting
            ? "Saving..."
            : isEditing
              ? "Update Listing"
              : "Publish Listing"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg border border-stone px-6 py-3 text-sm font-medium text-bark-light hover:bg-mist"
        >
          Cancel
        </button>
      </div>
      {showCancelModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-warm-white p-6 shadow-2xl animate-fade-up">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber/15">
              <svg className="h-6 w-6 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="mt-4 text-center font-[family-name:var(--font-display)] text-lg text-pine">
              Discard changes?
            </h3>
            <p className="mt-2 text-center text-sm text-bark-light">
              You have unsaved changes. If you leave now, your changes will not be saved.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-xl border border-stone px-4 py-3 text-sm font-medium text-bark hover:bg-mist transition-colors"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  router.back();
                }}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </form>
  );
}
