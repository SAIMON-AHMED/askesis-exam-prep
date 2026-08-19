import { useState, useCallback } from 'react';
import {
  generateQuestions,
  getPracticeQuota,
  GeneratedQuestion,
  QuestionGenerateRequest,
  PracticeQuota,
} from '@/lib/questionGeneration';

export interface UseQuestionGenerationOptions {
  onSuccess?: (questions: GeneratedQuestion[]) => void;
  onError?: (error: Error) => void;
}

export function useQuestionGeneration(options: UseQuestionGenerationOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<PracticeQuota | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);

  // Fetch user's practice quota
  const fetchQuota = useCallback(async () => {
    try {
      const data = await getPracticeQuota();
      setQuota(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch quota';
      setError(errorMsg);
    }
  }, []);

  // Generate questions
  const generate = useCallback(
    async (request: QuestionGenerateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        // Check quota first
        const quotaData = await getPracticeQuota();
        setQuota(quotaData);

        // Verify user has remaining questions
        if (!quotaData.is_premium && quotaData.remaining !== null && quotaData.remaining <= 0) {
          throw new Error('Daily free practice limit reached. Upgrade to Premium for unlimited practice.');
        }

        // Generate questions
        const questions = await generateQuestions(request);
        setGeneratedQuestions(questions);

        if (options.onSuccess) {
          options.onSuccess(questions);
        }

        return questions;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to generate questions';
        setError(errorMsg);

        if (options.onError) {
          options.onError(new Error(errorMsg));
        }

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return {
    isLoading,
    error,
    quota,
    generatedQuestions,
    generate,
    fetchQuota,
    clearError: () => setError(null),
  };
}
