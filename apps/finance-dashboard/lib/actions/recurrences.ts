"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
import { toIsoDate } from "@/lib/utils";
import { RECURRENCE_FREQ_MONTHS } from "@/lib/constants";
import type { Recurrence } from "@/types/database";

const RecurrenceSchema = z.object({
  description: z.string().min(1).max(200),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  category_id: z.string().uuid().nullable().optional(),
  account_id: z.string().uuid().nullable().optional(),
  frequency: z.enum(["monthly", "bimonthly", "quarterly", "semiannual", "annual"]),
  due_day: z.number().int().min(1).max(31),
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  active: z.boolean().default(true),
  next_run: z.string(),
});

export type RecurrenceInput = z.infer<typeof RecurrenceSchema>;

function addMonths(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1 + months, d);
  return toIsoDate(date);
}

function revalidateAll(type?: "income" | "expense") {
  revalidatePath("/");
  revalidatePath("/recurring");
  if (type === "income") revalidatePath("/income");
  if (type === "expense") revalidatePath("/expenses");
  if (!type) {
    revalidatePath("/income");
    revalidatePath("/expenses");
  }
}

export async function createRecurrence(input: RecurrenceInput, generateFirst: boolean = true) {
  const { supabase } = await requireUser();
  const data = RecurrenceSchema.parse(input);
  const { data: rec, error } = await supabase.from("recurrences").insert(data).select("id").single();
  if (error) return { error: error.message };

  // Optionally generate the first transaction right away.
  if (rec && generateFirst) {
    await generateNextTransaction(rec.id);
  }

  revalidateAll(data.type);
  return { ok: true };
}

export async function updateRecurrence(id: string, input: Partial<RecurrenceInput>) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("recurrences").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function deleteRecurrence(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("recurrences").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function toggleRecurrenceActive(id: string, active: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("recurrences").update({ active }).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function generateNextTransaction(id: string) {
  const { supabase, user } = await requireUser();

  const { data: rec, error: recErr } = await supabase
    .from("recurrences")
    .select("*")
    .eq("id", id)
    .single();
  if (recErr || !rec) return { error: recErr?.message ?? "Recurrence not found." };

  const recurrence = rec as Recurrence;
  if (!recurrence.active) return { error: "Recurrence is inactive." };
  if (recurrence.end_date && recurrence.next_run > recurrence.end_date) {
    await supabase.from("recurrences").update({ active: false }).eq("id", id);
    return { error: "Recurrence expired. Marked as inactive." };
  }

  const months = RECURRENCE_FREQ_MONTHS[recurrence.frequency];
  const newNextRun = addMonths(recurrence.next_run, months);

  const { error: insErr } = await supabase.from("transactions").insert({
    description: recurrence.description,
    type: recurrence.type,
    amount: recurrence.amount,
    category_id: recurrence.category_id,
    account_id: recurrence.account_id,
    accrual_date: recurrence.next_run,
    due_date: recurrence.next_run,
    recurrence_id: recurrence.id,
    created_by: user.id,
  });
  if (insErr) return { error: insErr.message };

  const expired = recurrence.end_date ? newNextRun > recurrence.end_date : false;
  const { error: updErr } = await supabase
    .from("recurrences")
    .update({ next_run: newNextRun, active: !expired })
    .eq("id", id);
  if (updErr) return { error: updErr.message };

  revalidateAll(recurrence.type);
  return { ok: true };
}
