'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExamDefinition } from '@/lib/examConstants';
import { countQuestionsByExamId } from '@/lib/practiceQuestionsData';
import { getCurriculumByExamId } from '@/lib/curriculumData';
import { MOCK_TESTS_PER_EXAM } from '@/lib/mockTestsData';

interface ExamSelectionCardProps {
  exam: ExamDefinition;
  progressPercent?: number;
  lastStudiedDaysAgo?: number;
  locked?: boolean;
  price?: number | null;
  buying?: boolean;
  onBuy?: (examId: string) => void;
}

export const ExamSelectionCard: React.FC<ExamSelectionCardProps> = ({
  exam,
  progressPercent = 0,
  lastStudiedDaysAgo,
  locked = false,
  price = null,
  buying = false,
  onBuy,
}) => {
  const router = useRouter();
  const totalQuestions = countQuestionsByExamId(exam.id);
  const curriculum = getCurriculumByExamId(exam.id);
  const estimatedHours = curriculum.sections.reduce(
    (sum, section) => sum + section.topics.reduce((a, t) => a + t.estimatedHours, 0),
    0
  );

  return (
    <div
      className="exam-card card"
      data-exam={exam.id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '320px',
      }}
    >
        {/* Exam Icon */}
        <div
          className="exam-card__icon"
          style={{
            fontSize: '48px',
            marginBottom: '16px',
            textAlign: 'left',
          }}
        >
          {exam.icon}
        </div>

      {/* Exam Name */}
      <h3
        className="exam-card__title"
        style={{
          color: `var(--exam-${exam.id}-primary)`,
          marginBottom: '8px',
          fontSize: '20px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {exam.displayName}
        {locked && <span aria-label="Locked" title="Purchase to unlock">🔒</span>}
      </h3>

        {/* Description */}
        <p
          className="exam-card__description"
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '12px',
            lineHeight: '1.4',
            flexGrow: 1,
          }}
        >
          {exam.description}
        </p>

        {/* Stats */}
        <div
          className="exam-card__stats"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '12px',
            color: '#9ca3af',
            marginBottom: '12px',
          }}
        >
        <span>📊 {totalQuestions.toLocaleString()} Practice Questions</span>
        <span>📝 {MOCK_TESTS_PER_EXAM} Mock Tests</span>
        <span>⏱️ {estimatedHours} Hours Estimated</span>
          {lastStudiedDaysAgo && (
            <span>📅 Last studied {lastStudiedDaysAgo} days ago</span>
          )}
        </div>

        {/* Progress Bar */}
        <div
          className="exam-card__progress"
          style={{
            marginBottom: '16px',
          }}
        >
          <div
            className="progress-track"
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '999px',
              background: '#e5e7eb',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
          >
            <div
              className="progress-fill"
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: `var(--exam-${exam.id}-primary)`,
                transition: 'width 300ms ease',
              }}
            />
          </div>
          <span
            className="progress-text"
            style={{
              fontSize: '12px',
              color: `var(--exam-${exam.id}-primary)`,
              fontWeight: '600',
            }}
          >
            {progressPercent}% Completed
          </span>
        </div>

      {/* Action Button */}
      {locked ? (
        <button
          className="btn-primary exam-card__button"
          style={{
            width: '100%',
            height: '44px',
            marginTop: 'auto',
          }}
          onClick={() => onBuy?.(exam.id)}
          disabled={buying}
        >
          {buying
            ? 'Processing...'
            : `Unlock ${exam.displayName}${price != null ? ` — $${price.toFixed(2)}` : ''}`}
        </button>
      ) : (
        <button
          className="btn-primary exam-card__button"
          style={{
            width: '100%',
            height: '44px',
            marginTop: 'auto',
          }}
          onClick={() => router.push(`/exams/${exam.id}`)}
        >
          Enter {exam.displayName} →
        </button>
      )}
    </div>
  );
};
