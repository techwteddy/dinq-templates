import { redirect } from "next/navigation";
import { getCachedUser } from "@/lib/supabase/server";

export default async function Index() {
  const user = await getCachedUser();
  redirect(user ? "/feed" : "/login");
}
