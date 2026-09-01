'use client';

import React from 'react';
import { triggerCelebrationConfetti } from '@/lib/confetti';

interface CelebrationBadgesProps {
  todayHours: number;
  goalHours: number;
  streakDays?: number;
  onTriggerConfetti?: () => void;
}

export const CelebrationBadges: React.FC<CelebrationBadgesProps> = ({
  todayHours,
  goalHours,
  streakDays = 0,
  onTriggerConfetti,
}) => {
  const isGoalMet = todayHours >= goalHours;
  const surplusHours = Math.max(0, Number((todayHours - goalHours).toFixed(1)));

  const handleCelebrateClick = () => {
    triggerCelebrationConfetti();
    if (onTriggerConfetti) onTriggerConfetti();
  };

  const badges = [
    {
      id: 'daily_champion',
      icon: '🏆',
      title: 'Daily Goal Champion',
      subtitle: `${todayHours.toFixed(1)}h / ${goalHours.toFixed(1)}h Completed`,
      unlocked: isGoalMet,
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      borderColor: '#a7f3d0',
      badgeTag: isGoalMet ? 'UNLOCKED' : 'IN PROGRESS',
    },
    {
      id: 'streak_master',
      icon: '🔥',
      title: streakDays > 0 ? `${streakDays}-Day Study Streak` : 'Daily Habit Builder',
      subtitle: streakDays > 0 ? 'Daily habit consistency maintained' : 'Study consecutive days to build a streak',
      unlocked: streakDays > 0,
      color: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      borderColor: '#fde68a',
      badgeTag: streakDays > 0 ? 'ACTIVE' : '0 DAYS',
    },
    {
      id: 'focus_titan',
      icon: surplusHours > 0 ? '⚡' : '🎯',
      title: surplusHours > 0 ? `+${surplusHours}h Overachiever` : 'Target Bullseye',
      subtitle: surplusHours > 0 ? 'Pushed past your daily minimum target' : 'Hit exact daily study benchmark',
      unlocked: isGoalMet,
      color: '#3b82f6',
      bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      borderColor: '#bfdbfe',
      badgeTag: isGoalMet ? 'EARNED' : 'IN PROGRESS',
    },
    {
      id: 'retention_master',
      icon: '🧠',
      title: 'Spaced Memory Boost',
      subtitle: 'Optimal neuro-retention window hit',
      unlocked: isGoalMet,
      color: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
      borderColor: '#ddd6fe',
      badgeTag: isGoalMet ? 'BOOSTED' : 'PENDING',
    },
  ];

  if (!isGoalMet) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '20px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #eff6ff 100%)',
        border: '1.5px solid #86efac',
        boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 0.4s ease-out',
      }}
      aria-label="Daily Study Goal Celebration & Badges"
    >
      {/* Top Banner with Confetti Re-trigger */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>🎉</span>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 800,
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Goal Complete! Celebration Badges Unlocked
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#047857' }}>
              Incredible work today! You crushed your target of {goalHours} hours of dedicated practice.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCelebrateClick}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '9999px',
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>🎊</span>
          <span>Celebrate Again!</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
        }}
      >
        {badges.map((badge) => (
          <div
            key={badge.id}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: badge.bgGradient,
              border: `1px solid ${badge.borderColor}`,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.03)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                }}
              >
                {badge.icon}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: badge.color,
                  border: `1px solid ${badge.borderColor}`,
                }}
              >
                {badge.badgeTag}
              </span>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                {badge.title}
              </div>
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.3 }}>
                {badge.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
