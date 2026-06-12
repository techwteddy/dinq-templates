"use client";

import { useForm } from "react-hook-form";
import { ZodError } from "zod";

import type { Habit } from "@/types";
import { habitCategories, habitFrequencies, habitSchema, type HabitFormInput } from "@/lib/validations/habit";

export function HabitForm({
  initialHabit,
  onSubmit,
  submitLabel,
}: {
  initialHabit?: Habit;
  onSubmit: (values: HabitFormInput) => Promise<void> | void;
  submitLabel: string;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormInput>({
    defaultValues: {
      title: initialHabit?.title ?? "",
      description: initialHabit?.description ?? "",
      emoji: initialHabit?.emoji ?? "{1F525}",
      category: initialHabit?.category ?? "personal",
      colour: initialHabit?.colour ?? "#111827",
      frequency: initialHabit?.frequency ?? "daily",
      targetCount: initialHabit?.targetCount ?? 1,
      unit: initialHabit?.unit ?? "session",
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const parsed = habitSchema.parse(values);
      await onSubmit(parsed);
    } catch (error) {
      if (error instanceof ZodError) {
        error.issues.forEach((issue) => {
          const key = String(issue.path[0]) as keyof HabitFormInput;
          setError(key, { message: issue.message });
        });
      }
    }
  });

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-zinc-600">
          Title
          <input className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" {...register("title")} />
          {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title.message}</p> : null}
        </label>
        <label className="text-sm text-zinc-600">
          Emoji
          <input className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" {...register("emoji")} />
          {errors.emoji ? <p className="mt-1 text-xs text-red-500">{errors.emoji.message}</p> : null}
        </label>
      </div>

      <label className="block text-sm text-zinc-600">
        Description
        <textarea className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" rows={3} {...register("description")} />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-zinc-600">
          Category
          <select className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" {...register("category")}>
            {habitCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-zinc-600">
          Frequency
          <select className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" {...register("frequency")}>
            {habitFrequencies.map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-zinc-600">
          Target
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
            {...register("targetCount", { valueAsNumber: true })}
          />
        </label>
        <label className="text-sm text-zinc-600">
          Unit
          <input className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" {...register("unit")} />
        </label>
        <label className="text-sm text-zinc-600">
          Colour
          <input className="mt-1 h-10 w-full rounded-lg border border-zinc-200 px-2" {...register("colour")} />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
