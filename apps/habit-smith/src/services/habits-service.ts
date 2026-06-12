import type { HabitRepository } from "@/repositories/interfaces";
import type { Habit, HabitLog } from "@/types";

export class HabitsService {
  constructor(private readonly habitRepository: HabitRepository) {}

  getHabits(userId: string) {
    return this.habitRepository.getHabits(userId);
  }

  getHabitById(habitId: string) {
    return this.habitRepository.getHabitById(habitId);
  }

  createHabit(payload: Omit<Habit, "id" | "createdAt">) {
    return this.habitRepository.createHabit(payload);
  }

  updateHabit(habitId: string, updates: Partial<Habit>) {
    return this.habitRepository.updateHabit(habitId, updates);
  }

  archiveHabit(habitId: string) {
    return this.habitRepository.archiveHabit(habitId);
  }

  deleteHabit(habitId: string) {
    return this.habitRepository.deleteHabit(habitId);
  }

  getHabitLogs(userId: string) {
    return this.habitRepository.getHabitLogs(userId);
  }

  completeHabit(log: HabitLog) {
    return this.habitRepository.upsertHabitLog({ ...log, completed: true });
  }

  upsertHabitLog(log: HabitLog) {
    return this.habitRepository.upsertHabitLog(log);
  }
}
