'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getExam } from '@/lib/examConstants';
import { getCurriculumByExamId } from '@/lib/curriculumData';
import { getMockTests } from '@/lib/mockTestsData';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useExam } from '@/context/ExamContext';
import { useExamAccess } from '@/hooks/useExamAccess';

export default function ExamDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const [exam, setExam] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<any>(null);
  const { setSelectedExam, userProgress } = useExam();
  const { hasAccess, priceFor, loading: accessLoading } = useExamAccess();

  useEffect(() => {
    const examData = getExam(examId);
    const curriculumData = getCurriculumByExamId(examId);
    setExam(examData);
    setCurriculum(curriculumData);
    if (examData) {
      setSelectedExam(examId);
    }
  }, [examId, setSelectedExam]);

  if (!exam) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <p>Exam not found</p>
        <Link href="/exams" className="btn-primary">
          Back to Exams
        </Link>
      </div>
    );
  }

  if (!accessLoading && !hasAccess(examId)) {
    const price = priceFor(examId);
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{exam.displayName} is locked</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Unlock lifetime access to the full {exam.displayName} curriculum, practice questions,
          and analytics{price != null ? ` for $${price.toFixed(2)}` : ''} — or subscribe to unlock every exam.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/exams" className="btn-primary">
            Unlock on the Exams page
          </Link>
          <Link href="/subscription" className="btn-secondary">
            View subscriptions
          </Link>
        </div>
      </div>
    );
  }

  // Calculate section progress from user data
  const getSectionProgress = (sectionIndex: number) => {
    if (!userProgress || !userProgress[examId]) return 0;
    const examProgress = userProgress[examId];
    return examProgress.sectionProgress[String(sectionIndex)] || 0;
  };

  const progress = {
    overallPercent: userProgress?.[examId]?.overallPercent || 0,
    sectionProgress: userProgress?.[examId]?.sectionProgress || {},
    topicsCompleted: userProgress?.[examId]?.topicsCompleted || 0,
    questionsAttempted: userProgress?.[examId]?.questionsAttempted || 0,
    lastStudiedDate: userProgress?.[examId]?.lastStudiedDate,
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <Link
          href="/exams"
          style={{
            color: '#3a6ea5',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '16px',
            display: 'inline-block',
          }}
        >
          ← Back to Exams
        </Link>

        <h1
          style={{
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '8px',
            color: exam.primaryColor,
          }}
        >
          {exam.displayName} Dashboard
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '8px' }}>
          Last studied: {progress.lastStudiedDate ? new Date(progress.lastStudiedDate).toLocaleDateString() : 'Never'}
        </p>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '40px',
        }}
      >
        {/* Left Column: Curriculum Overview */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0' }}>
              Curriculum Overview
            </h2>
            <Link
              href={`/exams/${examId}/curriculum`}
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: exam.primaryColor || '#3A6EA5',
                textDecoration: 'none',
                padding: '8px 12px',
                border: `1px solid ${exam.primaryColor || '#3A6EA5'}`,
                borderRadius: '6px',
                transition: 'all 200ms ease',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = exam.lightColor || '#F0F4FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              View All →
            </Link>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              {curriculum?.sections[0]?.name || 'Reading & Writing'}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              {curriculum?.sections[0]?.topics?.length || 8} topics • {getSectionProgress(0)}% completed
            </p>
            <ProgressBar percent={getSectionProgress(0)} />
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              {curriculum?.sections[1]?.name || 'Math'}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              {curriculum?.sections[1]?.topics?.length || 12} topics • {getSectionProgress(1)}% completed
            </p>
            <ProgressBar percent={getSectionProgress(1)} />
          </div>
        </section>

        {/* Right Column: Progress Summary */}
        <section>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Your Progress
          </h2>

          <div
            style={{
              background: 'var(--exam-' + examId + '-light)',
              border: '1px solid var(--exam-' + examId + '-border)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Overall
            </h3>
            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
              {progress.overallPercent}%
            </div>
            <ProgressBar percent={progress.overallPercent} height={12} />
          </div>

          {/* Quick Actions */}
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            Quick Actions
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
            }}
          >
            <button
              className="btn-primary"
              onClick={() => router.push(`/exams/${examId}/learn`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px',
              }}
            >
              <span style={{ fontSize: '24px' }}>📚</span>
              <span style={{ fontSize: '12px' }}>Learn</span>
            </button>
            <button
              className="btn-primary"
              onClick={() => router.push('/practice')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px',
              }}
            >
              <span style={{ fontSize: '24px' }}>🎯</span>
              <span style={{ fontSize: '12px' }}>Practice Mode</span>
            </button>
            <button
              className="btn-primary"
              onClick={() => router.push('/analytics')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px',
              }}
            >
              <span style={{ fontSize: '24px' }}>📊</span>
              <span style={{ fontSize: '12px' }}>Analytics</span>
            </button>
          </div>
        </section>
      </div>

      {/* Mock Tests */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          {exam.displayName} Mock Tests
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Timed, exam-style tests covering the full {exam.displayName} curriculum. Fresh questions
          are generated every attempt, with a scored breakdown by topic at the end.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {getMockTests(examId).map((mock) => (
            <div
              key={mock.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '24px' }}>📝</span>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{mock.name}</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                {mock.numQuestions} questions · {mock.durationMinutes} min
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: '8px', width: '100%' }}
                onClick={() =>
                  router.push(
                    `/mock-test?exam=${examId}&mock=${mock.id}&questions=${mock.numQuestions}&duration=${mock.durationMinutes}`
                  )
                }
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Responsive Grid on smaller screens */}
      <style>{`
        @media (max-width: 968px) {
          [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
