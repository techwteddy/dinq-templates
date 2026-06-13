"use server";

import { createClient } from "@/lib/supabase/server";

export async function startConversation(listingId: string, ownerId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check for existing conversation
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("renter_id", user.id)
    .single();

  if (existing) {
    return { conversationId: existing.id };
  }

  // Create new conversation
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      listing_id: listingId,
      renter_id: user.id,
      owner_id: ownerId,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { conversationId: data.id };
}

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
  });

  // Update conversation timestamp
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  if (error) return { error: error.message };
  return {};
}

export async function markAsRead(conversationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .is("read_at", null);
}
