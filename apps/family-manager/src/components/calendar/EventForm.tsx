"use client";

import { useState } from "react";
import type { Event } from "@/lib/database.types";

const inputClass =
  "px-3 py-2 rounded-xl border-2 border-card-border bg-card focus:border-lavender focus:outline-none transition-colors w-full";

export default function EventForm({
  event,
  action,
  onCancel,
  memberName,
  familyMembers,
}: {
  event?: Event;
  action: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  memberName?: string;
  familyMembers: string[];
}) {
  const [externalEmails, setExternalEmails] = useState<string[]>(
    event?.external_emails ?? []
  );
  const [emailInput, setEmailInput] = useState("");

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (email && email.includes("@") && !externalEmails.includes(email)) {
      setExternalEmails([...externalEmails, email]);
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setExternalEmails(externalEmails.filter((e) => e !== email));
  };

  const inviteeOptions = familyMembers.filter((m) => m !== memberName);

  return (
    <form
      action={async (formData) => {
        await action(formData);
        onCancel();
      }}
      className="space-y-3 p-4 border-2 border-lavender/30 rounded-2xl bg-lavender/5 shadow-sm"
    >
      {event && <input type="hidden" name="id" value={event.id} />}
      <input type="hidden" name="external_emails_json" value={JSON.stringify(externalEmails)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted block mb-1">Title *</label>
          <input
            name="title"
            placeholder="Event title"
            defaultValue={event?.title}
            required
            autoComplete="on"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Description</label>
          <input
            name="description"
            placeholder="Description"
            defaultValue={event?.description ?? ""}
            autoComplete="on"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted block mb-1">Start date *</label>
          <input
            name="start_date"
            type="date"
            defaultValue={event?.start_date}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Start time</label>
          <input
            name="start_time"
            type="time"
            defaultValue={event?.start_time ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">End date</label>
          <input
            name="end_date"
            type="date"
            defaultValue={event?.end_date ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">End time</label>
          <input
            name="end_time"
            type="time"
            defaultValue={event?.end_time ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted block mb-1">Repeat</label>
          <select
            name="repeat"
            defaultValue={event?.repeat ?? "none"}
            className={inputClass}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Repeat until</label>
          <input
            name="repeat_end_date"
            type="date"
            defaultValue={event?.repeat_end_date ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {/* Family invitees */}
      {memberName && (
        <div>
          <label className="text-xs text-muted block mb-1">Invite family</label>
          <div className="flex flex-wrap gap-3">
            {inviteeOptions.map((name) => (
              <label key={name} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="invitees"
                  value={name}
                  defaultChecked={event?.invitees?.includes(name)}
                  className="rounded accent-lavender"
                />
                {name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* External emails */}
      <div>
        <label className="text-xs text-muted block mb-1">Invite by email</label>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addEmail();
              }
            }}
            className={inputClass}
          />
          <button
            type="button"
            onClick={addEmail}
            className="px-3 py-2 rounded-xl bg-lavender/20 text-lavender text-sm font-medium hover:bg-lavender/30 transition-all active:scale-95 shrink-0"
          >
            Add
          </button>
        </div>
        {externalEmails.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {externalEmails.map((email) => (
              <span
                key={email}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-lavender/15 text-sm"
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="text-muted hover:text-rose text-xs ml-0.5"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-lavender text-white font-medium text-sm hover:opacity-90 shadow-sm transition-all active:scale-95"
        >
          {event ? "Update" : "Add Event"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-lavender/10 transition-all active:scale-95"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
