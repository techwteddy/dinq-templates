"use server";

import { createClient } from "@/lib/supabase/server";
import { startOfDay, endOfDay } from "date-fns";
import { nowGMT8, toGMT8 } from "@/lib/date-utils";

export async function getDashboardStats() {
  try {
    const supabase = await createClient();
    const now = nowGMT8();
    const todayStart = startOfDay(now).toISOString();
    const todayEnd = endOfDay(now).toISOString();

    // Get all vehicles with status counts
    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("status");

    const vehicleStats = {
      total: vehicles?.length || 0,
      available: vehicles?.filter((v) => v.status === "available").length || 0,
      maintenance: vehicles?.filter((v) => v.status === "maintenance").length || 0,
      unavailable: vehicles?.filter((v) => v.status === "unavailable").length || 0,
    };

    // Get all drivers with status counts
    const { data: drivers } = await supabase
      .from("drivers")
      .select("status");

    const driverStats = {
      total: drivers?.length || 0,
      available: drivers?.filter((d) => d.status === "available").length || 0,
      on_trip: drivers?.filter((d) => d.status === "on_trip").length || 0,
      unavailable: drivers?.filter((d) => d.status === "unavailable").length || 0,
    };

    // Get active trips (happening right now)
    const { data: activeTrips } = await supabase
      .from("reservations")
      .select("*, vehicle:vehicles(*), driver:drivers(*)")
      .lte("start_time", now.toISOString())
      .gte("end_time", now.toISOString());

    // Get low stock items
    const { data: lowStockItems } = await supabase
      .from("inventory_items")
      .select("*")
      .lt("quantity", supabase.rpc("reorder_level"));

    // Actually, let's use a simpler query since rpc might not work
    const { data: allInventory } = await supabase
      .from("inventory_items")
      .select("*");

    const lowStock = allInventory?.filter(
      (item) => item.quantity < item.reorder_level
    ) || [];

    return {
      vehicleStats,
      driverStats,
      activeTripsCount: activeTrips?.length || 0,
      activeTrips: activeTrips || [],
      lowStockCount: lowStock.length,
      lowStockItems: lowStock,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      vehicleStats: { total: 0, available: 0, maintenance: 0, unavailable: 0 },
      driverStats: { total: 0, available: 0, on_trip: 0, unavailable: 0 },
      activeTripsCount: 0,
      activeTrips: [],
      lowStockCount: 0,
      lowStockItems: [],
    };
  }
}

export async function getTodaysDepartures() {
  try {
    const supabase = await createClient();
    const now = nowGMT8();
    const todayStart = startOfDay(now).toISOString();
    const todayEnd = endOfDay(now).toISOString();

    const { data, error } = await supabase
      .from("reservations")
      .select("*, vehicle:vehicles(*), driver:drivers(*)")
      .gte("start_time", todayStart)
      .lte("start_time", todayEnd)
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching today's departures:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getTodaysDepartures:", error);
    return [];
  }
}

