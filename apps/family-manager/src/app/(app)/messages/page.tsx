import { getCurrentMember } from "@/lib/supabase-server";
import type { FamilyMessage } from "@/lib/database.types";
import MessagesPageClient from "@/components/messages/MessagesPageClient";

export default async function MessagesPage() {
  const { supabase, member } = await getCurrentMember();

  // Kids only see family channel; parents see both
  const query = supabase
    .from("family_messages")
    .select("id, author, message, pinned, channel, created_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(100);

  if (member.role === "kid") {
    query.eq("channel", "family");
  }

  const { data: messages } = await query;

  return (
    <MessagesPageClient
      messages={(messages as FamilyMessage[]) ?? []}
      memberName={member.name}
      memberRole={member.role}
    />
  );
}
