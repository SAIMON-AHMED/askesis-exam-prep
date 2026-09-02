/**
 * Exam scoring configuration and ranges
 * Derived from shared/exam-config.json (canonical source)
 * 
 * Phase 2.5: Instead of hardcoding exam bounds in multiple places,
 * this centralized module provides scoring ranges for all exams.
 */

export interface ExamScoringInfo {
  min: number;
  max: number;
  step: number;
  defaultTarget: number;
  presets: number[];
  label: string;
  sections?: { id: string; name: string; min: number; max: number }[];
}

export const EXAM_SCORING_RANGES: Record<string, ExamScoringInfo> = {
  sat: {
    min: 400,
    max: 1600,
    step: 10,
    defaultTarget: 1500,
    presets: [1300, 1400, 1480, 1520, 1560, 1600],
    label: 'SAT Scale (400-1600)',
    sections: [
      { id: 'reading_writing', name: 'Reading & Writing', min: 200, max: 800 },
      { id: 'math', name: 'Math', min: 200, max: 800 },
    ],
  },
  act: {
    min: 1,
    max: 36,
    step: 1,
    defaultTarget: 33,
    presets: [28, 30, 32, 34, 35, 36],
    label: 'ACT Composite (1-36)',
    sections: [
      { id: 'english', name: 'English', min: 1, max: 36 },
      { id: 'math', name: 'Math', min: 1, max: 36 },
      { id: 'reading', name: 'Reading', min: 1, max: 36 },
      { id: 'science', name: 'Science (Optional)', min: 1, max: 36 },
    ],
  },
  gre: {
    min: 260,
    max: 340,
    step: 1,
    defaultTarget: 325,
    presets: [310, 320, 325, 330, 335, 340],
    label: 'GRE General Scale (260-340)',
    sections: [
      { id: 'verbal', name: 'Verbal Reasoning', min: 130, max: 170 },
      { id: 'quant', name: 'Quantitative Reasoning', min: 130, max: 170 },
      { id: 'writing', name: 'Analytical Writing', min: 0, max: 6 },
    ],
  },
  gmat: {
    min: 205,
    max: 805,
    step: 10,
    defaultTarget: 720,
    presets: [640, 680, 700, 720, 760, 800],
    label: 'GMAT Total (205-805)',
    sections: [
      { id: 'verbal', name: 'Verbal & Reading Comprehension', min: 60, max: 90 },
      { id: 'quant', name: 'Quantitative', min: 60, max: 90 },
      { id: 'data_insights', name: 'Data Insights', min: 60, max: 90 },
    ],
  },
  shsat: {
    min: 200,
    max: 700,
    step: 5,
    defaultTarget: 560,
    presets: [500, 540, 580, 620, 670, 700],
    label: 'SHSAT Scaled (200-700)',
    sections: [
      { id: 'verbal', name: 'Verbal', min: 100, max: 350 },
      { id: 'math', name: 'Math', min: 100, max: 350 },
    ],
  },
  regents: {
    min: 0,
    max: 100,
    step: 1,
    defaultTarget: 85,
    presets: [65, 75, 80, 85, 90, 95],
    label: 'Regents Score (0-100% per subject)',
    sections: [
      { id: 'algebra', name: 'Algebra I', min: 0, max: 100 },
      { id: 'geometry', name: 'Geometry', min: 0, max: 100 },
      { id: 'algebra_ii', name: 'Algebra II', min: 0, max: 100 },
    ],
  },
};

export function getScoringInfo(examId: string | undefined): ExamScoringInfo {
  if (!examId || !EXAM_SCORING_RANGES[examId]) {
    return EXAM_SCORING_RANGES.sat; // Default fallback
  }
  return EXAM_SCORING_RANGES[examId];
}

export function getExamScoringBounds(examId: string | undefined) {
  const info = getScoringInfo(examId);
  return {
    min: info.min,
    max: info.max,
    step: info.step,
    presets: info.presets,
  };
}

export function getExamDefaultTarget(examId: string | undefined): number {
  const info = getScoringInfo(examId);
  return info.defaultTarget;
}
