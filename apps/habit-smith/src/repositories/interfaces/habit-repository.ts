import type { Habit, HabitLog } from "@/types";

export interface HabitRepository {
  getHabits(userId: string): Promise<Habit[]>;
  getHabitById(habitId: string): Promise<Habit | null>;
  createHabit(payload: Omit<Habit, "id" | "createdAt">): Promise<Habit>;
  updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit>;
  archiveHabit(habitId: string): Promise<void>;
  deleteHabit(habitId: string): Promise<void>;
  getHabitLogs(userId: string): Promise<HabitLog[]>;
  upsertHabitLog(log: HabitLog): Promise<HabitLog>;
}
