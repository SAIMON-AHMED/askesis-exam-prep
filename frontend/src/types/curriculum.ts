/**
 * Learn 2.0 — Lesson layer types.
 * Deterministic, hand-authored lesson content (never generated at runtime by the AI).
 */

export interface LearningObjective {
  id: string;
  topicId: string;
  statement: string;
  prerequisites: string[];
  commonMisconceptions: string[];
  successCriteria: string[];
}

export interface MicroQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** The specific trap/misconception this wrong answer reveals, fed to the Tutor for remediation. */
  conceptTrap?: string;
}

export interface WorkedExample {
  problem: string;
  stepByStepSolution: string[];
  takeaway: string;
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  contentMarkdown: string;
  workedExample?: WorkedExample;
  checkQuestion?: MicroQuizItem;
}

export interface TopicLesson {
  id: string;
  topicId: string;
  examId: string;
  version: number;
  estimatedMinutes: number;
  objectiveIds: string[];
  steps: LessonStep[];
  /** Keyed by stepNumber; seeds the Tutor drawer's context when a student gets that step wrong. */
  remediationPrompts?: Record<number, string>;
}

export type LessonStatus = 'not_started' | 'in_progress' | 'completed' | 'tested_out';

export interface MicroQuizResult {
  stepNumber: number;
  correct: boolean;
  attempts: number;
  hintsUsed: number;
}

export interface LessonProgress {
  lessonId: string;
  topic: string;
  examType: string;
  status: LessonStatus;
  currentStep: number;
  microQuizResults: MicroQuizResult[];
  startedAt: string | null;
  completedAt: string | null;
  masteryEvidenceScore: number | null;
}
