"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export interface LogActivityParams {
  actionType: string;
  entityType: string;
  entityId?: string | null;
  entityName?: string | null;
  details?: Record<string, any>;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

/**
 * Centralized activity logging function
 * Logs all user activities to the activity_logs table
 * This function is non-blocking and will not throw errors
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Don't log if user is not authenticated
      return;
    }

    // Get user details from admin_users table
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id, email, name")
      .eq("id", user.id)
      .single();

    // Get request headers for IP and user agent
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      headersList.get("remote-addr") ||
      null;
    const userAgent = headersList.get("user-agent") || null;

    // Insert log entry
    const { error } = await supabase.from("activity_logs").insert({
      user_id: adminUser?.id || user.id,
      user_email: adminUser?.email || user.email,
      user_name: adminUser?.name || null,
      action_type: params.actionType,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      entity_name: params.entityName || null,
      details: params.details || null,
      old_values: params.oldValues || null,
      new_values: params.newValues || null,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      // Log error but don't throw - we don't want logging failures to break main operations
      console.error("Failed to log activity:", {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        params: {
          actionType: params.actionType,
          entityType: params.entityType,
          entityId: params.entityId,
        },
      });
    } else {
      // Success - log in development mode only
      if (process.env.NODE_ENV === "development") {
        console.log("Activity logged:", {
          actionType: params.actionType,
          entityType: params.entityType,
          entityName: params.entityName,
        });
      }
    }
  } catch (error) {
    // Log error details for debugging
    console.error("Error in logActivity:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      params: {
        actionType: params.actionType,
        entityType: params.entityType,
      },
    });
  }
}

