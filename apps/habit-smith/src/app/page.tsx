import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-6 py-20 text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,_#1f2937_0,_transparent_45%),radial-gradient(circle_at_85%_10%,_#111827_0,_transparent_42%),linear-gradient(180deg,_#09090b_0,_#18181b_100%)]" />
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">HabitSmith</p>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
          Forge routines that actually stick.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-300">
          A productivity-first habit tracker built for streak momentum, analytics clarity, and social accountability.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500"
          >
            Log In
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </main>
  );
}
