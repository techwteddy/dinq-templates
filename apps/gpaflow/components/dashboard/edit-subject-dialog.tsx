"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getUniversityGradingEngine } from "@/lib/grading";
import { updateSubject } from "@/lib/supabase/mutations";
import type { UniversitySlug } from "@/types/grading";

interface EditSubjectDialogProps {
	subject: {
		id: string;
		name: string;
		obtained_marks: number;
		total_marks?: number;
		credit_hours: number;
	};
	semesterId: string;
	university: UniversitySlug;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditSubjectDialog({
	subject,
	semesterId,
	university,
	open,
	onOpenChange,
}: EditSubjectDialogProps) {
	const [name, setName] = useState(subject.name);
	const [marks, setMarks] = useState(String(subject.obtained_marks));
	const [totalMarks, setTotalMarks] = useState(
		String(subject.total_marks ?? 100),
	);
	const [creditHours, setCreditHours] = useState(String(subject.credit_hours));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const engine = getUniversityGradingEngine(university);
	const isGCWUF = university === "gcwuf";
	const maxCredits = university === "numl" ? 4 : university === "gcwuf" ? 5 : 6;

	useEffect(() => {
		setName(subject.name);
		setMarks(String(subject.obtained_marks));
		setTotalMarks(String(subject.total_marks ?? 100));
		setCreditHours(String(subject.credit_hours));
		setError(null);
	}, [subject]);

	const gradePreview = useMemo(() => {
		const marksNum = Number.parseFloat(marks);
		const totalMarksNum = Number.parseFloat(totalMarks);
		const creditHoursNum = Number.parseInt(creditHours, 10) || 3;

		if (Number.isNaN(marksNum) || marksNum < 0) return null;
		if (isGCWUF && (Number.isNaN(totalMarksNum) || totalMarksNum <= 0))
			return null;
		if (marksNum > (isGCWUF ? totalMarksNum : 100)) return null;

		const maxMarks = isGCWUF ? totalMarksNum : 100;
		const percentage = (marksNum / maxMarks) * 100;

		return {
			letterGrade: engine.getLetterGrade(
				marksNum,
				creditHoursNum,
				isGCWUF ? totalMarksNum : undefined,
			),
			gradePoint: engine.calculateGradePoint(
				marksNum,
				creditHoursNum,
				isGCWUF ? totalMarksNum : undefined,
			),
			percentage: percentage.toFixed(1),
		};
	}, [marks, totalMarks, creditHours, engine, isGCWUF]);

	function handleNumericChange(
		value: string,
		setter: (val: string) => void,
		allowDecimal = true,
	) {
		const filtered = allowDecimal
			? value.replace(/[^0-9.]/g, "").replace(/(\.)(?=.*\.)/g, "")
			: value.replace(/[^0-9]/g, "");
		setter(filtered);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const trimmedName = name.trim();
		const marksNum = Number.parseFloat(marks);
		const totalMarksNum = Number.parseFloat(totalMarks);
		const creditHoursNum = Number.parseInt(creditHours, 10);

		if (!trimmedName) {
			setError("Subject name is required");
			return;
		}

		const maxMarks = isGCWUF ? totalMarksNum : 100;
		if (Number.isNaN(marksNum) || marksNum < 0 || marksNum > maxMarks) {
			setError(`Marks must be between 0 and ${maxMarks}`);
			return;
		}

		if (isGCWUF && (Number.isNaN(totalMarksNum) || totalMarksNum <= 0)) {
			setError("Total marks must be greater than 0");
			return;
		}

		if (
			Number.isNaN(creditHoursNum) ||
			creditHoursNum < 1 ||
			creditHoursNum > maxCredits
		) {
			setError(`Credit hours must be between 1 and ${maxCredits}`);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await updateSubject(subject.id, semesterId, {
				name: trimmedName,
				obtained_marks: marksNum,
				total_marks: isGCWUF ? totalMarksNum : undefined,
				credit_hours: creditHoursNum,
			});
			onOpenChange(false);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to update subject");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-white border-gray-200 sm:max-w-[480px] rounded-2xl">
				<DialogHeader className="space-y-1">
					<DialogTitle className="text-lg font-semibold text-gray-900">
						Edit Subject
					</DialogTitle>
					<DialogDescription className="text-gray-500 text-sm">
						Update subject details
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<Field>
						<FieldLabel className="text-gray-600 text-sm font-medium mb-1.5 block">
							Subject Name
						</FieldLabel>
						<Input
							placeholder="e.g. Calculus, Programming Fundamentals"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-secondary/50 border-input h-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
							disabled={loading}
						/>
					</Field>

					<div
						className={`grid gap-4 items-end ${isGCWUF ? "grid-cols-3" : "grid-cols-2"}`}
					>
						<Field>
							<FieldLabel className="text-gray-600 text-sm font-medium mb-1.5 block">
								Obtained Marks
							</FieldLabel>
							<Input
								type="text"
								inputMode="decimal"
								placeholder={isGCWUF ? "0" : "0 - 100"}
								value={marks}
								onChange={(e) => handleNumericChange(e.target.value, setMarks)}
								className="bg-gray-50 border-gray-200 h-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
								disabled={loading}
							/>
						</Field>

						{isGCWUF && (
							<Field>
								<FieldLabel className="text-gray-600 text-sm font-medium mb-1.5 block">
									Total Marks
								</FieldLabel>
								<Input
									type="text"
									inputMode="numeric"
									placeholder="100"
									value={totalMarks}
									onChange={(e) =>
										handleNumericChange(e.target.value, setTotalMarks, false)
									}
									className="bg-gray-50 border-gray-200 h-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
									disabled={loading}
								/>
							</Field>
						)}

						<Field>
							<FieldLabel className="text-gray-600 text-sm font-medium mb-1.5 block">
								Credit Hours
							</FieldLabel>
							<Input
								type="text"
								inputMode="numeric"
								placeholder={`1 - ${maxCredits}`}
								value={creditHours}
								onChange={(e) =>
									handleNumericChange(e.target.value, setCreditHours, false)
								}
								className="bg-gray-50 border-gray-200 h-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
								disabled={loading}
							/>
						</Field>
					</div>

					<AnimatePresence>
						{gradePreview && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="p-3 rounded-xl bg-primary-50 border border-primary-100"
							>
								<p className="text-xs text-primary uppercase tracking-wider mb-2 font-medium">
									Grade Preview
								</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Badge className="bg-primary text-primary-foreground border-0 px-2.5 py-1 text-base font-semibold">
											{gradePreview.letterGrade}
										</Badge>
										<div>
											<p className="text-xl font-bold text-gray-900">
												{gradePreview.gradePoint.toFixed(2)}
											</p>
											<p className="text-xs text-gray-500">Grade Points</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-base font-medium text-gray-700">
											{gradePreview.percentage}%
										</p>
										<p className="text-xs text-gray-500">Percentage</p>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -4 }}
								transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
							>
								<FieldError className="text-destructive text-sm">
									{error}
								</FieldError>
							</motion.div>
						)}
					</AnimatePresence>

					<DialogFooter className="gap-2 pt-2">
						<Button
							type="button"
							variant="ghost"
							onClick={() => onOpenChange(false)}
							disabled={loading}
							className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 px-4 rounded-xl"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={loading || !name.trim() || !marks || !creditHours}
							className="bg-primary hover:bg-primary-600 text-primary-foreground font-medium h-9 px-4 rounded-xl disabled:opacity-50"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Saving...
								</span>
							) : (
								"Save Changes"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
