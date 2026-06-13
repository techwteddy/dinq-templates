"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { type AuthState, forgotPassword } from "@/lib/supabase/auth";

const initialState: AuthState = {};

export default function ForgotPasswordPage() {
	const [state, formAction, pending] = useActionState(
		forgotPassword,
		initialState,
	);

	return (
		<div className="space-y-6">
			{/* Welcome Headers */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Forgot Password
				</h1>
				<p className="text-sm text-gray-500">
					Enter your email below to receive a password reset link.
				</p>
			</div>

			{state.error && (
				<div className="rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1 duration-200">
					{state.error}
				</div>
			)}

			{state.success && (
				<div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs font-medium text-emerald-600 animate-in fade-in slide-in-from-top-1 duration-200">
					{state.success}
				</div>
			)}

			{/* Main Form */}
			<form action={formAction} className="space-y-4">
				{/* Email Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="email"
						className="block text-xs font-semibold uppercase tracking-wider text-gray-400"
					>
						Email Address
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						defaultValue=""
						className="block w-full rounded-xl border border-gray-200 bg-slate-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all duration-200"
						placeholder="sellostore@company.com"
					/>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={pending}
					className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10 cursor-pointer"
				>
					{pending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Sending Link...
						</>
					) : (
						"Send Reset Link"
					)}
				</button>
			</form>

			{/* Back to login option */}
			<div className="text-center pt-2">
				<Link
					href="/login"
					className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					Back to Log In
				</Link>
			</div>
		</div>
	);
}
