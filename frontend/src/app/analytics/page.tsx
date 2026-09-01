'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import StatCard from '@/components/analytics/StatCard';
import { PredictiveReadinessCard } from '@/components/analytics/PredictiveReadinessCard';
import { TopicMasteryRadar } from '@/components/analytics/TopicMasteryRadar';
import { PacingAnalyzer } from '@/components/analytics/PacingAnalyzer';
import { DiagnosticReportModal } from '@/components/analytics/DiagnosticReportModal';
import { WeeklyStudyConsistencyHeatmap } from '@/components/analytics/WeeklyStudyConsistencyHeatmap';

// Recharts is ~400 KB; defer it so the page shell and stats render without waiting on it.
const chartLoading = () => (
  <div style={{ height: 300, display: 'grid', placeItems: 'center', color: '#6b7280' }}>
    Loading chart…
  </div>
);
const WeeklyStudyChart = dynamic(
  () => import('@/components/analytics/Charts').then((m) => m.WeeklyStudyChart),
  { ssr: false, loading: chartLoading }
);
const StudyTimeBreakdownChart = dynamic(
  () => import('@/components/analytics/Charts').then((m) => m.StudyTimeBreakdownChart),
  { ssr: false, loading: chartLoading }
);

import {
  useAnalyticsOverview,
  useStudyTimeBreakdown,
  useTopicPerformance,
  useExamHistory,
  useWeeklyStats,
  useStudyStreak,
} from '@/hooks/useAnalytics';
import { useUserSettings } from '@/hooks/useProfile';

export default function AnalyticsPage() {
  const { data: overview } = useAnalyticsOverview();
  const { data: studyTime, loading: studyTimeLoading } = useStudyTimeBreakdown();
  const { data: topicPerf } = useTopicPerformance();
  const { data: examHistory, loading: historyLoading } = useExamHistory(5);
  const { data: weeklyStats, loading: weeklyLoading } = useWeeklyStats();
  const { data: streak } = useStudyStreak();
  const { settings: userSettings } = useUserSettings();

  const [showReportModal, setShowReportModal] = useState(false);

  const avgScore = overview?.average_score ?? 0;
  const studyHours = overview?.total_study_hours ?? 0;
  const examsCount = overview?.exams_completed ?? 0;

  // Calculate dynamic pacing from topic performance data if available
  const avgSeconds =
    topicPerf && topicPerf.length > 0
      ? Math.round(
          topicPerf.reduce((acc, t) => acc + (t.average_time_per_question || 0), 0) /
            topicPerf.length
        )
      : 0;

  return (
    <main style={{ padding: '28px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Diagnostic Report Export Modal */}
      <DiagnosticReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        examType="SAT"
        averageScore={avgScore}
        totalHours={studyHours}
        examsCompleted={examsCount}
        accuracy={avgScore}
      />

      {/* Header */}
      <div
        style={{
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '30px', fontWeight: 800, color: '#111827' }}>
            Performance Analytics & Diagnostic Insights
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: '#6b7280' }}>
            Real-time test readiness forecasts, topic mastery matrices, and pacing optimization.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowReportModal(true)}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '8px',
          }}
        >
          <span>📄 Export Diagnostic PDF</span>
        </button>
      </div>

      {/* 1. Predictive Test-Day Scorecard */}
      <section style={{ marginBottom: '28px' }}>
        <PredictiveReadinessCard
          averageScore={avgScore}
          examsCompleted={examsCount}
          totalHours={studyHours}
          primaryExam="SAT"
          targetScore={userSettings?.target_score}
        />
      </section>

      {/* 2. Overview Stats */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <StatCard
            title="Total Study Hours"
            value={overview?.total_study_hours ?? 0}
            unit="hours"
            icon="📚"
          />
          <StatCard
            title="Exams Completed"
            value={overview?.exams_completed ?? 0}
            unit="exams"
            icon="✅"
          />
          <StatCard
            title="Average Accuracy"
            value={overview?.average_score ?? 0}
            unit="%"
            icon="🎯"
          />
          <StatCard
            title="Study Streak"
            value={streak?.current_streak ?? 0}
            unit="days"
            icon="🔥"
          />
        </div>
      </section>

      {/* 3. Weekly Study Consistency Heatmap */}
      <section style={{ marginBottom: '28px' }}>
        <WeeklyStudyConsistencyHeatmap />
      </section>

      {/* 4. Topic Mastery Matrix */}
      <section style={{ marginBottom: '28px' }}>
        <TopicMasteryRadar data={topicPerf as any} />
      </section>

      {/* 4. Pacing & Time-Per-Question Breakdown */}
      <section style={{ marginBottom: '28px' }}>
        <PacingAnalyzer
          averageSecondsPerQuestion={avgSeconds}
          targetSecondsPerQuestion={75}
          correctTimeAvg={avgSeconds > 0 ? Math.max(10, avgSeconds - 12) : 0}
          incorrectTimeAvg={avgSeconds > 0 ? avgSeconds + 35 : 0}
        />
      </section>


      {/* 5. Charts Section */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {weeklyLoading ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              Loading Weekly Trend...
            </div>
          ) : (
            <WeeklyStudyChart data={weeklyStats} />
          )}
          {studyTimeLoading ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              Loading Breakdown...
            </div>
          ) : (
            <StudyTimeBreakdownChart data={studyTime} />
          )}
        </div>
      </section>

      {/* 6. Exam History */}
      <section>
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, color: '#111827' }}>
            Recent Practice Exams & Diagnostic Records
          </h3>
          {historyLoading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading history...</p>
          ) : examHistory.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No exam history yet. Complete a practice drill to see your score logs!</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: '#f9fafb' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#374151' }}>
                      Exam
                    </th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#374151' }}>
                      Score
                    </th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#374151' }}>
                      Accuracy
                    </th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#374151' }}>
                      Time Taken
                    </th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#374151' }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {examHistory.map((exam) => (
                    <tr
                      key={exam.id}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <td style={{ padding: '12px', fontWeight: 600, color: '#111827' }}>
                        {exam.exam_type}
                      </td>
                      <td style={{ padding: '12px', color: '#1f2937' }}>
                        {exam.raw_score}/{exam.total_questions}
                      </td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 600 }}>
                        {exam.accuracy_percentage ? `${exam.accuracy_percentage.toFixed(1)}%` : 'N/A'}
                      </td>
                      <td style={{ padding: '12px', color: '#4b5563' }}>
                        {exam.time_taken_minutes ? `${exam.time_taken_minutes} min` : 'N/A'}
                      </td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>
                        {exam.submitted_at
                          ? new Date(exam.submitted_at).toLocaleDateString()
                          : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
