function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={`animate-pulse bg-gray-200 rounded-xl ${className || ""}`}
		/>
	);
}

export default function SettingsLoading() {
	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
			<div className="w-full max-w-lg">
				{/* Header Skeleton */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<Skeleton className="h-14 w-14 rounded-2xl" />
					</div>
					<Skeleton className="h-7 w-48 mx-auto mb-2" />
					<Skeleton className="h-4 w-56 mx-auto" />
				</div>

				{/* Settings Card Skeleton */}
				<div className="rounded-2xl bg-white border border-gray-200 overflow-hidden card-shadow">
					{/* Avatar Section */}
					<div className="p-6 border-b border-gray-100 flex items-center gap-4">
						<Skeleton className="h-16 w-16 rounded-2xl" />
						<div>
							<Skeleton className="h-5 w-32 mb-2" />
							<Skeleton className="h-4 w-48" />
						</div>
					</div>

					{/* Form Section */}
					<div className="p-6 space-y-6">
						{/* Email Field */}
						<div>
							<Skeleton className="h-4 w-28 mb-3" />
							<Skeleton className="h-12 rounded-xl" />
							<Skeleton className="h-3 w-48 mt-2" />
						</div>

						{/* Name Field */}
						<div>
							<Skeleton className="h-4 w-28 mb-3" />
							<Skeleton className="h-12 rounded-xl" />
						</div>

						{/* Button */}
						<Skeleton className="h-12 rounded-xl" />
					</div>
				</div>

				{/* Footer */}
				<Skeleton className="h-4 w-64 mx-auto mt-6" />
			</div>
		</div>
	);
}
