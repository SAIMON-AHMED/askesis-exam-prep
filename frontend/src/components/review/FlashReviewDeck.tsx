'use client';

import React, { useState, useEffect } from 'react';

export interface ReviewItem {
  id: string;
  question_key: string;
  exam_type: string;
  topic: string;
  due_at: string;
  interval_days: number;
  repetitions: number;
  last_is_correct: boolean | null;
  question_text: string | null;
  options: Record<string, string> | null;
  correct_answer: string | null;
  explanation: string | null;
}

interface FlashReviewDeckProps {
  items: ReviewItem[];
  onRate: (itemId: string, rating: 'again' | 'hard' | 'good' | 'easy') => Promise<void>;
  onFinish: () => void;
}

export const FlashReviewDeck: React.FC<FlashReviewDeckProps> = ({ items, onRate, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [mode, setMode] = useState<'flashcard' | 'quiz'>('flashcard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const currentItem = items[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
    setSelectedQuizOption(null);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting || !currentItem) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') void handleRating('again');
        if (e.key === '2') void handleRating('hard');
        if (e.key === '3') void handleRating('good');
        if (e.key === '4') void handleRating('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, isSubmitting, currentItem]);

  const handleRating = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentItem || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onRate(currentItem.id, rating);
      setCompletedCount((prev) => prev + 1);
      if (currentIndex + 1 < items.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onFinish();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentItem || items.length === 0) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          All reviews complete!
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          You reviewed {completedCount} question{completedCount === 1 ? '' : 's'} in this session.
          Your spaced repetition retention intervals have been updated.
        </p>
        <button className="btn-primary" onClick={onFinish} style={{ padding: '10px 24px' }}>
          Back to Review Queue
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / items.length) * 100);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Header controls & Progress */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 600 }}>
            {currentItem.exam_type?.toUpperCase() || 'EXAM'}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            {currentItem.topic}
          </span>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#e5e7eb', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setMode('flashcard')}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: mode === 'flashcard' ? '#ffffff' : 'transparent',
              color: mode === 'flashcard' ? '#111827' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            📇 Flashcard Mode
          </button>
          <button
            type="button"
            onClick={() => setMode('quiz')}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: mode === 'quiz' ? '#ffffff' : 'transparent',
              color: mode === 'quiz' ? '#111827' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            🎯 Quiz Mode
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
          <span>Card {currentIndex + 1} of {items.length}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: '#3b82f6', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div
        className="card"
        style={{
          padding: '28px',
          borderRadius: '16px',
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Card Front / Question */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {isFlipped ? 'Answer & Explanation' : 'Question Prompt'}
            </span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              Repetitions: {currentItem.repetitions} · Interval: {currentItem.interval_days}d
            </span>
          </div>

          <p
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: '1.6',
              marginBottom: '20px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {currentItem.question_text || 'Review Item'}
          </p>

          {/* Options Display */}
          {currentItem.options && (
            <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
              {Object.entries(currentItem.options).map(([key, val]) => {
                const isSelected = selectedQuizOption === key;
                const isCorrect = key === currentItem.correct_answer;
                let bg = '#f9fafb';
                let border = '#e5e7eb';
                let textCol = '#1f2937';

                if (mode === 'quiz' && isSelected) {
                  bg = isCorrect ? '#d1fae5' : '#fee2e2';
                  border = isCorrect ? '#10b981' : '#ef4444';
                  textCol = isCorrect ? '#065f46' : '#991b1b';
                } else if (isFlipped && isCorrect) {
                  bg = '#d1fae5';
                  border = '#10b981';
                  textCol = '#065f46';
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (!selectedQuizOption) {
                        setSelectedQuizOption(key);
                        setIsFlipped(true);
                      }
                    }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      backgroundColor: bg,
                      color: textCol,
                      fontSize: '15px',
                      cursor: !selectedQuizOption ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <strong style={{ minWidth: '24px' }}>{key}.</strong>
                    <span style={{ flex: 1 }}>{val}</span>
                    {isFlipped && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Correct</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Flipped Content / Explanation */}
          {isFlipped && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              {currentItem.correct_answer && (
                <div style={{ fontWeight: 700, color: '#0f766e', marginBottom: '6px', fontSize: '15px' }}>
                  Correct Answer: Option {currentItem.correct_answer}
                </div>
              )}
              {currentItem.explanation && (
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
                  <strong>Explanation:</strong> {currentItem.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div style={{ marginTop: '24px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
          {!isFlipped ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                Tip: Press <kbd style={{ padding: '2px 6px', background: '#f3f4f6', borderRadius: '4px', border: '1px solid #d1d5db' }}>Space</kbd> to reveal answer
              </span>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsFlipped(true)}
                style={{ padding: '10px 20px', fontWeight: 600 }}
              >
                Reveal Answer 🔄
              </button>
            </div>
          ) : (
            <div>
              <p style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '12px' }}>
                How well did you recall this concept? (Select Interval):
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => void handleRating('again')}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: '1px solid #fca5a5',
                    backgroundColor: '#fef2f2',
                    color: '#991b1b',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>1. Again</span>
                  <span style={{ fontSize: '11px', opacity: 0.75 }}>&lt; 10 mins</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleRating('hard')}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: '1px solid #fed7aa',
                    backgroundColor: '#fff7ed',
                    color: '#9a3412',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>2. Hard</span>
                  <span style={{ fontSize: '11px', opacity: 0.75 }}>1 day</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleRating('good')}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: '1px solid #93c5fd',
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>3. Good</span>
                  <span style={{ fontSize: '11px', opacity: 0.75 }}>3 days</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleRating('easy')}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: '1px solid #86efac',
                    backgroundColor: '#f0fdf4',
                    color: '#166534',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>4. Easy</span>
                  <span style={{ fontSize: '11px', opacity: 0.75 }}>7+ days</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
