'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useUserSettings } from '@/hooks/useProfile';
import { useNotification } from '@/context/NotificationContext';

interface TestDayCountdownCardProps {
  initialExamDate?: string;
  initialTargetExam?: string;
  initialTargetScore?: number;
  onExamDateUpdated?: (newDate: string) => void;
}

export const TestDayCountdownCard: React.FC<TestDayCountdownCardProps> = ({
  initialExamDate,
  initialTargetExam,
  initialTargetScore,
  onExamDateUpdated,
}) => {
  const { settings, loading: settingsLoading } = useUserSettings();
  const { success, error: notifyError } = useNotification();

  const [examDate, setExamDate] = useState<string>(initialExamDate || '');
  const [targetExam, setTargetExam] = useState<string>(initialTargetExam || 'SAT');
  const [targetScore, setTargetScore] = useState<number | undefined>(initialTargetScore);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editDateInput, setEditDateInput] = useState<string>('');
  const [editExamInput, setEditExamInput] = useState<string>('SAT');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync with user settings
  useEffect(() => {
    if (settings) {
      if (settings.exam_date) {
        setExamDate(settings.exam_date);
      }
      if (settings.target_exam) {
        setTargetExam(settings.target_exam.toUpperCase());
      }
      if (settings.target_score) {
        setTargetScore(settings.target_score);
      }
    }
  }, [settings]);

  // Compute countdown calculations
  const countdown = useMemo(() => {
    if (!examDate) {
      return {
        hasDate: false,
        days: 0,
        weeks: 0,
        extraDays: 0,
        isToday: false,
        isPast: false,
        phase: 'No Date Set',
        phaseColor: '#64748b',
        phaseBg: '#f8fafc',
        formattedDate: 'Not Scheduled',
      };
    }

    const target = new Date(`${examDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const formattedDate = target.toLocaleDateString('en-US', options);

    if (diffDays === 0) {
      return {
        hasDate: true,
        days: 0,
        weeks: 0,
        extraDays: 0,
        isToday: true,
        isPast: false,
        phase: 'Test Day! 🎉',
        phaseColor: '#15803d',
        phaseBg: '#f0fdf4',
        formattedDate,
      };
    }

    if (diffDays < 0) {
      return {
        hasDate: true,
        days: Math.abs(diffDays),
        weeks: Math.floor(Math.abs(diffDays) / 7),
        extraDays: Math.abs(diffDays) % 7,
        isToday: false,
        isPast: true,
        phase: 'Exam Date Passed',
        phaseColor: '#b45309',
        phaseBg: '#fffbeb',
        formattedDate,
      };
    }

    const weeks = Math.floor(diffDays / 7);
    const extraDays = diffDays % 7;

    let phase = 'Steady Preparation';
    let phaseColor = '#3b82f6';
    let phaseBg = '#eff6ff';

    if (diffDays <= 7) {
      phase = 'Final Review & Readiness';
      phaseColor = '#ef4444';
      phaseBg = '#fef2f2';
    } else if (diffDays <= 21) {
      phase = 'Intensive Practice & Mocks';
      phaseColor = '#f59e0b';
      phaseBg = '#fffbeb';
    } else if (diffDays <= 45) {
      phase = 'Core Skill Mastery';
      phaseColor = '#6366f1';
      phaseBg = '#eef2ff';
    }

    return {
      hasDate: true,
      days: diffDays,
      weeks,
      extraDays,
      isToday: false,
      isPast: false,
      phase,
      phaseColor,
      phaseBg,
      formattedDate,
    };
  }, [examDate]);

  const handleOpenEditModal = () => {
    setEditDateInput(examDate || new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0]);
    setEditExamInput(targetExam || 'SAT');
    setIsEditing(true);
  };

  const handleSaveExamDate = async () => {
    if (!editDateInput) {
      notifyError('Please pick a target exam date.');
      return;
    }

    setIsSaving(true);
    try {
      await api.put('/profile/settings', {
        exam_date: editDateInput,
        target_exam: editExamInput.toLowerCase(),
      });

      setExamDate(editDateInput);
      setTargetExam(editExamInput.toUpperCase());
      setIsEditing(false);

      if (onExamDateUpdated) {
        onExamDateUpdated(editDateInput);
      }

      success(`✓ Test Day countdown updated to ${new Date(`${editDateInput}T00:00:00`).toLocaleDateString()}!`);
    } catch {
      notifyError('Failed to save exam date. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const setPresetDate = (daysFromNow: number) => {
    const future = new Date(Date.now() + daysFromNow * 86400000);
    setEditDateInput(future.toISOString().split('T')[0]);
  };

  return (
    <>
      <div
        id="test-day-countdown-card"
        className="card"
        style={{
          padding: '22px 24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>🎯</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Test Day Countdown
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#e0e7ff',
                  color: '#4338ca',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {targetExam}
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {countdown.hasDate ? (
                countdown.isToday ? (
                  'Good luck on test day today! 🚀'
                ) : countdown.isPast ? (
                  `Exam date passed (${countdown.formattedDate})`
                ) : (
                  `${countdown.days} Day${countdown.days === 1 ? '' : 's'} until ${targetExam} Exam`
                )
              ) : (
                'Set your upcoming test date'
              )}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                color: countdown.phaseColor,
                backgroundColor: countdown.phaseBg,
                border: `1px solid ${countdown.phaseColor}30`,
              }}
            >
              {countdown.phase}
            </span>

            <button
              id="edit-test-date-btn"
              type="button"
              onClick={handleOpenEditModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Change exam date or exam format"
            >
              <span>📅</span>
              <span>{countdown.hasDate ? 'Change Date' : 'Set Date'}</span>
            </button>
          </div>
        </div>

        {/* Countdown Visual Grid */}
        {countdown.hasDate && !countdown.isPast ? (
          <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {/* Days Remaining Big Stat */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Days Left
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: '#1e40af', lineHeight: 1.2, marginTop: '2px' }}>
                {countdown.days}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {countdown.weeks > 0 ? `${countdown.weeks}w ${countdown.extraDays}d` : 'Final week'}
              </div>
            </div>

            {/* Target Exam Date */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Exam Date
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '6px', lineHeight: 1.3 }}>
                {countdown.formattedDate}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Official Test Window
              </div>
            </div>

            {/* Target Score Benchmark */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Target Benchmark
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#7c3aed', lineHeight: 1.2, marginTop: '4px' }}>
                {targetScore || 1500}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {targetExam} Goal Score
              </div>
            </div>

            {/* Suggested Daily Study Cadence */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Pacing Cadence
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f766e', marginTop: '6px', lineHeight: 1.3 }}>
                {countdown.days > 30 ? '~1.5 - 2.0 hrs/day' : countdown.days > 10 ? '~2.5 hrs/day' : 'Daily Mock & Rev'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Recommended Rhythm
              </div>
            </div>
          </div>
        ) : countdown.isPast ? (
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400e' }}>
                Your previously targeted exam date was {countdown.formattedDate}.
              </div>
              <div style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>
                Ready for another test cycle or retake? Update your target date to generate a tailored timeline.
              </div>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={handleOpenEditModal}
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
            >
              Set New Test Date
            </button>
          </div>
        ) : (
          <div
            style={{
              marginTop: '16px',
              padding: '16px 20px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                No exam date configured yet
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Set your exam date in user settings to unlock personalized daily study pacing and test countdown milestones.
              </div>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={handleOpenEditModal}
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
            >
              Configure Test Date
            </button>
          </div>
        )}
      </div>

      {/* Edit Test Date Modal */}
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setIsEditing(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📅</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  Target Exam & Test Date
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                }}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
              Choose your target test and date. We will calibrate your countdown clock, weekly study plan milestones, and daily study goal recommendations.
            </p>

            {/* Target Exam Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Primary Target Exam
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {['SAT', 'ACT', 'GRE', 'GMAT', 'SHSAT', 'REGENTS'].map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setEditExamInput(ex)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      backgroundColor: editExamInput === ex ? '#4338ca' : '#f8fafc',
                      color: editExamInput === ex ? '#ffffff' : '#334155',
                      border: `1px solid ${editExamInput === ex ? '#4338ca' : '#cbd5e1'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Date Picker */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Target Test Date
              </label>
              <input
                id="exam-date-picker-input"
                type="date"
                value={editDateInput}
                onChange={(e) => setEditDateInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Quick Presets */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                Quick Presets
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setPresetDate(30)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  In 30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(45)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  In 45 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(60)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  In 60 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(90)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  In 90 Days
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '10px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                id="save-exam-date-btn"
                type="button"
                className="btn-primary"
                disabled={isSaving}
                onClick={handleSaveExamDate}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                {isSaving ? 'Saving...' : 'Save Exam Date'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
