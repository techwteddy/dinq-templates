import { getCategories } from "@/lib/queries/dashboard";
import type { Category } from "@/types/database";
import { CategoriesClient } from "./categories-client";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const all = await getCategories();
  return <CategoriesClient initialCategories={all as Category[]} />;
}
