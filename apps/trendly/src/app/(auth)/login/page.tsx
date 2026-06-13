"use client";
import Link from "next/link";
import { useActionState } from "react";
import { ChevronLeft } from "lucide-react";
import { signIn } from "@/app/actions";
import { TrendlyLogo } from "@/components/TrendlyLogo";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_: unknown, fd: FormData) => await signIn(fd),
    null,
  );

  return (
    <div className="flex-1 flex flex-col px-6 pb-6">
      <div className="py-3">
        <Link href="/switch" aria-label="Back">
          <ChevronLeft size={28} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex justify-center mb-4">
          <TrendlyLogo size={54} />
        </div>

        <form action={formAction} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full h-12 px-3 rounded-md bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border)] placeholder-white/40"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full h-12 px-3 rounded-md bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border)] placeholder-white/40"
          />
          <div className="flex justify-end">
            <Link href="/forgot" className="text-[color:var(--color-primary)] text-sm font-semibold">
              Forgot password?
            </Link>
          </div>

          {state?.error && <p className="text-[color:var(--color-danger)] text-sm">{state.error}</p>}

          <button
            disabled={pending}
            className="w-full h-12 btn-primary flex items-center justify-center font-semibold"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-wider">
          <div className="flex-1 h-px bg-[color:var(--color-border)]" />
          <span>or</span>
          <div className="flex-1 h-px bg-[color:var(--color-border)]" />
        </div>

        <p className="text-center text-white/70 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[color:var(--color-primary)] font-semibold">
            Sign up.
          </Link>
        </p>
      </div>

      <p className="text-center text-white/40 text-xs pt-6">Trendly from Forge</p>
    </div>
  );
}
