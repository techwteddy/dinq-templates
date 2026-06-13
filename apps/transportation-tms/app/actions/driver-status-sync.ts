"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { nowGMT8 } from "@/lib/date-utils";

/**
 * Synchronizes driver status based on active reservations
 * - If a driver has an active reservation (current time is between start_time and end_time), set status to "on_trip"
 * - If a driver has no active reservation and status is "on_trip", set status to "available"
 * - Respects manually set "unavailable" status (doesn't override it)
 * 
 * @param driverId Optional - if provided, only syncs that specific driver. Otherwise syncs all drivers.
 */
export async function syncDriverStatus(driverId?: string) {
  try {
    const supabase = await createClient();
    const now = nowGMT8().toISOString();
    
    // Get drivers with active reservations (current time is between start and end)
    const { data: activeReservations, error: reservationsError } = await supabase
      .from("reservations")
      .select("driver_id")
      .lte("start_time", now)
      .gte("end_time", now)
      .not("driver_id", "is", null);
    
    if (reservationsError) {
      console.error("Error fetching active reservations:", reservationsError);
      return { error: reservationsError.message };
    }
    
    const activeDriverIds = new Set(
      activeReservations?.map((r) => r.driver_id).filter(Boolean) || []
    );
    
    // If specific driver, update just that one
    if (driverId) {
      const newStatus = activeDriverIds.has(driverId) ? "on_trip" : "available";
      
      // Only update if the driver is not manually set to "unavailable"
      const { error } = await supabase
        .from("drivers")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", driverId)
        .neq("status", "unavailable"); // Don't override manual "unavailable"
      
      if (error) {
        console.error("Error updating driver status:", error);
        return { error: error.message };
      }
      
      revalidatePath("/dashboard/drivers");
      revalidatePath(`/dashboard/drivers/${driverId}`);
      return { success: true };
    }
    
    // Update all drivers
    // 1. Set to "on_trip" if they have active reservation
    if (activeDriverIds.size > 0) {
      const { error: onTripError } = await supabase
        .from("drivers")
        .update({ status: "on_trip", updated_at: new Date().toISOString() })
        .in("id", Array.from(activeDriverIds))
        .neq("status", "unavailable"); // Don't override manual "unavailable"
      
      if (onTripError) {
        console.error("Error setting drivers to on_trip:", onTripError);
      }
    }
    
    // 2. Set to "available" if no active reservation and currently "on_trip"
    const { data: driversToMakeAvailable, error: driversError } = await supabase
      .from("drivers")
      .select("id")
      .eq("status", "on_trip");
    
    if (!driversError && driversToMakeAvailable && driversToMakeAvailable.length > 0) {
      const driversToUpdate = driversToMakeAvailable
        .filter((d) => !activeDriverIds.has(d.id))
        .map((d) => d.id);
      
      if (driversToUpdate.length > 0) {
        const { error: availableError } = await supabase
          .from("drivers")
          .update({ status: "available", updated_at: new Date().toISOString() })
          .in("id", driversToUpdate);
        
        if (availableError) {
          console.error("Error setting drivers to available:", availableError);
        }
      }
    }
    
    revalidatePath("/dashboard/drivers");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in syncDriverStatus:", error);
    return { 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

