'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TopicHeader from '@/components/learning/TopicHeader';
import LearningMaterial from '@/components/learning/LearningMaterial';
import WorkedExample from '@/components/learning/WorkedExample';
import { getCurriculumByExamId } from '@/lib/curriculumData';
import { getLearningMaterialByTopicAndExam } from '@/lib/learningMaterialsData';

export default function TopicPage() {
  const params = useParams();
  const examId = (params.examId as string) || 'sat';
  const topicId = (params.topicId as string) || 'vocabulary';

  // Get curriculum data to find the topic
  const curriculum = getCurriculumByExamId(examId);
  
  // Find the topic in all sections
  let topic = null;
  for (const section of curriculum.sections) {
    const foundTopic = section.topics.find(t => t.id === topicId);
    if (foundTopic) {
      topic = foundTopic;
      break;
    }
  }

  // Get learning materials for this topic
  const learningMaterial = getLearningMaterialByTopicAndExam(topicId, examId);

  // If topic not found, show 404
  if (!topic) {
    return (
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1>Topic Not Found</h1>
        <p style={{ color: '#6B7280', marginBottom: '20px' }}>
          The topic "{topicId}" for exam "{examId}" could not be found.
        </p>
        <Link href={`/exams/${examId}/curriculum`}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: 'var(--current-exam-primary, #3A6EA5)',
            color: '#FFFFFF',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          ← Back to Curriculum
        </Link>
      </main>
    );
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
  };

  const backLinkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--current-exam-primary, #3A6EA5)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
    cursor: 'pointer',
  };

  const practiceCtaContainerStyle: React.CSSProperties = {
    backgroundColor: '#F0FDF4',
    border: '2px solid #10B981',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '40px',
    textAlign: 'center',
  };

  const practiceCtaTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#15803D',
    marginBottom: '12px',
  };

  const practiceCtaDescStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#166534',
    marginBottom: '16px',
  };

  const practiceButtonStyle: React.CSSProperties = {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    padding: '14px 28px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <main style={containerStyle}>
      {/* Back Link */}
      <Link href={`/exams/${examId}/curriculum`} style={backLinkStyle}>
        ← Back to Curriculum
      </Link>

      {/* Topic Header */}
      <TopicHeader
        topicName={topic.name}
        difficulty={topic.difficulty}
        progressPercent={topic.progressPercent}
        examId={examId}
        topicId={topicId}
        questionCount={topic.questionCount}
      />

      {/* Learning Materials */}
      <LearningMaterial material={learningMaterial} />

      {/* Worked Examples */}
      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📝</span>
          Worked Examples
        </h2>
        {learningMaterial.workedExamples.map((example) => (
          <WorkedExample key={example.id} example={example} examId={examId} />
        ))}
      </div>

      {/* Practice CTA */}
      <div style={practiceCtaContainerStyle}>
        <div style={practiceCtaTitleStyle}>Ready to Practice?</div>
        <div style={practiceCtaDescStyle}>
          You've learned the key concepts. Now let's test your understanding with {topic.questionCount} practice questions.
        </div>
        <Link href={`/exams/${examId}/topic/${topicId}/practice`} style={practiceButtonStyle}>
          ▶️ Start Practice Quiz
        </Link>
      </div>
    </main>
  );
}
