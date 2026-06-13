import { redirect } from "next/navigation";
import { ActivityDots } from "@/components/dashboard/activity-dots";
import { GPATrendChart } from "@/components/dashboard/gpa-trend-chart";
import { GradeProgress } from "@/components/dashboard/grade-progress";
import { InsightCard } from "@/components/dashboard/insight-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { getUser } from "@/lib/supabase/auth";
import { getDashboardStats, getSemesters } from "@/lib/supabase/queries";

export default async function DashboardPage() {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	const userTargetGpa = user.user_metadata?.target_gpa ?? 3.5;

	const [stats, semesters] = await Promise.all([
		getDashboardStats(user.id, userTargetGpa),
		getSemesters(user.id),
	]);

	const userName =
		user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

	return (
		<div className="max-w-[1600px] mx-auto px-6 py-8">
			{/* Welcome Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-light text-gray-900">
					Welcome back, <span className="font-medium">{userName}</span>
				</h1>
				<p className="text-gray-500 mt-1">Here's your academic overview</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-12 gap-4 mb-6">
				<StatsCards
					cgpa={stats.cgpa}
					totalCreditHours={stats.totalCreditHours}
					semesterCount={stats.semesterCount}
					targetGpa={stats.targetGpa}
					semesters={semesters}
				/>
			</div>

			{/* GPA Chart + Insights Row */}
			<div className="grid grid-cols-12 gap-4 mb-6">
				<div className="col-span-12 lg:col-span-8">
					<GPATrendChart semesters={semesters} targetGpa={stats.targetGpa} />
				</div>
				<div className="col-span-12 lg:col-span-4">
					<InsightCard semesters={semesters} cgpa={stats.cgpa} />
				</div>
			</div>

			{/* Activity & Grade Distribution Row */}
			<div className="grid grid-cols-12 gap-4">
				<div className="col-span-12 md:col-span-6">
					<ActivityDots semesters={semesters} />
				</div>
				<div className="col-span-12 md:col-span-6">
					<GradeProgress semesters={semesters} />
				</div>
			</div>
		</div>
	);
}
