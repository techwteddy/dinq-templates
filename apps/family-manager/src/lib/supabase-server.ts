import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user || error) throw new Error("Unauthorized");
  return supabase;
}

export async function getCurrentMember() {
  const supabase = await requireAuth();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? "";

  const { data } = await supabase
    .from("family_members")
    .select("name, role")
    .eq("email", email)
    .single();

  return {
    supabase,
    member: data
      ? { email, name: data.name as string, role: data.role as "parent" | "kid" }
      : { email, name: email, role: "parent" as const },
  };
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
