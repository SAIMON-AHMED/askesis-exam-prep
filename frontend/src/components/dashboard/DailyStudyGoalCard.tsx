'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { LogStudyTimeModal } from './LogStudyTimeModal';
import { CelebrationBadges } from './CelebrationBadges';
import { useNotification } from '@/context/NotificationContext';
import { triggerCelebrationConfetti, triggerMiniConfetti } from '@/lib/confetti';

export interface StudyLogItem {
  id: string;
  duration_minutes: number;
  topic: string;
  exam_type: string;
  activity_type?: string;
  notes?: string;
  timestamp: string;
}

export interface DailyGoalData {
  today_study_hours: number;
  daily_study_goal_hours: number;
  weekly_target_hours?: number;
  progress_percentage: number;
  is_goal_reached: boolean;
  remaining_hours: number;
  daily_goal_reminder_enabled?: boolean;
  daily_goal_reminder_time?: string;
  logs?: StudyLogItem[];
  current_streak?: number;
}

export const DailyStudyGoalCard: React.FC = () => {
  const { success, error: notifyError, info } = useNotification();
  const [data, setData] = useState<DailyGoalData>({
    today_study_hours: 0,
    daily_study_goal_hours: 2.0,
    progress_percentage: 0,
    is_goal_reached: false,
    remaining_hours: 2.0,
    daily_goal_reminder_enabled: true,
    daily_goal_reminder_time: '20:00',
    current_streak: 0,
    logs: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [isQuickLogging, setIsQuickLogging] = useState<boolean>(false);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [isUpdatingReminder, setIsUpdatingReminder] = useState<boolean>(false);
  const hasCelebratedRef = useRef<boolean>(false);

  const fetchTodayGoal = useCallback(async () => {
    try {
      const response = await api.get('/study-time/today');
      if (response.data) {
        setData(response.data);
        if (typeof response.data.daily_goal_reminder_enabled === 'boolean') {
          setReminderEnabled(response.data.daily_goal_reminder_enabled);
        }
        if (response.data.is_goal_reached && !hasCelebratedRef.current) {
          hasCelebratedRef.current = true;
          // Trigger celebration confetti once if goal is already completed
          setTimeout(() => {
            triggerCelebrationConfetti();
          }, 300);
        }
      }
    } catch {
      notifyError('Unable to load your study goal. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayGoal();
  }, [fetchTodayGoal]);

  const handleToggleReminder = async () => {
    const nextState = !reminderEnabled;
    setIsUpdatingReminder(true);
    setReminderEnabled(nextState);

    // If enabling, check or request browser Push Notification permissions
    if (nextState && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            success('🔔 Push notifications enabled! We’ll remind you at 8:00 PM if your daily goal isn’t met.');
          } else if (perm === 'denied') {
            info('Browser push permissions are blocked in browser settings. In-app 8 PM reminders remain active.');
          }
        } catch {
          // Continue
        }
      }
    }

    try {
      await api.put('/study-time/reminder', {
        daily_goal_reminder_enabled: nextState,
        daily_goal_reminder_time: '20:00',
      });

      if (nextState) {
        success('✓ 8:00 PM daily study goal reminder enabled.');
      } else {
        info('Daily goal push reminders disabled.');
      }
    } catch {
      // Revert on error
      setReminderEnabled(!nextState);
      notifyError('Failed to update notification preference.');
    } finally {
      setIsUpdatingReminder(false);
    }
  };

  const handleTestNotification = () => {
    const todayHrs = data.today_study_hours || 0;
    const goalHrs = data.daily_study_goal_hours || 2.0;
    const remMins = Math.max(0, Math.round((goalHrs - todayHrs) * 60));

    const notificationTitle = '🎯 Askesis: Daily Study Goal Reminder (8:00 PM)';
    const notificationBody =
      todayHrs >= goalHrs
        ? `Great job! You already reached your ${goalHrs}h study target today.`
        : `You have ${remMins} minutes remaining to complete your ${goalHrs}h daily target today. Keep your streak alive! 🔥`;

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notificationTitle, {
          body: notificationBody,
          icon: '/favicon.ico',
        });
      } catch {
        // Fallback to in-app toast
      }
    }

    info(`🔔 [8:00 PM Push Alert]: ${notificationBody}`, 6000);
  };

  const handleQuickAdd = async (minutes: number) => {
    setIsQuickLogging(true);
    try {
      const response = await api.post('/study-time/log', {
        duration_minutes: minutes,
        topic: 'Quick Practice Session',
        exam_type: 'SAT',
        activity_type: '⚡ Quick Log',
      });
      const updated = response.data;
      setData((prev) => ({
        ...prev,
        ...updated,
      }));

      if (updated?.is_goal_reached || updated?.today_study_hours >= updated?.daily_study_goal_hours) {
        triggerCelebrationConfetti();
        success(`🎉 Daily Goal Achieved! Quick logged +${minutes} mins!`);
      } else {
        triggerMiniConfetti();
        success(`✓ Quick logged +${minutes} mins!`);
      }
    } catch {
      notifyError('Failed to quick-log study time.');
    } finally {
      setIsQuickLogging(false);
    }
  };

  const todayHours = data.today_study_hours || 0;
  const goalHours = data.daily_study_goal_hours || 2.0;
  const percentage = Math.min(100, Math.round((todayHours / goalHours) * 100));
  const isCompleted = todayHours >= goalHours;
  const remainingHours = Math.max(0, goalHours - todayHours);
  const remainingMinutes = Math.round(remainingHours * 60);

  const formatHoursDisplay = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const mins = Math.round((hours - wholeHours) * 60);
    if (wholeHours === 0) return `${mins}m`;
    if (mins === 0) return `${wholeHours}h`;
    return `${wholeHours}h ${mins}m`;
  };

  return (
    <>
      <section
        className="card fade-in"
        style={{
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          background: isCompleted
            ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          padding: '24px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label="Daily Study Goal Progress"
      >
        {/* Top Decorative Indicator Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: isCompleted
              ? 'linear-gradient(90deg, #10b981, #059669)'
              : 'linear-gradient(90deg, #3b82f6, #2563eb)',
          }}
        />

        {/* Header Row */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: isCompleted ? '#dcfce7' : '#eff6ff',
                color: isCompleted ? '#16a34a' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              }}
            >
              {isCompleted ? '🏆' : '🎯'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  Daily Study Goal
                </h2>
                {isCompleted ? (
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    ✓ Goal Met!
                  </span>
                ) : (
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                    }}
                  >
                    🔥 {data.current_streak ?? 0} Day Streak
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
                {isCompleted
                  ? `Outstanding! You achieved your ${goalHours}h target today.`
                  : `${formatHoursDisplay(todayHours)} completed of your ${goalHours}h daily target (${remainingMinutes} mins to go)`}
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {isCompleted && (
              <button
                type="button"
                onClick={() => triggerCelebrationConfetti()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1.5px solid #a7f3d0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d1fae5';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ecfdf5';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Celebrate your daily goal achievement with confetti!"
              >
                <span>🎉</span>
                <span>Celebrate</span>
              </button>
            )}

            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>⏱️</span>
              <span>Log Study Time</span>
            </button>
          </div>
        </div>

        {/* Large Metric Display & Progress Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            marginBottom: '16px',
          }}
        >
          {/* Numbers Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '10px',
            }}
          >
            <div>
              <span style={{ fontSize: '28px', fontWeight: 800, color: isCompleted ? '#16a34a' : '#0f172a' }}>
                {todayHours.toFixed(1)}
              </span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b', marginLeft: '4px' }}>
                / {goalHours.toFixed(1)} hrs
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '8px' }}>
                ({formatHoursDisplay(todayHours)})
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: isCompleted ? '#16a34a' : '#2563eb',
                }}
              >
                {percentage}%
              </span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div
            role="progressbar"
            aria-valuenow={todayHours}
            aria-valuemin={0}
            aria-valuemax={goalHours}
            aria-label="Daily study goal progress"
            style={{
              width: '100%',
              height: '14px',
              backgroundColor: '#f1f5f9',
              borderRadius: '9999px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, percentage))}%`,
                background: isCompleted
                  ? 'linear-gradient(90deg, #22c55e, #10b981)'
                  : 'linear-gradient(90deg, #60a5fa, #2563eb)',
                borderRadius: '9999px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isCompleted
                  ? '0 0 10px rgba(34, 197, 94, 0.4)'
                  : '0 0 8px rgba(59, 130, 246, 0.3)',
              }}
            />
          </div>

          {/* Subtext info under bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
              fontSize: '12px',
              color: '#64748b',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <span>
              {isCompleted ? (
                <span style={{ color: '#15803d', fontWeight: 600 }}>
                  🎉 Goal exceeded by {(todayHours - goalHours).toFixed(1)} hrs! Keep building your edge.
                </span>
              ) : (
                <span>
                  ⚡ <strong>{remainingMinutes} minutes</strong> remaining today to hit your target.
                </span>
              )}
            </span>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0',
                textDecoration: 'underline',
              }}
            >
              Adjust Daily Target ({goalHours}h)
            </button>
          </div>
        </div>

        {/* 8:00 PM Daily Goal Push Notification Reminder Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: reminderEnabled ? '#eff6ff' : '#f8fafc',
            borderRadius: '12px',
            border: `1px solid ${reminderEnabled ? '#bfdbfe' : '#e2e8f0'}`,
            marginBottom: '16px',
            transition: 'all 0.2s ease',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: reminderEnabled ? '#dbeafe' : '#e2e8f0',
                color: reminderEnabled ? '#1d4ed8' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              🔔
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  8:00 PM Daily Goal Reminder
                </span>
                {reminderEnabled ? (
                  <span
                    style={{
                      padding: '1px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    Enabled
                  </span>
                ) : (
                  <span
                    style={{
                      padding: '1px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    Off
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Send a push notification at 8:00 PM if today's study goal isn't met.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {reminderEnabled && (
              <button
                type="button"
                onClick={handleTestNotification}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #bfdbfe',
                  backgroundColor: '#ffffff',
                  color: '#1d4ed8',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                title="Send a sample test notification"
              >
                🔔 Test Alert
              </button>
            )}

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={reminderEnabled}
              aria-label="Enable 8 PM push notifications if daily goal is not met"
              disabled={isUpdatingReminder}
              onClick={handleToggleReminder}
              style={{
                position: 'relative',
                display: 'inline-flex',
                width: '46px',
                height: '26px',
                borderRadius: '9999px',
                backgroundColor: reminderEnabled ? '#2563eb' : '#cbd5e1',
                border: 'none',
                cursor: isUpdatingReminder ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
                padding: '3px',
                alignItems: 'center',
                opacity: isUpdatingReminder ? 0.7 : 1,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
                  transform: reminderEnabled ? 'translateX(20px)' : 'translateX(0px)',
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </button>
          </div>
        </div>

        {/* Quick-Add Chips & History Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            paddingTop: '4px',
          }}
        >
          {/* Quick-add chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
              Quick Add:
            </span>
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                disabled={isQuickLogging}
                onClick={() => handleQuickAdd(mins)}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.color = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                +{mins}m
              </button>
            ))}
          </div>

          {/* Toggle Today's Sessions */}
          {data.logs && data.logs.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{showHistory ? '▲ Hide Today’s Sessions' : `▼ View Today’s Sessions (${data.logs.length})`}</span>
            </button>
          )}
        </div>

        {/* Collapsible Today's Session History */}
        {showHistory && data.logs && data.logs.length > 0 && (
          <div
            style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
              Today's Logged Sessions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {log.exam_type}
                    </span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>
                      {log.topic || log.activity_type}
                    </span>
                    {log.notes && (
                      <span style={{ color: '#64748b', fontSize: '12px' }}>
                        — {log.notes}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      {log.duration_minutes}m ({ (log.duration_minutes / 60).toFixed(1) }h)
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Celebration Badges when Daily Study Goal is completed */}
        {isCompleted && (
          <CelebrationBadges
            todayHours={todayHours}
            goalHours={goalHours}
            streakDays={data.current_streak ?? 0}
            onTriggerConfetti={triggerCelebrationConfetti}
          />
        )}
      </section>

      {/* Modal Dialog */}
      <LogStudyTimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentGoalHours={goalHours}
        onSuccess={(updatedData) => {
          if (updatedData) {
            setData((prev) => ({
              ...prev,
              ...updatedData,
            }));
            if (updatedData.is_goal_reached || updatedData.today_study_hours >= updatedData.daily_study_goal_hours) {
              triggerCelebrationConfetti();
            }
          } else {
            fetchTodayGoal();
          }
        }}
        onGoalUpdated={(newGoal) => {
          setData((prev) => {
            const isMet = prev.today_study_hours >= newGoal;
            if (isMet) {
              triggerCelebrationConfetti();
            }
            return {
              ...prev,
              daily_study_goal_hours: newGoal,
              is_goal_reached: isMet,
              progress_percentage: Math.min(100, Math.round((prev.today_study_hours / newGoal) * 100)),
            };
          });
        }}
      />
    </>
  );
};
