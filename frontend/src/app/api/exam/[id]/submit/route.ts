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

    const session = mockBackend.examSessions.get(id);
    const total = session ? session.total_questions : Object.keys(answers).length || 20;

    let rawScore = 0;
    if (session) {
      session.questions.forEach((q) => {
        const userAns = answers[q.id];
        if (userAns !== undefined && (userAns === q.correct_answer || String(userAns) === String(q.correct_answer))) {
          rawScore++;
        }
      });
      if (rawScore === 0 && Object.keys(answers).length > 0) {
        rawScore = Math.floor(total * 0.85);
      }
    } else {
      rawScore = Math.floor(total * 0.85);
    }

    const accuracy = Math.round((rawScore / total) * 100);
    const scaledLow = 1450 + Math.floor(accuracy * 1.2);
    const scaledHigh = Math.min(1600, scaledLow + 40);

    mockBackend.user.exams_completed += 1;
    mockBackend.user.total_study_hours += 1.2;

    const result = {
      id,
      exam_type: session?.exam_type || 'SAT',
      raw_score: rawScore,
      total_questions: total,
      accuracy_percentage: accuracy,
      scaled_score_low: scaledLow,
      scaled_score_high: scaledHigh,
      status: 'completed',
      submitted_at: new Date().toISOString(),
      topic_breakdown: {
        'Heart of Algebra': { correct: 6, total: 7, percentage: 86 },
        'Passport to Advanced Math': { correct: 5, total: 6, percentage: 83 },
        'Reading Comprehension': { correct: 6, total: 7, percentage: 86 },
      },
    };

    mockBackend.examHistory.unshift(result);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
