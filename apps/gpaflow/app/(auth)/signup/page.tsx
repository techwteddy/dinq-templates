"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { GoogleIcon } from "@/components/ui/google-icon";
import { type AuthState, signInWithGoogle, signUp } from "@/lib/supabase/auth";

const initialState: AuthState = {};

export default function SignupPage() {
	const [state, formAction, pending] = useActionState(signUp, initialState);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="space-y-6">
			{/* Welcome Headers */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Create Account
				</h1>
				<p className="text-sm text-gray-500">
					Enter your details below to create your academic profile.
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
				{/* Name Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="name"
						className="block text-xs font-semibold uppercase tracking-wider text-gray-400"
					>
						Full Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						defaultValue=""
						className="block w-full rounded-xl border border-gray-200 bg-slate-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all duration-200"
						placeholder="Fahad Shahbaz"
					/>
					{state.fieldErrors?.name && (
						<p className="text-xs text-rose-500 font-medium">
							{state.fieldErrors.name[0]}
						</p>
					)}
				</div>

				{/* Email Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="email"
						className="block text-xs font-semibold uppercase tracking-wider text-gray-400"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						defaultValue=""
						className="block w-full rounded-xl border border-gray-200 bg-slate-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all duration-200"
						placeholder="fahad@example.com"
					/>
					{state.fieldErrors?.email && (
						<p className="text-xs text-rose-500 font-medium">
							{state.fieldErrors.email[0]}
						</p>
					)}
				</div>

				{/* Password Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="password"
						className="block text-xs font-semibold uppercase tracking-wider text-gray-400"
					>
						Password
					</label>
					<div className="relative">
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							required
							className="block w-full rounded-xl border border-gray-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all duration-200"
							placeholder="Create a password"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition"
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</button>
					</div>
					{state.fieldErrors?.password && (
						<p className="text-xs text-rose-500 font-medium">
							{state.fieldErrors.password[0]}
						</p>
					)}
				</div>

				{/* Agree to terms visual checkbox */}
				<div className="flex items-start gap-2 text-xs text-gray-500 pt-1">
					<input
						type="checkbox"
						required
						id="terms"
						className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-0 cursor-pointer"
					/>
					<label
						htmlFor="terms"
						className="cursor-pointer font-medium leading-relaxed"
					>
						I agree to the{" "}
						<Link
							href="/terms"
							className="text-indigo-600 hover:text-indigo-700 hover:underline transition font-semibold"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="text-indigo-600 hover:text-indigo-700 hover:underline transition font-semibold"
						>
							Privacy Policy
						</Link>
						.
					</label>
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
							Creating Account...
						</>
					) : (
						"Register"
					)}
				</button>
			</form>

			{/* Divider */}
			<div className="relative my-4">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-100" />
				</div>
				<div className="relative flex justify-center text-xs font-medium uppercase text-gray-400">
					<span className="bg-white px-3">Or Register With</span>
				</div>
			</div>

			{/* Social Providers - Google OAuth */}
			<form action={signInWithGoogle} className="w-full">
				<button
					type="submit"
					className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-semibold text-gray-700 hover:bg-slate-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
				>
					<GoogleIcon />
					Continue with Google
				</button>
			</form>

			{/* Login Option */}
			<p className="text-center text-xs text-gray-500 pt-2">
				Already Have An Account?{" "}
				<Link
					href="/login"
					className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition"
				>
					Log In Now.
				</Link>
			</p>
		</div>
	);
}
