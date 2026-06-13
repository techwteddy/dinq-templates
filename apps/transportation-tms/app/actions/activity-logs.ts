"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActivityLog } from "@/lib/types";
import { getCurrentAdminUser } from "./admin-management";

export interface GetActivityLogsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  actionType?: string;
  entityType?: string;
  userId?: string;
  search?: string;
}

export interface GetActivityLogsResult {
  data: ActivityLog[];
  total: number;
  page: number;
  limit: number;
  error: string | null;
}

/**
 * Get activity logs with filtering, pagination, and sorting
 * Only supervisors can access this
 */
export async function getActivityLogs(
  params: GetActivityLogsParams = {}
): Promise<GetActivityLogsResult> {
  try {
    // Verify current user is a supervisor
    const currentUser = await getCurrentAdminUser();
    if (!currentUser || currentUser.role !== "supervisor") {
      return {
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 50,
        error: "Unauthorized: Only supervisors can view activity logs.",
      };
    }

    const supabase = await createClient();
    const page = params.page || 1;
    const limit = params.limit || 50;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("activity_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Apply filters
    if (params.startDate) {
      query = query.gte("created_at", params.startDate);
    }
    if (params.endDate) {
      // Add one day to endDate to include the entire day
      const endDate = new Date(params.endDate);
      endDate.setDate(endDate.getDate() + 1);
      query = query.lt("created_at", endDate.toISOString());
    }
    if (params.actionType) {
      query = query.eq("action_type", params.actionType);
    }
    if (params.entityType) {
      query = query.eq("entity_type", params.entityType);
    }
    if (params.userId) {
      query = query.eq("user_id", params.userId);
    }
    if (params.search) {
      query = query.or(
        `entity_name.ilike.%${params.search}%,user_email.ilike.%${params.search}%,user_name.ilike.%${params.search}%`
      );
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        error: error.message,
      };
    }

    return {
      data: (data as ActivityLog[]) || [],
      total: count || 0,
      page,
      limit,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 50,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

/**
 * Get distinct action types for filter dropdown
 * Returns all supported action types, including those from database
 */
export async function getActionTypes(): Promise<string[]> {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser || currentUser.role !== "supervisor") {
      return [];
    }

    // Define all supported action types in the system
    const supportedActionTypes = [
      "login",
      "logout",
      "create",
      "update",
      "delete",
      "restock",
      "consume",
    ];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activity_logs")
      .select("action_type")
      .order("action_type", { ascending: true });

    if (error) {
      console.error("Error fetching action types:", error);
      // Return supported types even if database query fails
      return supportedActionTypes.sort();
    }

    // Get unique action types from database
    const dbTypes = Array.from(
      new Set((data || []).map((item) => item.action_type))
    );

    // Combine supported types with database types and remove duplicates
    const allTypes = Array.from(new Set([...supportedActionTypes, ...dbTypes]));
    return allTypes.sort();
  } catch (error) {
    console.error("Error in getActionTypes:", error);
    // Return supported types even on error
    return [
      "login",
      "logout",
      "create",
      "update",
      "delete",
      "restock",
      "consume",
    ].sort();
  }
}

/**
 * Get distinct entity types for filter dropdown
 * Returns all supported entity types, including those from database
 */
export async function getEntityTypes(): Promise<string[]> {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser || currentUser.role !== "supervisor") {
      return [];
    }

    // Define all supported entity types in the system
    const supportedEntityTypes = [
      "auth",
      "reservation",
      "driver",
      "vehicle",
      "inventory",
      "admin",
    ];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activity_logs")
      .select("entity_type")
      .order("entity_type", { ascending: true });

    if (error) {
      console.error("Error fetching entity types:", error);
      // Return supported types even if database query fails
      return supportedEntityTypes.sort();
    }

    // Get unique entity types from database
    const dbTypes = Array.from(
      new Set((data || []).map((item) => item.entity_type))
    );

    // Combine supported types with database types and remove duplicates
    const allTypes = Array.from(new Set([...supportedEntityTypes, ...dbTypes]));
    return allTypes.sort();
  } catch (error) {
    console.error("Error in getEntityTypes:", error);
    // Return supported types even on error
    return [
      "auth",
      "reservation",
      "driver",
      "vehicle",
      "inventory",
      "admin",
    ].sort();
  }
}


