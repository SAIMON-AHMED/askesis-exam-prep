import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const exam = mockBackend.onboarding.primary_exam_id || 'sat';
  return NextResponse.json({
    exam_type: exam.toUpperCase(),
    topic: 'Heart of Algebra & Linear Systems',
    action: 'Targeted Practice Drills',
    reason: 'Identified as a high-yield growth opportunity to hit your target score.',
    target_difficulty: 'Medium-Hard',
    estimated_minutes: 15,
    destination: `/exams/${exam.toLowerCase()}/practice`,
  });
}
