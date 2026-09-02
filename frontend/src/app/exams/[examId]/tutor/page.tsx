'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getExam } from '@/lib/examConstants';
import { getCurriculumByExamId } from '@/lib/curriculumData';
import { getLessonsForTopic } from '@/lib/lessonsData';
import { useExam } from '@/context/ExamContext';
import { TutorChatPanel } from '@/components/learning/TutorChatPanel';

export default function TutorPage() {
  const params = useParams();
  const examId = params.examId as string;

  const exam = getExam(examId);
  const curriculum = getCurriculumByExamId(examId);
  const { setSelectedExam } = useExam();

  const allTopics = curriculum.sections.flatMap((s) => s.topics);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(allTopics[0]?.id ?? null);

  useEffect(() => {
    if (exam) setSelectedExam(examId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, exam]);

  if (!exam) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <p>Exam not found</p>
      </div>
    );
  }

  const selectedTopic = allTopics.find((t) => t.id === selectedTopicId) ?? null;
  const lessons = selectedTopicId ? getLessonsForTopic(examId, selectedTopicId) : [];
  const activeLesson = lessons[0] ?? null;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', backgroundColor: '#f5f7fa' }}>
      {/* Left sidebar: Topics */}
      <div
        style={{
          width: '260px',
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
          padding: '20px 0',
        }}
      >
        <div style={{ padding: '0 20px', marginBottom: '20px' }}>
          <Link href={`/exams/${examId}`} style={{ color: '#3a6ea5', textDecoration: 'none', fontSize: '12px' }}>
            ← Back
          </Link>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '10px', marginBottom: '2px' }}>
            🧑‍🏫 AI Tutor
          </h2>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{exam.displayName}</p>
        </div>

        <div style={{ padding: '0 20px', marginBottom: '10px' }}>
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#6b7280',
              letterSpacing: '0.5px',
              margin: 0,
            }}
          >
            Topics
          </h3>
        </div>

        {allTopics.map((topic, idx) => {
          const isSelected = selectedTopicId === topic.id;
          const hasLesson = (topic.lessonIds?.length ?? 0) > 0;
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              style={{
                width: '100%',
                padding: '10px 20px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: isSelected ? '#f0f4ff' : 'transparent',
                borderLeft: `4px solid ${isSelected ? exam.primaryColor : 'transparent'}`,
                cursor: 'pointer',
                color: isSelected ? exam.primaryColor : '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 500 }}>
                {idx + 1}. {topic.name}
              </span>
              {!hasLesson && (
                <span style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap' }}>Soon</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main: chat panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedTopic ? (
          <TutorChatPanel
            key={selectedTopic.id}
            examId={examId}
            topicId={selectedTopic.id}
            topicName={selectedTopic.name}
            lesson={activeLesson}
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <p>Select a topic to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
