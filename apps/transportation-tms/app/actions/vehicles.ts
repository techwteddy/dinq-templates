"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Vehicle } from "@/lib/types";
import { uploadVehicleDocument, deleteVehicleDocument } from "@/lib/supabase-vehicle-storage";
import { logActivity } from "@/lib/utils/activity-logger";

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*, assigned_driver:drivers!assigned_driver_id(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching vehicles:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getVehicles:", error);
    return [];
  }
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*, assigned_driver:drivers!assigned_driver_id(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching vehicle:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error in getVehicle:", error);
    return null;
  }
}

export async function createVehicle(formData: FormData) {
  const supabase = await createClient();

  // Handle file uploads
  let orImageUrl: string | null = null;
  let crImageUrl: string | null = null;

  const orFile = formData.get("or_image") as File | null;
  const crFile = formData.get("cr_image") as File | null;

  // Create temporary ID for file uploads
  const tempId = crypto.randomUUID();

  try {
    if (orFile && orFile.size > 0) {
      orImageUrl = await uploadVehicleDocument(orFile, tempId, "or");
    }
    if (crFile && crFile.size > 0) {
      crImageUrl = await uploadVehicleDocument(crFile, tempId, "cr");
    }
  } catch (error) {
    return {
      error: `Failed to upload documents: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  const assignedDriverId = formData.get("assigned_driver_id") as string;
  
  const data = {
    plate_number: formData.get("plate_number") as string,
    vehicle_type: formData.get("vehicle_type") as string,
    capacity: parseInt(formData.get("capacity") as string),
    status: (formData.get("status") as string) || "available",
    assigned_driver_id: assignedDriverId || null,
    or_image_url: orImageUrl,
    cr_image_url: crImageUrl,
  };

  const { data: newVehicle, error } = await supabase
    .from("vehicles")
    .insert(data)
    .select()
    .single();

  if (error) {
    // Clean up uploaded files if insert fails
    if (orImageUrl) await deleteVehicleDocument(orImageUrl).catch(console.error);
    if (crImageUrl) await deleteVehicleDocument(crImageUrl).catch(console.error);
    return { error: error.message };
  }

  // Log vehicle creation
  await logActivity({
    actionType: "create",
    entityType: "vehicle",
    entityId: newVehicle.id,
    entityName: data.plate_number,
    newValues: {
      plate_number: data.plate_number,
      vehicle_type: data.vehicle_type,
      capacity: data.capacity,
      status: data.status,
      assigned_driver_id: data.assigned_driver_id,
    },
  });

  revalidatePath("/dashboard/vehicles");
  return { success: true };
}

export async function updateVehicle(id: string, formData: FormData) {
  const supabase = await createClient();

  // Get existing vehicle to preserve existing image URLs if not updating
  const existingVehicle = await getVehicle(id);
  if (!existingVehicle) {
    return { error: "Vehicle not found" };
  }

  // Handle file uploads
  let orImageUrl: string | null = existingVehicle.or_image_url;
  let crImageUrl: string | null = existingVehicle.cr_image_url;

  const orFile = formData.get("or_image") as File | null;
  const crFile = formData.get("cr_image") as File | null;

  try {
    if (orFile && orFile.size > 0) {
      // Delete old OR if exists
      if (existingVehicle.or_image_url) {
        await deleteVehicleDocument(existingVehicle.or_image_url).catch(console.error);
      }
      orImageUrl = await uploadVehicleDocument(orFile, id, "or");
    }
    if (crFile && crFile.size > 0) {
      // Delete old CR if exists
      if (existingVehicle.cr_image_url) {
        await deleteVehicleDocument(existingVehicle.cr_image_url).catch(console.error);
      }
      crImageUrl = await uploadVehicleDocument(crFile, id, "cr");
    }
  } catch (error) {
    return {
      error: `Failed to upload documents: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  const assignedDriverId = formData.get("assigned_driver_id") as string;
  
  const data = {
    plate_number: formData.get("plate_number") as string,
    vehicle_type: formData.get("vehicle_type") as string,
    capacity: parseInt(formData.get("capacity") as string),
    status: formData.get("status") as string,
    assigned_driver_id: assignedDriverId || null,
    or_image_url: orImageUrl,
    cr_image_url: crImageUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("vehicles")
    .update(data)
    .eq("id", id);

  if (error) {
    // Clean up uploaded files if update fails
    if (orFile && orFile.size > 0 && orImageUrl && orImageUrl !== existingVehicle.or_image_url) {
      await deleteVehicleDocument(orImageUrl).catch(console.error);
    }
    if (crFile && crFile.size > 0 && crImageUrl && crImageUrl !== existingVehicle.cr_image_url) {
      await deleteVehicleDocument(crImageUrl).catch(console.error);
    }
    return { error: error.message };
  }

  // Prepare old and new values for logging (only changed fields)
  const oldValues: Record<string, any> = {};
  const newValues: Record<string, any> = {};

  if (existingVehicle.plate_number !== data.plate_number) {
    oldValues.plate_number = existingVehicle.plate_number;
    newValues.plate_number = data.plate_number;
  }
  if (existingVehicle.vehicle_type !== data.vehicle_type) {
    oldValues.vehicle_type = existingVehicle.vehicle_type;
    newValues.vehicle_type = data.vehicle_type;
  }
  if (existingVehicle.capacity !== data.capacity) {
    oldValues.capacity = existingVehicle.capacity;
    newValues.capacity = data.capacity;
  }
  if (existingVehicle.status !== data.status) {
    oldValues.status = existingVehicle.status;
    newValues.status = data.status;
  }
  if (existingVehicle.assigned_driver_id !== data.assigned_driver_id) {
    oldValues.assigned_driver_id = existingVehicle.assigned_driver_id;
    newValues.assigned_driver_id = data.assigned_driver_id;
  }
  if (orImageUrl !== existingVehicle.or_image_url) {
    oldValues.or_image_url = existingVehicle.or_image_url ? "file" : null;
    newValues.or_image_url = orImageUrl ? "file" : null;
  }
  if (crImageUrl !== existingVehicle.cr_image_url) {
    oldValues.cr_image_url = existingVehicle.cr_image_url ? "file" : null;
    newValues.cr_image_url = crImageUrl ? "file" : null;
  }

  // Log vehicle update
  if (Object.keys(newValues).length > 0) {
    await logActivity({
      actionType: "update",
      entityType: "vehicle",
      entityId: id,
      entityName: data.plate_number,
      oldValues: Object.keys(oldValues).length > 0 ? oldValues : undefined,
      newValues: newValues,
    });
  }

  revalidatePath("/dashboard/vehicles");
  revalidatePath(`/dashboard/vehicles/${id}`);
  return { success: true };
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient();
  
  // Get vehicle details before deletion for logging
  const vehicle = await getVehicle(id);
  
  const { error } = await supabase.from("vehicles").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Log vehicle deletion
  if (vehicle) {
    await logActivity({
      actionType: "delete",
      entityType: "vehicle",
      entityId: id,
      entityName: vehicle.plate_number,
      oldValues: {
        plate_number: vehicle.plate_number,
        vehicle_type: vehicle.vehicle_type,
        capacity: vehicle.capacity,
        status: vehicle.status,
      },
    });
  }

  revalidatePath("/dashboard/vehicles");
  return { success: true };
}



