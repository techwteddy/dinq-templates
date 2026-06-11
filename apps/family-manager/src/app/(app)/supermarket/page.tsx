import { getCurrentMember } from "@/lib/supabase-server";
import type { ShoppingList, ShoppingItem, MealPlanEntry, ItemCategory } from "@/lib/database.types";
import ShoppingListCard from "@/components/supermarket/ShoppingListCard";
import MealPlanGrid from "@/components/supermarket/MealPlanGrid";
import { addShoppingList } from "@/app/actions";

export default async function SupermarketPage() {
  const { supabase, member } = await getCurrentMember();
  const [{ data: lists }, { data: items }, { data: meals }, { data: knownItems }, { data: allMembers }] = await Promise.all([
    supabase.from("shopping_lists").select("id, name, created_at").order("created_at", { ascending: false }),
    supabase.from("shopping_items").select("id, list_id, name, quantity, category, notes, checked").order("created_at", { ascending: true }),
    supabase.from("meal_plan").select("id, day_of_week, member_name, meal").order("created_at", { ascending: true }),
    supabase.from("item_categories").select("name, category").order("name"),
    supabase.from("family_members").select("name").order("name"),
  ]);

  const familyMembers = allMembers?.map((m) => m.name) ?? [];

  const allLists = (lists as ShoppingList[]) ?? [];
  const itemsByList = new Map<number, ShoppingItem[]>();
  for (const item of (items as ShoppingItem[]) ?? []) {
    const list = itemsByList.get(item.list_id) ?? [];
    list.push(item);
    itemsByList.set(item.list_id, list);
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-2xl font-bold">Supermarket</h1>
        <form action={addShoppingList} className="flex gap-2">
          <input
            name="name"
            placeholder="New list name"
            required
            className="px-3 py-2 rounded-xl border-2 border-card-border bg-card text-sm focus:border-sage focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-sage text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
          >
            + List
          </button>
        </form>
      </div>

      {allLists.length === 0 ? (
        <p className="text-muted">No shopping lists yet. Create one above.</p>
      ) : (
        <div className="space-y-4">
          {allLists.map((list) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              items={itemsByList.get(list.id) ?? []}
              knownItems={(knownItems as ItemCategory[]) ?? []}
            />
          ))}
        </div>
      )}

      <div className="mt-10 pt-8 border-t-2 border-card-border">
        <MealPlanGrid
          entries={(meals as MealPlanEntry[]) ?? []}
          memberRole={member.role}
          shoppingLists={allLists}
          members={familyMembers}
        />
      </div>
    </>
  );
}
