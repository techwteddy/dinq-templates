"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
import { toIsoDate } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/constants";

const TransactionSchema = z.object({
  description: z.string().min(1).max(200),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  category_id: z.string().uuid().nullable().optional(),
  account_id: z.string().uuid().nullable().optional(),
  accrual_date: z.string().optional(),
  due_date: z.string(),
  payment_date: z.string().nullable().optional(),
  payment_method: z.enum(PAYMENT_METHODS).nullable().optional(),
  notes: z.string().nullable().optional(),
  installment_current: z.number().int().nullable().optional(),
  installment_total: z.number().int().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;

export async function createTransaction(input: TransactionInput) {
  const { supabase, user } = await requireUser();
  const data = TransactionSchema.parse(input);
  const payload = {
    ...data,
    accrual_date: data.accrual_date ?? data.due_date,
    created_by: user.id,
  };
  const { error } = await supabase.from("transactions").insert(payload);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath(data.type === "income" ? "/income" : "/expenses");
  return { ok: true };
}

export async function updateTransaction(id: string, input: Partial<TransactionInput>) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("transactions").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/income");
  revalidatePath("/expenses");
  return { ok: true };
}

export async function markAsPaid(id: string, paymentDate?: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("transactions")
    .update({ payment_date: paymentDate ?? toIsoDate(new Date()) })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/income");
  revalidatePath("/expenses");
  return { ok: true };
}

export async function unmarkPayment(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("transactions").update({ payment_date: null }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/income");
  revalidatePath("/expenses");
  return { ok: true };
}

export async function deleteTransaction(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/income");
  revalidatePath("/expenses");
  return { ok: true };
}
