'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';

interface PredictiveReadinessProps {
  averageScore?: number;
  examsCompleted?: number;
  totalHours?: number;
  primaryExam?: string;
  targetScore?: number;
  onTargetScoreChange?: (newTarget: number) => void;
}

export const PredictiveReadinessCard: React.FC<PredictiveReadinessProps> = ({
  averageScore = 0,
  examsCompleted = 0,
  totalHours = 0,
  primaryExam = 'SAT',
  targetScore,
  onTargetScoreChange,
}) => {
  const { success, error: notifyError } = useNotification();
  const hasData = examsCompleted > 0 || averageScore > 0 || totalHours > 0;

  const getDefaultTarget = (exam: string) => {
    switch (exam.toUpperCase()) {
      case 'SAT': return 1500;
      case 'GRE': return 325;
      case 'ACT': return 33;
      case 'SHSAT': return 560;
      case 'GMAT': return 720;
      default: return 90;
    }
  };

  const getExamBounds = (exam: string) => {
    switch (exam.toUpperCase()) {
      case 'SAT': return { min: 400, max: 1600, step: 10, presets: [1300, 1400, 1480, 1520, 1560, 1600] };
      case 'GRE': return { min: 260, max: 340, step: 1, presets: [310, 320, 325, 330, 335, 340] };
      case 'ACT': return { min: 1, max: 36, step: 1, presets: [28, 30, 32, 34, 35, 36] };
      case 'SHSAT': return { min: 200, max: 700, step: 5, presets: [500, 540, 580, 620, 670, 700] };
      case 'GMAT': return { min: 200, max: 800, step: 10, presets: [640, 680, 700, 720, 760, 800] };
      default: return { min: 1, max: 100, step: 1, presets: [75, 80, 85, 90, 95, 100] };
    }
  };

  const bounds = getExamBounds(primaryExam);
  const [currentTarget, setCurrentTarget] = useState<number>(targetScore || getDefaultTarget(primaryExam));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editInput, setEditInput] = useState<number>(currentTarget);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (targetScore && targetScore > 0) {
      setCurrentTarget(targetScore);
      setEditInput(targetScore);
    }
  }, [targetScore]);

  // Calculate scaled predictive score based on exam format
  const getScaledPrediction = (exam: string, scorePercent: number) => {
    const activeTarget = currentTarget || getDefaultTarget(exam);

    if (!hasData) {
      switch (exam.toUpperCase()) {
        case 'SAT':
          return { score: 0, max: 1600, range: 'N/A (Take a practice test)', target: activeTarget, scaleName: 'SAT Scale (400-1600)' };
        case 'GRE':
          return { score: 0, max: 340, range: 'N/A (Take a practice test)', target: activeTarget, scaleName: 'GRE General Scale (260-340)' };
        case 'ACT':
          return { score: 0, max: 36, range: 'N/A (Take a practice test)', target: activeTarget, scaleName: 'ACT Composite (1-36)' };
        case 'SHSAT':
          return { score: 0, max: 700, range: 'N/A (Take a practice test)', target: activeTarget, scaleName: 'SHSAT Scaled (200-700)' };
        default:
          return { score: 0, max: 100, range: 'N/A (Take a practice test)', target: activeTarget, scaleName: 'Percentage Scale' };
      }
    }

    const norm = Math.min(100, Math.max(1, scorePercent));
    switch (exam.toUpperCase()) {
      case 'SAT': {
        const scaled = Math.round((norm / 100) * 1200 + 400); // 400 - 1600
        const rounded = Math.round(scaled / 10) * 10;
        return {
          score: rounded,
          max: 1600,
          range: `${rounded - 30} – ${Math.min(1600, rounded + 30)}`,
          target: activeTarget,
          scaleName: 'SAT Scale (400-1600)',
        };
      }
      case 'GRE': {
        const scaled = Math.round((norm / 100) * 80 + 260); // 260 - 340
        return {
          score: scaled,
          max: 340,
          range: `${scaled - 2} – ${Math.min(340, scaled + 2)}`,
          target: activeTarget,
          scaleName: 'GRE General Scale (260-340)',
        };
      }
      case 'ACT': {
        const scaled = Math.round((norm / 100) * 35 + 1); // 1 - 36
        return {
          score: scaled,
          max: 36,
          range: `${scaled - 1} – ${Math.min(36, scaled + 1)}`,
          target: activeTarget,
          scaleName: 'ACT Composite (1-36)',
        };
      }
      case 'SHSAT': {
        const scaled = Math.round((norm / 100) * 500 + 200); // 200 - 700
        return {
          score: scaled,
          max: 700,
          range: `${scaled - 20} – ${Math.min(700, scaled + 20)}`,
          target: activeTarget,
          scaleName: 'SHSAT Scaled (200-700)',
        };
      }
      default: {
        return {
          score: Math.round(norm),
          max: 100,
          range: `${Math.round(norm - 3)}% – ${Math.min(100, Math.round(norm + 3))}%`,
          target: activeTarget,
          scaleName: 'Percentage Scale',
        };
      }
    }
  };

  const prediction = getScaledPrediction(primaryExam, averageScore);
  const readinessPercentage = hasData ? Math.min(100, Math.round((averageScore / 90) * 100)) : 0;

  let readinessLevel = 'New Student (Zero Activity)';
  let badgeColor = '#64748b';
  let badgeBg = '#f1f5f9';
  let badgeBorder = '#cbd5e1';

  if (hasData) {
    if (averageScore >= 85) {
      readinessLevel = '🎯 Target Score In Reach (Exam-Ready)';
      badgeColor = '#166534';
      badgeBg = '#f0fdf4';
      badgeBorder = '#bbf7d0';
    } else if (averageScore >= 70) {
      readinessLevel = '⚡ Competitive Baseline (Fine-Tuning Needed)';
      badgeColor = '#1e40af';
      badgeBg = '#eff6ff';
      badgeBorder = '#bfdbfe';
    } else {
      readinessLevel = 'Developing Competency';
      badgeColor = '#9a3412';
      badgeBg = '#fff7ed';
      badgeBorder = '#fed7aa';
    }
  }

  const handleSaveTarget = async () => {
    const val = Number(editInput);
    if (isNaN(val) || val < bounds.min || val > bounds.max) {
      notifyError(`Please enter a valid target score between ${bounds.min} and ${bounds.max} for ${primaryExam}.`);
      return;
    }

    setIsSaving(true);
    try {
      await api.put('/profile/settings', {
        target_score: val,
        target_exam: primaryExam.toLowerCase(),
      });
      setCurrentTarget(val);
      setIsEditing(false);
      if (onTargetScoreChange) {
        onTargetScoreChange(val);
      }
      success(`✓ Target Benchmark updated to ${val} for ${primaryExam}!`);
    } catch {
      notifyError('Failed to save target score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className="card"
        style={{
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Predictive Test-Day Projection
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '4px 0 0 0' }}>
              {primaryExam} Score Forecast
            </h2>
          </div>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              color: badgeColor,
              backgroundColor: badgeBg,
              border: `1px solid ${badgeBorder}`,
            }}
          >
            {readinessLevel}
          </span>
        </div>

        {/* Main Score Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', margin: '20px 0' }}>
          <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Predicted Scaled Score</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e40af', marginTop: '4px' }}>
              {prediction.score}
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#94a3b8' }}> / {prediction.max}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Estimated Range: <strong>{prediction.range}</strong>
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Exam Readiness Index</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f766e', marginTop: '4px' }}>
              {readinessPercentage}%
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Based on {examsCompleted} exams & {totalHours}h practice
            </div>
          </div>

          {/* Editable Target Benchmark Card */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1.5px solid #e9d5ff',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.06)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Target Benchmark</div>
              <button
                type="button"
                onClick={() => {
                  setEditInput(currentTarget);
                  setIsEditing(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#f5f3ff',
                  color: '#7c3aed',
                  border: '1px solid #ddd6fe',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Edit your target benchmark score"
              >
                <span>✏️</span>
                <span>Edit Target</span>
              </button>
            </div>

            <div style={{ fontSize: '32px', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
              {prediction.target}
            </div>

            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Gap to goal: <strong>{Math.max(0, prediction.target - prediction.score)} pts</strong>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
            <span>Current Baseline: {prediction.score}</span>
            <span>Target Score: {prediction.target}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, (prediction.score / prediction.max) * 100)}%`,
                background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Target Benchmark Edit Modal */}
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
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎯</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  Set Target Benchmark
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
              Set your target goal for <strong>{primaryExam}</strong> ({bounds.min} – {bounds.max}). We will calibrate your score readiness gap, study hours recommendation, and milestone pacing.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Target Score ({primaryExam})
              </label>
              <input
                type="number"
                min={bounds.min}
                max={bounds.max}
                step={bounds.step}
                value={editInput}
                onChange={(e) => setEditInput(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#7c3aed',
                  borderRadius: '10px',
                  border: '2px solid #ddd6fe',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                autoFocus
              />
            </div>

            {/* Quick Presets */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                Quick Presets
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {bounds.presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEditInput(p)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      backgroundColor: editInput === p ? '#7c3aed' : '#f5f3ff',
                      color: editInput === p ? '#ffffff' : '#6d28d9',
                      border: `1px solid ${editInput === p ? '#7c3aed' : '#ddd6fe'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {p}
                  </button>
                ))}
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
                type="button"
                className="btn-primary"
                disabled={isSaving}
                onClick={handleSaveTarget}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                {isSaving ? 'Saving...' : 'Save Target Benchmark'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

