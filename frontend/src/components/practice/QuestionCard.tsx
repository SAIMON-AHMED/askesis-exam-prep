'use client';

import React from 'react';
import { PracticeQuestion } from '@/lib/learningMaterialsData';

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
  examPrimaryColor
}) => {
  const handleOptionClick = (optionLabel: string) => {
    if (!isAnswered) {
      onAnswerSelect(optionLabel);
    }
  };

  const getOptionStyles = (optionLabel: string) => {
    const isCorrect = optionLabel === question.correctAnswer;
    const isSelected = optionLabel === selectedAnswer;

    if (!isAnswered) {
      return {
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        cursor: 'pointer'
      };
    }

    if (isSelected && isCorrect) {
      return {
        borderColor: '#10B981',
        backgroundColor: '#D1FAE5',
        cursor: 'default'
      };
    }

    if (isSelected && !isCorrect) {
      return {
        borderColor: '#EF4444',
        backgroundColor: '#FEE2E2',
        cursor: 'default'
      };
    }

    if (isCorrect) {
      return {
        borderColor: '#10B981',
        backgroundColor: '#F0FDF4',
        cursor: 'default'
      };
    }

    return {
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      cursor: 'default',
      opacity: 0.6
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

  return (
    <div style={{ width: '100%' }}>
      {/* Progress bar */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          Question {questionNumber} of {totalQuestions}
        </span>
        <div style={{
          flex: 1,
          height: '8px',
          backgroundColor: '#E5E7EB',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${(questionNumber / totalQuestions) * 100}%`,
            backgroundColor: examPrimaryColor,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '20px',
          lineHeight: '1.6'
        }}>
          {question.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleOptionClick(option.label)}
              style={{
                padding: '16px',
                border: `2px solid ${getOptionStyles(option.label).borderColor}`,
                backgroundColor: getOptionStyles(option.label).backgroundColor as string,
                borderRadius: '8px',
                cursor: getOptionStyles(option.label).cursor as any,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                fontSize: '16px',
                fontWeight: '500',
                color: '#1F2937',
                transition: 'all 0.2s ease',
                opacity: getOptionStyles(option.label).opacity || 1
              }}
              onMouseEnter={(e) => {
                if (!isAnswered) {
                  (e.target as any).style.borderColor = examPrimaryColor;
                  (e.target as any).style.backgroundColor = '#F3F4F6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnswered) {
                  (e.target as any).style.borderColor = '#E5E7EB';
                  (e.target as any).style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              <span style={{
                minWidth: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: examPrimaryColor,
                flexShrink: 0
              }}>
                {option.label})
              </span>
              <span style={{ flex: 1 }}>
                {option.text}
              </span>
              {getOptionIcon(option.label) && (
                <span style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: option.label === question.correctAnswer ? '#10B981' : '#EF4444',
                  marginLeft: '8px'
                }}>
                  {getOptionIcon(option.label)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback message */}
      {isAnswered && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: selectedAnswer === question.correctAnswer ? '#D1FAE5' : '#FEE2E2',
          border: `1px solid ${selectedAnswer === question.correctAnswer ? '#10B981' : '#EF4444'}`,
          color: selectedAnswer === question.correctAnswer ? '#065F46' : '#7F1D1D',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect. The correct answer is ' + question.correctAnswer + '.'}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
