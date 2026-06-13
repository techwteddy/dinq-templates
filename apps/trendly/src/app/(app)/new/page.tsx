import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostComposer } from "@/components/PostComposer";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <PostComposer userId={user.id} />;
}
