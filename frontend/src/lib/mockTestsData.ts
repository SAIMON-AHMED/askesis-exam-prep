/**
 * Mock test definitions — 5 condensed, timed practice tests per exam.
 * Question counts stay within the backend limits (5-60 questions, 5-240 min).
 */

export interface MockTestDefinition {
  id: number;
  name: string;
  numQuestions: number;
  durationMinutes: number;
}

export const MOCK_TESTS_PER_EXAM = 5;

// Condensed format per exam: [questions, minutes]
const MOCK_CONFIG: Record<string, [number, number]> = {
  sat: [25, 45],
  act: [30, 45],
  gre: [25, 50],
  gmat: [25, 50],
  shsat: [30, 60],
  regents: [25, 60],
};

export function getMockTests(examId: string): MockTestDefinition[] {
  const [numQuestions, durationMinutes] = MOCK_CONFIG[examId] || [25, 45];
  return Array.from({ length: MOCK_TESTS_PER_EXAM }, (_, i) => ({
    id: i + 1,
    name: `Mock Test ${i + 1}`,
    numQuestions,
    durationMinutes,
  }));
}
