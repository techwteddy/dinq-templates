"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  toggleRecurrenceActive,
  deleteRecurrence,
  generateNextTransaction,
} from "@/lib/actions/recurrences";
import type { Recurrence } from "@/types/database";
import { Play, Power, PowerOff, Trash2 } from "lucide-react";

export function RowActions({ recurrence }: { recurrence: Recurrence }) {
  const [pending, startTransition] = useTransition();

  function onGenerate() {
    startTransition(async () => {
      const result = await generateNextTransaction(recurrence.id);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Transaction generated.");
    });
  }

  function onToggle() {
    startTransition(async () => {
      const result = await toggleRecurrenceActive(recurrence.id, !recurrence.active);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(recurrence.active ? "Recurrence paused." : "Recurrence reactivated.");
    });
  }

  function onDelete() {
    if (!confirm("Delete this recurrence? Already generated transactions will remain.")) return;
    startTransition(async () => {
      const result = await deleteRecurrence(recurrence.id);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Recurrence deleted.");
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={onGenerate}
        disabled={pending || !recurrence.active}
        title="Generate next transaction"
      >
        <Play className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={onToggle}
        disabled={pending}
        title={recurrence.active ? "Pause" : "Reactivate"}
      >
        {recurrence.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
      </Button>
      <Button size="icon" variant="ghost" onClick={onDelete} disabled={pending} title="Delete">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
