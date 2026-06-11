"use client";

import { useState, useOptimistic, useTransition } from "react";
import type { Chore } from "@/lib/database.types";
import { addChore, updateChore, deleteChore, completeChore } from "@/app/actions";
import AssigneeSelect from "@/components/AssigneeSelect";

const FREQ_COLORS: Record<string, string> = {
  daily: "bg-peach/30 text-peach",
  weekly: "bg-honey/30 text-honey",
  monthly: "bg-lavender/30 text-lavender",
};

function isOverdue(chore: Chore, today: string): boolean {
  if (!chore.last_completed) return true;
  const last = new Date(chore.last_completed);
  const now = new Date(today + "T12:00:00");
  const diffMs = now.getTime() - last.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  switch (chore.frequency) {
    case "daily": return diffDays > 1;
    case "weekly": return diffDays > 7;
    case "monthly": return diffDays > 30;
    default: return false;
  }
}

export default function ChoresList({ chores, today, members }: { chores: Chore[]; today: string; members: string[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  // Optimistic: mark chore as just completed
  const [optimisticChores, markDone] = useOptimistic(
    chores,
    (current, completedId: number) =>
      current.map((c) =>
        c.id === completedId
          ? { ...c, last_completed: new Date().toISOString() }
          : c
      )
  );

  const inputClass = "px-3 py-2 rounded-xl border-2 border-card-border bg-card focus:border-peach focus:outline-none transition-colors";

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="px-4 py-2 rounded-xl bg-peach text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
      >
        + Add Chore
      </button>

      {showAdd && (
        <form
          action={async (fd) => { await addChore(fd); setShowAdd(false); }}
          className="p-4 rounded-2xl border-2 border-peach/30 bg-peach/5 space-y-3 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input name="name" placeholder="Chore name *" required className={inputClass} />
            <select name="frequency" required className={inputClass}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <AssigneeSelect className={inputClass} members={members} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-xl bg-peach text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95">Save</button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-peach/10 transition-all active:scale-95">Cancel</button>
          </div>
        </form>
      )}

      {optimisticChores.length === 0 && !showAdd && (
        <p className="text-muted">No chores yet. Add one above.</p>
      )}

      <div className="space-y-2">
        {optimisticChores.map((chore) => {
          const overdue = isOverdue(chore, today);

          if (editingId === chore.id) {
            return (
              <form
                key={chore.id}
                action={async (fd) => { await updateChore(fd); setEditingId(null); }}
                className="p-4 rounded-2xl border-2 border-peach/30 bg-peach/5 space-y-3 shadow-sm"
              >
                <input type="hidden" name="id" value={chore.id} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input name="name" defaultValue={chore.name} required className={inputClass} />
                  <select name="frequency" defaultValue={chore.frequency} className={inputClass}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <AssigneeSelect defaultValue={chore.assignee} className={inputClass} members={members} />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded-xl bg-peach text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95">Update</button>
                  <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-peach/10 transition-all active:scale-95">Cancel</button>
                </div>
              </form>
            );
          }

          return (
            <div
              key={chore.id}
              className={`flex items-center justify-between gap-3 p-4 rounded-2xl border-2 shadow-sm ${
                overdue
                  ? "border-rose/40 bg-rose/5"
                  : "border-card-border bg-card"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{chore.name}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${FREQ_COLORS[chore.frequency]}`}>
                      {chore.frequency}
                    </span>
                    {overdue && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose/20 text-rose font-medium">
                        overdue
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {chore.assignee && <span>{chore.assignee} · </span>}
                    {chore.last_completed
                      ? `Last done: ${chore.last_completed.slice(0, 10)}`
                      : "Never completed"}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <form
                  action={(fd) => {
                    startTransition(async () => {
                      markDone(chore.id);
                      await completeChore(fd);
                    });
                  }}
                >
                  <input type="hidden" name="id" value={chore.id} />
                  <input type="hidden" name="chore_name" value={chore.name} />
                  <input type="hidden" name="assignee" value={chore.assignee ?? ""} />
                  <button type="submit" className="px-3 py-1.5 text-xs rounded-xl bg-sage text-white font-medium hover:opacity-90 shadow-sm transition-all active:scale-95">
                    Done
                  </button>
                </form>
                <button
                  onClick={() => setEditingId(chore.id)}
                  className="px-3 py-1 text-xs rounded-xl border-2 border-card-border hover:bg-peach/10 transition-all active:scale-95"
                >
                  Edit
                </button>
                <form action={deleteChore}>
                  <input type="hidden" name="id" value={chore.id} />
                  <button type="submit" className="px-3 py-1 text-xs rounded-xl border-2 border-rose/40 text-rose hover:bg-rose/10 transition-all active:scale-95">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
