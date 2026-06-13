function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={`animate-pulse bg-gray-200 rounded-xl ${className || ""}`}
		/>
	);
}

export default function SemestersLoading() {
	return (
		<div className="max-w-[1600px] mx-auto px-6 py-8">
			{/* Page Header Skeleton */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<Skeleton className="h-9 w-40 mb-2" />
					<Skeleton className="h-5 w-64" />
				</div>
				<Skeleton className="h-10 w-36 rounded-lg" />
			</div>

			{/* Semester List Card Skeleton */}
			<div className="bg-white rounded-3xl p-6 card-shadow">
				<div className="mb-6">
					<Skeleton className="h-6 w-40 mb-2" />
					<Skeleton className="h-4 w-56" />
				</div>

				{/* Semester Items Skeleton */}
				<div className="space-y-4">
					<Skeleton className="h-24 rounded-2xl" />
					<Skeleton className="h-24 rounded-2xl" />
					<Skeleton className="h-24 rounded-2xl" />
				</div>
			</div>
		</div>
	);
}
