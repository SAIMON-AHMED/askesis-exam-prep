/**
 * Per-exam question totals, precomputed so that browse pages can show counts without
 * importing the ~1 MB question bank into the client bundle.
 *
 * Kept honest by scripts/auditQuestions.ts, which fails if these drift from the real data.
 */
export const QUESTION_COUNTS: Record<string, number> = {
  sat: 385,
  act: 850,
  gre: 360,
  gmat: 555,
  shsat: 300,
  regents: 455,
};

export function getQuestionCount(examId: string): number {
  return QUESTION_COUNTS[examId] ?? 0;
}
