"use client";

import { useState, useTransition } from "react";
import type { MealPlanEntry, ShoppingList } from "@/lib/database.types";
import { addMealEntry, updateMealEntry, deleteMealEntry, getMealIngredients, addMealToShoppingList } from "@/app/actions";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type ModalState =
  | { mode: "closed" }
  | { mode: "add"; member: string; day: number }
  | { mode: "edit"; entry: MealPlanEntry }
  | { mode: "add-to-list"; entry: MealPlanEntry };

interface IngredientRow {
  name: string;
  quantity: string;
}

export default function MealPlanGrid({
  entries,
  memberRole,
  shoppingLists = [],
  members,
}: {
  entries: MealPlanEntry[];
  memberRole?: "parent" | "kid";
  shoppingLists?: ShoppingList[];
  members: string[];
}) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  const inputClass =
    "px-3 py-2 rounded-xl border-2 border-card-border bg-card focus:border-sage focus:outline-none transition-colors";

  function getEntry(member: string, day: number) {
    return entries.find(
      (e) => e.member_name === member && e.day_of_week === day
    );
  }

  async function openAddToList(entry: MealPlanEntry) {
    setModal({ mode: "add-to-list", entry });
    setLoadingIngredients(true);
    setSelectedListId(shoppingLists[0]?.id ?? null);

    try {
      const saved = await getMealIngredients(entry.meal);
      if (saved.length > 0) {
        setIngredients(saved.map((s) => ({ name: s.item_name, quantity: s.quantity ?? "" })));
      } else {
        setIngredients([{ name: "", quantity: "" }]);
      }
    } catch {
      setIngredients([{ name: "", quantity: "" }]);
    }
    setLoadingIngredients(false);
  }

  function updateIngredient(idx: number, field: "name" | "quantity", value: string) {
    setIngredients((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  function addIngredientRow() {
    setIngredients((prev) => [...prev, { name: "", quantity: "" }]);
  }

  function removeIngredientRow(idx: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAddToList() {
    if (!selectedListId || modal.mode !== "add-to-list") return;
    const validItems = ingredients.filter((i) => i.name.trim());
    if (validItems.length === 0) return;

    const fd = new FormData();
    fd.set("list_id", String(selectedListId));
    fd.set("meal", modal.entry.meal);
    fd.set("items", JSON.stringify(validItems));

    startTransition(async () => {
      await addMealToShoppingList(fd);
      setModal({ mode: "closed" });
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Meal Plan</h2>

      {/* Desktop: full grid */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-muted w-20" />
              {DAYS.map((day, i) => (
                <th
                  key={i}
                  className="p-2 text-center text-sm font-medium text-muted"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member}>
                <td className="p-2 font-medium text-sm whitespace-nowrap">
                  {member}
                </td>
                {DAYS.map((_, dayIdx) => {
                  const entry = getEntry(member, dayIdx);
                  return (
                    <td key={dayIdx} className="p-1 align-top min-w-[100px]">
                      <div
                        className="min-h-[50px] rounded-xl border-2 border-dashed border-card-border p-1.5 cursor-pointer hover:border-sage/50 transition-colors"
                        onClick={() =>
                          entry
                            ? setModal({ mode: "edit", entry })
                            : setModal({ mode: "add", member, day: dayIdx })
                        }
                      >
                        {entry ? (
                          <span className="text-xs">{entry.meal}</span>
                        ) : (
                          <span className="text-xs text-muted/40 block text-center mt-3">
                            +
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked by member */}
      <div className="sm:hidden space-y-4">
        {members.map((member) => (
          <div
            key={member}
            className="rounded-2xl border-2 border-card-border bg-card p-3 shadow-sm"
          >
            <h3 className="font-medium mb-2">{member}</h3>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day, dayIdx) => {
                const entry = getEntry(member, dayIdx);
                return (
                  <div key={dayIdx} className="text-center">
                    <div className="text-[10px] text-muted font-medium mb-1">
                      {day}
                    </div>
                    <div
                      className="min-h-[40px] rounded-lg border border-dashed border-card-border p-0.5 cursor-pointer"
                      onClick={() =>
                        entry
                          ? setModal({ mode: "edit", entry })
                          : setModal({ mode: "add", member, day: dayIdx })
                      }
                    >
                      {entry ? (
                        <span className="text-[9px] leading-tight">
                          {entry.meal}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted/30 block mt-2">
                          +
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for add/edit/add-to-list */}
      {modal.mode !== "closed" && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={() => setModal({ mode: "closed" })}
        >
          <div
            className="bg-card rounded-2xl p-5 w-full max-w-sm shadow-lg border-2 border-card-border space-y-3 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {modal.mode === "add" && (
              <>
                <h3 className="font-bold text-lg">
                  Add meal — {modal.member}, {DAYS[modal.day]}
                </h3>
                <form
                  action={async (fd) => {
                    await addMealEntry(fd);
                    setModal({ mode: "closed" });
                  }}
                >
                  <input type="hidden" name="member_name" value={modal.member} />
                  <input type="hidden" name="day_of_week" value={modal.day} />
                  <div className="space-y-3">
                    <textarea
                      name="meal"
                      placeholder="What do you want to eat? *"
                      required
                      rows={3}
                      className={inputClass + " w-full"}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-sage text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ mode: "closed" })}
                        className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-sage/10 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {modal.mode === "edit" && (
              <>
                <h3 className="font-bold text-lg">
                  Edit meal — {modal.entry.member_name}, {DAYS[modal.entry.day_of_week]}
                </h3>
                <div className="space-y-3">
                  <form
                    action={async (fd) => {
                      await updateMealEntry(fd);
                      setModal({ mode: "closed" });
                    }}
                  >
                    <input type="hidden" name="id" value={modal.entry.id} />
                    <input type="hidden" name="member_name" value={modal.entry.member_name} />
                    <input type="hidden" name="day_of_week" value={modal.entry.day_of_week} />
                    <div className="space-y-3">
                      <textarea
                        name="meal"
                        defaultValue={modal.entry.meal}
                        required
                        rows={3}
                        className={inputClass + " w-full"}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-sage text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => setModal({ mode: "closed" })}
                          className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-sage/10 transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>

                  {memberRole === "parent" && shoppingLists.length > 0 && (
                    <button
                      type="button"
                      onClick={() => openAddToList(modal.entry)}
                      className="px-4 py-2 rounded-xl bg-honey text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95 w-full"
                    >
                      Add to Shopping List
                    </button>
                  )}

                  <form
                    action={async (fd) => {
                      await deleteMealEntry(fd);
                      setModal({ mode: "closed" });
                    }}
                  >
                    <input type="hidden" name="id" value={modal.entry.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl border-2 border-rose/40 text-rose text-sm hover:bg-rose/10 transition-all active:scale-95 w-full"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </>
            )}

            {modal.mode === "add-to-list" && (
              <>
                <h3 className="font-bold text-lg">
                  Add ingredients — {modal.entry.meal}
                </h3>

                {loadingIngredients ? (
                  <p className="text-sm text-muted">Loading saved ingredients...</p>
                ) : (
                  <div className="space-y-3">
                    {/* Target list picker */}
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Target list</label>
                      <select
                        value={selectedListId ?? ""}
                        onChange={(e) => setSelectedListId(Number(e.target.value))}
                        className={inputClass + " w-full"}
                      >
                        {shoppingLists.map((l) => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Ingredient rows */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted block">Ingredients</label>
                      {ingredients.map((row, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            value={row.name}
                            onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                            placeholder="Item name"
                            className={inputClass + " flex-1 min-w-0 text-sm"}
                          />
                          <input
                            value={row.quantity}
                            onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                            placeholder="Qty"
                            className={inputClass + " w-16 text-sm"}
                          />
                          <button
                            type="button"
                            onClick={() => removeIngredientRow(idx)}
                            className="text-muted hover:text-rose text-sm shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addIngredientRow}
                        className="text-xs text-sage hover:underline"
                      >
                        + Add row
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddToList}
                        disabled={isPending}
                        className="px-4 py-2 rounded-xl bg-sage text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isPending ? "Adding..." : "Add to List"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ mode: "closed" })}
                        className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-sage/10 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
