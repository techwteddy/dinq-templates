import Link from "next/link";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return (
    <main className="min-h-screen bg-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="h-20 w-20 rounded-full bg-zinc-200" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">@{username}</h1>
        <p className="mt-2 text-sm text-zinc-600">Public HabitSmith profile with streak highlights and accountability badges.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-zinc-100 p-3">
            <p className="text-xs text-zinc-500">Current Streak</p>
            <p className="text-xl font-semibold text-zinc-900">28 days</p>
          </div>
          <div className="rounded-xl bg-zinc-100 p-3">
            <p className="text-xs text-zinc-500">Habits</p>
            <p className="text-xl font-semibold text-zinc-900">6</p>
          </div>
          <div className="rounded-xl bg-zinc-100 p-3">
            <p className="text-xs text-zinc-500">Consistency</p>
            <p className="text-xl font-semibold text-zinc-900">84%</p>
          </div>
        </div>
        <Link href="/dashboard/social" className="mt-6 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
          Back to Social
        </Link>
      </div>
    </main>
  );
}
