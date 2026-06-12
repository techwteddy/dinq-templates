import CustomerPortalForm from "@/components/ui/AccountForms/CustomerPortalForm";
import EmailForm from "@/components/ui/AccountForms/EmailForm";
import NameForm from "@/components/ui/AccountForms/NameForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Account() {
  const supabase = createClient();

  // Attempt to get the current user
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  // Early redirect if no user is found
  if (!user) {
    return redirect("/signin");
  }

  // Now that user existence is confirmed, proceed to fetch userDetails
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id) // user.id is now guaranteed to exist
    .single();

  // Fetch subscription details
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <p className="mt-8">
            <span className="text-5xl font-extrabold white text-center">
              Konto
            </span>
          </p>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={user.user_metadata.name ?? ""} />
        <EmailForm userEmail={user.email} />
      </div>
    </section>
  );
}
