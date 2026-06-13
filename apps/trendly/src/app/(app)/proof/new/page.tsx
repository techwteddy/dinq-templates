import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProofComposer } from "@/components/ProofComposer";

export const dynamic = "force-dynamic";

export default async function NewProofPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <ProofComposer userId={user.id} />;
}
