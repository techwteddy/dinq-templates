"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Driver } from "@/lib/types";
import { uploadDriverDocument, deleteDriverDocument } from "@/lib/supabase-driver-storage";
import { syncDriverStatus } from "./driver-status-sync";
import { logActivity } from "@/lib/utils/activity-logger";

export async function getDrivers(): Promise<Driver[]> {
  try {
    // Sync all driver statuses before fetching
    await syncDriverStatus();
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching drivers:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getDrivers:", error);
    return [];
  }
}

export async function getDriver(id: string): Promise<Driver | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching driver:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error in getDriver:", error);
    return null;
  }
}

export async function createDriver(formData: FormData) {
  const supabase = await createClient();

  // Handle file uploads
  let licenseImageUrl: string | null = null;
  let photoUrl: string | null = null;

  const licenseFile = formData.get("license_image") as File | null;
  const photoFile = formData.get("photo") as File | null;

  // Create temporary ID for file uploads
  const tempId = crypto.randomUUID();

  try {
    if (licenseFile && licenseFile.size > 0) {
      licenseImageUrl = await uploadDriverDocument(licenseFile, tempId, "license");
    }
    if (photoFile && photoFile.size > 0) {
      photoUrl = await uploadDriverDocument(photoFile, tempId, "photo");
    }
  } catch (error) {
    return {
      error: `Failed to upload documents: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  const data = {
    name: formData.get("name") as string,
    license_no: formData.get("license_no") as string,
    status: (formData.get("status") as string) || "available",
    license_image_url: licenseImageUrl,
    photo_url: photoUrl,
  };

  const { data: newDriver, error } = await supabase
    .from("drivers")
    .insert(data)
    .select()
    .single();

  if (error) {
    // Clean up uploaded files if insert fails
    if (licenseImageUrl) await deleteDriverDocument(licenseImageUrl).catch(console.error);
    if (photoUrl) await deleteDriverDocument(photoUrl).catch(console.error);
    
    // Provide user-friendly error message for duplicate license
    if (error.code === '23505' && error.message.includes('license_no')) {
      return { error: "A driver with this license number already exists. Please use a different license number." };
    }
    
    return { error: error.message };
  }

  // Log driver creation
  await logActivity({
    actionType: "create",
    entityType: "driver",
    entityId: newDriver.id,
    entityName: `${data.name} (${data.license_no})`,
    newValues: {
      name: data.name,
      license_no: data.license_no,
      status: data.status,
    },
  });

  revalidatePath("/dashboard/drivers");
  return { success: true };
}

export async function updateDriver(id: string, formData: FormData) {
  const supabase = await createClient();

  // Get existing driver to preserve existing image URLs if not updating
  const existingDriver = await getDriver(id);
  if (!existingDriver) {
    return { error: "Driver not found" };
  }

  // Handle file uploads
  let licenseImageUrl: string | null = existingDriver.license_image_url;
  let photoUrl: string | null = existingDriver.photo_url;

  const licenseFile = formData.get("license_image") as File | null;
  const photoFile = formData.get("photo") as File | null;

  try {
    if (licenseFile && licenseFile.size > 0) {
      // Delete old license if exists
      if (existingDriver.license_image_url) {
        await deleteDriverDocument(existingDriver.license_image_url).catch(console.error);
      }
      licenseImageUrl = await uploadDriverDocument(licenseFile, id, "license");
    }
    if (photoFile && photoFile.size > 0) {
      // Delete old photo if exists
      if (existingDriver.photo_url) {
        await deleteDriverDocument(existingDriver.photo_url).catch(console.error);
      }
      photoUrl = await uploadDriverDocument(photoFile, id, "photo");
    }
  } catch (error) {
    return {
      error: `Failed to upload documents: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  const data = {
    name: formData.get("name") as string,
    license_no: formData.get("license_no") as string,
    status: formData.get("status") as string,
    license_image_url: licenseImageUrl,
    photo_url: photoUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("drivers")
    .update(data)
    .eq("id", id);

  if (error) {
    // Clean up uploaded files if update fails
    if (licenseFile && licenseFile.size > 0 && licenseImageUrl && licenseImageUrl !== existingDriver.license_image_url) {
      await deleteDriverDocument(licenseImageUrl).catch(console.error);
    }
    if (photoFile && photoFile.size > 0 && photoUrl && photoUrl !== existingDriver.photo_url) {
      await deleteDriverDocument(photoUrl).catch(console.error);
    }
    
    // Provide user-friendly error message for duplicate license
    if (error.code === '23505' && error.message.includes('license_no')) {
      return { error: "A driver with this license number already exists. Please use a different license number." };
    }
    
    return { error: error.message };
  }

  // Prepare old and new values for logging (only changed fields)
  const oldValues: Record<string, any> = {};
  const newValues: Record<string, any> = {};

  if (existingDriver.name !== data.name) {
    oldValues.name = existingDriver.name;
    newValues.name = data.name;
  }
  if (existingDriver.license_no !== data.license_no) {
    oldValues.license_no = existingDriver.license_no;
    newValues.license_no = data.license_no;
  }
  if (existingDriver.status !== data.status) {
    oldValues.status = existingDriver.status;
    newValues.status = data.status;
  }
  if (licenseImageUrl !== existingDriver.license_image_url) {
    oldValues.license_image_url = existingDriver.license_image_url ? "file" : null;
    newValues.license_image_url = licenseImageUrl ? "file" : null;
  }
  if (photoUrl !== existingDriver.photo_url) {
    oldValues.photo_url = existingDriver.photo_url ? "file" : null;
    newValues.photo_url = photoUrl ? "file" : null;
  }

  // Log driver update
  if (Object.keys(newValues).length > 0) {
    await logActivity({
      actionType: "update",
      entityType: "driver",
      entityId: id,
      entityName: `${data.name} (${data.license_no})`,
      oldValues: Object.keys(oldValues).length > 0 ? oldValues : undefined,
      newValues: newValues,
    });
  }

  revalidatePath("/dashboard/drivers");
  revalidatePath(`/dashboard/drivers/${id}`);
  return { success: true };
}

export async function deleteDriver(id: string) {
  const supabase = await createClient();
  
  // Get driver details before deletion for logging
  const driver = await getDriver(id);
  
  const { error } = await supabase.from("drivers").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Log driver deletion
  if (driver) {
    await logActivity({
      actionType: "delete",
      entityType: "driver",
      entityId: id,
      entityName: `${driver.name} (${driver.license_no})`,
      oldValues: {
        name: driver.name,
        license_no: driver.license_no,
        status: driver.status,
      },
    });
  }

  revalidatePath("/dashboard/drivers");
  return { success: true };
}



