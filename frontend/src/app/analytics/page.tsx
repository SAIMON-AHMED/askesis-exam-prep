'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import StatCard from '@/components/analytics/StatCard';

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
const TopicPerformanceChart = dynamic(
  () => import('@/components/analytics/Charts').then((m) => m.TopicPerformanceChart),
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

export default function AnalyticsPage() {
  const { data: overview, loading: overviewLoading } = useAnalyticsOverview();
  const { data: studyTime, loading: studyTimeLoading } = useStudyTimeBreakdown();
  const { data: topicPerf, loading: topicPerfLoading } = useTopicPerformance();
  const { data: examHistory, loading: historyLoading } = useExamHistory(5);
  const { data: weeklyStats, loading: weeklyLoading } = useWeeklyStats();
  const { data: streak } = useStudyStreak();

  const isLoading = overviewLoading || studyTimeLoading || topicPerfLoading || weeklyLoading;

  return (
    <main style={{ padding: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
          Analytics & Insights
        </h1>
        <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)' }}>
          Track your progress and study patterns
        </p>
      </div>

      {/* Overview Stats */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
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
            title="Average Score"
            value={overview?.average_score ?? 0}
            unit="%"
            icon="🎯"
          />
          <StatCard
            title="Current Streak"
            value={streak?.current_streak ?? 0}
            unit="days"
            icon="🔥"
          />
        </div>
      </section>

      {/* Charts Section */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
          {weeklyLoading ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              Loading...
            </div>
          ) : (
            <WeeklyStudyChart data={weeklyStats} />
          )}
          {studyTimeLoading ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              Loading...
            </div>
          ) : (
            <StudyTimeBreakdownChart data={studyTime} />
          )}
        </div>
      </section>

      {/* Topic Performance */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        {topicPerfLoading ? (
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            Loading...
          </div>
        ) : (
          <TopicPerformanceChart data={topicPerf} />
        )}
      </section>

      {/* Exam History */}
      <section>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
            Recent Exams
          </h3>
          {historyLoading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          ) : examHistory.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No exam history yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                      }}
                    >
                      Exam
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                      }}
                    >
                      Score
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                      }}
                    >
                      Accuracy
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                      }}
                    >
                      Time Taken
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                      }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {examHistory.map((exam) => (
                    <tr
                      key={exam.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                        {exam.exam_type}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                        {exam.raw_score}/{exam.total_questions}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                        {exam.accuracy_percentage ? `${exam.accuracy_percentage.toFixed(1)}%` : 'N/A'}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                        {exam.time_taken_minutes ? `${exam.time_taken_minutes} min` : 'N/A'}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                        {exam.submitted_at
                          ? new Date(exam.submitted_at).toLocaleDateString()
                          : 'N/A'}
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
