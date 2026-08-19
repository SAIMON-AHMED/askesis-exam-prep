'use client';

import React from 'react';
import { getDifficultyColor } from '@/lib/examConstants';

interface DifficultyBadgeProps {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  className = '',
}) => {
  const colors = getDifficultyColor(difficulty);

  return (
    <span
      className={`difficulty-badge ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
      }}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
