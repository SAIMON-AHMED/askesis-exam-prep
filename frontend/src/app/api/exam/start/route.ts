import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';
import { SAT_QUESTIONS } from '@/lib/practiceQuestionsData';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const examType = (body.exam_type || 'SAT').toUpperCase();
    const durationMinutes = body.duration_minutes || 65;
    const numQuestions = body.number_of_questions || 20;

    const questions: any[] = [];
    const topics = Object.values(SAT_QUESTIONS);
    
    for (const t of topics) {
      for (const q of t.questions) {
        if (questions.length < numQuestions) {
          questions.push({
            id: q.id,
            question_text: q.question,
            options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            correct_answer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
            explanation: q.explanation || 'Correct step-by-step reasoning.',
            topic: t.topicName,
            difficulty: q.difficulty,
          });
        }
      }
    }

    const sessionId = 'exam-' + Math.random().toString(36).substring(2, 9);
    const session = {
      id: sessionId,
      exam_type: examType,
      duration_seconds: durationMinutes * 60,
      status: 'in_progress' as const,
      total_questions: questions.length,
      started_at: new Date().toISOString(),
      questions,
    };

    mockBackend.examSessions.set(sessionId, session);

    return NextResponse.json({
      id: sessionId,
      exam_type: examType,
      duration_seconds: session.duration_seconds,
      status: session.status,
      total_questions: session.total_questions,
      started_at: session.started_at,
      questions: session.questions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        options: q.options,
        topic: q.topic,
        difficulty: q.difficulty,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
