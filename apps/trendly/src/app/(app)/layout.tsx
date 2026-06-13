import { redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { BottomNav } from "@/components/BottomNav";
import { StatusBar } from "@/components/StatusBar";
import { CallProvider } from "@/components/CallProvider";
import { ViewTransitionLinks } from "@/components/ViewTransitionLinks";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  // Fallback if the trigger hasn't fired yet
  const username = profile?.username ?? user.email?.split("@")[0] ?? "me";
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div className="min-h-dvh flex flex-col bg-black text-white">
      <StatusBar />
      <ViewTransitionLinks />
      <CallProvider me={{ id: user.id, username }}>
        <main className="flex-1 flex flex-col has-floating-nav">{children}</main>
        <BottomNav username={username} avatarUrl={avatarUrl} />
      </CallProvider>
    </div>
  );
}
