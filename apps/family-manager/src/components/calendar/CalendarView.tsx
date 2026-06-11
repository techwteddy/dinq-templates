"use client";

import { useState, useMemo } from "react";
import type { Event, CalendarEntry } from "@/lib/database.types";
import { addEvent, updateEvent, deleteEvent } from "@/app/actions";
import EventForm from "./EventForm";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TYPE_DOT: Record<string, string> = {
  event: "bg-lavender",
  project: "bg-honey",
  task: "bg-peach",
  google: "bg-sky-500",
  test: "bg-rose",
};

const TYPE_BADGE: Record<string, string> = {
  event: "bg-lavender/20 text-lavender border-lavender/30",
  project: "bg-honey/20 text-honey border-honey/30",
  task: "bg-peach/20 text-peach border-peach/30",
  google: "bg-sky-500/20 text-sky-600 border-sky-500/30",
  test: "bg-rose/20 text-rose border-rose/30",
};

export default function CalendarView({
  events,
  entries,
  today: todayStr,
  memberName,
  familyMembers = [],
}: {
  events: Event[];
  entries: CalendarEntry[];
  today: string;
  memberName?: string;
  familyMembers?: string[];
}) {
  const today = new Date(todayStr + "T12:00:00");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return map;
  }, [entries]);

  // Get unique types for a date (for dot indicators)
  function getTypesForDate(dateStr: string): string[] {
    const dateEntries = entriesByDate.get(dateStr) ?? [];
    return [...new Set(dateEntries.map((e) => e.type))];
  }

  // Don't allow navigating more than ~30 days into the past
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const minYear = thirtyDaysAgo.getFullYear();
  const minMonth = thirtyDaysAgo.getMonth();
  const canGoPrev = year > minYear || (year === minYear && month > minMonth);

  function prevMonth() {
    if (!canGoPrev) return;
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }

  const selectedEntries = selectedDate ? (entriesByDate.get(selectedDate) ?? []) : [];
  const selectedEvents = selectedDate
    ? events.filter((ev) => ev.start_date === selectedDate)
    : [];

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className={`px-3 py-1.5 rounded-xl border-2 border-lavender/40 transition-all active:scale-95 ${canGoPrev ? "hover:bg-lavender/20" : "opacity-40 cursor-not-allowed"}`}>
          &larr;
        </button>
        <h2 className="text-lg font-semibold">{MONTH_NAMES[month]} {year}</h2>
        <button onClick={nextMonth} className="px-3 py-1.5 rounded-xl border-2 border-lavender/40 hover:bg-lavender/20 transition-all active:scale-95">
          &rarr;
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-lavender" /> Events</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-honey" /> Projects</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-peach" /> Tasks</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> Google</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose" /> Tests</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 text-center text-sm rounded-2xl border-2 border-card-border bg-card p-3 shadow-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 font-medium text-muted text-xs uppercase tracking-wide">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(year, month, day);
          const types = getTypesForDate(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={`py-2 rounded-xl relative transition-all ${
                isSelected
                  ? "bg-lavender text-white font-bold shadow-sm"
                  : isToday
                  ? "bg-lavender/30 font-bold ring-2 ring-lavender ring-offset-1"
                  : "hover:bg-lavender/10"
              }`}
            >
              {day}
              {types.length > 0 && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {types.map((type) => (
                    <span key={type} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : TYPE_DOT[type]}`} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day entries */}
      {selectedDate && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{selectedDate}</h3>
            <button
              onClick={() => { setShowForm(true); setEditingEvent(null); }}
              className="px-4 py-1.5 rounded-xl bg-lavender text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
            >
              + Add Event
            </button>
          </div>

          {selectedEntries.length === 0 && !showForm && (
            <p className="text-muted text-sm">Nothing scheduled this day.</p>
          )}

          {selectedEntries.map((entry) => {
            // Google Calendar events — read-only
            if (entry.type === "google") {
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-4 rounded-2xl border-2 border-card-border bg-card shadow-sm"
                >
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${TYPE_BADGE.google}`}>
                    google
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{entry.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      {entry.time && <span>{entry.time}</span>}
                      {entry.memberName && <span>{entry.memberName}</span>}
                    </div>
                  </div>
                </div>
              );
            }

            // If it's an event, show with edit/delete
            if (entry.type === "event") {
              const ev = selectedEvents.find((e) => e.id === entry.source_id);
              if (!ev) return null;

              if (editingEvent?.id === ev.id) {
                return (
                  <EventForm
                    key={entry.id}
                    event={ev}
                    action={updateEvent}
                    onCancel={() => setEditingEvent(null)}
                    memberName={memberName}
                    familyMembers={familyMembers}
                  />
                );
              }

              return (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-3 p-4 rounded-2xl border-2 border-card-border bg-card shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${TYPE_BADGE.event}`}>event</span>
                      <p className="font-medium">
                        {entry.repeat && entry.repeat !== "none" && (
                          <span className="text-muted mr-1" title={`Repeats ${entry.repeat}`}>↻</span>
                        )}
                        {ev.title}
                      </p>
                    </div>
                    {ev.description && (
                      <p className="text-sm text-muted mt-1">{ev.description}</p>
                    )}
                    {ev.start_time && (
                      <p className="text-xs text-muted mt-1">
                        {ev.start_time}{ev.end_time ? ` – ${ev.end_time}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setEditingEvent(ev)}
                      className="px-3 py-1 text-xs rounded-xl border-2 border-card-border hover:bg-lavender/10 transition-all active:scale-95"
                    >
                      Edit
                    </button>
                    <form action={deleteEvent}>
                      <input type="hidden" name="id" value={ev.id} />
                      <button
                        type="submit"
                        className="px-3 py-1 text-xs rounded-xl border-2 border-rose/40 text-rose hover:bg-rose/10 transition-all active:scale-95"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            }

            // Project or task entries (read-only on calendar)
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 border-card-border bg-card shadow-sm"
              >
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${TYPE_BADGE[entry.type]}`}>
                  {entry.type}
                </span>
                <div className="min-w-0">
                  <p className="font-medium truncate">{entry.title}</p>
                  {entry.time && <p className="text-xs text-muted">{entry.time}</p>}
                </div>
              </div>
            );
          })}

          {showForm && !editingEvent && (
            <EventForm
              action={async (formData) => {
                if (!formData.get("start_date")) {
                  formData.set("start_date", selectedDate);
                }
                await addEvent(formData);
              }}
              onCancel={() => setShowForm(false)}
              memberName={memberName}
              familyMembers={familyMembers}
            />
          )}
        </div>
      )}

      {/* Add button when no date selected */}
      {!selectedDate && (
        <div className="space-y-3">
          <button
            onClick={() => { setShowForm(true); setSelectedDate(formatDate(year, month, today.getDate() <= daysInMonth ? today.getDate() : 1)); }}
            className="px-4 py-2 rounded-xl bg-lavender text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
          >
            + Add Event
          </button>
        </div>
      )}
    </div>
  );
}
