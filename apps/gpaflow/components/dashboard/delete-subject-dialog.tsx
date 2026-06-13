"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteSubject } from "@/lib/supabase/mutations";

interface DeleteSubjectDialogProps {
	subjectId: string;
	subjectName: string;
	semesterId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteSubjectDialog({
	subjectId,
	subjectName,
	semesterId,
	open,
	onOpenChange,
}: DeleteSubjectDialogProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleDelete() {
		setLoading(true);
		setError(null);

		try {
			await deleteSubject(subjectId, semesterId);
			onOpenChange(false);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to delete subject");
		} finally {
			setLoading(false);
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="bg-white border-gray-200 rounded-2xl">
				<AlertDialogHeader className="space-y-1">
					<AlertDialogTitle className="text-lg font-semibold text-gray-900">
						Delete Subject
					</AlertDialogTitle>
					<AlertDialogDescription className="text-gray-500 text-sm">
						This action cannot be undone
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="py-3">
					<p className="text-gray-600 text-sm">
						Are you sure you want to delete{" "}
						<span className="font-medium text-gray-900">{subjectName}</span>?
						This will permanently remove this subject and recalculate your
						semester GPA.
					</p>

					<AnimatePresence>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -4 }}
								transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
								className="mt-3 text-destructive text-sm"
							>
								{error}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel
						disabled={loading}
						className="bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 px-4 rounded-xl"
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={loading}
						className="bg-destructive hover:bg-destructive-600 text-destructive-foreground font-medium h-9 px-4 rounded-xl disabled:opacity-50"
					>
						{loading ? (
							<span className="flex items-center gap-2">
								<span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Deleting...
							</span>
						) : (
							"Delete Subject"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
