'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getExam } from '@/lib/examConstants';
import { getCurriculumByExamId } from '@/lib/curriculumData';
import { useExam } from '@/context/ExamContext';
import { getMaterialByExamAndTopic, ReadingMaterial } from '@/lib/learningMaterialsContent';
import { getQuestionsByTopic, PracticeQuestion } from '@/lib/practiceQuestionsData';

type ViewMode = 'reading' | 'practice';

interface EssayFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detailed_feedback: string;
}

interface EssayEvaluation {
  [questionId: string]: EssayFeedback;
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  
  const exam = getExam(examId);
  const curriculum = getCurriculumByExamId(examId);
  const { setSelectedExam } = useExam();

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('reading');
  const [currentReadingMaterial, setCurrentReadingMaterial] = useState<ReadingMaterial | null>(null);
  const [currentPracticeQuestions, setCurrentPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [practiceAnswers, setPracticeAnswers] = useState<Map<string, number | string>>(new Map());
  const [submittedPages, setSubmittedPages] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [essayEvaluations, setEssayEvaluations] = useState<EssayEvaluation>({});
  const [evaluatingEssays, setEvaluatingEssays] = useState<Set<string>>(new Set());
  const questionsPerPage = 5; // Show 5 questions at a time

  useEffect(() => {
    if (exam) {
      setSelectedExam(examId);
    }
    
    // Set first topic as selected
    if (curriculum.sections[0]?.topics[0]) {
      setSelectedTopic(curriculum.sections[0].topics[0].id);
    }
  }, [examId, curriculum, exam, setSelectedExam]);

  // Load reading materials and practice questions when topic changes
  useEffect(() => {
    if (selectedTopic) {
      const material = getMaterialByExamAndTopic(examId, selectedTopic);
      setCurrentReadingMaterial(material);
      
      const questions = getQuestionsByTopic(examId, selectedTopic);
      setCurrentPracticeQuestions(questions);
      setPracticeAnswers(new Map());
      setSubmittedPages(new Set());
      setCurrentPage(1); // Reset to first page
    }
  }, [selectedTopic, examId]);

  if (!exam) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <p>Exam not found</p>
      </div>
    );
  }

  const currentTopic = selectedTopic
    ? curriculum.sections
        .flatMap((s) => s.topics)
        .find((t) => t.id === selectedTopic)
    : null;

  // Topic name for header

  const handlePracticeAnswer = (questionId: string, answerIndex: number | string) => {
    const newAnswers = new Map(practiceAnswers);
    newAnswers.set(questionId, answerIndex);
    setPracticeAnswers(newAnswers);
  };

  // Locks in answers for the current batch of 5 and reveals per-question explanations
  const handleSubmitPage = (page: number) => {
    setSubmittedPages(new Set([...submittedPages, page]));
  };

  const handleRetryTopic = () => {
    setPracticeAnswers(new Map());
    setSubmittedPages(new Set());
    setEssayEvaluations({});
    setCurrentPage(1);
  };

  const evaluateEssay = async (question: PracticeQuestion, essayText: string) => {
    if (!essayText.trim() || essayText.trim().length < 50) {
      alert('Please write at least 50 characters for your essay.');
      return;
    }

    setEvaluatingEssays(new Set([...evaluatingEssays, question.id]));

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const response = await fetch(`${baseURL}/essay/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          essay_response: essayText,
          rubric: question.rubric || 'Standard rubric',
          difficulty: question.difficulty,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Evaluation failed: ${error.detail || 'Unknown error'}`);
        return;
      }

      const feedback = await response.json();
      setEssayEvaluations({ ...essayEvaluations, [question.id]: feedback });
    } catch (error) {
      console.error('Essay evaluation error:', error);
      alert('Failed to evaluate essay. Please try again.');
    } finally {
      setEvaluatingEssays(new Set([...evaluatingEssays].filter(id => id !== question.id)));
    }
  };

  // Questions belonging to a given page (batch of 5)
  const getPageQuestions = (page: number) =>
    currentPracticeQuestions.slice((page - 1) * questionsPerPage, page * questionsPerPage);

  const totalPages = Math.max(1, Math.ceil(currentPracticeQuestions.length / questionsPerPage));

  // Score is based only on batches the student has actually submitted so far,
  // so a full score summary is available without requiring every question to be answered.
  const calculatePracticeScore = () => {
    let correct = 0;
    let total = 0;
    submittedPages.forEach((page) => {
      getPageQuestions(page).forEach((q) => {
        if (q.isEssay) return;
        total++;
        if (practiceAnswers.get(q.id) === q.correctAnswer) {
          correct++;
        }
      });
    });
    // Essays count once evaluated, independent of batch submission
    const essayQuestions = currentPracticeQuestions.filter((q) => q.isEssay);
    const evaluatedEssays = essayQuestions.filter((q) => essayEvaluations[q.id]).length;

    const combinedTotal = total + evaluatedEssays;
    return {
      correct: correct + evaluatedEssays,
      total: combinedTotal,
      percentage: combinedTotal > 0 ? Math.round(((correct + evaluatedEssays) / combinedTotal) * 100) : 0,
    };
  };

  // Helper function to parse Markdown and convert to React elements
  const parseMarkdown = (text: string) => {
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;

    // Pattern to match **bold** and *italic*
    const markdownRegex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let match;

    while ((match = markdownRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add formatted text
      if (match[1]) {
        // **bold**
        parts.push(
          <strong key={`bold-${lastIndex}`} style={{ fontWeight: '700' }}>
            {match[1]}
          </strong>
        );
      } else if (match[2]) {
        // *italic*
        parts.push(
          <em key={`italic-${lastIndex}`} style={{ fontStyle: 'italic' }}>
            {match[2]}
          </em>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Left Sidebar */}
      <div
        style={{
          width: '280px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
          padding: '24px 0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <Link href={`/exams/${examId}`} style={{ color: '#3a6ea5', textDecoration: 'none', fontSize: '12px' }}>
            ← Back
          </Link>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginTop: '12px', marginBottom: '4px' }}>
            {exam.displayName} Practice
          </h2>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px 0' }}>
            Master each topic
          </p>
          <Link
            href={`/exams/${examId}/tutor`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: exam.lightColor,
              color: exam.primaryColor,
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            🧑‍🏫 Ask the AI Tutor →
          </Link>
        </div>

        {/* Modules/Sections */}
        {curriculum.sections.map((section) => (
          <div key={section.id} style={{ marginBottom: '24px' }}>
            <div style={{ padding: '0 24px', marginBottom: '12px' }}>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  letterSpacing: '0.5px',
                  margin: '0',
                }}
              >
                {section.name}
              </h3>
            </div>

            {/* Topics in Section */}
            {section.topics.map((topic) => {
              const isSelected = selectedTopic === topic.id;

              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: isSelected ? '#f0f4ff' : 'transparent',
                    borderLeft: `4px solid ${isSelected ? exam.primaryColor : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    color: isSelected ? exam.primaryColor : '#374151',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#fafbfc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{topic.icon}</span>
                    <span style={{ fontWeight: isSelected ? '600' : '500', fontSize: '13px' }}>
                      {topic.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {currentTopic ? (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Topic Header */}
            <div
              style={{
                padding: '40px 32px 32px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  color: '#1a1a1a',
                }}
              >
                {currentTopic.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#6b7280' }}>
                <span>{currentPracticeQuestions.length} practice questions</span>
                <span>•</span>
                <span>Ready to practice</span>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                padding: '0 32px',
              }}
            >
              {(['reading', 'practice'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '16px 24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: viewMode === mode ? `3px solid ${exam.primaryColor}` : '3px solid transparent',
                    color: viewMode === mode ? exam.primaryColor : '#6b7280',
                    fontWeight: viewMode === mode ? '600' : '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  {mode === 'reading' && '📖 Cheatsheet'}
                  {mode === 'practice' && '✏️ Practice Questions'}
                </button>
              ))}
            </div>

            {/* Content Based on View Mode */}
            <div style={{ padding: '32px' }}>
              {/* READING MATERIALS VIEW */}
              {viewMode === 'reading' && currentReadingMaterial && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px' }}>
                  <div style={{ marginBottom: '32px' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                      ⏱️ Estimated reading time: {currentReadingMaterial.estimatedReadTime} minutes
                    </p>
                  </div>

                  {/* Reading Sections */}
                  {currentReadingMaterial.sections.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: '32px' }}>
                      <h2
                        style={{
                          fontSize: '22px',
                          fontWeight: '700',
                          color: '#1a1a1a',
                          marginBottom: '12px',
                          marginTop: idx === 0 ? '0' : '24px',
                        }}
                      >
                        {parseMarkdown(section.heading)}
                      </h2>
                      <div
                        style={{
                          fontSize: '15px',
                          lineHeight: '1.8',
                          color: '#374151',
                          whiteSpace: 'pre-wrap',
                          marginBottom: '16px',
                        }}
                      >
                        {parseMarkdown(section.content)}
                      </div>

                      {/* Examples */}
                      {section.examples && section.examples.length > 0 && (
                        <div
                          style={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '16px',
                            marginTop: '12px',
                          }}
                        >
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '0 0 12px 0' }}>
                            Examples:
                          </p>
                          {section.examples.map((example, exIdx) => (
                            <p
                              key={exIdx}
                              style={{
                                fontSize: '14px',
                                color: '#4b5563',
                                margin: '8px 0',
                                paddingLeft: '16px',
                                borderLeft: `2px solid ${exam.primaryColor}`,
                              }}
                            >
                              {parseMarkdown(example)}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Key Points */}
                  {currentReadingMaterial.keyPoints && currentReadingMaterial.keyPoints.length > 0 && (
                    <div
                      style={{
                        marginTop: '40px',
                        paddingTop: '24px',
                        borderTop: '2px solid #e5e7eb',
                      }}
                    >
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
                        Key Points to Remember
                      </h3>
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: '0',
                          margin: '0',
                        }}
                      >
                        {currentReadingMaterial.keyPoints.map((point, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: '14px',
                              color: '#374151',
                              marginBottom: '12px',
                              paddingLeft: '24px',
                              position: 'relative',
                            }}
                          >
                            <span style={{ position: 'absolute', left: '0', color: exam.primaryColor, fontWeight: '700' }}>
                              ✓
                            </span>
                            {parseMarkdown(point)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <button
                      onClick={() => setViewMode('practice')}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: exam.primaryColor,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 200ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      Practice Questions →
                    </button>
                  </div>
                </div>
              )}

              {/* PRACTICE QUESTIONS VIEW */}
              {viewMode === 'practice' && currentPracticeQuestions.length > 0 && (
                <div>
                  {(() => {
                    const score = calculatePracticeScore();
                    const pageQuestions = getPageQuestions(currentPage);
                    const isPageSubmitted = submittedPages.has(currentPage);
                    const pageMcqQuestions = pageQuestions.filter((q) => !q.isEssay);
                    const allPageMcqAnswered = pageMcqQuestions.every((q) => practiceAnswers.has(q.id));
                    const canSubmitPage = pageMcqQuestions.length > 0 && allPageMcqAnswered;
                    const isLastPage = currentPage === totalPages;
                    const hasProgress = submittedPages.size > 0 || Object.keys(essayEvaluations).length > 0;

                    return (
                      <>
                        {/* Running Score Banner - reflects only batches submitted so far */}
                        {hasProgress && (
                          <div
                            style={{
                              marginBottom: '24px',
                              padding: '16px 20px',
                              backgroundColor: '#ffffff',
                              border: `2px solid ${exam.primaryColor}`,
                              borderRadius: '8px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px',
                            }}
                          >
                            <div>
                              <span style={{ fontSize: '20px', fontWeight: '700', color: exam.primaryColor }}>
                                {score.percentage}%
                              </span>
                              <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '10px' }}>
                                {score.correct} of {score.total} correct so far ({submittedPages.size} of {totalPages} batches submitted)
                              </span>
                            </div>
                            {submittedPages.size === totalPages && (
                              <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                                🎉 Practice complete!
                              </span>
                            )}
                          </div>
                        )}

                        {/* Pagination Info */}
                        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                            Showing questions {(currentPage - 1) * questionsPerPage + 1} - {Math.min(currentPage * questionsPerPage, currentPracticeQuestions.length)} of {currentPracticeQuestions.length}
                          </p>
                        </div>

                        {pageQuestions.map((question, qIdx) => {
                          const userAnswer = practiceAnswers.get(question.id);
                          const isAnswered = userAnswer !== undefined;
                          const globalIndex = (currentPage - 1) * questionsPerPage + qIdx;
                          const isCorrect = isPageSubmitted && !question.isEssay && userAnswer === question.correctAnswer;

                          return (
                            <div
                              key={question.id}
                              style={{
                                marginBottom: '24px',
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                border: `2px solid ${
                                  isPageSubmitted && !question.isEssay
                                    ? isCorrect ? '#86efac' : '#fca5a5'
                                    : isAnswered ? exam.primaryColor : '#e5e7eb'
                                }`,
                                borderRadius: '8px',
                                transition: 'all 200ms ease',
                              }}
                            >
                              <div style={{ marginBottom: '16px' }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '12px',
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      backgroundColor: exam.lightColor,
                                      color: exam.primaryColor,
                                      padding: '4px 10px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    Q{globalIndex + 1}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      padding: '4px 10px',
                                      borderRadius: '4px',
                                      backgroundColor: '#f3f4f6',
                                      color: '#6b7280',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {question.difficulty}
                                  </span>
                                  {isPageSubmitted && !question.isEssay && (
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: isCorrect ? '#059669' : '#dc2626' }}>
                                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </span>
                                  )}
                                </div>
                                <h4
                                  style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    margin: '0',
                                    lineHeight: '1.6',
                                  }}
                                >
                                  {question.question}
                                </h4>
                                {question.passage && (
                                  <blockquote
                                    style={{
                                      margin: '12px 0 0 0',
                                      padding: '12px 16px',
                                      borderLeft: '4px solid #3A6EA5',
                                      background: '#f8fafc',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      fontWeight: '400',
                                      color: '#374151',
                                      lineHeight: '1.7',
                                      whiteSpace: 'pre-wrap',
                                    }}
                                  >
                                    {question.passage}
                                  </blockquote>
                                )}
                              </div>

                              {/* Answer Options (Multiple Choice) or Text Area (Essay) */}
                              {!question.isEssay ? (
                                <div>
                                  {question.options && question.options.map((option, optIdx) => {
                                    const isSelected = userAnswer === optIdx;
                                    const isCorrectOption = optIdx === question.correctAnswer;
                                    let borderColor = isSelected ? exam.primaryColor : '#e5e7eb';
                                    let bgColor = isSelected ? exam.lightColor : '#ffffff';
                                    let textColor = isSelected ? exam.primaryColor : '#374151';

                                    if (isPageSubmitted) {
                                      if (isCorrectOption) {
                                        borderColor = '#22c55e';
                                        bgColor = '#f0fdf4';
                                        textColor = '#059669';
                                      } else if (isSelected) {
                                        borderColor = '#ef4444';
                                        bgColor = '#fef2f2';
                                        textColor = '#dc2626';
                                      } else {
                                        borderColor = '#e5e7eb';
                                        bgColor = '#ffffff';
                                        textColor = '#9ca3af';
                                      }
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        onClick={() => !isPageSubmitted && handlePracticeAnswer(question.id, optIdx)}
                                        disabled={isPageSubmitted}
                                        style={{
                                          width: '100%',
                                          padding: '12px 16px',
                                          marginBottom: '8px',
                                          textAlign: 'left',
                                          border: `2px solid ${borderColor}`,
                                          backgroundColor: bgColor,
                                          borderRadius: '6px',
                                          cursor: isPageSubmitted ? 'default' : 'pointer',
                                          fontSize: '14px',
                                          fontWeight: isSelected ? '600' : '500',
                                          color: textColor,
                                          transition: 'all 200ms ease',
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isPageSubmitted && !isSelected) {
                                            e.currentTarget.style.backgroundColor = '#f9fafb';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isPageSubmitted && !isSelected) {
                                            e.currentTarget.style.backgroundColor = '#ffffff';
                                          }
                                        }}
                                      >
                                        <span style={{ marginRight: '12px', fontWeight: '700' }}>
                                          {String.fromCharCode(65 + optIdx)}.
                                        </span>
                                        {option}
                                        {isPageSubmitted && isCorrectOption && (
                                          <span style={{ marginLeft: '8px', fontWeight: '700' }}>✓</span>
                                        )}
                                      </button>
                                    );
                                  })}

                                  {/* Explanation - revealed immediately once this batch is submitted */}
                                  {isPageSubmitted && (
                                    <div
                                      style={{
                                        marginTop: '12px',
                                        padding: '14px 16px',
                                        backgroundColor: '#f9fafb',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', margin: '0 0 6px 0' }}>
                                        Explanation:
                                      </p>
                                      <p style={{ fontSize: '13px', color: '#374151', margin: '0', lineHeight: '1.6' }}>
                                        {question.explanation}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  {/* Essay Question - Text Area */}
                                  <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                      Your Essay Response (min. 50 characters):
                                    </label>
                                    <textarea
                                      value={(practiceAnswers.get(question.id) || '') as string}
                                      onChange={(e) => handlePracticeAnswer(question.id, e.target.value)}
                                      placeholder="Write your essay response here..."
                                      style={{
                                        width: '100%',
                                        minHeight: '200px',
                                        padding: '12px',
                                        border: `2px solid #e5e7eb`,
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        boxSizing: 'border-box',
                                      }}
                                    />
                                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '8px 0 0 0' }}>
                                      Character count: {((practiceAnswers.get(question.id) || '') as string).length}
                                    </p>
                                  </div>

                                  {/* Evaluate Button */}
                                  <button
                                    onClick={() => evaluateEssay(question, (practiceAnswers.get(question.id) || '') as string)}
                                    disabled={
                                      evaluatingEssays.has(question.id) ||
                                      !((practiceAnswers.get(question.id) || '') as string).trim() ||
                                      ((practiceAnswers.get(question.id) || '') as string).trim().length < 50
                                    }
                                    style={{
                                      padding: '10px 20px',
                                      backgroundColor:
                                        evaluatingEssays.has(question.id) || !((practiceAnswers.get(question.id) || '') as string).trim() || ((practiceAnswers.get(question.id) || '') as string).trim().length < 50
                                          ? '#d1d5db'
                                          : exam.primaryColor,
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontWeight: '600',
                                      cursor:
                                        evaluatingEssays.has(question.id) ||
                                        !((practiceAnswers.get(question.id) || '') as string).trim() ||
                                        ((practiceAnswers.get(question.id) || '') as string).trim().length < 50
                                          ? 'not-allowed'
                                          : 'pointer',
                                      fontSize: '14px',
                                    }}
                                  >
                                    {evaluatingEssays.has(question.id) ? '⏳ Evaluating...' : '📝 Submit & Evaluate Essay'}
                                  </button>

                                  {/* Evaluation Results - shown immediately after submission */}
                                  {essayEvaluations[question.id] && (
                                    <div
                                      style={{
                                        marginTop: '20px',
                                        padding: '16px',
                                        backgroundColor: '#f0fdf4',
                                        border: `2px solid #86efac`,
                                        borderRadius: '6px',
                                      }}
                                    >
                                      <div style={{ marginBottom: '16px' }}>
                                        <h5 style={{ fontSize: '16px', fontWeight: '700', color: '#059669', margin: '0 0 8px 0' }}>
                                          Evaluation Score: {essayEvaluations[question.id].score}/100
                                        </h5>
                                        <div
                                          style={{
                                            width: '100%',
                                            height: '8px',
                                            backgroundColor: '#d1fae5',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <div
                                            style={{
                                              height: '100%',
                                              width: `${essayEvaluations[question.id].score}%`,
                                              backgroundColor: '#059669',
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* Strengths */}
                                      {essayEvaluations[question.id].strengths && essayEvaluations[question.id].strengths.length > 0 && (
                                        <div style={{ marginBottom: '12px' }}>
                                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#047857', margin: '0 0 6px 0' }}>
                                            ✓ Strengths:
                                          </p>
                                          <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#065f46' }}>
                                            {essayEvaluations[question.id].strengths.map((strength, idx) => (
                                              <li key={idx} style={{ marginBottom: '4px' }}>
                                                {strength}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Weaknesses */}
                                      {essayEvaluations[question.id].weaknesses && essayEvaluations[question.id].weaknesses.length > 0 && (
                                        <div style={{ marginBottom: '12px' }}>
                                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#dc2626', margin: '0 0 6px 0' }}>
                                            ✗ Areas for Improvement:
                                          </p>
                                          <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#7f1d1d' }}>
                                            {essayEvaluations[question.id].weaknesses.map((weakness, idx) => (
                                              <li key={idx} style={{ marginBottom: '4px' }}>
                                                {weakness}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Suggestions */}
                                      {essayEvaluations[question.id].suggestions && essayEvaluations[question.id].suggestions.length > 0 && (
                                        <div>
                                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#0369a1', margin: '0 0 6px 0' }}>
                                            💡 Suggestions:
                                          </p>
                                          <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#0c4a6e' }}>
                                            {essayEvaluations[question.id].suggestions.map((suggestion, idx) => (
                                              <li key={idx} style={{ marginBottom: '4px' }}>
                                                {suggestion}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Detailed Feedback */}
                                      {essayEvaluations[question.id].detailed_feedback && (
                                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #a7f3d0' }}>
                                          <p style={{ fontSize: '12px', color: '#065f46', lineHeight: '1.5', margin: '0' }}>
                                            {essayEvaluations[question.id].detailed_feedback}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Pagination + Batch Submit Controls */}
                        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              style={{
                                padding: '10px 16px',
                                backgroundColor: currentPage === 1 ? '#d1d5db' : '#ffffff',
                                color: currentPage === 1 ? '#9ca3af' : exam.primaryColor,
                                border: `2px solid ${currentPage === 1 ? '#e5e7eb' : exam.primaryColor}`,
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                              }}
                            >
                              ← Previous
                            </button>
                            <button
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={isLastPage}
                              style={{
                                padding: '10px 16px',
                                backgroundColor: isLastPage ? '#d1d5db' : exam.primaryColor,
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: isLastPage ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                              }}
                            >
                              Next →
                            </button>
                          </div>

                          {/* Batch submit / advance / restart button (MCQ-only batches) */}
                          {pageMcqQuestions.length > 0 && (
                            !isPageSubmitted ? (
                              <button
                                onClick={() => handleSubmitPage(currentPage)}
                                disabled={!canSubmitPage}
                                style={{
                                  padding: '12px 32px',
                                  backgroundColor: canSubmitPage ? exam.primaryColor : '#d1d5db',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  cursor: canSubmitPage ? 'pointer' : 'not-allowed',
                                  fontSize: '15px',
                                  transition: 'all 200ms ease',
                                }}
                              >
                                Submit These {pageMcqQuestions.length} Questions
                              </button>
                            ) : isLastPage ? (
                              <button
                                onClick={handleRetryTopic}
                                style={{
                                  padding: '12px 32px',
                                  backgroundColor: exam.primaryColor,
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  fontSize: '15px',
                                  transition: 'all 200ms ease',
                                }}
                              >
                                🔁 Try Again From Start
                              </button>
                            ) : (
                              <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                style={{
                                  padding: '12px 32px',
                                  backgroundColor: exam.primaryColor,
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  fontSize: '15px',
                                  transition: 'all 200ms ease',
                                }}
                              >
                                Next 5 Questions →
                              </button>
                            )
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <p>Select a topic to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
