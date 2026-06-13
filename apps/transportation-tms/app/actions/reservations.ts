"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Reservation } from "@/lib/types";
import { uploadApprovalLetter, deleteApprovalLetter } from "@/lib/supabase-storage";
import { checkAvailability } from "./availability";
import { syncDriverStatus } from "./driver-status-sync";
import { datetimeLocalToUTC, toGMT8 } from "@/lib/date-utils";
import { startOfDay, endOfDay } from "date-fns";
import { logActivity } from "@/lib/utils/activity-logger";

export async function getReservations(): Promise<Reservation[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        vehicle:vehicles(*),
        driver:drivers(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reservations:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getReservations:", error);
    return [];
  }
}

export async function getReservation(id: string): Promise<Reservation | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        vehicle:vehicles(*),
        driver:drivers(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching reservation:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error in getReservation:", error);
    return null;
  }
}

export async function createReservation(formData: FormData) {
  const supabase = await createClient();

  const vehicleId = formData.get("vehicle_id") as string;
  const driverId = formData.get("driver_id") as string;
  const startTimeLocal = formData.get("start_time") as string;
  const endTimeLocal = formData.get("end_time") as string;

  // Convert datetime-local (interpreted as GMT+8) to UTC
  const startTime = datetimeLocalToUTC(startTimeLocal);
  const endTime = datetimeLocalToUTC(endTimeLocal);

  // Check availability
  const { vehicleAvailable, driverAvailable } = await checkAvailability(
    vehicleId || null,
    driverId || null,
    startTime,
    endTime
  );

  if (!vehicleAvailable) {
    return { error: "Vehicle is not available for the selected time range" };
  }

  if (!driverAvailable) {
    return { error: "Driver is not available for the selected time range" };
  }

  // Handle file upload if present
  let approvalLetterUrl: string | null = null;
  const file = formData.get("approval_letter") as File | null;

  if (file && file.size > 0) {
    try {
      // Create a temporary reservation ID for file upload
      // We'll update it after creating the reservation
      const tempId = crypto.randomUUID();
      approvalLetterUrl = await uploadApprovalLetter(file, tempId);
    } catch (error) {
      return {
        error: `Failed to upload approval letter: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  const data = {
    department_name: formData.get("department_name") as string,
    requestor_name: formData.get("requestor_name") as string,
    purpose: formData.get("purpose") as string,
    destination: formData.get("destination") as string,
    departure_area: formData.get("departure_area") as string,
    start_time: startTime,
    end_time: endTime,
    vehicle_id: vehicleId || null,
    driver_id: driverId || null,
    approval_letter_url: approvalLetterUrl,
  };

  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert(data)
    .select()
    .single();

  if (error) {
    // Clean up uploaded file if reservation creation fails
    if (approvalLetterUrl) {
      try {
        await deleteApprovalLetter(approvalLetterUrl);
      } catch (deleteError) {
        console.error("Failed to delete uploaded file:", deleteError);
      }
    }
    return { error: error.message };
  }

  // Sync driver status if driver is assigned
  if (driverId) {
    await syncDriverStatus(driverId);
  }

  // Log reservation creation
  await logActivity({
    actionType: "create",
    entityType: "reservation",
    entityId: reservation.id,
    entityName: `${data.department_name} - ${data.requestor_name}`,
    newValues: {
      department_name: data.department_name,
      requestor_name: data.requestor_name,
      purpose: data.purpose,
      destination: data.destination,
      departure_area: data.departure_area,
      start_time: data.start_time,
      end_time: data.end_time,
      vehicle_id: data.vehicle_id,
      driver_id: data.driver_id,
    },
  });

  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard");
  return { success: true, data: reservation };
}

export async function updateReservation(id: string, formData: FormData) {
  const supabase = await createClient();

  // Get existing reservation
  const existing = await getReservation(id);
  if (!existing) {
    return { error: "Reservation not found" };
  }

  const vehicleId = formData.get("vehicle_id") as string;
  const driverId = formData.get("driver_id") as string;
  const startTimeLocal = formData.get("start_time") as string;
  const endTimeLocal = formData.get("end_time") as string;

  // Convert datetime-local (interpreted as GMT+8) to UTC
  const startTime = datetimeLocalToUTC(startTimeLocal);
  const endTime = datetimeLocalToUTC(endTimeLocal);

  // Check availability (excluding current reservation)
  const { vehicleAvailable, driverAvailable } = await checkAvailability(
    vehicleId || null,
    driverId || null,
    startTime,
    endTime,
    id
  );

  if (!vehicleAvailable) {
    return { error: "Vehicle is not available for the selected time range" };
  }

  if (!driverAvailable) {
    return { error: "Driver is not available for the selected time range" };
  }

  // Handle file upload/replacement
  let approvalLetterUrl: string | null = existing.approval_letter_url;
  const file = formData.get("approval_letter") as File | null;

  if (file && file.size > 0) {
    try {
      // Delete old file if it exists
      if (existing.approval_letter_url) {
        try {
          await deleteApprovalLetter(existing.approval_letter_url);
        } catch (deleteError) {
          console.error("Failed to delete old file:", deleteError);
        }
      }

      approvalLetterUrl = await uploadApprovalLetter(file, id);
    } catch (error) {
      return {
        error: `Failed to upload approval letter: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  const data = {
    department_name: formData.get("department_name") as string,
    requestor_name: formData.get("requestor_name") as string,
    purpose: formData.get("purpose") as string,
    destination: formData.get("destination") as string,
    departure_area: formData.get("departure_area") as string,
    start_time: startTime,
    end_time: endTime,
    vehicle_id: vehicleId || null,
    driver_id: driverId || null,
    approval_letter_url: approvalLetterUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("reservations")
    .update(data)
    .eq("id", id);

  if (error) {
    // Clean up uploaded file if update fails
    if (file && file.size > 0 && approvalLetterUrl !== existing.approval_letter_url) {
      try {
        await deleteApprovalLetter(approvalLetterUrl!);
      } catch (deleteError) {
        console.error("Failed to delete uploaded file:", deleteError);
      }
    }
    return { error: error.message };
  }

  // Sync driver status if driver changed or is assigned
  const oldDriverId = existing.driver_id;
  if (driverId || oldDriverId) {
    // Sync both old and new driver if they're different
    if (oldDriverId && oldDriverId !== driverId) {
      await syncDriverStatus(oldDriverId);
    }
    if (driverId) {
      await syncDriverStatus(driverId);
    }
  }

  // Prepare old and new values for logging (only changed fields)
  const oldValues: Record<string, any> = {};
  const newValues: Record<string, any> = {};

  if (existing.department_name !== data.department_name) {
    oldValues.department_name = existing.department_name;
    newValues.department_name = data.department_name;
  }
  if (existing.requestor_name !== data.requestor_name) {
    oldValues.requestor_name = existing.requestor_name;
    newValues.requestor_name = data.requestor_name;
  }
  if (existing.purpose !== data.purpose) {
    oldValues.purpose = existing.purpose;
    newValues.purpose = data.purpose;
  }
  if (existing.destination !== data.destination) {
    oldValues.destination = existing.destination;
    newValues.destination = data.destination;
  }
  if (existing.departure_area !== data.departure_area) {
    oldValues.departure_area = existing.departure_area;
    newValues.departure_area = data.departure_area;
  }
  if (existing.start_time !== data.start_time) {
    oldValues.start_time = existing.start_time;
    newValues.start_time = data.start_time;
  }
  if (existing.end_time !== data.end_time) {
    oldValues.end_time = existing.end_time;
    newValues.end_time = data.end_time;
  }
  if (existing.vehicle_id !== data.vehicle_id) {
    oldValues.vehicle_id = existing.vehicle_id;
    newValues.vehicle_id = data.vehicle_id;
  }
  if (existing.driver_id !== data.driver_id) {
    oldValues.driver_id = existing.driver_id;
    newValues.driver_id = data.driver_id;
  }
  if (approvalLetterUrl !== existing.approval_letter_url) {
    oldValues.approval_letter_url = existing.approval_letter_url ? "file" : null;
    newValues.approval_letter_url = approvalLetterUrl ? "file" : null;
  }

  // Log reservation update
  if (Object.keys(newValues).length > 0) {
    await logActivity({
      actionType: "update",
      entityType: "reservation",
      entityId: id,
      entityName: `${data.department_name} - ${data.requestor_name}`,
      oldValues: Object.keys(oldValues).length > 0 ? oldValues : undefined,
      newValues: newValues,
    });
  }

  revalidatePath("/dashboard/reservations");
  revalidatePath(`/dashboard/reservations/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteReservation(id: string) {
  const supabase = await createClient();

  // Get reservation to delete associated file and sync driver status
  const reservation = await getReservation(id);
  const driverId = reservation?.driver_id;
  
  if (reservation?.approval_letter_url) {
    try {
      await deleteApprovalLetter(reservation.approval_letter_url);
    } catch (error) {
      console.error("Failed to delete approval letter:", error);
    }
  }

  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Sync driver status if driver was assigned
  if (driverId) {
    await syncDriverStatus(driverId);
  }

  // Log reservation deletion
  if (reservation) {
    await logActivity({
      actionType: "delete",
      entityType: "reservation",
      entityId: id,
      entityName: `${reservation.department_name} - ${reservation.requestor_name}`,
      oldValues: {
        department_name: reservation.department_name,
        requestor_name: reservation.requestor_name,
        purpose: reservation.purpose,
        destination: reservation.destination,
        start_time: reservation.start_time,
        end_time: reservation.end_time,
        vehicle_id: reservation.vehicle_id,
        driver_id: reservation.driver_id,
      },
    });
  }

  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  try {
    const supabase = await createClient();
    
    // Parse the date string and get start/end of day in GMT+8
    const selectedDate = new Date(date);
    const gmt8Date = toGMT8(selectedDate);
    const dayStart = startOfDay(gmt8Date);
    const dayEnd = endOfDay(gmt8Date);
    
    // Convert to UTC for database query
    const startUTC = dayStart.toISOString();
    const endUTC = dayEnd.toISOString();

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        vehicle:vehicles(*),
        driver:drivers(*)
      `)
      .gte("start_time", startUTC)
      .lte("start_time", endUTC)
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching reservations by date:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getReservationsByDate:", error);
    return [];
  }
}



