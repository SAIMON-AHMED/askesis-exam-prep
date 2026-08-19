'use client';

import React from 'react';
import Link from 'next/link';
import { Topic } from '@/lib/curriculumData';
import { getDifficultyColor } from '@/lib/examConstants';
import DifficultyBadge from '@/components/common/DifficultyBadge';
import ProgressBar from '@/components/common/ProgressBar';

interface TopicCardProps {
  examId: string;
  topic: Topic;
}

export const TopicCard: React.FC<TopicCardProps> = ({ examId, topic }) => {
  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    minHeight: '280px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    transition: 'all 300ms ease',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative' as const,
  };

  const hoverStyles = {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 0 0',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '24px',
    opacity: 0.8,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '12px',
    lineHeight: '1.4',
    flexGrow: 1,
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '12px',
  };

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: 'auto',
    padding: '10px 12px',
    backgroundColor: 'var(--current-exam-primary, #3A6EA5)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 200ms ease',
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles,
        ...(isHovered ? hoverStyles : {}),
      }}
    >
      <Link href={`/exams/${examId}/topic/${topic.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <div style={headerStyle}>
          <h3 style={titleStyle}>{topic.name}</h3>
          <span style={iconStyle}>{topic.icon}</span>
        </div>

        <p style={descriptionStyle}>{topic.description}</p>

        <div style={{ marginBottom: '12px' }}>
          <DifficultyBadge difficulty={topic.difficulty} />
        </div>

        <div style={statsStyle}>
          <div style={statItemStyle}>
            <span>📊</span>
            <span>{topic.questionCount} questions</span>
          </div>
          <div style={statItemStyle}>
            <span>⏱️</span>
            <span>{topic.estimatedHours} hrs</span>
          </div>
        </div>

        <ProgressBar percent={topic.progressPercent} showLabel={true} />
      </Link>
    </div>
  );
};

export default TopicCard;
