"use client";

import { Plus } from "lucide-react";
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
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createSemester } from "@/lib/supabase/mutations";

export function AddSemesterDialog() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;

		setLoading(true);
		setError(null);

		try {
			await createSemester(name);
			setOpen(false);
			setName("");
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : "Failed to create semester",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-primary hover:bg-primary-600 text-primary-foreground font-medium px-4 h-9 rounded-xl">
					<Plus className="mr-1.5 h-4 w-4" />
					New Semester
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white border-gray-200 sm:max-w-[420px] rounded-2xl shadow-xl">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-gray-900">
						Create Semester
					</DialogTitle>
					<DialogDescription className="text-gray-500 text-sm">
						Add a new semester to track your academic progress
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<Field>
						<FieldLabel className="text-gray-600 text-sm mb-2 block font-medium">
							Semester Name
						</FieldLabel>
						<Input
							placeholder="e.g. Semester 1, Fall 2024"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-secondary/50 border-input h-11 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
					<DialogFooter className="gap-2 pt-2">
						<Button
							type="button"
							variant="ghost"
							onClick={() => setOpen(false)}
							disabled={loading}
							className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-10 px-4 rounded-xl"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={loading || !name.trim()}
							className="bg-primary hover:bg-primary-600 text-primary-foreground font-medium h-10 px-5 rounded-xl disabled:opacity-50"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Creating...
								</span>
							) : (
								"Create Semester"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
