"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { AdminUser } from "@/lib/types";
import { logActivity } from "@/lib/utils/activity-logger";

/**
 * Get the current logged-in admin user with their role
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single();

  return adminUser;
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers(): Promise<{
  data: AdminUser[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Create a new admin user
 * Only supervisors can call this
 */
export async function createNewAdmin(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // 1. Verify the current user is a supervisor
    const currentUser = await getCurrentAdminUser();

    if (!currentUser || currentUser.role !== "supervisor") {
      return {
        success: false,
        error: "Unauthorized: Only supervisors can add admins.",
      };
    }

    // 2. Get form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = (formData.get("role") as string) || "admin";

    // Validate inputs
    if (!email || !password || !name) {
      return { success: false, error: "All fields are required." };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters.",
      };
    }

    if (role !== "admin" && role !== "supervisor") {
      return { success: false, error: "Invalid role specified." };
    }

    // 3. Create the admin client (with service role key)
    const supabaseAdmin = createAdminClient();

    // 4. Create the new auth user
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm so they can login immediately
      });

    if (createError) {
      return { success: false, error: createError.message };
    }

    if (!newUser.user) {
      return { success: false, error: "Failed to create user." };
    }

    // 5. Update the admin_users record (the trigger created it, we just need to set name and role)
    const { error: updateError } = await supabaseAdmin
      .from("admin_users")
      .update({ name, role })
      .eq("id", newUser.user.id);

    if (updateError) {
      // Try to clean up the auth user if profile update fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return { success: false, error: updateError.message };
    }

    // 6. Log user creation
    await logActivity({
      actionType: "create",
      entityType: "user",
      entityId: newUser.user.id,
      entityName: `${name} (${email})`,
      newValues: {
        email: email,
        name: name,
        role: role,
      },
    });

    // 7. Revalidate the users page
    revalidatePath("/dashboard/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error creating admin:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Promote an admin to supervisor
 * Only supervisors can call this
 */
export async function promoteToSupervisor(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Verify the current user is a supervisor
    const currentUser = await getCurrentAdminUser();

    if (!currentUser || currentUser.role !== "supervisor") {
      return {
        success: false,
        error: "Unauthorized: Only supervisors can promote users.",
      };
    }

    // 2. Get user details before promotion
    const supabase = await createClient();
    const { data: targetUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    // 3. Update the user's role
    const { error } = await supabase
      .from("admin_users")
      .update({ role: "supervisor" })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    // 4. Log role promotion
    await logActivity({
      actionType: "promote",
      entityType: "user",
      entityId: userId,
      entityName: `${targetUser.name || "Unknown"} (${targetUser.email})`,
      oldValues: { role: targetUser.role },
      newValues: { role: "supervisor" },
    });

    // 5. Revalidate the users page
    revalidatePath("/dashboard/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error promoting user:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Demote a supervisor to admin
 * Only supervisors can call this
 */
export async function demoteToAdmin(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Verify the current user is a supervisor
    const currentUser = await getCurrentAdminUser();

    if (!currentUser || currentUser.role !== "supervisor") {
      return {
        success: false,
        error: "Unauthorized: Only supervisors can demote users.",
      };
    }

    // 2. Prevent self-demotion (to avoid locking out all supervisors)
    if (currentUser.id === userId) {
      return {
        success: false,
        error: "You cannot demote yourself.",
      };
    }

    // 3. Get user details before demotion
    const supabase = await createClient();
    const { data: targetUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    // 4. Update the user's role
    const { error } = await supabase
      .from("admin_users")
      .update({ role: "admin" })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    // 5. Log role demotion
    await logActivity({
      actionType: "demote",
      entityType: "user",
      entityId: userId,
      entityName: `${targetUser.name || "Unknown"} (${targetUser.email})`,
      oldValues: { role: targetUser.role },
      newValues: { role: "admin" },
    });

    // 6. Revalidate the users page
    revalidatePath("/dashboard/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error demoting user:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Delete an admin user
 * Only supervisors can call this
 */
export async function deleteAdmin(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Verify the current user is a supervisor
    const currentUser = await getCurrentAdminUser();

    if (!currentUser || currentUser.role !== "supervisor") {
      return {
        success: false,
        error: "Unauthorized: Only supervisors can remove admins.",
      };
    }

    // 2. Prevent self-deletion
    if (currentUser.id === userId) {
      return {
        success: false,
        error: "You cannot delete yourself.",
      };
    }

    // 3. Get user details before deletion
    const supabase = await createClient();
    const { data: targetUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    // 4. Delete from admin_users table (this will be handled by RLS)
    const { error: deleteProfileError } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", userId);

    if (deleteProfileError) {
      return { success: false, error: deleteProfileError.message };
    }

    // 5. Delete the auth user (requires admin client)
    const supabaseAdmin = createAdminClient();
    const { error: deleteAuthError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      console.error("Error deleting auth user:", deleteAuthError);
      // Continue anyway, the profile is already deleted
    }

    // 6. Log user deletion
    await logActivity({
      actionType: "delete",
      entityType: "user",
      entityId: userId,
      entityName: `${targetUser.name || "Unknown"} (${targetUser.email})`,
      oldValues: {
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role,
      },
    });

    // 7. Revalidate the users page
    revalidatePath("/dashboard/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}




