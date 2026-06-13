"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import { createReview } from "@/app/profile/actions";

export function ReviewForm({ ownerId }: { ownerId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError("");

    const result = await createReview(ownerId, rating, comment);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-pine/5 px-4 py-3 text-sm text-pine-muted">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Review submitted successfully!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-bark-light">Rating</label>
        <div className="mt-1.5">
          <StarRating rating={rating} interactive onChange={setRating} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-bark-light">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          className="mt-1.5 w-full rounded-xl border border-stone/60 bg-cream px-4 py-3 text-sm text-bark placeholder:text-bark-light/50 focus:border-pine-muted focus:outline-none focus:ring-1 focus:ring-pine-muted transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-amber shadow-md shadow-pine/20 hover:bg-pine-light disabled:opacity-50 transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
