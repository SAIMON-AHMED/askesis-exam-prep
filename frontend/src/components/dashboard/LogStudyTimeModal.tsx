'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import { EXAMS } from '@/lib/examConstants';
import { triggerCelebrationConfetti, triggerMiniConfetti } from '@/lib/confetti';
import { useExam } from '@/context/ExamContext';

interface LogStudyTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedData?: any) => void;
  currentGoalHours: number;
  onGoalUpdated?: (newGoal: number) => void;
}

const PRESET_DURATIONS = [
  { label: '+15m', minutes: 15 },
  { label: '+30m', minutes: 30 },
  { label: '+45m', minutes: 45 },
  { label: '+1 hr', minutes: 60 },
  { label: '+1.5 hrs', minutes: 90 },
  { label: '+2 hrs', minutes: 120 },
];

const ACTIVITY_TYPES = [
  { id: 'practice', label: '⚡ Practice Drills / Questions' },
  { id: 'mock_exam', label: '📝 Mock Exam / Timed Test' },
  { id: 'spaced_review', label: '🔁 Spaced Review & Flashcards' },
  { id: 'concept_study', label: '📖 Concept & Theory Study' },
  { id: 'video_lesson', label: '🎬 Video Lesson / Tutorial' },
  { id: 'notes_summary', label: '✍️ Notes & Error Log Review' },
  { id: 'other', label: '📚 General Self-Study' },
];

export const LogStudyTimeModal: React.FC<LogStudyTimeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentGoalHours,
  onGoalUpdated,
}) => {
  const { success, error: notifyError } = useNotification();
  const { selectedExam } = useExam();

  const [mode, setMode] = useState<'log' | 'goal'>('log');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [customHours, setCustomHours] = useState<string>('0');
  const [customMins, setCustomMins] = useState<string>('30');
  const [activityType, setActivityType] = useState<string>('practice');
  const [examType, setExamType] = useState<string>('SAT');
  const [topic, setTopic] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [targetGoalInput, setTargetGoalInput] = useState<string>(String(currentGoalHours || 2.0));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTargetGoalInput(String(currentGoalHours || 2.0));
      if (selectedExam?.id) {
        setExamType(selectedExam.id.toUpperCase());
      }
      setErrorMessage(null);
    }
  }, [isOpen, currentGoalHours, selectedExam?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePresetClick = (minutes: number) => {
    setDurationMinutes(minutes);
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    setCustomHours(String(hrs));
    setCustomMins(String(mins));
  };

  const handleCustomTimeChange = (hoursStr: string, minsStr: string) => {
    setCustomHours(hoursStr);
    setCustomMins(minsStr);
    const h = parseInt(hoursStr, 10) || 0;
    const m = parseInt(minsStr, 10) || 0;
    setDurationMinutes(h * 60 + m);
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = durationMinutes;

    if (!totalMinutes || totalMinutes <= 0) {
      setErrorMessage('Please specify a study duration greater than 0 minutes.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const selectedActivity = ACTIVITY_TYPES.find((a) => a.id === activityType)?.label || 'Study Session';
      const response = await api.post('/study-time/log', {
        duration_minutes: totalMinutes,
        topic: topic.trim() || 'General Study & Practice',
        exam_type: examType,
        activity_type: selectedActivity,
        notes: notes.trim(),
      });

      const data = response.data;
      const formattedDuration =
        totalMinutes >= 60
          ? `${(totalMinutes / 60).toFixed(1)} hrs (${totalMinutes} mins)`
          : `${totalMinutes} mins`;

      if (data?.is_goal_reached || (data?.today_study_hours >= data?.daily_study_goal_hours)) {
        triggerCelebrationConfetti();
        success(`🎉 Goal Achieved! Logged ${formattedDuration}. Outstanding work today!`);
      } else {
        triggerMiniConfetti();
        success(`✓ Logged ${formattedDuration} of study time! Progress updated.`);
      }

      onSuccess(data);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to log study time. Please try again.';
      setErrorMessage(msg);
      notifyError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = parseFloat(targetGoalInput);

    if (isNaN(newGoal) || newGoal <= 0 || newGoal > 24) {
      setErrorMessage('Please enter a valid daily target between 0.5 and 24 hours.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await api.put('/study-time/goal', {
        daily_study_goal_hours: newGoal,
      });

      success(`✓ Daily study goal updated to ${newGoal} hours!`);
      if (onGoalUpdated) {
        onGoalUpdated(newGoal);
      }
      onSuccess(response.data);
      setMode('log');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to update study goal.';
      setErrorMessage(msg);
      notifyError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
          padding: '24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '16px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              ⏱️
            </div>
            <div>
              <h2 id="modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                {mode === 'log' ? 'Log Study Time' : 'Adjust Daily Study Goal'}
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                {mode === 'log'
                  ? 'Record offline practice, textbook review, or timed drills.'
                  : 'Customize your target study hours per day.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '22px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              lineHeight: 1,
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab switch between Log Time and Change Goal */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('log');
              setErrorMessage(null);
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              backgroundColor: mode === 'log' ? '#ffffff' : 'transparent',
              color: mode === 'log' ? '#1e293b' : '#64748b',
              boxShadow: mode === 'log' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            ⏱️ Log Session
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('goal');
              setErrorMessage(null);
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              backgroundColor: mode === 'goal' ? '#ffffff' : 'transparent',
              color: mode === 'goal' ? '#1e293b' : '#64748b',
              boxShadow: mode === 'goal' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            🎯 Adjust Daily Target ({currentGoalHours}h)
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#b91c1c',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {errorMessage}
          </div>
        )}

        {mode === 'log' ? (
          <form onSubmit={handleLogSubmit}>
            {/* Quick Duration Presets */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Quick Duration Presets
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {PRESET_DURATIONS.map((preset) => {
                  const isSelected = durationMinutes === preset.minutes;
                  return (
                    <button
                      key={preset.minutes}
                      type="button"
                      onClick={() => handlePresetClick(preset.minutes)}
                      style={{
                        padding: '9px 12px',
                        fontSize: '13px',
                        fontWeight: isSelected ? 700 : 500,
                        borderRadius: '8px',
                        border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#1d4ed8' : '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Hours & Minutes */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Custom Duration
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={customHours}
                      onChange={(e) => handleCustomTimeChange(e.target.value, customMins)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>hrs</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      step="5"
                      value={customMins}
                      onChange={(e) => handleCustomTimeChange(customHours, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>mins</span>
                  </div>
                </div>
                <div
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#2563eb',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Total: {durationMinutes} min ({ (durationMinutes / 60).toFixed(2) }h)
                </div>
              </div>
            </div>

            {/* Activity Type */}
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="study-activity-type" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Study Activity
              </label>
              <select
                id="study-activity-type"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                }}
              >
                {ACTIVITY_TYPES.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam & Topic Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="study-exam-type" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Exam
                </label>
                <select
                  id="study-exam-type"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="SAT">SAT</option>
                  <option value="ACT">ACT</option>
                  <option value="GRE">GRE</option>
                  <option value="GMAT">GMAT</option>
                  <option value="SHSAT">SHSAT</option>
                  <option value="REGENTS">Regents</option>
                </select>
              </div>

              <div>
                <label htmlFor="study-topic" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Topic / Subject (Optional)
                </label>
                <input
                  id="study-topic"
                  type="text"
                  placeholder="e.g. Heart of Algebra, Reading Passages"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                  }}
                />
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="study-notes" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Session Notes (Optional)
              </label>
              <textarea
                id="study-notes"
                rows={2}
                placeholder="What did you focus on? Any key formulas or takeaways?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  padding: '8px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isSubmitting ? 'Logging...' : '✓ Log Study Time'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleGoalSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="daily-goal-target" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Daily Target Hours
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <input
                  id="daily-goal-target"
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="12"
                  value={targetGoalInput}
                  onChange={(e) => setTargetGoalInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '16px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>hours / day</span>
              </div>

              {/* Goal Presets */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['1.0', '1.5', '2.0', '2.5', '3.0', '4.0'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTargetGoalInput(val)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: targetGoalInput === val ? 700 : 500,
                      borderRadius: '6px',
                      border: `1px solid ${targetGoalInput === val ? '#2563eb' : '#cbd5e1'}`,
                      backgroundColor: targetGoalInput === val ? '#eff6ff' : '#f8fafc',
                      color: targetGoalInput === val ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {val} hrs/day
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #dcfce7',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#166534',
                marginBottom: '20px',
                lineHeight: 1.4,
              }}
            >
              💡 <strong>Tip:</strong> Setting a realistic daily goal (1.5 – 2.5 hours) builds consistent study habits and boosts exam retention through spaced repetition.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMode('log')}
                disabled={isSubmitting}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ padding: '8px 20px', fontSize: '14px', fontWeight: 600 }}
              >
                {isSubmitting ? 'Saving...' : 'Save Daily Goal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
