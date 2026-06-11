"use client";

import { useState, useRef, useOptimistic, useTransition, useMemo, useCallback, useEffect } from "react";
import type { ShoppingList, ShoppingItem, ItemCategory } from "@/lib/database.types";
import {
  deleteShoppingList,
  clearShoppingList,
  restoreShoppingItems,
  reuseShoppingList,
  addShoppingItem,
  updateShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
} from "@/app/actions";

export default function ShoppingListCard({
  list,
  items,
  knownItems = [],
}: {
  list: ShoppingList;
  items: ShoppingItem[];
  knownItems?: ItemCategory[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [clearedItems, setClearedItems] = useState<ShoppingItem[] | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClearChecked = useCallback(async () => {
    const checked = items.filter((i) => i.checked);
    if (checked.length === 0) return;
    setClearedItems(checked);
    const fd = new FormData();
    fd.set("list_id", String(list.id));
    await clearShoppingList(fd);
    undoTimerRef.current = setTimeout(() => setClearedItems(null), 5000);
  }, [items, list.id]);

  const handleUndo = useCallback(async () => {
    if (!clearedItems) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    const toRestore = clearedItems.map((i) => ({
      list_id: i.list_id,
      name: i.name,
      quantity: i.quantity,
      category: i.category,
      notes: i.notes,
    }));
    setClearedItems(null);
    await restoreShoppingItems(toRestore);
  }, [clearedItems]);

  useEffect(() => {
    return () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); };
  }, []);

  // Optimistic toggle state
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items,
    (current, toggledId: number) =>
      current.map((item) =>
        item.id === toggledId ? { ...item, checked: !item.checked } : item
      )
  );

  const categories = useMemo(() => {
    const map = new Map<string, ShoppingItem[]>();
    for (const item of optimisticItems) {
      const cat = item.category || "Uncategorized";
      const group = map.get(cat) ?? [];
      group.push(item);
      map.set(cat, group);
    }
    return map;
  }, [optimisticItems]);

  const checkedCount = optimisticItems.filter((i) => i.checked).length;
  const inputClass = "px-3 py-2 rounded-xl border-2 border-card-border bg-card text-sm focus:border-sage focus:outline-none transition-colors";

  return (
    <div className="rounded-2xl border-2 border-sage/40 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-sage/10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 font-semibold"
        >
          <span className="text-xs">{expanded ? "▼" : "▶"}</span>
          {list.name}
          <span className="text-sm font-normal text-muted">
            ({checkedCount}/{optimisticItems.length})
          </span>
        </button>
        <div className="flex gap-1">
          {items.length > 0 && (
            <>
              <form action={reuseShoppingList}>
                <input type="hidden" name="list_id" value={list.id} />
                <input type="hidden" name="list_name" value={list.name} />
                <button
                  type="submit"
                  className="px-3 py-1 text-xs rounded-xl border-2 border-sage/40 text-sage hover:bg-sage/10 transition-all active:scale-95"
                >
                  Reuse List
                </button>
              </form>
              <button
                onClick={handleClearChecked}
                className="px-3 py-1 text-xs rounded-xl border-2 border-honey/40 text-honey hover:bg-honey/10 transition-all active:scale-95"
              >
                Clear Checked
              </button>
            </>
          )}
          <form action={deleteShoppingList}>
            <input type="hidden" name="id" value={list.id} />
            <button
              type="submit"
              className="px-3 py-1 text-xs rounded-xl border-2 border-rose/40 text-rose hover:bg-rose/10 transition-all active:scale-95"
            >
              Delete List
            </button>
          </form>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4 bg-card">
          {clearedItems && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-honey/10 border-2 border-honey/30 text-sm">
              <span className="text-honey">{clearedItems.length} item{clearedItems.length !== 1 ? "s" : ""} cleared</span>
              <button
                onClick={handleUndo}
                className="px-3 py-1 text-xs font-medium rounded-xl bg-honey text-white hover:opacity-90 transition-all active:scale-95"
              >
                Undo
              </button>
            </div>
          )}
          {/* Items by category */}
          {Array.from(categories.entries()).map(([cat, catItems]) => (
            <div key={cat}>
              <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
                {cat}
              </h4>
              <div className="space-y-1">
                {catItems.map((item) => {
                  if (editingId === item.id) {
                    return (
                      <form
                        key={item.id}
                        action={async (fd) => {
                          await updateShoppingItem(fd);
                          setEditingId(null);
                        }}
                        className="flex gap-2 flex-wrap py-1.5"
                      >
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          name="name"
                          defaultValue={item.name}
                          required
                          className={`flex-1 min-w-[120px] ${inputClass}`}
                        />
                        <input
                          name="quantity"
                          defaultValue={item.quantity ?? ""}
                          placeholder="Qty"
                          autoComplete="on"
                          className={`w-20 ${inputClass}`}
                        />
                        <input
                          name="category"
                          defaultValue={item.category ?? ""}
                          placeholder="Category"
                          autoComplete="on"
                          className={`w-28 ${inputClass}`}
                        />
                        <input
                          name="notes"
                          defaultValue={item.notes ?? ""}
                          placeholder="Notes"
                          autoComplete="off"
                          className={`flex-1 min-w-[120px] ${inputClass}`}
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs rounded-xl bg-sage text-white font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs rounded-xl border-2 border-card-border hover:bg-sage/10 transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                      </form>
                    );
                  }

                  return (
                    <ToggleableItem
                      key={item.id}
                      item={item}
                      onToggle={() => setOptimisticItems(item.id)}
                      onEdit={() => setEditingId(item.id)}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {optimisticItems.length === 0 && (
            <p className="text-sm text-muted">No items yet.</p>
          )}

          {/* Add item form */}
          <AddItemForm listId={list.id} knownItems={knownItems} inputClass={inputClass} />
        </div>
      )}
    </div>
  );
}

function ToggleableItem({
  item,
  onToggle,
  onEdit,
}: {
  item: ShoppingItem;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const [, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <form
        action={(fd) => {
          startTransition(async () => {
            onToggle();
            await toggleShoppingItem(fd);
          });
        }}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="checked" value={String(item.checked)} />
        <button
          type="submit"
          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
            item.checked
              ? "bg-sage border-sage text-white"
              : "border-card-border hover:border-sage"
          }`}
        >
          {item.checked && "✓"}
        </button>
        <span className={item.checked ? "line-through text-muted" : ""}>
          {item.name}
        </span>
        {item.quantity && (
          <span className="text-xs text-muted shrink-0">
            ({item.quantity})
          </span>
        )}
        {item.notes && (
          <span className="text-xs text-muted/70 italic truncate">
            — {item.notes}
          </span>
        )}
      </form>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="text-muted hover:text-sage text-xs transition-colors"
        >
          Edit
        </button>
        <form action={deleteShoppingItem}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="text-muted hover:text-rose text-sm transition-colors"
          >
            ×
          </button>
        </form>
      </div>
    </div>
  );
}

function AddItemForm({
  listId,
  knownItems,
  inputClass,
}: {
  listId: number;
  knownItems: ItemCategory[];
  inputClass: string;
}) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);

  const matches =
    query.length >= 1
      ? knownItems.filter((ki) =>
          ki.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
      : [];

  function pickSuggestion(ki: ItemCategory) {
    setQuery(ki.name);
    setShowSuggestions(false);
    // Auto-fill category from the known mapping
    if (categoryRef.current && !categoryRef.current.value) {
      categoryRef.current.value = ki.category;
    }
  }

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addShoppingItem(fd);
        setQuery("");
        formRef.current?.reset();
      }}
      className="flex gap-2 flex-wrap"
    >
      <input type="hidden" name="list_id" value={listId} />
      <div className="relative flex-1 min-w-[120px]">
        <input
          name="name"
          placeholder="Item name *"
          required
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => query.length >= 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className={inputClass + " w-full"}
        />
        {showSuggestions && matches.length > 0 && (
          <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-card border-2 border-card-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {matches.map((ki) => (
              <li key={ki.name}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickSuggestion(ki)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-sage/10 transition-colors flex justify-between"
                >
                  <span>{ki.name}</span>
                  <span className="text-xs text-muted">{ki.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        name="quantity"
        placeholder="Qty"
        autoComplete="on"
        className={`w-20 ${inputClass}`}
      />
      <input
        ref={categoryRef}
        name="category"
        placeholder="Category"
        autoComplete="on"
        className={`w-28 ${inputClass}`}
      />
      <input
        name="notes"
        placeholder="Notes"
        autoComplete="off"
        className={`flex-1 min-w-[120px] ${inputClass}`}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-sage text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
      >
        + Add
      </button>
    </form>
  );
}
