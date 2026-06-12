"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  updateCategory,
  createCategory,
  deleteCategory,
  type CategoryInput,
} from "@/lib/actions/categories";
import type { Category, CategoryType } from "@/types/database";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { IconPreview, CATEGORY_ICONS } from "@/components/icon-preview";

type Props = { mode?: "create" | "edit"; category?: Category };

const PRESET_COLORS = [
  "#71717a", // Zinc
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#84cc16", // Lime
  "#22c55e", // Green
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#a855f7", // Purple
  "#d946ef", // Fuchsia
  "#ec4899", // Pink
];

export function CategoryForm({ mode = "create", category }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(category?.name ?? "");
  const [type, setType] = useState<CategoryType>((category?.type as CategoryType) ?? "expense");
  const [color, setColor] = useState(category?.color ?? "#71717a");
  const [icon, setIcon] = useState(category?.icon ?? "Package");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CategoryInput = {
      name,
      type,
      color: color || null,
      icon: icon || null,
    };
    startTransition(async () => {
      const result =
        mode === "create" ? await createCategory(payload) : await updateCategory(category!.id, payload);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(mode === "create" ? "Category created." : "Category updated.");
      setOpen(false);
    });
  }

  function onDelete() {
    if (!category) return;
    if (!confirm("Delete this category?")) return;
    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Category deleted.");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button size="icon" variant="ghost">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" /> New category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New category" : "Edit category"}</DialogTitle>
          <DialogDescription>Classifies your transactions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center gap-4 py-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shadow-inner">
              <IconPreview name={icon} className="h-6 w-6" style={{ color: color ?? "currentColor" }} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Category name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Groceries" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Flow type</Label>
              <Select value={type} onValueChange={(v) => setType(v as CategoryType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
               <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CATEGORY_ICONS.map((ic) => (
                    <SelectItem key={ic} value={ic}>
                      <div className="flex items-center gap-2">
                        <IconPreview name={ic} className="h-4 w-4" />
                        <span className="text-xs">{ic}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="color">Custom color</Label>
              <span className="text-[10px] text-muted-foreground font-mono uppercase">{color}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-6 w-6 rounded-full border shadow-sm transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-ring ring-offset-1' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
              <div className="relative h-6 w-6 rounded-full border shadow-sm items-center justify-center flex overflow-hidden">
                 <input
                  type="color"
                  className="absolute inset-0 h-10 w-10 -translate-x-1 -translate-y-1 cursor-pointer"
                  value={color ?? "#71717a"}
                  onChange={(e) => setColor(e.target.value)}
                />
                <Plus className="h-3 w-3 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-2 pt-2">
            {mode === "edit" ? (
              <Button type="button" variant="destructive" size="sm" onClick={onDelete} disabled={pending}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending || !name}>
                {pending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
