import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ListingForm } from "@/components/listings/ListingForm";
import { updateListing } from "../../actions";

export const metadata = {
  title: "Edit Listing",
  description: "Update your rental property listing on BaguioRentals.",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: listing } = await supabase
    .from("listings")
    .select("*, listing_images(*)")
    .eq("id", id)
    .eq("owner_id", user.id)
    .order("display_order", {
      referencedTable: "listing_images",
      ascending: true,
    })
    .single();

  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
      <p className="mt-1 text-sm text-gray-500">Update your property details</p>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <ListingForm
          userId={user.id}
          listing={listing as Parameters<typeof ListingForm>[0]["listing"]}
          action={updateListing}
        />
      </div>
    </div>
  );
}
