"use client";

import { useEffect, useMemo, useState } from "react";

import { CompletionButtons } from "@/components/habits/completion-buttons";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitForm } from "@/components/habits/habit-form";
import { HabitStats } from "@/components/habits/habit-stats";
import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import type { Habit, HabitLog } from "@/types";
import { habitCategories, type HabitCategoryFilter, type HabitFormInput } from "@/lib/validations/habit";

export default function HabitsPage() {
  const session = useSessionStore((state) => state.session);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [activeFilter, setActiveFilter] = useState<HabitCategoryFilter>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const userId = session?.user.id ?? "";

  useEffect(() => {
    if (!userId) return;

    let active = true;

    void (async () => {
      const [nextHabits, nextLogs] = await Promise.all([
        services.habits.getHabits(userId),
        services.habits.getHabitLogs(userId),
      ]);

      if (!active) return;
      setHabits(nextHabits);
      setLogs(nextLogs);
    })();

    return () => {
      active = false;
    };
  }, [refreshKey, userId]);

  const visibleHabits = useMemo(() => {
    const activeOnly = habits.filter((habit) => !habit.archived);
    if (activeFilter === "all") return activeOnly;
    return activeOnly.filter((habit) => habit.category === activeFilter);
  }, [activeFilter, habits]);

  const openDetails = (habit: Habit) => setSelectedHabit(habit);

  const handleCreate = async (values: HabitFormInput) => {
    if (!userId) return;

    await services.habits.createHabit({
      ...values,
      userId,
      archived: false,
    });

    setShowCreateModal(false);
    setRefreshKey((value) => value + 1);
  };

  const handleEdit = async (values: HabitFormInput) => {
    if (!selectedHabit) return;

    await services.habits.updateHabit(selectedHabit.id, values);
    setShowEditModal(false);
    setRefreshKey((value) => value + 1);
  };

  const markComplete = async (habit: Habit) => {
    await services.habits.completeHabit({
      habitId: habit.id,
      date: new Date().toISOString().slice(0, 10),
      completed: true,
      count: habit.targetCount,
      notes: "Completed from habits page",
    });
    setRefreshKey((value) => value + 1);
  };

  const skipToday = async (habit: Habit) => {
    await services.habits.upsertHabitLog({
      habitId: habit.id,
      date: new Date().toISOString().slice(0, 10),
      completed: false,
      count: 0,
      notes: "Skipped today",
    });
    setRefreshKey((value) => value + 1);
  };

  const archiveHabit = async (habitId: string) => {
    await services.habits.archiveHabit(habitId);
    setRefreshKey((value) => value + 1);
  };

  const deleteHabit = async (habitId: string) => {
    await services.habits.deleteHabit(habitId);
    setSelectedHabit(null);
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Habits</h1>
        <button onClick={() => setShowCreateModal(true)} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
          Create Habit
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={`rounded-lg px-3 py-1.5 text-sm ${activeFilter === "all" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>
        {habitCategories.map((category) => (
          <button
            key={category}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${activeFilter === category ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {visibleHabits.map((habit) => {
          const habitLogs = logs.filter((log) => log.habitId === habit.id);

          return (
            <div key={habit.id} className="space-y-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm">
              <button type="button" className="w-full text-left" onClick={() => openDetails(habit)}>
                <HabitCard habit={habit} logs={logs} />
              </button>
              <CompletionButtons onComplete={() => void markComplete(habit)} onSkip={() => void skipToday(habit)} />
              <HabitStats logs={habitLogs} />
              <div className="flex gap-2">
                <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs" onClick={() => { setSelectedHabit(habit); setShowEditModal(true); }}>
                  Edit
                </button>
                <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs" onClick={() => void archiveHabit(habit.id)}>
                  Archive
                </button>
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600" onClick={() => void deleteHabit(habit.id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedHabit ? (
        <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Habit Details</h2>
          <p className="mt-1 text-sm text-zinc-600">{selectedHabit.description}</p>
          <p className="mt-3 text-sm text-zinc-700">
            Frequency: <span className="font-semibold capitalize">{selectedHabit.frequency}</span> · Target: {selectedHabit.targetCount} {selectedHabit.unit}
          </p>
        </section>
      ) : null}

      {showCreateModal ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            <h2 className="text-xl font-semibold">Create Habit</h2>
            <div className="mt-4">
              <HabitForm submitLabel="Create Habit" onSubmit={handleCreate} />
            </div>
            <button className="mt-4 text-sm text-zinc-600" onClick={() => setShowCreateModal(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {showEditModal && selectedHabit ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            <h2 className="text-xl font-semibold">Edit Habit</h2>
            <div className="mt-4">
              <HabitForm initialHabit={selectedHabit} submitLabel="Save Changes" onSubmit={handleEdit} />
            </div>
            <button className="mt-4 text-sm text-zinc-600" onClick={() => setShowEditModal(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
