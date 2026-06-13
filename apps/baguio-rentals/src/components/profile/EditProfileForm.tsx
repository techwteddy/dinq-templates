"use client";

import { useState } from "react";
import { updateProfile } from "@/app/profile/actions";
import type { Profile } from "@/lib/types/database";

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profile updated!" });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-bark">
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile.full_name}
          required
          className="mt-1.5 w-full rounded-xl border border-stone/60 bg-cream px-4 py-2.5 text-sm text-bark placeholder:text-bark-light/50 focus:border-pine-muted focus:outline-none focus:ring-1 focus:ring-pine-muted transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-bark">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={profile.email ?? ""}
          placeholder="your@email.com"
          className="mt-1.5 w-full rounded-xl border border-stone/60 bg-cream px-4 py-2.5 text-sm text-bark placeholder:text-bark-light/50 focus:border-pine-muted focus:outline-none focus:ring-1 focus:ring-pine-muted transition-colors"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-bark">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone ?? ""}
          placeholder="+63 912 345 6789"
          className="mt-1.5 w-full rounded-xl border border-stone/60 bg-cream px-4 py-2.5 text-sm text-bark placeholder:text-bark-light/50 focus:border-pine-muted focus:outline-none focus:ring-1 focus:ring-pine-muted transition-colors"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-bark">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={profile.bio ?? ""}
          placeholder="Tell others about yourself..."
          className="mt-1.5 w-full rounded-xl border border-stone/60 bg-cream px-4 py-2.5 text-sm text-bark placeholder:text-bark-light/50 focus:border-pine-muted focus:outline-none focus:ring-1 focus:ring-pine-muted transition-colors resize-none"
        />
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-amber/10 px-3.5 py-2.5">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-xs text-bark-light">
          Your email and phone number will be <span className="font-semibold text-bark">publicly visible</span> on your profile. Only add them if you want others to contact you directly.
        </p>
      </div>

      {message && (
        <div className={`rounded-lg px-3.5 py-2.5 text-sm ${
          message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
        }`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-amber shadow-lg shadow-pine/20 hover:bg-pine-light disabled:opacity-50 transition-all"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
