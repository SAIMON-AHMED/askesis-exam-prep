import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';
import { SAT_QUESTIONS } from '@/lib/practiceQuestionsData';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const examType = body.exam_type || 'SAT';
    const numQuestions = body.number_of_questions || 10;

    // Collect questions from practice question bank
    const questions: any[] = [];
    const topics = Object.values(SAT_QUESTIONS);
    
    for (const t of topics) {
      for (const q of t.questions) {
        if (questions.length < numQuestions) {
          questions.push({
            id: q.id,
            question_text: q.question,
            options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            topic: t.topicName,
            difficulty: q.difficulty,
          });
        }
      }
    }

    const sessionId = 'diag-' + Math.random().toString(36).substring(2, 9);
    mockBackend.diagnosticSessions.set(sessionId, {
      id: sessionId,
      exam_type: examType,
      questions,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      id: sessionId,
      exam_type: examType,
      questions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
