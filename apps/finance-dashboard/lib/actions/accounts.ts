"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
import { CURRENCY } from "@/lib/constants";

const AccountSchema = z.object({
  name: z.string().min(1).max(120),
  bank: z.string().max(120).nullable().optional(),
  type: z.enum(["checking", "savings", "credit_card", "cash", "investment"]),
  initial_balance: z.number().default(0),
  currency: z.string().default(CURRENCY),
  active: z.boolean().default(true),
  color: z.string().nullable().optional(),
  last_digits: z.string().max(4).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type AccountInput = z.infer<typeof AccountSchema>;

export async function createAccount(input: AccountInput) {
  const { supabase } = await requireUser();
  const data = AccountSchema.parse(input);
  const { error } = await supabase.from("accounts").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/accounts");
  revalidatePath("/");
  return { ok: true };
}

export async function updateAccount(id: string, input: Partial<AccountInput>) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("accounts").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/accounts");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleAccountActive(id: string, active: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("accounts").update({ active }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/accounts");
  return { ok: true };
}

export async function deleteAccount(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("accounts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/accounts");
  revalidatePath("/");
  return { ok: true };
}
