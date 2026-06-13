import { notFound } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { ChatThread } from "@/components/ChatThread";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: Promise<{ peerId: string }> }) {
  const { peerId } = await params;
  const [user, supabase] = await Promise.all([getCachedUser(), createClient()]);

  // Fan out reads + the mark-as-read write — they're all independent.
  const markReadPromise = supabase
    .from("messages")
    .update({ is_read: true })
    .eq("receiver_id", user!.id)
    .eq("sender_id", peerId)
    .eq("is_read", false);

  const [{ data: me }, { data: peer }, { data: msgs }] = await Promise.all([
    supabase.from("profiles").select("id, username, avatar_url").eq("id", user!.id).single(),
    supabase.from("profiles").select("id, username, avatar_url").eq("id", peerId).single(),
    supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user!.id},receiver_id.eq.${peerId}),and(sender_id.eq.${peerId},receiver_id.eq.${user!.id})`,
      )
      .order("created_at", { ascending: true }),
  ]);

  if (!peer) notFound();
  await markReadPromise;

  return (
    <ChatThread
      me={{ id: me!.id, username: me!.username, avatar_url: me!.avatar_url }}
      peer={{ id: peer.id, username: peer.username, avatar_url: peer.avatar_url }}
      initialMessages={msgs ?? []}
    />
  );
}
