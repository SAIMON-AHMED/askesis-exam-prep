import { NextResponse } from 'next/server';

const PENDING_QUESTIONS = [
  {
    id: 'rev-q-1',
    exam_type: 'SAT',
    topic: 'Passport to Advanced Math',
    difficulty: 'Hard',
    question_text: 'For what positive value of c does the quadratic equation 3x^2 - 12x + c = 0 have exactly one real solution?',
    options: ['c = 4', 'c = 12', 'c = 16', 'c = 36'],
    correct_answer: 'c = 12',
    explanation: 'For exactly one real solution, the discriminant b^2 - 4ac = 0. (-12)^2 - 4(3)(c) = 0 => 144 - 12c = 0 => c = 12.',
    submitted_by: 'AI Generator',
  },
  {
    id: 'rev-q-2',
    exam_type: 'GRE',
    topic: 'Text Completion',
    difficulty: 'Medium',
    question_text: 'Although the theory was initially dismissed as _____, subsequent empirical studies confirmed its foundational veracity.',
    options: ['specious', 'substantive', 'pedantic', 'laudable'],
    correct_answer: 'specious',
    explanation: 'Specious means superficially plausible, but actually wrong. The word "Although" establishes contrast with confirmed veracity.',
    submitted_by: 'AI Generator',
  },
];

export async function GET() {
  return NextResponse.json({ questions: PENDING_QUESTIONS, total: PENDING_QUESTIONS.length });
}
