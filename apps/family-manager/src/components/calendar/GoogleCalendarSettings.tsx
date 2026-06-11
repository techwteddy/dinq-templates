"use client";

import { useState } from "react";
import type { GoogleCalendarLink } from "@/lib/database.types";
import { addCalendarLink, deleteCalendarLink } from "@/app/actions";

export default function GoogleCalendarSettings({
  links,
  members,
}: {
  links: GoogleCalendarLink[];
  members: string[];
}) {
  const [open, setOpen] = useState(false);

  const linkByMember = new Map<string, GoogleCalendarLink>();
  for (const link of links) {
    linkByMember.set(link.member_name, link);
  }

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1"
      >
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>&#9654;</span>
        Google Calendar Links
      </button>

      {open && (
        <div className="mt-3 space-y-3 p-4 rounded-2xl border-2 border-card-border bg-card shadow-sm">
          <p className="text-xs text-muted">
            Go to Google Calendar &rarr; Settings &rarr; [calendar name] &rarr; Integrate calendar &rarr; &quot;Secret address in iCal format&quot;
          </p>

          {members.map((name) => {
            const existing = linkByMember.get(name);
            return (
              <div key={name} className="flex items-center gap-2">
                <span className="text-sm font-medium w-16 shrink-0">{name}</span>
                {existing ? (
                  <>
                    <span className="text-xs text-muted truncate flex-1">
                      {existing.ical_url.slice(0, 50)}...
                    </span>
                    <form action={deleteCalendarLink}>
                      <input type="hidden" name="id" value={existing.id} />
                      <button
                        type="submit"
                        className="px-2 py-1 text-xs rounded-xl border-2 border-rose/40 text-rose hover:bg-rose/10 transition-all active:scale-95"
                      >
                        Remove
                      </button>
                    </form>
                  </>
                ) : (
                  <form action={addCalendarLink} className="flex gap-2 flex-1">
                    <input type="hidden" name="member_name" value={name} />
                    <input
                      name="ical_url"
                      placeholder="Paste iCal URL"
                      required
                      autoComplete="url"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border-2 border-card-border bg-card focus:border-lavender focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs rounded-xl bg-lavender text-white font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
                    >
                      Save
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
