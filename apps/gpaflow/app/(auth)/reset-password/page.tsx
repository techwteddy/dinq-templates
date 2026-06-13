"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { type AuthState, resetPassword } from "@/lib/supabase/auth";

const initialState: AuthState = {};

export default function ResetPasswordPage() {
	const [state, formAction, pending] = useActionState(
		resetPassword,
		initialState,
	);
	const [showPass, setShowPass] = useState(false);
	const [showConf, setShowConf] = useState(false);

	return (
		<div className="space-y-6">
			{/* Welcome Headers */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Reset Password
				</h1>
				<p className="text-sm text-gray-500">
					Enter your new password details below.
				</p>
			</div>

			{state.error && (
				<div className="rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1 duration-200">
					{state.error}
				</div>
			)}

			{/* Main Form */}
			<form action={formAction} className="space-y-4">
				{/* New Password Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="password"
						className="block text-xs font-semibold uppercase tracking-wider text-gray-400"
					>
						New Password
					</label>
					<div className="relative">
						<input
							id="password"
							name="password"
							type={showPass ? "text" : "password"}
							required
							minLength={6}
							className="block w-full rounded-xl border border-gray-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all duration-200"
							placeholder="Minimum 6 characters"
						/>
						<button
							type="button"
							onClick={() => setShowPass(!showPass)}
							className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition"
						>
							{showPass ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</button>
					</div>
				</div>

				{/* Confirm Password Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="confirmPassword"
						className="block text-xs font-semibold uppercase tracking-wider text-gray-400"
					>
						Confirm Password
					</label>
					<div className="relative">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConf ? "text" : "password"}
							required
							minLength={6}
							className="block w-full rounded-xl border border-gray-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all duration-200"
							placeholder="Re-enter new password"
						/>
						<button
							type="button"
							onClick={() => setShowConf(!showConf)}
							className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition"
						>
							{showConf ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</button>
					</div>
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
							Resetting Password...
						</>
					) : (
						"Reset Password"
					)}
				</button>
			</form>
		</div>
	);
}
