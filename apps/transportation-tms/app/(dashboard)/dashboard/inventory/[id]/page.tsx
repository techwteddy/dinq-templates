import {
  getInventoryItem,
  getInventoryLogs,
} from "@/app/actions/inventory";
import { getVehicles } from "@/app/actions/vehicles";
import { notFound } from "next/navigation";
import InventoryItemPageClient from "./page-client";

export default async function InventoryItemPage({
  params,
}: {
  params: { id: string };
}) {
  const [item, logs, vehicles] = await Promise.all([
    getInventoryItem(params.id),
    getInventoryLogs(params.id),
    getVehicles(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <InventoryItemPageClient
      item={item}
      logs={logs}
      vehicles={vehicles}
    />
  );
}
