"use client";

import { useMemo } from "react";
import type { Semester } from "@/types/grading";

interface ActivityDotsProps {
	semesters: Semester[];
}

export function ActivityDots({ semesters }: ActivityDotsProps) {
	const activity = useMemo(() => {
		const semesterData = semesters.map((s, i) => ({
			name: `S${i + 1}`,
			fullName: s.name,
			subjects: s.subjects?.length || 0,
		}));

		const total = semesterData.reduce((sum, s) => sum + s.subjects, 0);
		const avgPerSemester = semesters.length > 0 ? total / semesters.length : 0;

		return {
			semesters: semesterData,
			total,
			avgPerSemester: Number(avgPerSemester.toFixed(1)),
		};
	}, [semesters]);

	const maxSubjects = useMemo(
		() => Math.max(...activity.semesters.map((s) => s.subjects), 1),
		[activity.semesters],
	);

	const getColor = (
		semesterIndex: number,
		dotIndex: number,
		totalDots: number,
	) => {
		const isActive = dotIndex < totalDots;
		if (!isActive) return "bg-gray-100";

		const intensity = (semesterIndex + 1) / activity.semesters.length;
		if (intensity > 0.8) return "bg-success-600";
		if (intensity > 0.6) return "bg-success";
		if (intensity > 0.4) return "bg-success-600/70";
		if (intensity > 0.2) return "bg-success-600/40";
		return "bg-success-600/20";
	};

	return (
		<div className="bg-white rounded-3xl p-6 card-shadow h-full">
			<div className="flex items-start justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
			</div>

			{/* Big Number */}
			<div className="flex items-end gap-4 mb-5">
				<span className="text-4xl font-light text-gray-900 tracking-tight">
					{activity.total}
				</span>
				<div className="mb-1">
					<span className="text-sm text-gray-500">total subjects</span>
				</div>
				<div className="text-right mb-1 ml-auto">
					<p className="text-xs text-gray-500">avg per semester</p>
					<p className="text-sm font-semibold text-success-600">
						{activity.avgPerSemester}
					</p>
				</div>
			</div>

			{/* Semester Grid or Empty State */}
			{activity.semesters.length === 0 ? (
				<div className="text-center py-8 text-gray-400 text-sm">
					No semesters added yet
				</div>
			) : (
				<div className="space-y-2">
					{activity.semesters.map((semester, semesterIndex) => (
						<div key={semester.name} className="flex items-center gap-3">
							<span className="text-xs text-gray-500 w-6 flex-shrink-0">
								{semester.name}
							</span>
							<div className="flex gap-1.5 flex-1">
								{Array.from({ length: maxSubjects }, (_, dotIndex) => (
									<div
										key={dotIndex}
										className={`h-3 w-3 rounded-full transition-all hover:scale-110 ${getColor(semesterIndex, dotIndex, semester.subjects)}`}
										title={
											dotIndex < semester.subjects
												? `Subject ${dotIndex + 1}`
												: ""
										}
									/>
								))}
							</div>
							<span className="text-xs font-medium text-gray-700 w-4 text-right">
								{semester.subjects}
							</span>
						</div>
					))}
				</div>
			)}

			{/* Legend */}
			{activity.semesters.length > 0 && (
				<div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-success-600/20" />
						<div className="h-2.5 w-2.5 rounded-full bg-success-600/60" />
						<div className="h-2.5 w-2.5 rounded-full bg-success-600" />
						<span className="text-xs text-gray-500 ml-1">Recent semesters</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-gray-100" />
						<span className="text-xs text-gray-400">Empty</span>
					</div>
				</div>
			)}
		</div>
	);
}
