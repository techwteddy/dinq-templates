"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
        ☕
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="text-gray-500 max-w-sm">
          We spilled the coffee on our end. Please try again or head back home.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-2.5 rounded-full font-medium transition"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
