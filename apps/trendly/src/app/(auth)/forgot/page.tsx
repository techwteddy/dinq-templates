"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useActionState } from "react";
import { resetPassword } from "@/app/actions";
import { TrendlyLogo } from "@/components/TrendlyLogo";

export default function ForgotPage() {
  const [state, formAction, pending] = useActionState(
    async (_: unknown, fd: FormData) => await resetPassword(fd),
    null,
  );
  return (
    <div className="flex-1 flex flex-col px-6 pb-6">
      <div className="py-3">
        <Link href="/login" aria-label="Back">
          <ChevronLeft size={28} />
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex justify-center">
          <TrendlyLogo size={46} />
        </div>
        <p className="text-center text-white/70 text-sm">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <form action={formAction} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full h-12 px-3 rounded-md bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border)] placeholder-white/40"
          />
          {state?.error && <p className="text-[color:var(--color-danger)] text-sm">{state.error}</p>}
          {state?.ok && <p className="text-emerald-400 text-sm">{state.ok}</p>}
          <button disabled={pending} className="w-full h-12 btn-primary font-semibold">
            {pending ? "Sending…" : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
