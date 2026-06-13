"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useRef } from "react";

type UploadedImage = {
  storage_path: string;
  preview_url: string;
};

export function ImageUploader({
  userId,
  listingId,
  existingImages = [],
  onImagesChange,
}: {
  userId: string;
  listingId: string;
  existingImages?: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
}) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const uploadFiles = async (files: FileList) => {
    if (images.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    setUploading(true);
    const newImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${listingId}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("listing-images")
        .upload(path, file);

      if (!error) {
        const { data } = supabase.storage
          .from("listing-images")
          .getPublicUrl(path);

        newImages.push({
          storage_path: path,
          preview_url: data.publicUrl,
        });
      }
    }

    const updated = [...images, ...newImages];
    setImages(updated);
    onImagesChange(updated);
    setUploading(false);
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    await supabase.storage.from("listing-images").remove([image.storage_path]);

    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <div key={img.storage_path} className="group relative aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={img.preview_url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 rounded-full bg-black/50 p-1.5 text-white opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                Cover
              </span>
            )}
          </div>
        ))}

        {images.length < 10 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-emerald-400 hover:text-emerald-500 disabled:opacity-50"
          >
            {uploading ? (
              <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="mt-1 block text-xs">Add Photo</span>
              </div>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        className="hidden"
      />

      <p className="mt-2 text-xs text-gray-500">
        {images.length}/10 images. First image is the cover photo.
      </p>
    </div>
  );
}
