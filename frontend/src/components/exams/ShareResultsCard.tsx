'use client';

import React, { useState } from 'react';

export interface TopicBreakdown {
  topic: string;
  correct: number;
  total: number;
}

export interface ExamResultData {
  id?: string;
  raw_score: number;
  total_questions: number;
  scaled_score_low?: number | null;
  scaled_score_high?: number | null;
  topic_breakdown: TopicBreakdown[];
  status?: string;
  examType?: string;
  examTitle?: string;
  timeTakenMinutes?: number;
  completedAt?: string;
}

interface ShareResultsCardProps {
  result: ExamResultData;
  examType?: string;
  examTitle?: string;
  timeTakenMinutes?: number;
}

export const ShareResultsCard: React.FC<ShareResultsCardProps> = ({
  result,
  examType = 'SAT',
  examTitle,
  timeTakenMinutes,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const displayTitle = examTitle || `${examType} Exam`;
  const accuracy =
    result.total_questions > 0
      ? Math.round((result.raw_score / result.total_questions) * 100)
      : 0;

  const getTopicStatus = (correct: number, total: number) => {
    if (total === 0) return 'N/A';
    const pct = (correct / total) * 100;
    if (pct >= 85) return 'Mastered (85%+)';
    if (pct >= 70) return 'Proficient (70-84%)';
    if (pct >= 50) return 'Developing (50-69%)';
    return 'Priority Gap (<50%)';
  };

  const generateFormattedReport = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    let report = `📊 Askesis Exam Prep — Test Performance Report\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `📝 Exam: ${displayTitle}\n`;
    report += `📅 Date: ${today}\n`;
    report += `🎯 Overall Score: ${result.raw_score} / ${result.total_questions} (${accuracy}%)\n`;

    if (result.scaled_score_low && result.scaled_score_high) {
      report += `📈 Estimated Scaled Range: ${result.scaled_score_low} – ${result.scaled_score_high}\n`;
    }

    const effectiveTime = timeTakenMinutes || result.timeTakenMinutes;
    if (effectiveTime) {
      report += `⏱️ Time Taken: ${effectiveTime} minutes\n`;
    }

    report += `🏆 Status: ${result.status || 'Completed'}\n\n`;

    if (result.topic_breakdown && result.topic_breakdown.length > 0) {
      report += `📚 Topic Performance Breakdown:\n`;
      result.topic_breakdown.forEach((t) => {
        const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
        const status = getTopicStatus(t.correct, t.total);
        report += `  • ${t.topic}: ${t.correct}/${t.total} (${pct}%) — ${status}\n`;
      });
      report += `\n`;
    }

    // High leverage recommendation based on accuracy
    if (accuracy >= 85) {
      report += `💡 Analysis: High competency across tested domains. Ready for test-day execution.\n`;
    } else if (accuracy >= 70) {
      report += `💡 Analysis: Competitive baseline. Target lowest-scoring topics for rapid score improvements.\n`;
    } else {
      report += `💡 Analysis: Review core concepts and complete spaced repetition drills before retaking.\n`;
    }

    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `Generated via Askesis AI Exam Preparation Platform`;

    return report;
  };

  const handleCopy = async () => {
    const textReport = generateFormattedReport();
    setShareError(null);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textReport);
      } else {
        // Fallback for environments where clipboard API is restricted
        const textArea = document.createElement('textarea');
        textArea.value = textReport;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      setShareError('Unable to auto-copy to clipboard. You can select and copy from the preview below.');
      setShowPreview(true);
    }
  };

  const handleNativeShare = async () => {
    const textReport = generateFormattedReport();
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${displayTitle} Results — Askesis`,
          text: textReport,
        });
      } catch (err) {
        // Fall back to copy if dismissed or unsupported
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="card fade-in"
      style={{
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        marginTop: '20px',
        marginBottom: '20px',
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            📋
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Share Performance Summary
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
              Generate a formatted score & topic breakdown report for tutors, parents, or study groups.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: showPreview ? '#f3f4f6' : '#ffffff',
              color: '#4b5563',
              cursor: 'pointer',
            }}
          >
            {showPreview ? 'Hide Preview' : '👁️ View Text'}
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleNativeShare}
            style={{
              padding: '8px 18px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              backgroundColor: copied ? '#16a34a' : '#2563eb',
              borderColor: copied ? '#16a34a' : '#2563eb',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
            }}
          >
            <span>{copied ? '✓ Copied to Clipboard!' : '📤 Share Results'}</span>
          </button>
        </div>
      </div>

      {/* Snapshot Summary Visual Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          padding: '14px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Score
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
            {result.raw_score} / {result.total_questions}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Accuracy
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: accuracy >= 75 ? '#16a34a' : '#2563eb', marginTop: '2px' }}>
            {accuracy}%
          </div>
        </div>

        {result.scaled_score_low !== null && result.scaled_score_low !== undefined && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Scaled Estimate
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>
              {result.scaled_score_low}–{result.scaled_score_high}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Topics Evaluated
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#334155', marginTop: '2px' }}>
            {result.topic_breakdown?.length || 0} Domains
          </div>
        </div>
      </div>

      {shareError && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '12px',
          }}
        >
          {shareError}
        </div>
      )}

      {/* Collapsible Clipboard Text Preview Box */}
      {showPreview && (
        <div style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
              Clipboard Text Preview:
            </span>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 6px',
              }}
            >
              {copied ? '✓ Copied' : 'Copy Text'}
            </button>
          </div>
          <pre
            style={{
              padding: '14px',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              margin: 0,
              maxHeight: '220px',
              overflowY: 'auto',
            }}
          >
            {generateFormattedReport()}
          </pre>
        </div>
      )}
    </div>
  );
};
