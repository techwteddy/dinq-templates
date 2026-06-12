import { formatISO } from "date-fns";

import type { HabitRepository } from "@/repositories/interfaces";
import type { Habit, HabitLog } from "@/types";
import { mockHabits, mockHabitLogs } from "@/lib/constants/mock-data";

let habitsDb = [...mockHabits];
let logsDb = [...mockHabitLogs];

export class MockHabitRepository implements HabitRepository {
  async getHabits(userId: string): Promise<Habit[]> {
    return habitsDb.filter((habit) => habit.userId === userId);
  }

  async getHabitById(habitId: string): Promise<Habit | null> {
    return habitsDb.find((habit) => habit.id === habitId) ?? null;
  }

  async createHabit(payload: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
    const habit: Habit = {
      ...payload,
      id: `habit_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: formatISO(new Date()),
    };

    habitsDb.unshift(habit);
    return habit;
  }

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit> {
    const index = habitsDb.findIndex((habit) => habit.id === habitId);
    if (index === -1) throw new Error("Habit not found");

    const updated = { ...habitsDb[index], ...updates };
    habitsDb[index] = updated;
    return updated;
  }

  async archiveHabit(habitId: string): Promise<void> {
    await this.updateHabit(habitId, { archived: true });
  }

  async deleteHabit(habitId: string): Promise<void> {
    habitsDb = habitsDb.filter((habit) => habit.id !== habitId);
    logsDb = logsDb.filter((log) => log.habitId !== habitId);
  }

  async getHabitLogs(userId: string): Promise<HabitLog[]> {
    const userHabitIds = new Set(habitsDb.filter((habit) => habit.userId === userId).map((habit) => habit.id));
    return logsDb.filter((log) => userHabitIds.has(log.habitId));
  }

  async upsertHabitLog(log: HabitLog): Promise<HabitLog> {
    const index = logsDb.findIndex((entry) => entry.habitId === log.habitId && entry.date === log.date);
    if (index === -1) {
      logsDb.push(log);
      return log;
    }

    logsDb[index] = log;
    return log;
  }
}
