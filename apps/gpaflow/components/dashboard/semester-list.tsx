"use client";

import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	MoreVertical,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUniversityGradingEngine } from "@/lib/grading";
import type { Semester, Subject, UniversitySlug } from "@/types/grading";
import { AddSubjectDialog } from "./add-subject-dialog";
import { DeleteSemesterDialog } from "./delete-semester-dialog";
import { DeleteSubjectDialog } from "./delete-subject-dialog";
import { EditSemesterDialog } from "./edit-semester-dialog";
import { EditSubjectDialog } from "./edit-subject-dialog";

interface SemesterListProps {
	semesters: Semester[];
	university: UniversitySlug;
}

export function SemesterList({ semesters, university }: SemesterListProps) {
	const _engine = getUniversityGradingEngine(university);
	const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
	const [deletingSemester, setDeletingSemester] = useState<Semester | null>(
		null,
	);
	const [editingSubject, setEditingSubject] = useState<{
		subject: Subject;
		semesterId: string;
	} | null>(null);
	const [deletingSubject, setDeletingSubject] = useState<{
		subject: Subject;
		semesterId: string;
	} | null>(null);
	const [expandedSemesters, setExpandedSemesters] = useState<Set<string>>(
		new Set(),
	);

	const toggleExpanded = (semesterId: string) => {
		setExpandedSemesters((prev) => {
			const next = new Set(prev);
			if (next.has(semesterId)) {
				next.delete(semesterId);
			} else {
				next.add(semesterId);
			}
			return next;
		});
	};

	if (semesters.length === 0) {
		return (
			<div className="py-16 text-center">
				<div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
					<BookOpen className="h-7 w-7 text-gray-400" />
				</div>
				<h3 className="text-lg font-medium text-gray-900 mb-1">
					No semesters yet
				</h3>
				<p className="text-sm text-gray-500 max-w-xs mx-auto">
					Start tracking your academic journey by adding your first semester
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{semesters.map((semester, index) => (
					<div
						key={semester.id}
						className="bg-gray-50/50 rounded-2xl p-4 hover:bg-gray-50 transition-colors"
					>
						{/* Header */}
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-xl bg-white card-shadow flex items-center justify-center">
									<span className="text-sm font-semibold text-gray-600">
										{index + 1}
									</span>
								</div>
								<div>
									<h4 className="text-sm font-semibold text-gray-900">
										{semester.name}
									</h4>
									<p className="text-xs text-gray-500">{semester.year}</p>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
										aria-label="More options"
									>
										<MoreVertical className="h-4 w-4" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="bg-white border-gray-200 min-w-[140px] rounded-xl shadow-lg"
								>
									<DropdownMenuItem
										onClick={() => setEditingSemester(semester)}
										className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer text-sm rounded-lg"
									>
										<Pencil className="h-4 w-4 mr-2 text-gray-400" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setDeletingSemester(semester)}
										className="text-destructive hover:text-destructive-700 hover:bg-destructive-50 cursor-pointer text-sm rounded-lg"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Stats Row */}
						<div className="flex items-center gap-2 mb-4">
							<span className="px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
								{semester.sgpa.toFixed(2)} SGPA
							</span>
							<span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
								{semester.total_credit_hours} Credits
							</span>
						</div>

						{/* Subjects */}
						{semester.subjects.length === 0 ? (
							<div className="py-4 text-center bg-white rounded-xl">
								<p className="text-sm text-gray-500 mb-2">No subjects yet</p>
								<AddSubjectDialog
									semesterId={semester.id}
									semesterName={semester.name}
									university={university}
									trigger={
										<Button
											variant="ghost"
											size="sm"
											className="text-primary hover:text-primary-700 hover:bg-primary-50 h-8 text-xs"
										>
											Add subject
											<ChevronRight className="h-3.5 w-3.5 ml-1" />
										</Button>
									}
								/>
							</div>
						) : (
							<div className="space-y-2">
								{(expandedSemesters.has(semester.id)
									? semester.subjects
									: semester.subjects.slice(0, 4)
								).map((subject) => (
									<div
										key={subject.id}
										className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm group/subject card-shadow"
									>
										<span className="text-gray-700 truncate flex-1 font-medium">
											{subject.name}
										</span>
										<div className="flex items-center gap-2">
											<span className="text-primary font-semibold text-sm">
												{subject.letter_grade}
											</span>
											<span className="text-gray-400 text-xs">
												{subject.credit_hours}ch
											</span>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button
														type="button"
														className="h-6 w-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 opacity-0 group-hover/subject:opacity-100 transition-opacity"
														aria-label="Subject options"
													>
														<MoreVertical className="h-3.5 w-3.5" />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="bg-white border-gray-200 min-w-[110px] rounded-xl shadow-lg"
												>
													<DropdownMenuItem
														onClick={() =>
															setEditingSubject({
																subject,
																semesterId: semester.id,
															})
														}
														className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer text-xs rounded-lg"
													>
														<Pencil className="h-3.5 w-3.5 mr-2 text-gray-400" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															setDeletingSubject({
																subject,
																semesterId: semester.id,
															})
														}
														className="text-destructive hover:text-destructive-700 hover:bg-destructive-50 cursor-pointer text-xs rounded-lg"
													>
														<Trash2 className="h-3.5 w-3.5 mr-2" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								))}

								{semester.subjects.length > 4 && (
									<button
										type="button"
										onClick={() => toggleExpanded(semester.id)}
										className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl py-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
									>
										{expandedSemesters.has(semester.id) ? (
											<>
												<ChevronUp className="h-3.5 w-3.5" />
												Show less
											</>
										) : (
											<>
												<ChevronDown className="h-3.5 w-3.5" />+
												{semester.subjects.length - 4} more
											</>
										)}
									</button>
								)}

								<AddSubjectDialog
									semesterId={semester.id}
									semesterName={semester.name}
									university={university}
									trigger={
										<button
											type="button"
											className="w-full text-muted-foreground hover:text-primary hover:bg-primary-50 rounded-xl py-2.5 text-xs font-medium flex items-center justify-center gap-1 transition-colors border-2 border-dashed border-input hover:border-primary-200"
										>
											<Plus className="h-3.5 w-3.5" />
											Add Subject
										</button>
									}
								/>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Semester Dialogs */}
			{editingSemester && (
				<EditSemesterDialog
					semesterId={editingSemester.id}
					currentName={editingSemester.name}
					open={!!editingSemester}
					onOpenChange={(open) => !open && setEditingSemester(null)}
				/>
			)}

			{deletingSemester && (
				<DeleteSemesterDialog
					semesterId={deletingSemester.id}
					semesterName={deletingSemester.name}
					subjectCount={deletingSemester.subjects.length}
					open={!!deletingSemester}
					onOpenChange={(open) => !open && setDeletingSemester(null)}
				/>
			)}

			{/* Subject Dialogs */}
			{editingSubject && (
				<EditSubjectDialog
					subject={editingSubject.subject}
					semesterId={editingSubject.semesterId}
					university={university}
					open={!!editingSubject}
					onOpenChange={(open) => !open && setEditingSubject(null)}
				/>
			)}

			{deletingSubject && (
				<DeleteSubjectDialog
					subjectId={deletingSubject.subject.id}
					subjectName={deletingSubject.subject.name}
					semesterId={deletingSubject.semesterId}
					open={!!deletingSubject}
					onOpenChange={(open) => !open && setDeletingSubject(null)}
				/>
			)}
		</>
	);
}
