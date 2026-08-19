'use client';

import React from 'react';
import ProgressBar from '../common/ProgressBar';

interface SectionHeaderProps {
  icon: string;
  name: string;
  description: string;
  topicCount: number;
  progressPercent: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  name,
  description,
  topicCount,
  progressPercent,
}) => {
  const containerStyle: React.CSSProperties = {
    paddingTop: '32px',
    paddingBottom: '20px',
    borderBottom: '2px solid var(--current-exam-primary, #3A6EA5)',
    marginBottom: '20px',
  };

  const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '28px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0',
  };

  const statsStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '12px',
  };

  const progressContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const progressLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1F2937',
    minWidth: '40px',
  };

  const progressBarStyle: React.CSSProperties = {
    flex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <span style={iconStyle}>{icon}</span>
        <h2 style={titleStyle}>{name}</h2>
      </div>

      <div style={statsStyle}>
        {topicCount} topics • {progressPercent}% completed
      </div>

      <div style={progressContainerStyle}>
        <div style={progressBarStyle}>
          <ProgressBar percent={progressPercent} showLabel={false} />
        </div>
        <span style={progressLabelStyle}>{progressPercent}%</span>
      </div>
    </div>
  );
};

export default SectionHeader;
