import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { markAsRead } from "../actions";
import { ChatThread } from "@/components/messages/ChatThread";
import { ConversationList } from "@/components/messages/ConversationList";
import Link from "next/link";

export const metadata = {
  title: "Chat",
  description: "Your conversations with property owners and renters on BaguioRentals.",
};

async function getConversationsWithMeta(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      `
      *,
      listings(id, title),
      renter:profiles!conversations_renter_id_fkey(id, full_name, avatar_url),
      owner:profiles!conversations_owner_id_fkey(id, full_name, avatar_url)
    `
    )
    .or(`renter_id.eq.${userId},owner_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  const conversationsWithMeta = await Promise.all(
    (conversations ?? []).map(async (conv) => {
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .neq("sender_id", userId)
        .is("read_at", null);

      return {
        ...conv,
        listings: conv.listings as { id: string; title: string },
        renter: conv.renter as { id: string; full_name: string; avatar_url: string | null },
        owner: conv.owner as { id: string; full_name: string; avatar_url: string | null },
        lastMessage: lastMsg as { content: string; created_at: string; sender_id: string } | null,
        unreadCount: count ?? 0,
      };
    })
  );

  return conversationsWithMeta;
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: conversation } = await supabase
    .from("conversations")
    .select(
      `
      *,
      listings(id, title),
      renter:profiles!conversations_renter_id_fkey(id, full_name, avatar_url),
      owner:profiles!conversations_owner_id_fkey(id, full_name, avatar_url)
    `
    )
    .eq("id", conversationId)
    .single();

  if (!conversation) notFound();

  if (conversation.renter_id !== user.id && conversation.owner_id !== user.id) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  await markAsRead(conversationId);

  const allConversations = await getConversationsWithMeta(supabase, user.id);

  const otherPerson =
    conversation.renter_id === user.id
      ? (conversation.owner as { id: string; full_name: string; avatar_url: string | null })
      : (conversation.renter as { id: string; full_name: string; avatar_url: string | null });

  const listing = conversation.listings as { id: string; title: string };

  return (
    <div className="overflow-hidden rounded-2xl border border-stone/60 bg-warm-white shadow-sm">
      <div className="flex h-[calc(100vh-10rem)]">
        {/* Sidebar - hidden on mobile when viewing a chat */}
        <div className="hidden w-80 shrink-0 border-r border-stone/60 sm:block lg:w-96">
          <div className="border-b border-stone/60 px-5 py-4">
            <h1 className="font-[family-name:var(--font-display)] text-xl text-pine">Messages</h1>
          </div>
          <div className="overflow-y-auto" style={{ height: "calc(100% - 57px)" }}>
            <ConversationList
              conversations={allConversations}
              currentUserId={user.id}
              activeConversationId={conversationId}
            />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-stone/60 bg-cream/50 px-4 py-3">
            <Link
              href="/messages"
              className="rounded-lg p-2.5 text-bark-light hover:bg-mist hover:text-bark transition-colors sm:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Link href={`/profile/${otherPerson.id}`} className="shrink-0">
              {otherPerson.avatar_url ? (
                <img
                  src={otherPerson.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-stone/40 hover:ring-amber/40 transition-all"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pine text-sm font-semibold text-amber ring-2 ring-stone/40 hover:ring-amber/40 transition-all">
                  {otherPerson.full_name[0]}
                </div>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${otherPerson.id}`} className="font-semibold text-pine truncate block hover:text-pine-light transition-colors">{otherPerson.full_name}</Link>
              <Link
                href={`/listings/${listing.id}`}
                className="text-xs text-pine-muted hover:text-amber transition-colors truncate block"
              >
                {listing.title}
              </Link>
            </div>
          </div>

          {/* Chat thread */}
          <ChatThread
            conversationId={conversationId}
            currentUserId={user.id}
            initialMessages={messages ?? []}
          />
        </div>
      </div>
    </div>
  );
}
