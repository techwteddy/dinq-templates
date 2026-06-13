"use client";

import { Check, Pencil, TrendingDown, TrendingUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { updateTargetGpa } from "@/lib/supabase/auth";
import type { Semester } from "@/types/grading";

interface StatsCardsProps {
	cgpa: number;
	totalCreditHours: number;
	semesterCount: number;
	targetGpa: number;
	semesters: Semester[];
}

export function StatsCards({
	cgpa,
	totalCreditHours,
	semesterCount,
	targetGpa,
	semesters,
}: StatsCardsProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(targetGpa.toString());
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	// Calculate actual GPA change from last two semesters
	const gpaChange = useMemo(() => {
		if (semesters.length < 2) return null;
		const lastSGPA = semesters[semesters.length - 1].sgpa;
		const prevSGPA = semesters[semesters.length - 2].sgpa;
		return lastSGPA - prevSGPA;
	}, [semesters]);

	const isTargetMet = cgpa >= targetGpa;
	const percentageToTarget =
		targetGpa > 0 ? Math.min((cgpa / targetGpa) * 100, 100) : 0;

	const handleSave = useCallback(() => {
		const value = Number.parseFloat(editValue);

		if (Number.isNaN(value) || value < 0 || value > 4) {
			setError("Enter a valid GPA (0-4)");
			return;
		}

		setError(null);
		startTransition(async () => {
			const result = await updateTargetGpa(value);
			if (result.error) {
				setError(result.error);
			} else {
				setIsEditing(false);
				router.refresh();
			}
		});
	}, [editValue, router]);

	const handleCancel = useCallback(() => {
		setIsEditing(false);
		setEditValue(targetGpa.toString());
		setError(null);
	}, [targetGpa]);

	return (
		<>
			{/* CGPA Card - Large Featured */}
			<div className="col-span-12 md:col-span-6 lg:col-span-4">
				<div className="bg-white rounded-3xl p-6 card-shadow h-full">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-sm font-medium text-gray-500">
							Cumulative GPA
						</h3>
					</div>
					<div className="flex items-end gap-3 mb-4">
						<span className="text-5xl font-light text-gray-900 tracking-tight">
							{cgpa.toFixed(2)}
						</span>
						{gpaChange !== null && (
							<div
								className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${
									gpaChange >= 0
										? "bg-success-50 text-success-600"
										: "bg-destructive-50 text-destructive-600"
								}`}
							>
								{gpaChange >= 0 ? (
									<TrendingUp className="h-3.5 w-3.5" />
								) : (
									<TrendingDown className="h-3.5 w-3.5" />
								)}
								{gpaChange >= 0 ? "+" : ""}
								{gpaChange.toFixed(2)}
							</div>
						)}
					</div>

					{/* Progress to target */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500">Progress to Target</span>
							<span className="font-medium text-gray-900">
								{targetGpa.toFixed(2)}
							</span>
						</div>
						<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-primary to-primary-400 rounded-full transition-all duration-500"
								style={{ width: `${percentageToTarget}%` }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Credit Hours */}
			<div className="col-span-6 md:col-span-3 lg:col-span-2">
				<div className="bg-white rounded-3xl p-6 card-shadow h-full">
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						Total Credits
					</h3>
					<span className="text-4xl font-light text-gray-900 tracking-tight">
						{totalCreditHours}
					</span>
					<p className="text-sm text-gray-400 mt-2">credit hours</p>
				</div>
			</div>

			{/* Semesters */}
			<div className="col-span-6 md:col-span-3 lg:col-span-2">
				<div className="bg-white rounded-3xl p-6 card-shadow h-full">
					<h3 className="text-sm font-medium text-gray-500 mb-2">Semesters</h3>
					<div className="flex items-end gap-2">
						<span className="text-4xl font-light text-gray-900 tracking-tight">
							{semesterCount}
						</span>
						<span className="text-lg text-gray-400 mb-1">/ 8</span>
					</div>
					<div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
						<div
							className="h-full bg-gray-400 rounded-full"
							style={{ width: `${(semesterCount / 8) * 100}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Target GPA - Editable */}
			<div className="col-span-12 md:col-span-6 lg:col-span-4">
				<div className="bg-white rounded-3xl p-6 card-shadow h-full">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-sm font-medium text-gray-500">Target GPA</h3>
						<div className="flex items-center gap-2">
							{semesterCount > 0 && !isEditing && (
								<span
									className={`px-2.5 py-1 rounded-full text-xs font-medium ${
										isTargetMet
											? "bg-success-50 text-success-600"
											: "bg-warning-50 text-warning-600"
									}`}
								>
									{isTargetMet ? "Achieved" : "In Progress"}
								</span>
							)}
							{!isEditing && (
								<button
									type="button"
									onClick={() => setIsEditing(true)}
									className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
									aria-label="Edit target GPA"
								>
									<Pencil className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>

					{isEditing ? (
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<input
									type="number"
									step="0.01"
									min="0"
									max="4"
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									className="w-full text-4xl font-light text-foreground tracking-tight bg-secondary/50 border-input rounded-xl px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
									disabled={isPending}
								/>
							</div>
							{error && <p className="text-xs text-destructive">{error}</p>}
							<div className="flex gap-2">
								<button
									type="button"
									onClick={handleSave}
									disabled={isPending}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 disabled:bg-primary-300 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
								>
									<Check className="h-4 w-4" />
									{isPending ? "Saving..." : "Save"}
								</button>
								<button
									type="button"
									onClick={handleCancel}
									disabled={isPending}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
								>
									<X className="h-4 w-4" />
									Cancel
								</button>
							</div>
						</div>
					) : (
						<>
							<span className="text-5xl font-light text-gray-900 tracking-tight">
								{targetGpa.toFixed(2)}
							</span>
							<div className="mt-4 flex items-center gap-4">
								{!isTargetMet && semesterCount > 0 && (
									<p className="text-sm text-gray-500">
										<span className="font-semibold text-primary">
											{(targetGpa - cgpa).toFixed(2)}
										</span>{" "}
										points needed
									</p>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}
