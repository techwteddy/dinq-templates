"use client";

import { useMemo } from "react";
import type { Semester } from "@/types/grading";

interface GradeProgressProps {
	semesters: Semester[];
}

interface GradeBreakdown {
	grade: string;
	count: number;
	percentage: number;
	color: string;
}

export function GradeProgress({ semesters }: GradeProgressProps) {
	const breakdown = useMemo<GradeBreakdown[]>(() => {
		const allSubjects = semesters.flatMap((s) => s.subjects || []);

		const gradeGroups = {
			"A/A+": 0,
			"B/B+": 0,
			"C/C+": 0,
			"D & Below": 0,
		};

		for (const subject of allSubjects) {
			const grade = subject.letter_grade || "";
			if (grade.startsWith("A")) gradeGroups["A/A+"]++;
			else if (grade.startsWith("B")) gradeGroups["B/B+"]++;
			else if (grade.startsWith("C")) gradeGroups["C/C+"]++;
			else if (grade) gradeGroups["D & Below"]++;
		}

		const total = allSubjects.length;
		const colors = {
			"A/A+": "bg-success",
			"B/B+": "bg-primary-500",
			"C/C+": "bg-warning-600",
			"D & Below": "bg-destructive",
		};

		return Object.entries(gradeGroups).map(([grade, count]) => ({
			grade,
			count,
			percentage: total > 0 ? Math.round((count / total) * 100) : 0,
			color: colors[grade as keyof typeof colors],
		}));
	}, [semesters]);

	const totalSubjects = useMemo(
		() => breakdown.reduce((sum, b) => sum + b.count, 0),
		[breakdown],
	);

	const topGradePercentage = breakdown[0]?.percentage || 0;

	return (
		<div className="bg-white rounded-3xl p-6 card-shadow h-full">
			<div className="flex items-start justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900">
					Grade Distribution
				</h3>
				{totalSubjects > 0 && (
					<div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success-50">
						<span className="text-xs font-semibold text-success-600">
							{topGradePercentage}% A's
						</span>
					</div>
				)}
			</div>

			{/* Big Number */}
			<div className="flex items-end gap-3 mb-5">
				<span className="text-4xl font-light text-gray-900 tracking-tight">
					{totalSubjects}
				</span>
				<div className="mb-1">
					<span className="text-sm text-gray-500">subjects</span>
				</div>
			</div>

			{/* Progress Bars or Empty State */}
			{totalSubjects === 0 ? (
				<div className="text-center py-8 text-gray-400 text-sm">
					No subjects added yet
				</div>
			) : (
				<div className="space-y-3">
					{breakdown.map((item) => (
						<div key={item.grade}>
							<div className="flex items-center justify-between mb-1.5">
								<span className="text-sm text-gray-600">{item.grade}</span>
								<span className="text-sm font-medium text-gray-900">
									{item.count}
								</span>
							</div>
							<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full transition-all duration-500 ${item.color}`}
									style={{
										width: `${item.percentage}%`,
										backgroundImage:
											"repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 5px)",
									}}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
