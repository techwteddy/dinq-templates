"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";

const CategorySchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(["income", "expense"]),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
});

export type CategoryInput = z.infer<typeof CategorySchema>;

export async function createCategory(input: CategoryInput) {
  const { supabase } = await requireUser();
  const data = CategorySchema.parse(input);
  const { error } = await supabase.from("categories").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/categories");
  return { ok: true };
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("categories").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/categories");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/categories");
  return { ok: true };
}
