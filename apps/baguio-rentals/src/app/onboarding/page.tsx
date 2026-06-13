import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          {profile?.avatar_url && (
            <img
              src={profile.avatar_url}
              alt=""
              referrerPolicy="no-referrer"
              className="mx-auto h-16 w-16 rounded-full"
            />
          )}
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-pine">
            Welcome, {profile?.full_name}!
          </h1>
          <p className="mt-2 text-bark-light">
            How will you use BaguioRentals?
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
