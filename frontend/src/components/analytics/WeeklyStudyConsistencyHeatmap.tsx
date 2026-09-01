'use client';

import React, { useState } from 'react';
import {
  useWeeklyConsistency,
  HeatmapDay,
  ConsistencyWeek,
} from '@/hooks/useAnalytics';

interface WeeklyStudyConsistencyHeatmapProps {
  initialData?: any;
}

export const WeeklyStudyConsistencyHeatmap: React.FC<WeeklyStudyConsistencyHeatmapProps> = () => {
  const { data, loading, error, refetch } = useWeeklyConsistency();
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [viewMode, setViewMode] = useState<'multi_week' | 'current_week'>('multi_week');
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Intensity color palettes
  const getIntensityStyles = (intensity: number, isGoalMet: boolean) => {
    switch (intensity) {
      case 4: // 3h+ Peak
        return {
          backgroundColor: '#1d4ed8', // blue-700
          color: '#ffffff',
          border: '1px solid #1e40af',
          label: '3h+ Peak',
        };
      case 3: // 2-3h Target Met
        return {
          backgroundColor: '#3b82f6', // blue-500
          color: '#ffffff',
          border: '1px solid #2563eb',
          label: '2h - 3h (Goal Met)',
        };
      case 2: // 1-2h Steady
        return {
          backgroundColor: '#93c5fd', // blue-300
          color: '#1e3a8a',
          border: '1px solid #60a5fa',
          label: '1h - 2h Steady',
        };
      case 1: // <1h Light
        return {
          backgroundColor: '#dbeafe', // blue-100
          color: '#1e40af',
          border: '1px solid #bfdbfe',
          label: '< 1h Light',
        };
      case 0:
      default:
        return {
          backgroundColor: '#f8fafc', // slate-50
          color: '#94a3b8',
          border: '1px solid #e2e8f0',
          label: '0h Rest / Inactive',
        };
    }
  };

  const weeks: ConsistencyWeek[] = Array.isArray(data?.weeks) ? data.weeks : [];
  const currentWeekDays: HeatmapDay[] =
    Array.isArray(data?.current_week_days)
      ? data.current_week_days
      : (weeks.length > 0 && Array.isArray(weeks[weeks.length - 1].days)
        ? weeks[weeks.length - 1].days
        : []);

  // Default active day inspection to today or latest day
  const inspectedDay =
    selectedDay ||
    hoveredDay ||
    currentWeekDays[currentWeekDays.length - 1] ||
    null;

  return (
    <div
      className="card fade-in"
      style={{
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        padding: '24px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Weekly Study Consistency Heatmap"
    >
      {/* Top Accent Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b)',
        }}
      />

      {/* Header with Title & Streak Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '24px', lineHeight: 1 }}>🗓️</span>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              Weekly Study Consistency
            </h2>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
              }}
            >
              Heatmap
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>
            Color-coded daily activity density, goal milestones, and streak momentum.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('multi_week')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'multi_week' ? '#ffffff' : 'transparent',
                color: viewMode === 'multi_week' ? '#0f172a' : '#64748b',
                boxShadow: viewMode === 'multi_week' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              4-Week Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('current_week')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'current_week' ? '#ffffff' : 'transparent',
                color: viewMode === 'current_week' ? '#0f172a' : '#64748b',
                boxShadow: viewMode === 'current_week' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Current Week Focus
            </button>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            title="Refresh consistency data"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Motivational Streak & Consistency Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Streak Metric */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            🔥
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#92400e' }}>
              {data?.current_streak ?? 0} Days
            </div>
            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>
              Active Study Streak (Best: {data?.longest_streak ?? 0}d)
            </div>
          </div>
        </div>

        {/* Adherence Rate */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            🎯
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534' }}>
              {data?.weekly_adherence_rate ?? 0}%
            </div>
            <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
              Weekly Target Adherence
            </div>
          </div>
        </div>

        {/* Total Monthly Volume */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            ⏱️
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af' }}>
              {data?.total_study_hours_month ?? 0} hrs
            </div>
            <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>
              Past 28 Days Study Total
            </div>
          </div>
        </div>

        {/* Peak Activity Day */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#faf5ff',
            border: '1px solid #e9d5ff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#f3e8ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#6b21a8' }}>
              {data?.best_day_of_week || 'No study days yet'}
            </div>
            <div style={{ fontSize: '11px', color: '#7e22ce', fontWeight: 600 }}>
              Peak Performance Day
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Section */}
      {loading ? (
        <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
          Loading consistency heatmap data...
        </div>
      ) : error ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#ef4444' }}>
          {error}
        </div>
      ) : viewMode === 'multi_week' ? (
        /* Multi-Week Heatmap Table Grid */
        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
          <div style={{ minWidth: '600px' }}>
            {/* Days Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px repeat(7, 1fr)',
                gap: '8px',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textAlign: 'left', paddingLeft: '6px' }}>
                TIMELINE
              </div>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {weeks.map((week) => (
                <div
                  key={week.week_number}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px repeat(7, 1fr)',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  {/* Week Label */}
                  <div style={{ textAlign: 'left', paddingLeft: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                      {week.week_label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {week.total_hours}h • {week.completion_rate}% met
                    </div>
                  </div>

                  {/* 7 Day Tiles */}
                  {(Array.isArray(week.days) ? week.days : []).map((day) => {
                    const style = getIntensityStyles(day.intensity_level, day.is_goal_met);
                    const isSelected = selectedDay?.date === day.date;
                    const isHovered = hoveredDay?.date === day.date;

                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        style={{
                          height: '56px',
                          borderRadius: '10px',
                          backgroundColor: style.backgroundColor,
                          color: style.color,
                          border: isSelected
                            ? '2px solid #0f172a'
                            : day.is_today
                            ? '2px solid #2563eb'
                            : style.border,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.15s ease',
                          transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                          boxShadow:
                            isSelected || isHovered
                              ? '0 4px 10px rgba(0, 0, 0, 0.15)'
                              : '0 1px 2px rgba(0, 0, 0, 0.04)',
                          zIndex: isHovered || isSelected ? 2 : 1,
                        }}
                        title={`${day.day_full} (${day.date}): ${day.study_hours}h studied - ${day.is_goal_met ? 'Goal Met' : 'In Progress'}`}
                      >
                        {/* Star/Check indicator for goal met */}
                        {day.is_goal_met && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '4px',
                              fontSize: '10px',
                              lineHeight: 1,
                            }}
                          >
                            ✓
                          </span>
                        )}

                        {day.is_today && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '2px',
                              left: '4px',
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: '#2563eb',
                            }}
                          />
                        )}

                        <span style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1.1 }}>
                          {day.study_hours.toFixed(1)}h
                        </span>
                        <span style={{ fontSize: '10px', opacity: 0.85, fontWeight: 600 }}>
                          {day.questions_answered} Qs
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Single Week Large Tiles View */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          {currentWeekDays.map((day) => {
            const style = getIntensityStyles(day.intensity_level, day.is_goal_met);
            const isSelected = selectedDay?.date === day.date;
            const isHovered = hoveredDay?.date === day.date;

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDay(day)}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{
                  padding: '14px 10px',
                  borderRadius: '12px',
                  backgroundColor: style.backgroundColor,
                  color: style.color,
                  border: isSelected
                    ? '2px solid #0f172a'
                    : day.is_today
                    ? '2px solid #2563eb'
                    : style.border,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  transform: isHovered || isSelected ? 'scale(1.04)' : 'scale(1)',
                  boxShadow:
                    isSelected || isHovered
                      ? '0 4px 12px rgba(0, 0, 0, 0.12)'
                      : '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {day.day_name}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>
                  {day.study_hours.toFixed(1)}h
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  }}
                >
                  {day.is_goal_met ? '✓ Target Met' : `${day.questions_answered} Qs`}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Color Intensity Scale Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
            Study Density:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
              title="0 hrs (Rest / Inactive)"
            />
            <span style={{ fontSize: '11px', color: '#64748b' }}>0h</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                backgroundColor: '#dbeafe',
                border: '1px solid #bfdbfe',
              }}
              title="< 1 hr (Light Practice)"
            />
            <span style={{ fontSize: '11px', color: '#64748b' }}>&lt;1h</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                backgroundColor: '#93c5fd',
                border: '1px solid #60a5fa',
              }}
              title="1 - 2 hrs (Steady Habit)"
            />
            <span style={{ fontSize: '11px', color: '#64748b' }}>1-2h</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                backgroundColor: '#3b82f6',
                border: '1px solid #2563eb',
              }}
              title="2 - 3 hrs (Daily Goal Met)"
            />
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>2-3h (Target Met)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                backgroundColor: '#1d4ed8',
                border: '1px solid #1e40af',
              }}
              title="3+ hrs (Peak Overachiever)"
            />
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>3h+ (Peak)</span>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#64748b' }}>
          <span>💡 Click any tile to inspect drill notes & topics</span>
        </div>
      </div>

      {/* Selected / Hovered Day Inspector Card */}
      {inspectedDay && (
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: inspectedDay.is_goal_met ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${inspectedDay.is_goal_met ? '#86efac' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: inspectedDay.is_goal_met ? '#dcfce7' : '#eff6ff',
                color: inspectedDay.is_goal_met ? '#16a34a' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              {inspectedDay.is_goal_met ? '🏆' : '📖'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                  {inspectedDay.day_full} ({inspectedDay.date})
                </span>
                {inspectedDay.is_goal_met ? (
                  <span
                    style={{
                      padding: '1px 8px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                    }}
                  >
                    ✓ Goal Met ({Math.round((inspectedDay.study_hours / inspectedDay.daily_goal_hours) * 100)}%)
                  </span>
                ) : (
                  <span
                    style={{
                      padding: '1px 8px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                    }}
                  >
                    In Progress
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#475569' }}>
                {inspectedDay.notes || 'Focused practice drill'} •{' '}
                <strong>{inspectedDay.questions_answered} questions completed</strong> across{' '}
                {inspectedDay.topics.join(', ')}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              {inspectedDay.study_hours.toFixed(1)} hrs
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Target: {inspectedDay.daily_goal_hours}h / day
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
