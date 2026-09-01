'use client';

import React from 'react';

interface PacingDataProps {
  averageSecondsPerQuestion?: number;
  targetSecondsPerQuestion?: number;
  correctTimeAvg?: number;
  incorrectTimeAvg?: number;
}

export const PacingAnalyzer: React.FC<PacingDataProps> = ({
  averageSecondsPerQuestion = 0,
  targetSecondsPerQuestion = 75,
  correctTimeAvg = 0,
  incorrectTimeAvg = 0,
}) => {
  const hasData = averageSecondsPerQuestion > 0;
  const isPacingOptimal = hasData ? averageSecondsPerQuestion <= targetSecondsPerQuestion : true;
  const timeSinkDifference = Math.max(0, incorrectTimeAvg - correctTimeAvg);

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
            backgroundColor: !hasData ? '#f1f5f9' : isPacingOptimal ? '#f0fdf4' : '#fff7ed',
            color: !hasData ? '#64748b' : isPacingOptimal ? '#15803d' : '#c2410c',
            border: `1px solid ${!hasData ? '#cbd5e1' : isPacingOptimal ? '#bbf7d0' : '#fed7aa'}`,
          }}
        >
          {!hasData ? 'No Pacing Data' : isPacingOptimal ? '✓ Pacing on Schedule' : '⚠️ Potential Time Crunch'}
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
          <div style={{ fontSize: '12px', color: hasData ? '#10b981' : '#64748b', marginTop: '4px' }}>
            {hasData ? `${targetSecondsPerQuestion - averageSecondsPerQuestion}s buffer below target` : 'Complete timed exams to log pace'}
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
          <div style={{ fontSize: '28px', fontWeight: 800, color: hasData ? '#dc2626' : '#64748b', marginTop: '4px' }}>
            {incorrectTimeAvg}s
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}> avg</span>
          </div>
          <div style={{ fontSize: '12px', color: hasData ? '#dc2626' : '#64748b', marginTop: '4px' }}>
            {hasData ? `+${timeSinkDifference}s longer than correct answers` : 'No missed questions recorded'}
          </div>
        </div>
      </div>

      {/* Pacing Advice Box */}
      <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', fontSize: '13px', color: '#1e3a8a', lineHeight: '1.5' }}>
        <strong>💡 Strategic Recommendation:</strong> {hasData ? `You spend ${incorrectTimeAvg}s on questions you miss. If stuck on a question for more than ${targetSecondsPerQuestion} seconds, use elimination tools, flag the question, and move forward.` : 'Take a timed diagnostic practice section to analyze your question-by-question speed and identify bottleneck topics.'}
      </div>
    </div>
  );
};
