"use client";

import { Check, Loader2, Mail, Settings, User } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { type AuthState, getUser, updateUserName } from "@/lib/supabase/auth";

export default function SettingsPage() {
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const [state, formAction, isPending] = useActionState<AuthState, FormData>(
		updateUserName,
		{},
	);

	useEffect(() => {
		async function fetchUser() {
			const user = await getUser();
			if (user) {
				setUserName(user.user_metadata?.name || "");
				setUserEmail(user.email || "");
			}
			setIsLoading(false);
		}
		fetchUser();
	}, []);

	useEffect(() => {
		if (state.success) {
			async function refetchUser() {
				const user = await getUser();
				if (user) {
					setUserName(user.user_metadata?.name || "");
				}
			}
			refetchUser();
		}
	}, [state.success]);

	if (isLoading) {
		return (
			<div className="min-h-[calc(100vh-4rem)] flex justify-center pt-16 sm:pt-0 sm:items-center p-6">
				<div className="w-full max-w-lg">
					{/* Header Skeleton */}
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<div className="h-14 w-14 rounded-2xl bg-gray-200 animate-pulse" />
						</div>
						<div className="h-7 w-48 mx-auto mb-2 bg-gray-200 rounded-xl animate-pulse" />
						<div className="h-4 w-56 mx-auto bg-gray-200 rounded-xl animate-pulse" />
					</div>

					{/* Card Skeleton */}
					<div className="rounded-2xl bg-white border border-gray-200 overflow-hidden card-shadow">
						{/* Avatar Section */}
						<div className="p-6 border-b border-gray-100 flex items-center gap-4">
							<div className="h-16 w-16 rounded-2xl bg-gray-200 animate-pulse" />
							<div>
								<div className="h-5 w-32 mb-2 bg-gray-200 rounded-lg animate-pulse" />
								<div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse" />
							</div>
						</div>

						{/* Form Section */}
						<div className="p-6 space-y-6">
							<div>
								<div className="h-4 w-28 mb-3 bg-gray-200 rounded-lg animate-pulse" />
								<div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
								<div className="h-3 w-48 mt-2 bg-gray-200 rounded-lg animate-pulse" />
							</div>
							<div>
								<div className="h-4 w-28 mb-3 bg-gray-200 rounded-lg animate-pulse" />
								<div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
							</div>
							<div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
						</div>
					</div>

					<div className="h-4 w-64 mx-auto mt-6 bg-gray-200 rounded-lg animate-pulse" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100vh-4rem)] flex justify-center pt-16 sm:pt-0 sm:items-center p-6">
			<div className="w-full max-w-lg">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
						<Settings className="h-7 w-7 text-blue-500" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
					<p className="text-sm text-gray-500 mt-2">
						Manage your profile information
					</p>
				</div>

				{/* Settings Card */}
				<div className="rounded-2xl bg-white border border-gray-200 overflow-hidden card-shadow">
					{/* Avatar Section */}
					<div className="p-6 border-b border-gray-100 flex items-center gap-4">
						<div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
							<span className="text-2xl font-bold text-white">
								{userName?.charAt(0)?.toUpperCase() ||
									userEmail?.charAt(0)?.toUpperCase() ||
									"U"}
							</span>
						</div>
						<div>
							<p className="text-gray-900 font-semibold">
								{userName || "Set your name"}
							</p>
							<p className="text-sm text-gray-500">{userEmail}</p>
						</div>
					</div>

					{/* Form Section */}
					<div className="p-6 space-y-6">
						{/* Email Field (Read-only) */}
						<div>
							<span className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-3">
								<Mail className="h-3.5 w-3.5" />
								Email Address
							</span>
							<div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3.5">
								<span className="text-sm text-gray-500">{userEmail}</span>
							</div>
							<p className="text-xs text-gray-400 mt-2">
								Email address cannot be changed
							</p>
						</div>

						{/* Name Field (Editable) */}
						<form action={formAction}>
							<div className="mb-5">
								<label
									htmlFor="name"
									className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-3"
								>
									<User className="h-3.5 w-3.5" />
									Display Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									defaultValue={userName}
									placeholder="Enter your display name"
									className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
								/>
							</div>

							{/* Status Messages */}
							{state.error && (
								<div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 mb-5">
									<p className="text-xs text-red-600">{state.error}</p>
								</div>
							)}

							{state.success && (
								<div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 mb-5 flex items-center gap-2">
									<Check className="h-4 w-4 text-green-500" />
									<p className="text-xs text-green-600">{state.success}</p>
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isPending}
								className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed px-4 py-3.5 text-sm font-semibold text-white transition-colors"
							>
								{isPending ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Updating...
									</>
								) : (
									"Save Changes"
								)}
							</button>
						</form>
					</div>
				</div>

				{/* Footer Note */}
				<p className="text-center text-xs text-gray-400 mt-6">
					Changes will be reflected across the application
				</p>
			</div>
		</div>
	);
}
