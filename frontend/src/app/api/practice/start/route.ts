import { NextResponse } from 'next/server';
import { SAT_QUESTIONS } from '@/lib/practiceQuestionsData';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const topic = body.topic || 'vocabulary';
    const numQuestions = body.number_of_questions || 5;

    const topicData = SAT_QUESTIONS[topic] || Object.values(SAT_QUESTIONS)[0];
    const questions = (topicData?.questions || []).slice(0, numQuestions);

    return NextResponse.json({
      session_id: 'prac-' + Math.random().toString(36).substring(2, 9),
      topic,
      questions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
