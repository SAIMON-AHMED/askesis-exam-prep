'use client';

import React, { useState } from 'react';
import { WorkedExample as WorkedExampleType } from '@/lib/learningMaterialsData';

interface WorkedExampleProps {
  example: WorkedExampleType;
  examId: string;
}

export const WorkedExample: React.FC<WorkedExampleProps> = ({ example, examId }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  };

  const questionStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '16px',
    lineHeight: '1.6',
  };

  const optionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  };

  const getOptionStyle = (label: string): React.CSSProperties => {
    const isSelected = selectedAnswer === label;
    const isCorrect = label === example.correctAnswer;
    const isWrongSelected = isSelected && !isCorrect;

    let borderColor = '#E5E7EB';
    let backgroundColor = '#F9FAFB';
    let cursor = 'pointer';

    if (selectedAnswer) {
      if (isCorrect) {
        borderColor = '#10B981';
        backgroundColor = '#D1FAE5';
      } else if (isWrongSelected) {
        borderColor = '#EF4444';
        backgroundColor = '#FEE2E2';
      }
    } else if (isSelected) {
      borderColor = 'var(--current-exam-primary, #3A6EA5)';
      backgroundColor = 'var(--current-exam-light, #EFF6FF)';
    }

    return {
      padding: '12px 16px',
      border: `2px solid ${borderColor}`,
      borderRadius: '8px',
      backgroundColor,
      cursor,
      transition: 'all 200ms ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    };
  };

  const optionLabelStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#1F2937',
    minWidth: '24px',
  };

  const optionTextStyle: React.CSSProperties = {
    color: '#374151',
    fontSize: '14px',
  };

  const submitButtonStyle: React.CSSProperties = {
    backgroundColor: 'var(--current-exam-primary, #3A6EA5)',
    color: '#FFFFFF',
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 200ms ease',
    marginBottom: '16px',
  };

  const explanationContainerStyle: React.CSSProperties = {
    backgroundColor: '#F0FDF4',
    border: '1px solid #86EFAC',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
  };

  const explanationTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#15803D',
    marginBottom: '8px',
  };

  const explanationTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#166534',
    lineHeight: '1.6',
  };

  const correctAnswerHighlightStyle: React.CSSProperties = {
    backgroundColor: '#D1FAE5',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px',
  };

  const handleSelectAnswer = (label: string) => {
    if (!selectedAnswer) {
      setSelectedAnswer(label);
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div style={containerStyle}>
      <div style={questionStyle}>✓ Worked Example</div>
      <div style={questionStyle}>{example.question}</div>

      <div style={optionsContainerStyle}>
        {example.options.map((option) => (
          <div
            key={option.label}
            style={getOptionStyle(option.label)}
            onClick={() => handleSelectAnswer(option.label)}
          >
            <span style={optionLabelStyle}>{option.label})</span>
            <span style={optionTextStyle}>{option.text}</span>
            {selectedAnswer && option.isCorrect && (
              <span style={{ marginLeft: 'auto', fontSize: '18px' }}>✓</span>
            )}
            {selectedAnswer && option.label === selectedAnswer && !option.isCorrect && (
              <span style={{ marginLeft: 'auto', fontSize: '18px' }}>✗</span>
            )}
          </div>
        ))}
      </div>

      {selectedAnswer ? (
        <>
          <button
            style={{
              ...submitButtonStyle,
              backgroundColor: '#10B981',
            }}
            onClick={handleShowExplanation}
          >
            {showExplanation ? '✓ See Explanation' : 'Show Explanation'}
          </button>
          <button
            style={{
              ...submitButtonStyle,
              backgroundColor: '#6B7280',
              marginLeft: '8px',
            }}
            onClick={handleReset}
          >
            Try Again
          </button>

          {showExplanation && (
            <div style={explanationContainerStyle}>
              <div style={explanationTitleStyle}>
                Correct Answer: <span style={correctAnswerHighlightStyle}>{example.correctAnswer}) {example.options.find(o => o.label === example.correctAnswer)?.text}</span>
              </div>
              <div style={explanationTextStyle}>{example.explanation}</div>
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          Click an option to select your answer
        </div>
      )}
    </div>
  );
};

export default WorkedExample;
