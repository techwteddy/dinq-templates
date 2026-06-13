// Grading Engine Factory
// Provides a unified interface to access grading functions based on university

import type { GradingEngine, UniversitySlug } from "@/types/grading";
import * as gcwufEngine from "./gcwuf";
import * as numlEngine from "./numl";

/**
 * Get the grading engine for a specific university
 */
export function getUniversityGradingEngine(
	university: UniversitySlug,
): GradingEngine {
	switch (university) {
		case "gcwuf":
			return {
				calculateGradePoint: gcwufEngine.calculateGradePoint,
				getLetterGrade: gcwufEngine.getLetterGrade,
				calculateSGPA: gcwufEngine.calculateSGPA,
				calculateCGPA: gcwufEngine.calculateCGPA,
			};
		default:
			return {
				calculateGradePoint: (marks: number) =>
					numlEngine.calculateGradePoint(marks),
				getLetterGrade: (marks: number) => numlEngine.getLetterGrade(marks),
				calculateSGPA: numlEngine.calculateSGPA,
				calculateCGPA: numlEngine.calculateCGPA,
			};
	}
}

// Re-export individual engines for direct access if needed
export { numlEngine as numl, gcwufEngine as gcwuf };
