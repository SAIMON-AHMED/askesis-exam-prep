import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export const dynamic = 'force-dynamic';

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
    const accuracy = Math.round((correctCount / total) * 100);

    mockBackend.studyLogs.unshift({
      id: `log-diag-${Date.now()}`,
      duration_minutes: 30,
      topic: 'Full Diagnostic Assessment',
      exam_type: 'SAT',
      activity_type: 'Diagnostic Test',
      notes: `Diagnostic completed with ${correctCount}/${total} (${accuracy}%).`,
      timestamp: new Date().toISOString(),
    });

    mockBackend.examHistory.unshift({
      id: `diag-hist-${Date.now()}`,
      exam_type: 'SAT',
      raw_score: correctCount,
      total_questions: total,
      accuracy_percentage: accuracy,
      scaled_score_low: 1460,
      scaled_score_high: 1520,
      time_taken_minutes: 30,
      submitted_at: new Date().toISOString(),
      topic_breakdown: {
        'Heart of Algebra': { correct: 3, total: 3, percentage: 100 },
        'Reading Comprehension': { correct: 3, total: 4, percentage: 75 },
        'Standard English Conventions': { correct: 1, total: 3, percentage: 33 },
      },
    });

    mockBackend.recalculateTotals();

    return NextResponse.json({
      diagnostic_id: id,
      raw_score: correctCount,
      total_questions: total,
      accuracy_percentage: accuracy,
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

