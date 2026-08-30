import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const answers = body.answers || {};
    const total = Object.keys(answers).length || 10;
    const correctCount = Math.max(1, Math.floor(total * 0.8));

    mockBackend.user.exams_completed += 1;
    mockBackend.user.total_study_hours += 0.5;

    return NextResponse.json({
      diagnostic_id: id,
      raw_score: correctCount,
      total_questions: total,
      accuracy_percentage: Math.round((correctCount / total) * 100),
      recommended_difficulty: 'Medium-Hard',
      weak_topics: ['Standard English Conventions', 'Geometry'],
      topic_results: [
        { topic: 'Heart of Algebra', correct: 3, total: 3, percentage: 100 },
        { topic: 'Reading Comprehension', correct: 3, total: 4, percentage: 75 },
        { topic: 'Standard English Conventions', correct: 1, total: 3, percentage: 33 },
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
