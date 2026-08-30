'use client';

import React, { useState } from 'react';
import { PracticeQuestion } from '@/lib/learningMaterialsData';
import { ScratchpadDrawer } from './ScratchpadDrawer';

interface QuestionCardProps {
  question: PracticeQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (optionLabel: string) => void;
  selectedAnswer: string | null;
  isAnswered: boolean;
  examPrimaryColor: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  selectedAnswer,
  isAnswered,
  examPrimaryColor,
}) => {
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, boolean>>({});
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleOptionClick = (optionLabel: string) => {
    if (!isAnswered && !eliminatedOptions[optionLabel]) {
      onAnswerSelect(optionLabel);
    }
  };

  const toggleElimination = (e: React.MouseEvent, optionLabel: string) => {
    e.stopPropagation();
    if (isAnswered) return;
    setEliminatedOptions((prev) => ({
      ...prev,
      [optionLabel]: !prev[optionLabel],
    }));
    if (selectedAnswer === optionLabel) {
      onAnswerSelect('');
    }
  };

  const getOptionStyles = (optionLabel: string) => {
    const isCorrect = optionLabel === question.correctAnswer;
    const isSelected = optionLabel === selectedAnswer;
    const isEliminated = eliminatedOptions[optionLabel];

    if (!isAnswered) {
      if (isEliminated) {
        return {
          borderColor: '#E5E7EB',
          backgroundColor: '#F9FAFB',
          cursor: 'pointer',
          opacity: 0.45,
          textDecoration: 'line-through',
        };
      }
      return {
        borderColor: isSelected ? examPrimaryColor : '#E5E7EB',
        backgroundColor: isSelected ? '#F0F9FF' : '#FFFFFF',
        cursor: 'pointer',
        opacity: 1,
        textDecoration: 'none',
      };
    }

    if (isSelected && isCorrect) {
      return {
        borderColor: '#10B981',
        backgroundColor: '#D1FAE5',
        cursor: 'default',
        opacity: 1,
        textDecoration: 'none',
      };
    }

    if (isSelected && !isCorrect) {
      return {
        borderColor: '#EF4444',
        backgroundColor: '#FEE2E2',
        cursor: 'default',
        opacity: 1,
        textDecoration: 'none',
      };
    }

    if (isCorrect) {
      return {
        borderColor: '#10B981',
        backgroundColor: '#F0FDF4',
        cursor: 'default',
        opacity: 1,
        textDecoration: 'none',
      };
    }

    return {
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      cursor: 'default',
      opacity: 0.5,
      textDecoration: isEliminated ? 'line-through' : 'none',
    };
  };

  const getOptionIcon = (optionLabel: string) => {
    if (!isAnswered) return null;

    const isCorrect = optionLabel === question.correctAnswer;
    const isSelected = optionLabel === selectedAnswer;

    if (isSelected && isCorrect) {
      return '✓';
    }
    if (isSelected && !isCorrect) {
      return '✗';
    }
    if (isCorrect && selectedAnswer !== null) {
      return '✓';
    }
    return null;
  };

  const isIncorrect = isAnswered && selectedAnswer !== question.correctAnswer;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Scratchpad Drawer */}
      <ScratchpadDrawer
        isOpen={showScratchpad}
        onClose={() => setShowScratchpad(false)}
      />

      {/* Progress & Toolkit Bar */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              whiteSpace: 'nowrap',
            }}
          >
            Question {questionNumber} of {totalQuestions}
          </span>
          <div
            style={{
              flex: 1,
              height: '8px',
              backgroundColor: '#E5E7EB',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(questionNumber / totalQuestions) * 100}%`,
                backgroundColor: examPrimaryColor,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Test-Taking Tool Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsHighlighted(!isHighlighted)}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: isHighlighted ? '#fef08a' : '#ffffff',
              color: isHighlighted ? '#854d0e' : '#374151',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
            title="Highlight Question Text"
          >
            <span>🖍️</span>
            <span>{isHighlighted ? 'Highlighted' : 'Highlight'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowScratchpad(!showScratchpad)}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: showScratchpad ? '#eff6ff' : '#ffffff',
              color: showScratchpad ? '#1d4ed8' : '#374151',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
            title="Open Scratchpad"
          >
            <span>✏️</span>
            <span>Scratchpad</span>
          </button>
        </div>
      </div>

      {/* Question Stem */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '20px',
            lineHeight: '1.6',
            backgroundColor: isHighlighted ? '#fef9c3' : 'transparent',
            padding: isHighlighted ? '8px 12px' : '0',
            borderRadius: isHighlighted ? '6px' : '0',
            transition: 'background-color 0.2s ease',
          }}
        >
          {question.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((option) => {
            const styles = getOptionStyles(option.label);
            const isEliminated = eliminatedOptions[option.label];

            return (
              <div
                key={option.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleOptionClick(option.label)}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    border: `2px solid ${styles.borderColor}`,
                    backgroundColor: styles.backgroundColor as string,
                    borderRadius: '8px',
                    cursor: styles.cursor as any,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#1F2937',
                    transition: 'all 0.15s ease',
                    opacity: styles.opacity || 1,
                    textDecoration: styles.textDecoration,
                  }}
                >
                  <span
                    style={{
                      minWidth: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: isAnswered && option.label === question.correctAnswer ? '#10B981' : '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: isAnswered && option.label === question.correctAnswer ? '#FFFFFF' : examPrimaryColor,
                      flexShrink: 0,
                      fontSize: '14px',
                    }}
                  >
                    {option.label}
                  </span>
                  <span style={{ flex: 1 }}>{option.text}</span>
                  {getOptionIcon(option.label) && (
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: option.label === question.correctAnswer ? '#10B981' : '#EF4444',
                        marginLeft: '8px',
                      }}
                    >
                      {getOptionIcon(option.label)}
                    </span>
                  )}
                </button>

                {/* Eliminate Option Button (Active during pre-answer) */}
                {!isAnswered && (
                  <button
                    type="button"
                    onClick={(e) => toggleElimination(e, option.label)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: isEliminated ? '#FEE2E2' : '#FFFFFF',
                      color: isEliminated ? '#DC2626' : '#9CA3AF',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                    title={isEliminated ? 'Restore option' : 'Eliminate option (Cross out)'}
                  >
                    {isEliminated ? 'Undo' : '<s>✕</s>'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback & Error Remediation */}
      {isAnswered && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: selectedAnswer === question.correctAnswer ? '#D1FAE5' : '#FEE2E2',
              border: `1px solid ${selectedAnswer === question.correctAnswer ? '#10B981' : '#EF4444'}`,
              color: selectedAnswer === question.correctAnswer ? '#065F46' : '#7F1D1D',
            }}
          >
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>
              {selectedAnswer === question.correctAnswer
                ? '✓ Correct! Excellent work.'
                : `✗ Incorrect. The correct answer is Option ${question.correctAnswer}.`}
            </div>
            {question.explanation && (
              <div style={{ fontSize: '14px', lineHeight: '1.5', marginTop: '6px', opacity: 0.95 }}>
                {question.explanation}
              </div>
            )}
          </div>

          {/* AI Error Diagnosis Accordion for Incorrect Answers */}
          {isIncorrect && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fed7aa',
                borderRadius: '10px',
                padding: '14px 16px',
              }}
            >
              <div
                onClick={() => setShowDiagnosis(!showDiagnosis)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>💡</span>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: '#9a3412' }}>
                    Why did I miss this? (Error Breakdown)
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#ea580c', fontWeight: 600 }}>
                  {showDiagnosis ? 'Hide ▲' : 'Analyze ▼'}
                </span>
              </div>

              {showDiagnosis && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #fed7aa', fontSize: '13px', color: '#431407' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
                    Common error patterns in this question type:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li><strong>Concept Trap:</strong> Confusing the inverse operation or overlooking negative signs.</li>
                    <li><strong>Reading Distractor:</strong> Missing restrictive qualifiers (e.g. <em>&quot;must be true&quot;</em> vs <em>&quot;could be true&quot;</em>).</li>
                    <li><strong>Elimination Tip:</strong> Rule out outlier choices immediately before performing final algebra steps.</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
