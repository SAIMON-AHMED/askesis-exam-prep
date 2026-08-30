'use client';

import React from 'react';

interface PredictiveReadinessProps {
  averageScore?: number;
  examsCompleted?: number;
  totalHours?: number;
  primaryExam?: string;
}

export const PredictiveReadinessCard: React.FC<PredictiveReadinessProps> = ({
  averageScore = 78,
  examsCompleted = 4,
  totalHours = 12.5,
  primaryExam = 'SAT',
}) => {
  // Calculate scaled predictive score based on exam format
  const getScaledPrediction = (exam: string, scorePercent: number) => {
    const norm = Math.min(100, Math.max(20, scorePercent || 70));
    switch (exam.toUpperCase()) {
      case 'SAT': {
        const scaled = Math.round((norm / 100) * 1200 + 400); // 400 - 1600
        const rounded = Math.round(scaled / 10) * 10;
        return {
          score: rounded,
          max: 1600,
          range: `${rounded - 30} – ${Math.min(1600, rounded + 30)}`,
          target: 1500,
          scaleName: 'SAT Scale (400-1600)',
        };
      }
      case 'GRE': {
        const scaled = Math.round((norm / 100) * 80 + 260); // 260 - 340
        return {
          score: scaled,
          max: 340,
          range: `${scaled - 2} – ${Math.min(340, scaled + 2)}`,
          target: 325,
          scaleName: 'GRE General Scale (260-340)',
        };
      }
      case 'ACT': {
        const scaled = Math.round((norm / 100) * 35 + 1); // 1 - 36
        return {
          score: scaled,
          max: 36,
          range: `${scaled - 1} – ${Math.min(36, scaled + 1)}`,
          target: 33,
          scaleName: 'ACT Composite (1-36)',
        };
      }
      case 'SHSAT': {
        const scaled = Math.round((norm / 100) * 500 + 200); // 200 - 700
        return {
          score: scaled,
          max: 700,
          range: `${scaled - 20} – ${Math.min(700, scaled + 20)}`,
          target: 560,
          scaleName: 'SHSAT Scaled (200-700)',
        };
      }
      default: {
        return {
          score: Math.round(norm),
          max: 100,
          range: `${Math.round(norm - 3)}% – ${Math.min(100, Math.round(norm + 3))}%`,
          target: 90,
          scaleName: 'Percentage Scale',
        };
      }
    }
  };

  const prediction = getScaledPrediction(primaryExam, averageScore);
  const readinessPercentage = Math.min(100, Math.round((averageScore / 90) * 100));

  let readinessLevel = 'Developing Competency';
  let badgeColor = '#9a3412';
  let badgeBg = '#fff7ed';
  let badgeBorder = '#fed7aa';

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
  }

  return (
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

        <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Target Benchmark</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
            {prediction.target}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Gap to 90th percentile: <strong>{Math.max(0, prediction.target - prediction.score)} pts</strong>
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
  );
};
