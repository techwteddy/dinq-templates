/* eslint-disable @typescript-eslint/no-unused-vars */
import type { HabitRepository } from "@/repositories/interfaces";
import type { Habit, HabitLog } from "@/types";

export class SupabaseHabitRepository implements HabitRepository {
  async getHabits(_userId: string): Promise<Habit[]> {
    throw new Error("SupabaseHabitRepository.getHabits not implemented");
  }

  async getHabitById(_habitId: string): Promise<Habit | null> {
    throw new Error("SupabaseHabitRepository.getHabitById not implemented");
  }

  async createHabit(_payload: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
    throw new Error("SupabaseHabitRepository.createHabit not implemented");
  }

  async updateHabit(_habitId: string, _updates: Partial<Habit>): Promise<Habit> {
    throw new Error("SupabaseHabitRepository.updateHabit not implemented");
  }

  async archiveHabit(_habitId: string): Promise<void> {
    throw new Error("SupabaseHabitRepository.archiveHabit not implemented");
  }

  async deleteHabit(_habitId: string): Promise<void> {
    throw new Error("SupabaseHabitRepository.deleteHabit not implemented");
  }

  async getHabitLogs(_userId: string): Promise<HabitLog[]> {
    throw new Error("SupabaseHabitRepository.getHabitLogs not implemented");
  }

  async upsertHabitLog(_log: HabitLog): Promise<HabitLog> {
    throw new Error("SupabaseHabitRepository.upsertHabitLog not implemented");
  }
}
