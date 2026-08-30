'use client';

import React from 'react';

interface PacingDataProps {
  averageSecondsPerQuestion?: number;
  targetSecondsPerQuestion?: number;
  correctTimeAvg?: number;
  incorrectTimeAvg?: number;
}

export const PacingAnalyzer: React.FC<PacingDataProps> = ({
  averageSecondsPerQuestion = 64,
  targetSecondsPerQuestion = 75,
  correctTimeAvg = 52,
  incorrectTimeAvg = 98,
}) => {
  const isPacingOptimal = averageSecondsPerQuestion <= targetSecondsPerQuestion;
  const timeSinkDifference = incorrectTimeAvg - correctTimeAvg;

  return (
    <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#111827' }}>
            ⏱️ Pacing & Time-Efficiency Analyzer
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
            Diagnose test-taking speed, bottleneck questions, and time sink risks.
          </p>
        </div>

        <span
          style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: isPacingOptimal ? '#f0fdf4' : '#fff7ed',
            color: isPacingOptimal ? '#15803d' : '#c2410c',
            border: `1px solid ${isPacingOptimal ? '#bbf7d0' : '#fed7aa'}`,
          }}
        >
          {isPacingOptimal ? '✓ Pacing on Schedule' : '⚠️ Potential Time Crunch'}
        </span>
      </div>

      {/* Pacing Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', margin: '20px 0' }}>
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Your Average Pace</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {averageSecondsPerQuestion}s
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}> / question</span>
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
            {targetSecondsPerQuestion - averageSecondsPerQuestion}s buffer below target
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Target Exam Pace</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#334155', marginTop: '4px' }}>
            {targetSecondsPerQuestion}s
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}> / question</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Official digital exam allotment
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Time on Missed Qs</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
            {incorrectTimeAvg}s
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}> avg</span>
          </div>
          <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
            +{timeSinkDifference}s longer than correct answers
          </div>
        </div>
      </div>

      {/* Pacing Advice Box */}
      <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', fontSize: '13px', color: '#1e3a8a', lineHeight: '1.5' }}>
        <strong>💡 Strategic Recommendation:</strong> You spend nearly <strong>{incorrectTimeAvg}s</strong> on questions you eventually miss. If stuck on a question for more than 75 seconds, use the <em>Option Elimination Tool</em> to rule out 2 choices, flag the question, make an educated guess, and return during your buffer time.
      </div>
    </div>
  );
};
