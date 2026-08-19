'use client';

import React from 'react';
import Link from 'next/link';
import ProgressBar from '@/components/common/ProgressBar';
import DifficultyBadge from '@/components/common/DifficultyBadge';

interface TopicHeaderProps {
  topicName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progressPercent: number;
  examId: string;
  topicId: string;
  questionCount?: number;
}

export const TopicHeader: React.FC<TopicHeaderProps> = ({
  topicName,
  difficulty,
  progressPercent,
  examId,
  topicId,
  questionCount = 45
}) => {
  const containerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, var(--current-exam-primary, #3A6EA5) 0%, var(--current-exam-accent, #5A7EBF) 100%)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
    color: '#FFFFFF',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    color: '#FFFFFF',
  };

  const badgeContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    fontSize: '14px',
  };

  const progressContainerStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const progressLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    marginBottom: '8px',
    opacity: 0.95,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    color: 'var(--current-exam-primary, #3A6EA5)',
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '2px solid #FFFFFF',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{topicName}</h1>

      <div style={badgeContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DifficultyBadge difficulty={difficulty} />
          <span style={{ opacity: 0.9 }}>•</span>
          <span style={{ opacity: 0.9 }}>{progressPercent}% Complete</span>
        </div>
      </div>

      <div style={progressContainerStyle}>
        <div style={progressLabelStyle}>Topic Progress</div>
        <ProgressBar percent={progressPercent} height={12} showLabel={true} color="#FFFFFF" />
      </div>

      <div style={buttonContainerStyle}>
        <Link href={`/exams/${examId}/topic/${topicId}/practice`} style={primaryButtonStyle}>
          <span>▶️</span>
          Start Practice
        </Link>
        <button style={secondaryButtonStyle}>
          <span>⏭️</span>
          Skip to Practice
        </button>
      </div>
    </div>
  );
};

export default TopicHeader;
