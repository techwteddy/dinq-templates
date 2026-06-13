import { redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";

export default async function MyProfileRedirect() {
  const user = await getCachedUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const { data: me } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  redirect(`/u/${me?.username ?? "me"}`);
}
