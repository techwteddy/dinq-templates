"use client";

import { useState, useOptimistic, useTransition } from "react";
import type { ChoreScheduleEntry } from "@/lib/database.types";
import {
  addScheduleEntry,
  updateScheduleEntry,
  deleteScheduleEntry,
  completeScheduleEntry,
} from "@/app/actions";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function isDoneToday(entry: ChoreScheduleEntry, today: string): boolean {
  if (!entry.last_completed) return false;
  return new Date(entry.last_completed).toISOString().slice(0, 10) === today;
}

function isOverdue(entry: ChoreScheduleEntry, today: string): boolean {
  const todayDow = new Date(today + "T12:00:00").getDay();
  if (entry.day_of_week !== todayDow) return false;
  if (isDoneToday(entry, today)) return false;
  return true;
}

type ModalState =
  | { mode: "closed" }
  | { mode: "add"; kid: string; day: number }
  | { mode: "edit"; entry: ChoreScheduleEntry };

export default function ChoreScheduleTable({
  entries,
  streaks = {},
  today,
  kids,
}: {
  entries: ChoreScheduleEntry[];
  streaks?: Record<string, number>;
  today: string;
  kids: string[];
}) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  // Optimistic: mark schedule entry as done
  const [optimisticEntries, markEntryDone] = useOptimistic(
    entries,
    (current, completedId: number) =>
      current.map((e) =>
        e.id === completedId
          ? { ...e, last_completed: new Date().toISOString() }
          : e
      )
  );

  const inputClass =
    "px-3 py-2 rounded-xl border-2 border-card-border bg-card focus:border-lavender focus:outline-none transition-colors";

  function getEntries(kid: string, day: number) {
    return optimisticEntries.filter((e) => e.kid_name === kid && e.day_of_week === day);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Kids&apos; Chore Schedule</h2>

      {/* Desktop: full grid */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-muted w-20" />
              {DAYS.map((day, i) => (
                <th
                  key={i}
                  className="p-2 text-center text-sm font-medium text-muted"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kids.map((kid) => (
              <tr key={kid}>
                <td className="p-2 font-medium text-sm whitespace-nowrap">
                  {kid}
                  {(streaks[kid] ?? 0) > 0 && (
                    <span className="ml-1 text-xs" title={`${streaks[kid]}-day streak`}>🔥 {streaks[kid]}</span>
                  )}
                </td>
                {DAYS.map((_, dayIdx) => {
                  const cellEntries = getEntries(kid, dayIdx);
                  return (
                    <td key={dayIdx} className="p-1 align-top min-w-[100px]">
                      <div
                        className="min-h-[60px] rounded-xl border-2 border-dashed border-card-border p-1.5 space-y-1 cursor-pointer hover:border-lavender/50 transition-colors"
                        onClick={() =>
                          setModal({ mode: "add", kid, day: dayIdx })
                        }
                      >
                        {cellEntries.map((entry) => (
                          <EntryChip
                            key={entry.id}
                            entry={entry}
                            today={today}
                            onEdit={() => setModal({ mode: "edit", entry })}
                            onDone={() => markEntryDone(entry.id)}
                          />
                        ))}
                        {cellEntries.length === 0 && (
                          <span className="text-xs text-muted/40 block text-center mt-3">
                            +
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked by kid */}
      <div className="sm:hidden space-y-4">
        {kids.map((kid) => (
          <div
            key={kid}
            className="rounded-2xl border-2 border-card-border bg-card p-3 shadow-sm"
          >
            <h3 className="font-medium mb-2">
              {kid}
              {(streaks[kid] ?? 0) > 0 && (
                <span className="ml-1 text-xs" title={`${streaks[kid]}-day streak`}>🔥 {streaks[kid]}</span>
              )}
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day, dayIdx) => {
                const cellEntries = getEntries(kid, dayIdx);
                return (
                  <div key={dayIdx} className="text-center">
                    <div className="text-[10px] text-muted font-medium mb-1">
                      {day}
                    </div>
                    <div
                      className="min-h-[48px] rounded-lg border border-dashed border-card-border p-0.5 space-y-0.5 cursor-pointer"
                      onClick={() =>
                        setModal({ mode: "add", kid, day: dayIdx })
                      }
                    >
                      {cellEntries.map((entry) => (
                        <EntryChip
                          key={entry.id}
                          entry={entry}
                          today={today}
                          compact
                          onEdit={() => setModal({ mode: "edit", entry })}
                          onDone={() => markEntryDone(entry.id)}
                        />
                      ))}
                      {cellEntries.length === 0 && (
                        <span className="text-[10px] text-muted/30 block mt-3">
                          +
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for add/edit */}
      {modal.mode !== "closed" && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={() => setModal({ mode: "closed" })}
        >
          <div
            className="bg-card rounded-2xl p-5 w-full max-w-sm shadow-lg border-2 border-card-border space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg">
              {modal.mode === "add"
                ? `Add chore — ${modal.kid}, ${DAYS[modal.day]}`
                : `Edit: ${modal.entry.chore_name}`}
            </h3>

            {modal.mode === "add" ? (
              <form
                action={async (fd) => {
                  await addScheduleEntry(fd);
                  setModal({ mode: "closed" });
                }}
              >
                <input type="hidden" name="kid_name" value={modal.kid} />
                <input type="hidden" name="day_of_week" value={modal.day} />
                <div className="space-y-3">
                  <input
                    name="chore_name"
                    placeholder="Chore name *"
                    required
                    className={inputClass + " w-full"}
                    autoFocus
                  />
                  <input
                    name="time_of_day"
                    type="time"
                    className={inputClass + " w-full"}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-lavender text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setModal({ mode: "closed" })}
                      className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-lavender/10 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <form
                  action={async (fd) => {
                    await updateScheduleEntry(fd);
                    setModal({ mode: "closed" });
                  }}
                >
                  <input type="hidden" name="id" value={modal.entry.id} />
                  <div className="space-y-3">
                    <input
                      name="chore_name"
                      defaultValue={modal.entry.chore_name}
                      required
                      className={inputClass + " w-full"}
                      autoFocus
                    />
                    <input
                      name="time_of_day"
                      type="time"
                      defaultValue={modal.entry.time_of_day ?? ""}
                      className={inputClass + " w-full"}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-lavender text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ mode: "closed" })}
                        className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-lavender/10 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
                <form
                  action={async (fd) => {
                    await deleteScheduleEntry(fd);
                    setModal({ mode: "closed" });
                  }}
                >
                  <input type="hidden" name="id" value={modal.entry.id} />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl border-2 border-rose/40 text-rose text-sm hover:bg-rose/10 transition-all active:scale-95 w-full"
                  >
                    Delete
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EntryChip({
  entry,
  compact,
  onEdit,
  onDone,
  today,
}: {
  entry: ChoreScheduleEntry;
  compact?: boolean;
  onEdit: () => void;
  onDone: () => void;
  today: string;
}) {
  const done = isDoneToday(entry, today);
  const overdue = isOverdue(entry, today);
  const [, startTransition] = useTransition();

  const bg = done
    ? "bg-sage/20 border-sage/40"
    : overdue
      ? "bg-rose/15 border-rose/40"
      : "bg-lavender/10 border-lavender/30";

  return (
    <div
      className={`rounded-lg border ${bg} ${compact ? "px-0.5 py-0.5" : "px-2 py-1"} flex items-center gap-1`}
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
    >
      {done && <span className={compact ? "text-[10px]" : "text-xs"}>&#10003;</span>}
      <span
        className={`${compact ? "text-[9px] leading-tight" : "text-xs"} truncate`}
      >
        {entry.chore_name}
      </span>
      {!done && !compact && (
        <form
          action={(fd) => {
            startTransition(async () => {
              onDone();
              await completeScheduleEntry(fd);
            });
          }}
          onClick={(e) => e.stopPropagation()}
          className="ml-auto shrink-0"
        >
          <input type="hidden" name="id" value={entry.id} />
          <input type="hidden" name="kid_name" value={entry.kid_name} />
          <input type="hidden" name="chore_name" value={entry.chore_name} />
          <button
            type="submit"
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-sage text-white hover:opacity-90 transition-all active:scale-95"
          >
            Done
          </button>
        </form>
      )}
    </div>
  );
}
