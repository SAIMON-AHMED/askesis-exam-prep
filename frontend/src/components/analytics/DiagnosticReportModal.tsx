'use client';

import React from 'react';

interface DiagnosticReportProps {
  isOpen: boolean;
  onClose: () => void;
  examType?: string;
  averageScore?: number;
  totalHours?: number;
  examsCompleted?: number;
  accuracy?: number;
}

export const DiagnosticReportModal: React.FC<DiagnosticReportProps> = ({
  isOpen,
  onClose,
  examType = 'SAT',
  averageScore = 0,
  totalHours = 0,
  examsCompleted = 0,
  accuracy = 0,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '850px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal Action Header (Hidden on Print) */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
              📄 Printable Diagnostic Assessment Report
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Formatted for students, tutors, and parent reviews.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handlePrint}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🖨️ Print / Save as PDF</span>
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div
          id="diagnostic-report-document"
          style={{
            padding: '36px',
            color: '#111827',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              borderBottom: '2px solid #0f172a',
              paddingBottom: '20px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ASKESIS EXAM PREPARATION PLATFORM
              </div>
              <h1 style={{ margin: '4px 0 0 0', fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
                {examType} Diagnostic & Performance Audit
              </h1>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                Student Diagnostic Summary · Generated on {currentDate}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>OVERALL READINESS</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a' }}>
                {averageScore >= 80 ? 'EXAM READY' : 'ON TRACK'}
              </div>
            </div>
          </div>

          {/* Key Executive Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '28px',
            }}
          >
            <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Predicted Score</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e40af', marginTop: '2px' }}>
                {examType === 'SAT' ? '1420 / 1600' : examType === 'GRE' ? '324 / 340' : `${Math.round(averageScore)}%`}
              </div>
            </div>

            <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Overall Accuracy</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f766e', marginTop: '2px' }}>
                {accuracy.toFixed(1)}%
              </div>
            </div>

            <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Completed Drills</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#334155', marginTop: '2px' }}>
                {examsCompleted} tests
              </div>
            </div>

            <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Study Volume</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>
                {totalHours} hrs
              </div>
            </div>
          </div>

          {/* Section 1: Domain Competency Breakdown */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '14px' }}>
              1. Domain & Skill Competency Breakdown
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700 }}>Topic Area</th>
                  <th style={{ textAlign: 'center', padding: '8px 10px', fontWeight: 700 }}>Accuracy</th>
                  <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700 }}>Mastery Status</th>
                  <th style={{ textAlign: 'right', padding: '8px 10px', fontWeight: 700 }}>Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Heart of Algebra & Linear Equations</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>88%</td>
                  <td style={{ padding: '8px 10px' }}><span style={{ color: '#166534', fontWeight: 600 }}>Mastered</span></td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#64748b' }}>Maintain weekly review</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Advanced Math & Quadratics</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#2563eb' }}>72%</td>
                  <td style={{ padding: '8px 10px' }}><span style={{ color: '#1e40af', fontWeight: 600 }}>Proficient</span></td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#64748b' }}>1 targeted drill recommended</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Geometry & Trigonometry</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#dc2626' }}>54%</td>
                  <td style={{ padding: '8px 10px' }}><span style={{ color: '#991b1b', fontWeight: 600 }}>Priority Gap</span></td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>Needs core concept drill</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Information & Ideas (Reading)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#2563eb' }}>79%</td>
                  <td style={{ padding: '8px 10px' }}><span style={{ color: '#1e40af', fontWeight: 600 }}>Proficient</span></td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#64748b' }}>Practice inference questions</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Standard English Conventions</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>92%</td>
                  <td style={{ padding: '8px 10px' }}><span style={{ color: '#166534', fontWeight: 600 }}>Mastered</span></td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#64748b' }}>Pacing speed benchmark</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Pacing & Test-Taking Strategy */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '14px' }}>
              2. Pacing & Time Allocation Observations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
              <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#15803d' }}>✓ Speed Efficiency Strength:</strong>
                Student averages <strong>64s per question</strong>, allowing a 10-minute buffer window at the end of each module for reviewing flagged items.
              </div>
              <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#b91c1c' }}>⚠️ Time-Trap Risk:</strong>
                Student averages <strong>98s</strong> on questions answered incorrectly. Encourage earlier process-of-elimination guessing when stuck past 80 seconds.
              </div>
            </div>
          </div>

          {/* Section 3: Targeted Remediation Plan */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '14px' }}>
              3. Personalized Next Steps & Action Plan
            </h3>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
              <li><strong>Focus on Geometry & Trigonometry:</strong> Complete 2 adaptive drills using the Custom Drill Builder focusing on circle theorems and right-triangle trigonometry.</li>
              <li><strong>Daily Spaced Repetition:</strong> Complete today's review queue cards using the SM-2 Flash Review mode to lock in punctuation rules.</li>
              <li><strong>Simulated Full Mock:</strong> Schedule a full-length timed mock exam this weekend under timed test-day conditions.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Print Style Injections */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #diagnostic-report-document,
          #diagnostic-report-document * {
            visibility: visible !important;
          }
          #diagnostic-report-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
