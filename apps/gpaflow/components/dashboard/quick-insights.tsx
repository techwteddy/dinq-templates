"use client";

import { Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Semester } from "@/types/grading";

interface QuickInsightsProps {
	semesters: Semester[];
	avgSGPA: number;
	bestSemester: Semester | null;
}

export function QuickInsights({ avgSGPA, bestSemester }: QuickInsightsProps) {
	return (
		<div className="col-span-12 lg:col-span-4 space-y-3">
			{/* Average SGPA Card */}
			<Card className="bg-[#141414] border-[#262626] rounded-xl">
				<CardContent className="p-4">
					<div className="flex items-center gap-2 mb-2">
						<TrendingUp className="h-4 w-4 text-gray-500" />
						<span className="text-xs text-gray-500">Average SGPA</span>
					</div>
					<p className="text-2xl font-semibold text-white">
						{avgSGPA > 0 ? avgSGPA.toFixed(2) : "—"}
					</p>
				</CardContent>
			</Card>

			{/* Best Semester Card */}
			<Card className="bg-[#141414] border-[#262626] rounded-xl">
				<CardContent className="p-4">
					<div className="flex items-center gap-2 mb-2">
						<Award className="h-4 w-4 text-warning" />
						<span className="text-xs text-gray-500">Best Performance</span>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-sm text-white truncate max-w-[120px]">
							{bestSemester?.name || "No data"}
						</p>
						<p className="text-xl font-semibold text-warning">
							{bestSemester ? bestSemester.sgpa.toFixed(2) : "—"}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
