import { api } from './api';

export type QuestionFormat = 'multiple_choice' | 'numeric';

export interface GeneratedQuestion {
  id: string;
  exam_type: string;
  topic: string;
  difficulty: number;
  question_format: QuestionFormat;
  question_text: string;
  options: Record<string, string> | null;
  correct_answer: string;
  explanation: string;
  validated: boolean;
  visual_aid: Record<string, any> | null;
}

export interface QuestionGenerateRequest {
  exam_type: string;
  topic: string;
  difficulty: number; // 1-5
  question_format: QuestionFormat;
  number_of_questions: number; // 1-20
}

export interface PracticeQuota {
  is_premium: boolean;
  questions_today: number;
  daily_limit: number | null;
  remaining: number | null;
}

/**
 * Generate AI-powered practice questions
 */
export async function generateQuestions(
  request: QuestionGenerateRequest
): Promise<GeneratedQuestion[]> {
  try {
    const response = await api.post<GeneratedQuestion[]>(
      '/questions/generate',
      request
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('Daily free practice limit reached. Upgrade to Premium for unlimited practice.');
    }
    if (error.response?.status === 422) {
      throw new Error(`Generation failed: ${error.response.data.detail}`);
    }
    if (error.response?.status === 502) {
      throw new Error('Question generation service unavailable. Please try again later.');
    }
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

/**
 * Get user's practice quota (free tier daily limit)
 */
export async function getPracticeQuota(): Promise<PracticeQuota> {
  try {
    const response = await api.get<PracticeQuota>('/questions/quota');
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch practice quota: ${error.message}`);
  }
}

/**
 * Submit an answer to a generated question
 */
export async function submitAnswer(
  questionId: string,
  submittedAnswer: string,
  timeTakenSeconds: number,
  difficulty: number,
  topic: string
): Promise<{
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  next_recommended_difficulty: number;
}> {
  try {
    const response = await api.post('/practice/submit', {
      generated_question_id: questionId,
      submitted_answer: submittedAnswer,
      time_taken_seconds: timeTakenSeconds,
      difficulty,
      topic,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to submit answer: ${error.message}`);
  }
}
