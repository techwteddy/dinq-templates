function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={`animate-pulse bg-gray-200 rounded-xl ${className || ""}`}
		/>
	);
}

export default function DashboardLoading() {
	return (
		<div className="max-w-[1600px] mx-auto px-6 py-8">
			{/* Welcome Header Skeleton */}
			<div className="mb-8">
				<Skeleton className="h-9 w-64 mb-2" />
				<Skeleton className="h-5 w-48" />
			</div>

			{/* Stats Grid Skeleton */}
			<div className="grid grid-cols-12 gap-4 mb-6">
				<div className="col-span-6 sm:col-span-3">
					<Skeleton className="h-28 rounded-2xl" />
				</div>
				<div className="col-span-6 sm:col-span-3">
					<Skeleton className="h-28 rounded-2xl" />
				</div>
				<div className="col-span-6 sm:col-span-3">
					<Skeleton className="h-28 rounded-2xl" />
				</div>
				<div className="col-span-6 sm:col-span-3">
					<Skeleton className="h-28 rounded-2xl" />
				</div>
			</div>

			{/* Chart + Insights Skeleton */}
			<div className="grid grid-cols-12 gap-4 mb-6">
				<div className="col-span-12 lg:col-span-8">
					<Skeleton className="h-80 rounded-3xl" />
				</div>
				<div className="col-span-12 lg:col-span-4">
					<Skeleton className="h-80 rounded-3xl" />
				</div>
			</div>

			{/* Activity & Grade Skeleton */}
			<div className="grid grid-cols-12 gap-4">
				<div className="col-span-12 md:col-span-6">
					<Skeleton className="h-48 rounded-3xl" />
				</div>
				<div className="col-span-12 md:col-span-6">
					<Skeleton className="h-48 rounded-3xl" />
				</div>
			</div>
		</div>
	);
}
