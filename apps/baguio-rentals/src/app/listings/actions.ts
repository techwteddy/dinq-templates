"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createListing(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "property_owner") {
    return { error: "Only property owners can create listings" };
  }

  const id = formData.get("id") as string;
  const imagePaths: string[] = JSON.parse(
    (formData.get("image_paths") as string) || "[]"
  );

  const { error } = await supabase.from("listings").insert({
    id,
    owner_id: user.id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    property_type: formData.get("property_type") as string,
    price_monthly: parseFloat(formData.get("price_monthly") as string),
    bedrooms: parseInt(formData.get("bedrooms") as string) || 0,
    bathrooms: parseInt(formData.get("bathrooms") as string) || 0,
    area_sqm: formData.get("area_sqm")
      ? parseFloat(formData.get("area_sqm") as string)
      : null,
    availability: (formData.get("availability") as string) || "available",
    pet_friendly: formData.get("pet_friendly") === "yes",
    parking: formData.get("parking") === "yes",
    furnished: (formData.get("furnished") as string) || "unfurnished",
    address_line: formData.get("address_line") as string,
    barangay: formData.get("barangay") as string,
    latitude: formData.get("latitude")
      ? parseFloat(formData.get("latitude") as string)
      : null,
    longitude: formData.get("longitude")
      ? parseFloat(formData.get("longitude") as string)
      : null,
  });

  if (error) return { error: error.message };

  // Insert image records
  if (imagePaths.length > 0) {
    await supabase.from("listing_images").insert(
      imagePaths.map((path, i) => ({
        listing_id: id,
        storage_path: path,
        display_order: i,
      }))
    );
  }

  revalidatePath("/listings");
  return { id };
}

export async function updateListing(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  const imagePaths: string[] = JSON.parse(
    (formData.get("image_paths") as string) || "[]"
  );

  const { error } = await supabase
    .from("listings")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      property_type: formData.get("property_type") as string,
      price_monthly: parseFloat(formData.get("price_monthly") as string),
      bedrooms: parseInt(formData.get("bedrooms") as string) || 0,
      bathrooms: parseInt(formData.get("bathrooms") as string) || 0,
      area_sqm: formData.get("area_sqm")
        ? parseFloat(formData.get("area_sqm") as string)
        : null,
      availability: (formData.get("availability") as string) || "available",
      pet_friendly: formData.get("pet_friendly") === "yes",
      parking: formData.get("parking") === "yes",
      furnished: (formData.get("furnished") as string) || "unfurnished",
      address_line: formData.get("address_line") as string,
      barangay: formData.get("barangay") as string,
      latitude: formData.get("latitude")
        ? parseFloat(formData.get("latitude") as string)
        : null,
      longitude: formData.get("longitude")
        ? parseFloat(formData.get("longitude") as string)
        : null,
    })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  // Rebuild image records
  await supabase.from("listing_images").delete().eq("listing_id", id);
  if (imagePaths.length > 0) {
    await supabase.from("listing_images").insert(
      imagePaths.map((path, i) => ({
        listing_id: id,
        storage_path: path,
        display_order: i,
      }))
    );
  }

  revalidatePath("/listings");
  revalidatePath(`/listings/${id}`);
  return { id };
}

export async function deleteListing(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Delete images from storage
  const { data: images } = await supabase
    .from("listing_images")
    .select("storage_path")
    .eq("listing_id", id);

  if (images && images.length > 0) {
    await supabase.storage
      .from("listing-images")
      .remove(images.map((img) => img.storage_path));
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/listings");
  return {};
}

export async function updateAvailability(
  id: string,
  availability: "available" | "reserved" | "occupied"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("listings")
    .update({ availability })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/listings");
  revalidatePath(`/listings/${id}`);
  return {};
}

export async function toggleFavorite(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return { favorited: false };
  } else {
    await supabase
      .from("favorites")
      .insert({ user_id: user.id, listing_id: listingId });
    return { favorited: true };
  }
}
