'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getExam } from '@/lib/examConstants';
import { getCurriculumByExamId, Section, Topic } from '@/lib/curriculumData';
import { getQuestionCount } from '@/lib/questionCounts';
import SectionHeader from '@/components/exams/SectionHeader';
import TopicCard from '@/components/exams/TopicCard';
import { useExam } from '@/context/ExamContext';

export default function CurriculumPage() {
  const params = useParams();
  const examId = params.examId as string;
  const exam = getExam(examId);
  const curriculum = getCurriculumByExamId(examId);
  const { setSelectedExam } = useExam();

  useEffect(() => {
    if (examId) {
      setSelectedExam(examId);
    }
  }, [examId, setSelectedExam]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Filter topics based on search and difficulty
  const filteredSections = useMemo(() => {
    return curriculum.sections.map((section) => ({
      ...section,
      topics: section.topics.filter((topic) => {
        const matchesSearch =
          topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty =
          selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
        return matchesSearch && matchesDifficulty;
      }),
    }));
  }, [searchTerm, selectedDifficulty]);

  // Count visible topics
  const visibleTopicCount = filteredSections.reduce(
    (acc, section) => acc + section.topics.length,
    0
  );

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
  };

  const headerSectionStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const pageHeaderStyle: React.CSSProperties = {
    marginBottom: '8px',
  };

  const pageTitle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    color: exam?.primaryColor || '#3A6EA5',
    margin: '0 0 8px 0',
  };

  const pageDescriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0 0 20px 0',
  };

  const filterBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const searchInputStyle: React.CSSProperties = {
    flex: '1',
    minWidth: '200px',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  };

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '600',
    border: `2px solid ${isActive ? exam?.primaryColor || '#3A6EA5' : '#E5E7EB'}`,
    borderRadius: '8px',
    backgroundColor: isActive ? exam?.lightColor || '#F0F4FF' : '#FFFFFF',
    color: isActive ? exam?.primaryColor || '#3A6EA5' : '#6B7280',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  });

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  };

  const topicGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  };

  const emptyMessageStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '32px 16px',
    color: '#6B7280',
    fontSize: '14px',
  };

  return (
    <div
      style={containerStyle}
      data-exam={examId}
    >
      {/* Page Header */}
      <div style={headerSectionStyle}>
        <div style={pageHeaderStyle}>
          <h1 style={pageTitle}>{curriculum.examName} Curriculum Map</h1>
          <p style={pageDescriptionStyle}>
            {curriculum.sections.length} sections • {curriculum.totalTopics} topics •{' '}
            {getQuestionCount(examId).toLocaleString()} questions
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={filterBarStyle}>
          <input
            type="text"
            placeholder="🔍 Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <button
            onClick={() => setSelectedDifficulty('All')}
            style={filterButtonStyle(selectedDifficulty === 'All')}
          >
            All Levels
          </button>
          <button
            onClick={() => setSelectedDifficulty('Beginner')}
            style={filterButtonStyle(selectedDifficulty === 'Beginner')}
          >
            Beginner
          </button>
          <button
            onClick={() => setSelectedDifficulty('Intermediate')}
            style={filterButtonStyle(selectedDifficulty === 'Intermediate')}
          >
            Intermediate
          </button>
          <button
            onClick={() => setSelectedDifficulty('Advanced')}
            style={filterButtonStyle(selectedDifficulty === 'Advanced')}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Curriculum Sections */}
      <div style={contentStyle}>
        {filteredSections.map((section) => (
          <div key={section.id}>
            <SectionHeader
              icon={section.icon}
              name={section.name}
              description={section.description}
              topicCount={section.topics.length}
              progressPercent={section.progressPercent}
            />

            {section.topics.length > 0 ? (
              <div style={topicGridStyle}>
                {section.topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    examId={examId}
                    topic={topic}
                  />
                ))}
              </div>
            ) : (
              <div style={emptyMessageStyle}>
                No topics found matching your filters
              </div>
            )}
          </div>
        ))}

        {visibleTopicCount === 0 && (
          <div style={emptyMessageStyle}>
            No topics found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
}
