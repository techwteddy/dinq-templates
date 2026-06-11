/**
 * Calculates a letter grade from a numeric score.
 * Thresholds: A ≥ 80, B ≥ 70, C ≥ 60, D ≥ 50, F < 50
 */
export function getGradeLetter(score: number): string {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}
