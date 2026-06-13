"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { deleteSemester } from "@/lib/supabase/mutations";

interface DeleteSemesterDialogProps {
	semesterId: string;
	semesterName: string;
	subjectCount: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteSemesterDialog({
	semesterId,
	semesterName,
	subjectCount,
	open,
	onOpenChange,
}: DeleteSemesterDialogProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleDelete() {
		setLoading(true);
		setError(null);

		try {
			await deleteSemester(semesterId);
			onOpenChange(false);
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : "Failed to delete semester",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-white border-gray-200 sm:max-w-[425px] rounded-2xl">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-xl bg-destructive-50 border border-destructive-100 flex items-center justify-center">
							<AlertTriangle className="h-5 w-5 text-destructive" />
						</div>
						<div>
							<DialogTitle className="text-xl font-semibold text-gray-900">
								Delete Semester
							</DialogTitle>
						</div>
					</div>
					<DialogDescription className="text-gray-500 text-sm pt-4">
						Are you sure you want to delete{" "}
						<span className="text-gray-900 font-medium">{semesterName}</span>?
						{subjectCount > 0 && (
							<span className="block mt-2 text-destructive text-xs">
								This will also delete {subjectCount} subject
								{subjectCount > 1 ? "s" : ""} associated with this semester.
							</span>
						)}
					</DialogDescription>
				</DialogHeader>
				{error && (
					<p className="text-sm text-destructive bg-destructive-50 border border-destructive-100 rounded-lg px-3 py-2">
						{error}
					</p>
				)}
				<DialogFooter className="gap-3 pt-2">
					<Button
						type="button"
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={loading}
						className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleDelete}
						disabled={loading}
						className="bg-destructive hover:bg-destructive-600 text-destructive-foreground font-medium h-11 px-6 rounded-xl transition-all disabled:opacity-50"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						{loading ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
