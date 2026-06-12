"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { ZodError } from "zod";

import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import { goals, onboardingSchema, type OnboardingInput } from "@/lib/validations/onboarding";

const starterHabitMap: Record<(typeof goals)[number], string[]> = {
  fitness: ["Morning walk", "Stretch for 10 minutes", "Gym session"],
  study: ["Review notes", "Flashcard practice", "Deep work block"],
  health: ["Drink water", "Sleep before 11 PM", "Healthy lunch"],
  reading: ["Read 20 pages", "Read during commute", "Summarize one chapter"],
  mindfulness: ["Meditate 10 minutes", "Journaling", "Breathing break"],
};

export function OnboardingWizard() {
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const [step, setStep] = useState(1);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({
    defaultValues: {
      goals: ["fitness"],
      starterHabits: ["Morning walk"],
      reminderPreference: "push",
    },
  });

  const selectedGoals = useWatch({ control, name: "goals" });
  const selectedStarterHabits = useWatch({ control, name: "starterHabits" });
  const reminderPreference = useWatch({ control, name: "reminderPreference" });

  const starterHabitOptions = useMemo(
    () => Array.from(new Set(selectedGoals.flatMap((goal) => starterHabitMap[goal]))),
    [selectedGoals],
  );

  const toggleGoal = (goal: (typeof goals)[number]) => {
    const next = selectedGoals.includes(goal)
      ? selectedGoals.filter((item) => item !== goal)
      : [...selectedGoals, goal];

    setValue("goals", next, { shouldValidate: true });
  };

  const toggleStarterHabit = (habit: string) => {
    const next = selectedStarterHabits.includes(habit)
      ? selectedStarterHabits.filter((item) => item !== habit)
      : [...selectedStarterHabits, habit];

    setValue("starterHabits", next, { shouldValidate: true });
  };

  const submit = handleSubmit(async (values) => {
    try {
      const parsed = onboardingSchema.parse(values);

      if (session?.user.id) {
        await services.auth.completeOnboarding(session.user.id, {
          reminderPreference: parsed.reminderPreference,
          onboardingComplete: true,
        });
      }

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ZodError) {
        error.issues.forEach((issue) => {
          const key = String(issue.path[0] ?? "goals") as keyof OnboardingInput;
          setError(key, { message: issue.message });
        });
      }
    }
  });

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Step {step} of 4</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
        {step === 1 && "Welcome to HabitSmith"}
        {step === 2 && "Choose your goals"}
        {step === 3 && "Pick starter habits"}
        {step === 4 && "Set reminders"}
      </h1>

      {step === 1 ? (
        <div className="mt-4 space-y-4 text-zinc-600">
          <p>HabitSmith helps you track streaks, monitor progress, and stay accountable with your community.</p>
          <button
            type="button"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setStep(2)}
          >
            Start Setup
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {goals.map((goal) => {
              const selected = selectedGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium capitalize transition ${
                    selected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-700"
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </button>
              );
            })}
          </div>
          {errors.goals ? <p className="mt-2 text-sm text-red-500">{errors.goals.message}</p> : null}
          <div className="mt-6 flex justify-between">
            <button type="button" className="text-sm text-zinc-500" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {starterHabitOptions.map((habit) => {
              const selected = selectedStarterHabits.includes(habit);
              return (
                <button
                  key={habit}
                  type="button"
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    selected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-700"
                  }`}
                  onClick={() => toggleStarterHabit(habit)}
                >
                  {habit}
                </button>
              );
            })}
          </div>
          {errors.starterHabits ? <p className="mt-2 text-sm text-red-500">{errors.starterHabits.message}</p> : null}
          <div className="mt-6 flex justify-between">
            <button type="button" className="text-sm text-zinc-500" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => setStep(4)}>
              Next
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <form className="mt-6" onSubmit={submit}>
          <div className="space-y-2">
            {[
              { label: "No reminders", value: "none" },
              { label: "Push notifications", value: "push" },
              { label: "Email reminders", value: "email" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-sm"
              >
                <span>{option.label}</span>
                <input
                  type="radio"
                  value={option.value}
                  checked={reminderPreference === option.value}
                  onChange={() => setValue("reminderPreference", option.value as OnboardingInput["reminderPreference"])}
                />
              </label>
            ))}
          </div>
          {errors.reminderPreference ? <p className="mt-2 text-sm text-red-500">{errors.reminderPreference.message}</p> : null}
          <div className="mt-6 flex justify-between">
            <button type="button" className="text-sm text-zinc-500" onClick={() => setStep(3)}>
              Back
            </button>
            <button type="submit" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Enter Dashboard"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
