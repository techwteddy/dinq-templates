"use client";

import { useState } from "react";

export function ImageGallery({
  images,
  title,
}: {
  images: { url: string }[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl">
        <img
          src={images[selected].url}
          alt={`${title} - Photo ${selected + 1}`}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`View photo ${i + 1}`}
              className={`shrink-0 overflow-hidden rounded-lg ${
                i === selected
                  ? "ring-2 ring-pine"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="h-16 w-24 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
