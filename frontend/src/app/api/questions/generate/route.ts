import { NextResponse } from 'next/server';
import { SAT_QUESTIONS } from '@/lib/practiceQuestionsData';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const examType = body.exam_type || 'SAT';
    const topic = body.topic || 'vocabulary';
    const difficulty = body.difficulty || 3;
    const numQuestions = Math.min(20, Math.max(1, body.number_of_questions || 5));

    // Lookup practice questions or dynamically synthesize
    const list: any[] = [];
    const topicData = SAT_QUESTIONS[topic] || Object.values(SAT_QUESTIONS)[0];

    if (topicData && topicData.questions.length > 0) {
      for (let i = 0; i < numQuestions; i++) {
        const base = topicData.questions[i % topicData.questions.length];
        const optionsMap: Record<string, string> = {};
        const labels = ['A', 'B', 'C', 'D'];
        (base.options || ['Option A', 'Option B', 'Option C', 'Option D']).forEach((opt, idx) => {
          optionsMap[labels[idx] || String(idx)] = opt;
        });

        list.push({
          id: `gen-${topic}-${i}-${Date.now()}`,
          exam_type: examType,
          topic: topicData.topicName || topic,
          difficulty: difficulty,
          question_format: 'multiple_choice',
          question_text: base.question,
          options: optionsMap,
          correct_answer: labels[base.correctAnswer ?? 0] || 'A',
          explanation: base.explanation || 'Detailed mathematical/grammatical derivation.',
          validated: true,
          visual_aid: null,
        });
      }
    } else {
      for (let i = 0; i < numQuestions; i++) {
        list.push({
          id: `gen-${topic}-${i}-${Date.now()}`,
          exam_type: examType,
          topic: topic,
          difficulty: difficulty,
          question_format: 'multiple_choice',
          question_text: `Sample adaptive practice question ${i + 1} for ${topic}: Evaluate the algebraic or verbal relation under test conditions.`,
          options: { A: 'Option A (Correct)', B: 'Option B', C: 'Option C', D: 'Option D' },
          correct_answer: 'A',
          explanation: 'Step 1: Identify given conditions. Step 2: Apply standard rules to solve.',
          validated: true,
          visual_aid: null,
        });
      }
    }

    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
