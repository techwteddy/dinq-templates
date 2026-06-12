import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient, getServerAuthToken } from "@/lib/supabase-server";
import { ApiError, fetchTripDetail } from "@/lib/api/trips";
import { resolveTripCoverUrl } from "@/lib/r2-public";
import NotesPageClient from "./NotesPageClient";

export const dynamic = "force-dynamic";

export default async function TripNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: shareCode } = await params;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/home");
  }

  const token = await getServerAuthToken();
  if (!token) {
    redirect("/home");
  }

  let detail;
  try {
    detail = await fetchTripDetail(shareCode, token);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      notFound();
    }
    throw err;
  }

  if (!detail?.trip) {
    notFound();
  }

  return (
    <NotesPageClient
      trip={detail.trip}
      shareCode={shareCode}
      coverImageUrl={resolveTripCoverUrl(detail.trip)}
      myRole={detail.my_role}
    />
  );
}
