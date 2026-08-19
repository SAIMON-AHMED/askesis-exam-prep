'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCurriculumByExamId } from '@/lib/curriculumData';
import { getLearningMaterialByTopicAndExam } from '@/lib/learningMaterialsData';
import QuestionCard from '@/components/practice/QuestionCard';
import { GenerateQuestionsDialog } from '@/components/GenerateQuestionsDialog';
import { GeneratedQuestion } from '@/lib/questionGeneration';

interface CompletionScreenProps {
  score: number;
  total: number;
  topicId: string;
  topicName: string;
  examId: string;
  examPrimaryColor: string;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  score,
  total,
  topicId,
  topicName,
  examId,
  examPrimaryColor
}) => {
  const percentage = Math.round((score / total) * 100);
  const performanceMessage = percentage >= 80
    ? 'Excellent work!'
    : percentage >= 60
    ? 'Good effort! Review the material for improvement.'
    : 'Keep practicing! Review the key concepts.';

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: `2px solid ${examPrimaryColor}`,
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: '700',
          color: examPrimaryColor,
          marginBottom: '12px'
        }}>
          {percentage}%
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '8px'
        }}>
          Quiz Complete!
        </h2>

        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '24px'
        }}>
          You scored {score} out of {total} questions correctly.
        </p>

        <div style={{
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <p style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937'
          }}>
            {performanceMessage}
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Link
            href={`/exams/${examId}/topic/${topicId}`}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#F3F4F6',
              color: '#1F2937',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'background-color 0.2s',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              width: '100%',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              (e.target as any).style.backgroundColor = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              (e.target as any).style.backgroundColor = '#F3F4F6';
            }}
          >
            ← Back to {topicName}
          </Link>

          <Link
            href={`/exams/${examId}/curriculum`}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: examPrimaryColor,
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'opacity 0.2s',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              width: '100%',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              (e.target as any).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              (e.target as any).style.opacity = '1';
            }}
          >
            Continue to Curriculum
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function PracticePage() {
  const params = useParams();
  const examId = params?.examId as string;
  let topicId = params?.topicId as string;
  
  // Normalize topicId: remove exam prefix if present
  if (topicId?.startsWith(examId + '-')) {
    topicId = topicId.substring(examId.length + 1);
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isShowingGenerated, setIsShowingGenerated] = useState(false);

  // Fetch curriculum to get topic info and exam color
  const curriculum = getCurriculumByExamId(examId);
  const topic = curriculum.sections
    .flatMap(s => s.topics)
    .find(t => t.id === topicId);

  // Fetch learning materials which includes questions
  const material = getLearningMaterialByTopicAndExam(topicId, examId);
  const defaultQuestions = material.questions;
  
  // Use generated questions if available, otherwise use default questions
  const questions = isShowingGenerated && generatedQuestions.length > 0
    ? generatedQuestions.map(q => ({
        id: q.id,
        question: q.question_text,
        options: q.options ? [
          { label: 'A', text: q.options.A || '' },
          { label: 'B', text: q.options.B || '' },
          { label: 'C', text: q.options.C || '' },
          { label: 'D', text: q.options.D || '' }
        ] : [],
        correctAnswer: q.correct_answer,
        explanation: q.explanation
      }))
    : defaultQuestions;

  // Determine exam primary color
  const examColorMap: { [key: string]: string } = {
    sat: '#4F46E5',    // Indigo
    act: '#06B6D4',    // Cyan
    gre: '#8B5CF6',    // Violet
    gmat: '#10B981',   // Emerald
    shsat: '#F97316',  // Orange
    regents: '#DC2626' // Red
  };
  const examPrimaryColor = examColorMap[examId] || '#4F46E5';

  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  const handleAnswerSelect = (optionLabel: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionLabel;
    setSelectedAnswers(newAnswers);
  };

  const handleQuestionsGenerated = (newQuestions: GeneratedQuestion[]) => {
    setGeneratedQuestions(newQuestions);
    setIsShowingGenerated(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setIsQuizComplete(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete
      const correctCount = selectedAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length;
      setIsQuizComplete(true);
    }
  };

  if (!topic || !currentQuestion) {
    return (
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ color: '#6B7280' }}>Loading...</p>
      </main>
    );
  }

  if (isQuizComplete) {
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;

    return (
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <CompletionScreen
          score={correctCount}
          total={questions.length}
          topicId={topicId}
          topicName={topic.name}
          examId={examId}
          examPrimaryColor={examPrimaryColor}
        />
      </main>
    );
  }

  return (
    <main style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href={`/exams/${examId}/topic/${topicId}`}
            style={{
              display: 'inline-block',
              color: examPrimaryColor,
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.target as any).style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              (e.target as any).style.opacity = '1';
            }}
          >
            ← Back to {topic.name}
          </Link>

          {isShowingGenerated && (
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: '#DDD6FE',
              color: '#4F46E5',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              ✨ Fresh Question
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {isShowingGenerated && (
            <button
              onClick={() => {
                setIsShowingGenerated(false);
                setCurrentQuestionIndex(0);
                setSelectedAnswers([]);
                setIsQuizComplete(false);
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#E5E7EB',
                color: '#1F2937',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as any).style.backgroundColor = '#D1D5DB';
              }}
              onMouseLeave={(e) => {
                (e.target as any).style.backgroundColor = '#E5E7EB';
              }}
            >
              ← Back to Original
            </button>
          )}

          <button
            onClick={() => setIsGenerateDialogOpen(true)}
            style={{
              padding: '10px 16px',
              backgroundColor: examPrimaryColor,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              (e.target as any).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              (e.target as any).style.opacity = '1';
            }}
          >
            ✨ Generate AI Questions
          </button>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={selectedAnswers[currentQuestionIndex] || null}
        isAnswered={isCurrentQuestionAnswered}
        examPrimaryColor={examPrimaryColor}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '32px',
        gap: '16px'
      }}>
        <button
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1);
            }
          }}
          disabled={currentQuestionIndex === 0}
          style={{
            padding: '12px 24px',
            backgroundColor: currentQuestionIndex === 0 ? '#E5E7EB' : '#FFFFFF',
            color: currentQuestionIndex === 0 ? '#9CA3AF' : '#1F2937',
            border: `1px solid ${currentQuestionIndex === 0 ? '#E5E7EB' : '#D1D5DB'}`,
            borderRadius: '8px',
            fontWeight: '600',
            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (currentQuestionIndex > 0) {
              (e.target as any).style.backgroundColor = '#F3F4F6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentQuestionIndex > 0) {
              (e.target as any).style.backgroundColor = '#FFFFFF';
            }
          }}
        >
          ← Previous
        </button>

        <button
          onClick={handleNextQuestion}
          disabled={!isCurrentQuestionAnswered}
          style={{
            padding: '12px 24px',
            backgroundColor: isCurrentQuestionAnswered ? examPrimaryColor : '#E5E7EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: isCurrentQuestionAnswered ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => {
            if (isCurrentQuestionAnswered) {
              (e.target as any).style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            if (isCurrentQuestionAnswered) {
              (e.target as any).style.opacity = '1';
            }
          }}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete Quiz' : 'Next →'}
        </button>
      </div>

      {/* Answer summary at bottom */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        border: '1px solid #E5E7EB'
      }}>
        <p style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#6B7280',
          marginBottom: '12px'
        }}>
          Progress: {selectedAnswers.filter(a => a !== undefined).length} of {questions.length} answered
        </p>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {questions.map((_, index) => (
            <div
              key={index}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
                backgroundColor: selectedAnswers[index]
                  ? selectedAnswers[index] === questions[index].correctAnswer
                    ? '#D1FAE5'
                    : '#FEE2E2'
                  : '#E5E7EB',
                color: selectedAnswers[index]
                  ? selectedAnswers[index] === questions[index].correctAnswer
                    ? '#059669'
                    : '#DC2626'
                  : '#6B7280',
                border: currentQuestionIndex === index ? `2px solid ${examPrimaryColor}` : '1px solid transparent',
                transition: 'all 0.2s'
              }}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <GenerateQuestionsDialog
        examId={examId}
        topicId={topicId}
        topicName={topic.name}
        isOpen={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        onQuestionsGenerated={handleQuestionsGenerated}
      />
    </main>
  );
}
