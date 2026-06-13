"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { InventoryItem, InventoryLog } from "@/lib/types";
import { logActivity } from "@/lib/utils/activity-logger";

export async function getInventoryItems(): Promise<InventoryItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching inventory items:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getInventoryItems:", error);
    return [];
  }
}

export async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching inventory item:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error in getInventoryItem:", error);
    return null;
  }
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*");

    if (error) {
      console.error("Error fetching low stock items:", error);
      return [];
    }
    
    // Filter items where quantity <= reorder_level
    return (data || []).filter(item => item.quantity <= item.reorder_level);
  } catch (error) {
    console.error("Error in getLowStockItems:", error);
    return [];
  }
}

export async function getInventoryLogs(itemId: string): Promise<InventoryLog[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inventory_logs")
      .select("*")
      .eq("item_id", itemId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inventory logs:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getInventoryLogs:", error);
    return [];
  }
}

export async function createInventoryItem(formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    quantity: parseInt(formData.get("quantity") as string) || 0,
    unit: formData.get("unit") as string,
    reorder_level: parseInt(formData.get("reorder_level") as string) || 5,
  };

  const { data: newItem, error } = await supabase
    .from("inventory_items")
    .insert(data)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Log inventory item creation
  await logActivity({
    actionType: "create",
    entityType: "inventory",
    entityId: newItem.id,
    entityName: data.name,
    newValues: {
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      reorder_level: data.reorder_level,
    },
  });

  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function updateInventoryItem(id: string, formData: FormData) {
  const supabase = await createClient();

  // Get existing item for comparison
  const existingItem = await getInventoryItem(id);
  if (!existingItem) {
    return { error: "Item not found" };
  }

  const data = {
    name: formData.get("name") as string,
    unit: formData.get("unit") as string,
    reorder_level: parseInt(formData.get("reorder_level") as string) || 5,
  };

  const { error } = await supabase
    .from("inventory_items")
    .update(data)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Prepare old and new values for logging (only changed fields)
  const oldValues: Record<string, any> = {};
  const newValues: Record<string, any> = {};

  if (existingItem.name !== data.name) {
    oldValues.name = existingItem.name;
    newValues.name = data.name;
  }
  if (existingItem.unit !== data.unit) {
    oldValues.unit = existingItem.unit;
    newValues.unit = data.unit;
  }
  if (existingItem.reorder_level !== data.reorder_level) {
    oldValues.reorder_level = existingItem.reorder_level;
    newValues.reorder_level = data.reorder_level;
  }

  // Log inventory item update
  if (Object.keys(newValues).length > 0) {
    await logActivity({
      actionType: "update",
      entityType: "inventory",
      entityId: id,
      entityName: data.name,
      oldValues: Object.keys(oldValues).length > 0 ? oldValues : undefined,
      newValues: newValues,
    });
  }

  revalidatePath("/dashboard/inventory");
  revalidatePath(`/dashboard/inventory/${id}`);
  return { success: true };
}

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient();
  
  // Get item details before deletion for logging
  const item = await getInventoryItem(id);
  
  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Log inventory item deletion
  if (item) {
    await logActivity({
      actionType: "delete",
      entityType: "inventory",
      entityId: id,
      entityName: item.name,
      oldValues: {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        reorder_level: item.reorder_level,
      },
    });
  }

  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function restockItem(itemId: string, formData: FormData) {
  const supabase = await createClient();

  const amount = parseInt(formData.get("amount") as string);
  const notes = formData.get("notes") as string;

  if (amount <= 0) {
    return { error: "Amount must be greater than 0" };
  }

  // Update quantity
  const { error: updateError } = await supabase.rpc("increment_quantity", {
    item_id: itemId,
    amount: amount,
  });

  if (updateError) {
    // Fallback to manual update if RPC doesn't exist
    const item = await getInventoryItem(itemId);
    if (!item) {
      return { error: "Item not found" };
    }

    const { error: manualUpdateError } = await supabase
      .from("inventory_items")
      .update({
        quantity: item.quantity + amount,
        last_restocked_at: new Date().toISOString(),
      })
      .eq("id", itemId);

    if (manualUpdateError) {
      return { error: manualUpdateError.message };
    }
  } else {
    // Update last_restocked_at
    await supabase
      .from("inventory_items")
      .update({ last_restocked_at: new Date().toISOString() })
      .eq("id", itemId);
  }

  // Get item before update for logging
  const itemBefore = await getInventoryItem(itemId);
  if (!itemBefore) {
    return { error: "Item not found" };
  }

  // Create log entry
  const { error: logError } = await supabase.from("inventory_logs").insert({
    item_id: itemId,
    change_amount: amount,
    notes: notes || "Restocked",
  });

  if (logError) {
    return { error: logError.message };
  }

  // Get updated item to get new quantity
  const itemAfter = await getInventoryItem(itemId);
  
  // Log restock activity
  await logActivity({
    actionType: "restock",
    entityType: "inventory",
    entityId: itemId,
    entityName: itemBefore.name,
    details: {
      amount: amount,
      notes: notes || "Restocked",
      previous_quantity: itemBefore.quantity,
      new_quantity: itemAfter?.quantity || itemBefore.quantity + amount,
    },
  });

  revalidatePath("/dashboard/inventory");
  revalidatePath(`/dashboard/inventory/${itemId}`);
  return { success: true };
}

export async function consumeItem(itemId: string, formData: FormData) {
  const supabase = await createClient();

  const amount = parseInt(formData.get("amount") as string);
  const vehicleId = formData.get("vehicle_id") as string;
  const notes = formData.get("notes") as string;

  if (amount <= 0) {
    return { error: "Amount must be greater than 0" };
  }

  // Check if sufficient quantity
  const item = await getInventoryItem(itemId);
  if (!item) {
    return { error: "Item not found" };
  }

  if (item.quantity < amount) {
    return { error: "Insufficient stock" };
  }

  // Get vehicle info for notes
  let vehicleInfo = "";
  if (vehicleId) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("plate_number")
      .eq("id", vehicleId)
      .single();
    vehicleInfo = vehicle ? `Vehicle ${vehicle.plate_number}` : "";
  }

  // Update quantity
  const { error: updateError } = await supabase
    .from("inventory_items")
    .update({ quantity: item.quantity - amount })
    .eq("id", itemId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Create log entry
  const logNotes = vehicleInfo
    ? `Used on ${vehicleInfo}: ${notes || "Maintenance"}`
    : notes || "Used";

  const { error: logError } = await supabase.from("inventory_logs").insert({
    item_id: itemId,
    change_amount: -amount,
    notes: logNotes,
  });

  if (logError) {
    return { error: logError.message };
  }

  // Log consumption activity
  await logActivity({
    actionType: "consume",
    entityType: "inventory",
    entityId: itemId,
    entityName: item.name,
    details: {
      amount: amount,
      vehicle_id: vehicleId || null,
      vehicle_info: vehicleInfo || null,
      notes: notes || "Used",
      previous_quantity: item.quantity,
      new_quantity: item.quantity - amount,
    },
  });

  revalidatePath("/dashboard/inventory");
  revalidatePath(`/dashboard/inventory/${itemId}`);
  return { success: true };
}

