"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/utils/activity-logger";

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient();

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    if (!data.email || !data.password) {
      return { error: "Email and password are required" };
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      return { error: error.message };
    }

    // Log successful login
    await logActivity({
      actionType: "login",
      entityType: "auth",
      entityName: data.email,
      details: { email: data.email },
    });

    // redirect() throws a special error that Next.js uses internally
    // We should not catch it - let it propagate
    redirect("/dashboard");
  } catch (error: any) {
    // Check if this is a Next.js redirect - if so, re-throw it
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    
    console.error("Sign in error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please check your environment variables.",
    };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    
    // Get user info before signing out (for logging)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    // Log logout before signing out
    if (user) {
      await logActivity({
        actionType: "logout",
        entityType: "auth",
        entityName: user.email || "unknown",
        details: { email: user.email },
      });
    }
    
    await supabase.auth.signOut();
    redirect("/login");
  } catch (error) {
    console.error("Sign out error:", error);
    // Even if sign out fails, redirect to login
    redirect("/login");
  }
}

