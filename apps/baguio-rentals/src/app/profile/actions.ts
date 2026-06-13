"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createReview(
  targetUserId: string,
  rating: number,
  comment: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  if (user.id === targetUserId) {
    return { error: "You cannot review yourself" };
  }

  // Check that they have an existing conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(renter_id.eq.${user.id},owner_id.eq.${targetUserId}),and(owner_id.eq.${user.id},renter_id.eq.${targetUserId})`
    )
    .limit(1)
    .single();

  if (!conversation) {
    return { error: "You can only review someone you have messaged with" };
  }

  const { error } = await supabase.from("reviews").insert({
    reviewer_id: user.id,
    owner_id: targetUserId,
    rating,
    comment: comment || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You have already reviewed this person" };
    }
    return { error: error.message };
  }

  revalidatePath(`/profile/${targetUserId}`);
  return {};
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.get("full_name") as string,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      bio: (formData.get("bio") as string) || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/profile/${user.id}`);
  return {};
}
