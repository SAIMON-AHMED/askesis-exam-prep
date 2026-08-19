'use client';

import { useState } from 'react';
import { useQuestionGeneration } from '@/hooks/useQuestionGeneration';
import { GeneratedQuestion, QuestionFormat } from '@/lib/questionGeneration';

interface GenerateQuestionsDialogProps {
  examId: string;
  topicId: string;
  topicName: string;
  isOpen: boolean;
  onClose: () => void;
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
}

export function GenerateQuestionsDialog({
  examId,
  topicId,
  topicName,
  isOpen,
  onClose,
  onQuestionsGenerated,
}: GenerateQuestionsDialogProps) {
  const [difficulty, setDifficulty] = useState(2);
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('multiple_choice');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading, error, quota, generate, clearError } = useQuestionGeneration({
    onSuccess: (questions) => {
      onQuestionsGenerated(questions);
      handleClose();
    },
  });

  const handleClose = () => {
    clearError();
    setDifficulty(2);
    setNumQuestions(5);
    setQuestionFormat('multiple_choice');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await generate({
        exam_type: examId.toUpperCase(),
        topic: topicId,
        difficulty,
        question_format: questionFormat,
        number_of_questions: numQuestions,
      });
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Generate Practice Questions</h2>

        {/* Quota Info */}
        {quota && !quota.is_premium && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900">
              <strong>Daily Limit:</strong> {quota.questions_today}/{quota.daily_limit} questions used
            </p>
            <p className="text-sm text-blue-900">
              <strong>Remaining today:</strong> {quota.remaining} questions
            </p>
          </div>
        )}
        {quota?.is_premium && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-900">✨ Premium: Unlimited questions</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <div className="p-2 bg-gray-50 rounded text-gray-700 text-sm">{topicName}</div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`px-3 py-2 rounded font-medium text-sm transition-colors ${
                    difficulty === level
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {difficulty === 1 && 'Beginner - Foundational concepts'}
              {difficulty === 2 && 'Intermediate - Core skills'}
              {difficulty === 3 && 'Advanced - Complex applications'}
              {difficulty === 4 && 'Expert - Challenging problems'}
              {difficulty === 5 && 'Master - Most difficult problems'}
            </p>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions ({numQuestions})
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {/* Question Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Format</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="multiple_choice"
                  checked={questionFormat === 'multiple_choice'}
                  onChange={(e) => setQuestionFormat(e.target.value as QuestionFormat)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Multiple Choice (A-D)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="numeric"
                  checked={questionFormat === 'numeric'}
                  onChange={(e) => setQuestionFormat(e.target.value as QuestionFormat)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Numeric Answer</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!!quota && !quota.is_premium && quota.remaining! <= 0)}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Generating...
                </span>
              ) : (
                '✨ Generate Questions'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
