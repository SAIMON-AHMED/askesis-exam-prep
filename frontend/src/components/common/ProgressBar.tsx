'use client';

import React from 'react';

interface ProgressBarProps {
  percent: number;
  height?: number;
  showLabel?: boolean;
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  height = 8,
  showLabel = false,
  color,
  className = '',
}) => {
  const displayPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className={`progress-container ${className}`}>
      <div
        className="progress-track"
        style={{
          width: '100%',
          height: `${height}px`,
          borderRadius: '999px',
          background: '#e5e7eb',
          overflow: 'hidden',
          marginBottom: showLabel ? '8px' : '0',
        }}
      >
        <div
          className="progress-fill"
          style={{
            height: '100%',
            width: `${displayPercent}%`,
            background: color || 'var(--current-exam-primary, var(--color-primary))',
            transition: 'width 300ms ease',
          }}
        />
      </div>
      {showLabel && (
        <span
          className="progress-text"
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: color || 'var(--current-exam-primary, var(--color-primary))',
          }}
        >
          {displayPercent}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
