"use client";

import { Pencil } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateSemester } from "@/lib/supabase/mutations";

interface EditSemesterDialogProps {
	semesterId: string;
	currentName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditSemesterDialog({
	semesterId,
	currentName,
	open,
	onOpenChange,
}: EditSemesterDialogProps) {
	const [name, setName] = useState(currentName);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim() || name === currentName) {
			onOpenChange(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await updateSemester(semesterId, name);
			onOpenChange(false);
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : "Failed to update semester",
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
						<div className="h-10 w-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
							<Pencil className="h-5 w-5 text-primary" />
						</div>
						<div>
							<DialogTitle className="text-xl font-semibold text-gray-900">
								Edit Semester
							</DialogTitle>
							<DialogDescription className="text-gray-500 text-sm">
								Update the name of this semester.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-5 pt-4">
					<Field>
						<FieldLabel className="text-gray-600 text-sm font-medium mb-2 block">
							Semester Name
						</FieldLabel>
						<Input
							placeholder="e.g. Semester 1, Fall 2024"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-secondary/50 border-input h-11 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
							disabled={loading}
						/>
						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4 }}
									transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
								>
									<FieldError className="mt-2 text-destructive text-sm">
										{error}
									</FieldError>
								</motion.div>
							)}
						</AnimatePresence>
					</Field>
					<DialogFooter className="gap-3">
						<Button
							type="button"
							variant="ghost"
							onClick={() => onOpenChange(false)}
							disabled={loading}
							className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-11 px-5 rounded-xl"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={loading || !name.trim() || name === currentName}
							className="bg-primary hover:bg-primary-600 text-primary-foreground font-medium h-11 px-6 rounded-xl transition-all disabled:opacity-50"
						>
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
