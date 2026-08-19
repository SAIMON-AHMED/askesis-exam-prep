'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExamSelectionCard } from '@/components/exams/ExamSelectionCard';
import { EXAMS, EXAM_IDS } from '@/lib/examConstants';
import { useExam } from '@/context/ExamContext';
import { useExamAccess } from '@/hooks/useExamAccess';
import type { Metadata } from "next";

// Note: generateMetadata must be in a separate server component for client pages
// This is handled in app/exams/layout.tsx

export default function ExamsPage() {
  const router = useRouter();
  const { userProgress } = useExam();
  const { hasAccess, priceFor, buyExam, isLoggedIn, loading } = useExamAccess();
  const [buyingExamId, setBuyingExamId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleBuy = async (examId: string) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    const price = priceFor(examId);
    const label = EXAMS[examId]?.displayName || examId.toUpperCase();
    if (!window.confirm(`Unlock ${label}${price != null ? ` for $${price.toFixed(2)}` : ''}? You'll get lifetime access to its full curriculum and practice.`)) {
      return;
    }
    setBuyingExamId(examId);
    setMessage(null);
    try {
      await buyExam(examId);
      setMessage(`${label} unlocked! You now have full access.`);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push('/login');
      } else {
        setMessage(err?.response?.data?.detail || 'Purchase failed. Please try again.');
      }
    } finally {
      setBuyingExamId(null);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px' }}>
          Askesis
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Choose your standardized exam & master it with personalized curriculum
        </p>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
          Buy a single exam for lifetime access, or subscribe to unlock everything.
        </p>
      </div>

      {message && (
        <div
          className={message.includes('unlocked') ? 'alert alert-success' : 'alert alert-error'}
          role="status"
          style={{ marginBottom: '24px' }}
        >
          {message}
        </div>
      )}

      {/* Exams Grid */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', marginBottom: '64px' }}>
          <p style={{ color: '#6b7280' }}>Loading exams...</p>
        </div>
      ) : (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '64px',
        }}
      >
        {EXAM_IDS.map((examId) => {
          const exam = EXAMS[examId];
          const progress = userProgress[examId];

          return (
            <ExamSelectionCard
              key={exam.id}
              exam={exam}
              locked={!hasAccess(exam.id)}
              price={priceFor(exam.id)}
              buying={buyingExamId === exam.id}
              onBuy={handleBuy}
              progressPercent={progress?.overallPercent || 0}
              lastStudiedDaysAgo={
                progress?.lastStudiedDate
                  ? Math.floor(
                      (Date.now() - new Date(progress.lastStudiedDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : undefined
              }
            />
          );
        })}
      </div>
      )}

      {/* Stats Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          textAlign: 'center',
          padding: '32px',
          background: '#f9fafb',
          borderRadius: '12px',
          marginBottom: '32px',
        }}
      >
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            ✓ {EXAM_IDS.length}+ Exams
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Comprehensive preparation</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            📚 2,900+ Questions
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Curated by topic, plus fresh adaptive practice</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            📝 30 Mock Tests
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Timed, exam-style, scored by topic</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            🎯 AI Adaptive
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Personalized learning path</div>
        </div>
      </div>
    </div>
  );
}
