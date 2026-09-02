'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MicroQuizItem, MicroQuizResult } from '@/types/curriculum';

const MarkdownMessage = dynamic(() => import('@/components/common/MarkdownMessage'), {
  ssr: false,
  loading: () => null,
});

interface LessonMicroQuizProps {
  quiz: MicroQuizItem;
  onResult: (result: MicroQuizResult) => void;
  onAskTutor: () => void;
}

export const LessonMicroQuiz: React.FC<LessonMicroQuizProps> = ({ quiz, onResult, onAskTutor }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected !== null && selected === quiz.correctIndex;

  const handleSelect = (index: number) => {
    if (revealed && isCorrect) return; // already solved, lock in
    setSelected(index);
    setRevealed(true);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    onResult({
      stepNumber: 0, // overwritten by caller with the actual step number
      correct: index === quiz.correctIndex,
      attempts: nextAttempts,
      hintsUsed,
    });
  };

  const handleAskTutor = () => {
    setHintsUsed((h) => h + 1);
    onAskTutor();
  };

  return (
    <div
      style={{
        marginTop: '16px',
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
      }}
    >
      <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '10px' }}>
        Check your understanding
      </p>
      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
        <MarkdownMessage content={quiz.question} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {quiz.options.map((option, index) => {
          const isSelected = selected === index;
          const showCorrect = revealed && index === quiz.correctIndex;
          const showWrong = revealed && isSelected && index !== quiz.correctIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              disabled={revealed && isCorrect}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                border: `1.5px solid ${showCorrect ? '#16a34a' : showWrong ? '#dc2626' : '#d1d5db'}`,
                backgroundColor: showCorrect ? '#f0fdf4' : showWrong ? '#fef2f2' : '#ffffff',
                cursor: revealed && isCorrect ? 'default' : 'pointer',
                fontSize: '13px',
              }}
            >
              <MarkdownMessage content={option} />
            </button>
          );
        })}
      </div>

      {revealed && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: isCorrect ? '#f0fdf4' : '#fffbeb',
            border: `1px solid ${isCorrect ? '#bbf7d0' : '#fde68a'}`,
          }}
        >
          <p style={{ margin: '0 0 6px 0', fontWeight: 600, fontSize: '13px', color: isCorrect ? '#166534' : '#92400e' }}>
            {isCorrect ? '✓ Correct' : '✗ Not quite'}
          </p>
          <div style={{ fontSize: '13px', color: '#374151' }}>
            <MarkdownMessage content={quiz.explanation} />
          </div>
          {!isCorrect && (
            <button
              type="button"
              onClick={handleAskTutor}
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid #93c5fd',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                cursor: 'pointer',
              }}
            >
              🧑‍🏫 Explain this differently
            </button>
          )}
        </div>
      )}
    </div>
  );
};
