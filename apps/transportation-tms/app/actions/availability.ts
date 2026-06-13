"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkAvailability(
  vehicleId: string | null,
  driverId: string | null,
  startTime: string,
  endTime: string,
  excludeReservationId?: string
): Promise<{ vehicleAvailable: boolean; driverAvailable: boolean }> {
  try {
    const supabase = await createClient();

    let vehicleAvailable = true;
    let driverAvailable = true;

    // Check vehicle availability
    // Two reservations overlap if:
    // existing.start_time < new.end_time AND existing.end_time > new.start_time
    if (vehicleId) {
      let query = supabase
        .from("reservations")
        .select("id")
        .eq("vehicle_id", vehicleId)
        .lt("start_time", endTime)  // Changed from lte to lt
        .gt("end_time", startTime);  // Changed from gte to gt

      if (excludeReservationId) {
        query = query.neq("id", excludeReservationId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error checking vehicle availability:", error);
        vehicleAvailable = false;
      } else {
        vehicleAvailable = !data || data.length === 0;
      }
    }

    // Check driver availability
    // Two reservations overlap if:
    // existing.start_time < new.end_time AND existing.end_time > new.start_time
    if (driverId) {
      let query = supabase
        .from("reservations")
        .select("id")
        .eq("driver_id", driverId)
        .lt("start_time", endTime)  // Changed from lte to lt
        .gt("end_time", startTime);  // Changed from gte to gt

      if (excludeReservationId) {
        query = query.neq("id", excludeReservationId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error checking driver availability:", error);
        driverAvailable = false;
      } else {
        driverAvailable = !data || data.length === 0;
      }
    }

    return { vehicleAvailable, driverAvailable };
  } catch (error) {
    console.error("Error in checkAvailability:", error);
    return { vehicleAvailable: false, driverAvailable: false };
  }
}

export async function getAvailableVehicles(
  startTime?: string,
  endTime?: string
) {
  try {
    const supabase = await createClient();

    // Get all vehicles with assigned driver info
    const { data: allVehicles, error: vehiclesError } = await supabase
      .from("vehicles")
      .select("*, assigned_driver:drivers!assigned_driver_id(id, name, license_no)")
      .eq("status", "available");

    if (vehiclesError) {
      console.error("Error fetching vehicles:", vehiclesError);
      return [];
    }

    // If no time range provided, return all available vehicles
    // The final availability check will happen on form submit
    if (!startTime || !endTime) {
      return allVehicles || [];
    }

    // Get booked vehicles in the time range
    // Only consider actually overlapping reservations (not back-to-back)
    const { data: bookedReservations, error: reservationsError } =
      await supabase
        .from("reservations")
        .select("vehicle_id")
        .lt("start_time", endTime)  // Changed from lte to lt
        .gt("end_time", startTime)  // Changed from gte to gt
        .not("vehicle_id", "is", null);

    if (reservationsError) {
      console.error("Error fetching reservations:", reservationsError);
      return allVehicles || [];
    }

    const bookedVehicleIds = new Set(
      bookedReservations?.map((r) => r.vehicle_id).filter(Boolean) || []
    );

    return (
      allVehicles?.filter((v) => !bookedVehicleIds.has(v.id)) || []
    );
  } catch (error) {
    console.error("Error in getAvailableVehicles:", error);
    return [];
  }
}

export async function getAvailableDrivers(
  startTime?: string,
  endTime?: string
) {
  try {
    const supabase = await createClient();

    // Get all drivers
    const { data: allDrivers, error: driversError } = await supabase
      .from("drivers")
      .select("*")
      .eq("status", "available");

    if (driversError) {
      console.error("Error fetching drivers:", driversError);
      return [];
    }

    // If no time range provided, return all available drivers
    // The final availability check will happen on form submit
    if (!startTime || !endTime) {
      return allDrivers || [];
    }

    // Get booked drivers in the time range
    // Only consider actually overlapping reservations (not back-to-back)
    const { data: bookedReservations, error: reservationsError } =
      await supabase
        .from("reservations")
        .select("driver_id")
        .lt("start_time", endTime)  // Changed from lte to lt
        .gt("end_time", startTime)  // Changed from gte to gt
        .not("driver_id", "is", null);

    if (reservationsError) {
      console.error("Error fetching reservations:", reservationsError);
      return allDrivers || [];
    }

    const bookedDriverIds = new Set(
      bookedReservations?.map((r) => r.driver_id).filter(Boolean) || []
    );

    return allDrivers?.filter((d) => !bookedDriverIds.has(d.id)) || [];
  } catch (error) {
    console.error("Error in getAvailableDrivers:", error);
    return [];
  }
}



