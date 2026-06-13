import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ListingForm } from "@/components/listings/ListingForm";
import { createListing } from "../actions";

export const metadata = {
  title: "Post a Listing",
  description: "List your Baguio City rental property for free. Reach renters looking for apartments, houses, rooms, and condos.",
};

export default async function NewListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Post a New Listing</h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in the details about your property
      </p>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <ListingForm userId={user.id} action={createListing} />
      </div>
    </div>
  );
}
