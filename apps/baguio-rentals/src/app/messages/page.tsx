import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messages/ConversationList";

export const metadata = {
  title: "Messages",
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

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const conversations = await getConversationsWithMeta(supabase, user.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone/60 bg-warm-white shadow-sm">
      <div className="flex h-[calc(100vh-10rem)]">
        {/* Sidebar */}
        <div className="w-full border-r border-stone/60 sm:w-80 lg:w-96">
          <div className="border-b border-stone/60 px-5 py-4">
            <h1 className="font-[family-name:var(--font-display)] text-xl text-pine">Messages</h1>
          </div>
          <div className="overflow-y-auto" style={{ height: "calc(100% - 57px)" }}>
            <ConversationList
              conversations={conversations}
              currentUserId={user.id}
            />
          </div>
        </div>

        {/* Empty state */}
        <div className="hidden flex-1 items-center justify-center sm:flex">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mist">
              <svg className="h-8 w-8 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-pine">Select a conversation</p>
            <p className="mt-1 text-sm text-bark-light">Choose from your conversations on the left</p>
          </div>
        </div>
      </div>
    </div>
  );
}
