'use client';

import React, { useState } from 'react';
import { EXAMS, ExamDefinition } from '@/lib/examConstants';
import { getCurriculumByExamId } from '@/lib/curriculumData';

export interface CustomTestConfig {
  examId: string;
  topicIds: string[];
  topicNames: string[];
  difficulty: number; // 1: Easy, 2: Medium, 3: Hard, 0: Adaptive Mix
  questionCount: number;
  mode: 'tutor' | 'timed';
  timeLimitMinutes: number;
}

interface CustomTestBuilderProps {
  initialExamId?: string;
  onStartTest: (config: CustomTestConfig) => void;
}

export const CustomTestBuilder: React.FC<CustomTestBuilderProps> = ({
  initialExamId = 'sat',
  onStartTest,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId);
  const currentExam: ExamDefinition = EXAMS[selectedExamId] || EXAMS.sat;
  const curriculum = getCurriculumByExamId(selectedExamId);

  // All topics for the selected exam
  const allTopics = curriculum.sections.flatMap((s) => s.topics);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(
    allTopics.slice(0, 3).map((t) => t.id)
  );

  const [difficulty, setDifficulty] = useState<number>(2); // Medium default
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [mode, setMode] = useState<'tutor' | 'timed'>('timed');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(15);

  const handleExamChange = (newExamId: string) => {
    setSelectedExamId(newExamId);
    const newCurriculum = getCurriculumByExamId(newExamId);
    const newAllTopics = newCurriculum.sections.flatMap((s) => s.topics);
    setSelectedTopicIds(newAllTopics.slice(0, 3).map((t) => t.id));
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSelectAllTopics = () => {
    setSelectedTopicIds(allTopics.map((t) => t.id));
  };

  const handleClearTopics = () => {
    setSelectedTopicIds([]);
  };

  const handleLaunch = () => {
    const topicNames = allTopics
      .filter((t) => selectedTopicIds.includes(t.id))
      .map((t) => t.name);

    onStartTest({
      examId: selectedExamId,
      topicIds: selectedTopicIds.length > 0 ? selectedTopicIds : allTopics.map((t) => t.id),
      topicNames: topicNames.length > 0 ? topicNames : allTopics.map((t) => t.name),
      difficulty,
      questionCount,
      mode,
      timeLimitMinutes: mode === 'timed' ? timeLimitMinutes : 0,
    });
  };

  return (
    <div className="card" style={{ padding: '28px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px 0', color: '#111827' }}>
          🛠️ Custom Practice Test Builder
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Configure a personalized practice set tailored to your exact target topics, timing conditions, and difficulty.
        </p>
      </div>

      {/* 1. Select Target Exam */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '10px', color: '#374151' }}>
          1. Select Target Exam
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {Object.values(EXAMS).map((ex) => {
            const isSelected = ex.id === selectedExamId;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleExamChange(ex.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `2px solid ${isSelected ? ex.primaryColor : '#e5e7eb'}`,
                  backgroundColor: isSelected ? ex.lightColor : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '18px' }}>{ex.icon}</span>
                <span style={{ fontWeight: 600, fontSize: '14px', color: isSelected ? ex.primaryColor : '#374151' }}>
                  {ex.displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Choose Topics */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>
            2. Select Topics ({selectedTopicIds.length}/{allTopics.length} selected)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleSelectAllTopics}
              style={{
                fontSize: '12px',
                color: '#2563eb',
                background: 'none',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Select All
            </button>
            <span style={{ color: '#d1d5db' }}>|</span>
            <button
              type="button"
              onClick={handleClearTopics}
              style={{
                fontSize: '12px',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
          {allTopics.map((topic) => {
            const isChecked = selectedTopicIds.includes(topic.id);
            return (
              <label
                key={topic.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: isChecked ? '#eff6ff' : '#f9fafb',
                  border: `1px solid ${isChecked ? '#93c5fd' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isChecked ? 600 : 400,
                  color: isChecked ? '#1e40af' : '#374151',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTopic(topic.id)}
                  style={{ accentColor: currentExam.primaryColor }}
                />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {topic.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Settings Grid: Difficulty, Count, Mode */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Difficulty */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#374151' }}>
            3. Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
          >
            <option value={0}>⚡ Adaptive / Mixed Difficulty</option>
            <option value={1}>🟢 Easy (Foundations)</option>
            <option value={2}>🟡 Medium (Standard Exam Level)</option>
            <option value={3}>🔴 Hard (Advanced Traps & 99th Percentile)</option>
          </select>
        </div>

        {/* Question Count */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#374151' }}>
            4. Question Count
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[5, 10, 15, 20, 30].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setQuestionCount(count);
                  setTimeLimitMinutes(Math.round(count * 1.5));
                }}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: `1px solid ${questionCount === count ? currentExam.primaryColor : '#d1d5db'}`,
                  backgroundColor: questionCount === count ? currentExam.lightColor : '#ffffff',
                  color: questionCount === count ? currentExam.primaryColor : '#374151',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Test Mode */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#374151' }}>
            5. Session Format
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setMode('timed')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${mode === 'timed' ? '#2563eb' : '#d1d5db'}`,
                backgroundColor: mode === 'timed' ? '#eff6ff' : '#ffffff',
                color: mode === 'timed' ? '#1d4ed8' : '#374151',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              ⏱️ Timed Drill ({timeLimitMinutes}m)
            </button>
            <button
              type="button"
              onClick={() => setMode('tutor')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${mode === 'tutor' ? '#2563eb' : '#d1d5db'}`,
                backgroundColor: mode === 'tutor' ? '#eff6ff' : '#ffffff',
                color: mode === 'tutor' ? '#1d4ed8' : '#374151',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              🎓 Tutor Mode
            </button>
          </div>
        </div>
      </div>

      {/* Start Test Button */}
      <button
        type="button"
        className="btn-primary"
        onClick={handleLaunch}
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: '16px',
          fontWeight: 700,
          backgroundColor: currentExam.primaryColor,
          borderColor: currentExam.primaryColor,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span>🚀 Start Custom Practice Test ({questionCount} Questions)</span>
      </button>
    </div>
  );
};
