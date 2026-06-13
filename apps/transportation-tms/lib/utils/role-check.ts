import type { AdminUser } from "@/lib/types";

/**
 * Check if a user has supervisor role
 */
export function isSupervisor(user: AdminUser | null | undefined): boolean {
  return user?.role === "supervisor";
}

/**
 * Check if a user can manage other users (add, edit, remove)
 */
export function canManageUsers(user: AdminUser | null | undefined): boolean {
  return isSupervisor(user);
}

/**
 * Check if a user is a regular admin
 */
export function isAdmin(user: AdminUser | null | undefined): boolean {
  return user?.role === "admin";
}





