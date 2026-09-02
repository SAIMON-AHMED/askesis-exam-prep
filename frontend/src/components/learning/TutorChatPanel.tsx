'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { TopicLesson, LessonStatus, MicroQuizResult } from '@/types/curriculum';
import { LessonMicroQuiz } from './LessonMicroQuiz';

const MarkdownMessage = dynamic(() => import('@/components/common/MarkdownMessage'), {
  ssr: false,
  loading: () => null,
});

type ChatBubble =
  | { id: string; role: 'user'; kind: 'text'; content: string }
  | { id: string; role: 'assistant'; kind: 'text'; content: string }
  | { id: string; role: 'assistant'; kind: 'quiz'; stepNumber: number }
  | { id: string; role: 'assistant'; kind: 'continue' };

interface TutorChatPanelProps {
  examId: string;
  topicId: string;
  topicName: string;
  /** null when this topic has no deterministic lesson yet — falls back to freeform chat only. */
  lesson: TopicLesson | null;
}

let chatBubbleSeq = 0;
const nextChatBubbleId = () => `bubble-${++chatBubbleSeq}`;

/**
 * "AI Tutor" chat-driven Study Mode: deterministic lesson content (explanation, worked
 * example, micro-quiz) delivered as a conversation, with freeform Q&A woven into the
 * same thread via the existing /assistant/chat endpoint.
 */
export const TutorChatPanel: React.FC<TutorChatPanelProps> = ({ examId, topicId, topicName, lesson }) => {
  const router = useRouter();
  const [bubbles, setBubbles] = useState<ChatBubble[]>([]);
  const [started, setStarted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBubbles([]);
    setStarted(false);
    setCurrentStepIndex(0);
  }, [topicId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bubbles]);

  const saveProgress = async (status: LessonStatus, stepIndex: number, quizResult?: MicroQuizResult) => {
    if (!lesson) return;
    try {
      await api.post(`/lessons/${lesson.id}/progress`, {
        topic: topicName,
        exam_type: examId,
        status,
        current_step: stepIndex,
        micro_quiz_result: quizResult
          ? {
              step_number: quizResult.stepNumber,
              correct: quizResult.correct,
              attempts: quizResult.attempts,
              hints_used: quizResult.hintsUsed,
            }
          : undefined,
      });
    } catch {
      // Non-blocking: progress tracking should never interrupt the lesson.
    }
  };

  const teachStep = (stepIndex: number) => {
    if (!lesson) return;
    const step = lesson.steps[stepIndex];
    const parts: ChatBubble[] = [
      { id: nextChatBubbleId(), role: 'assistant', kind: 'text', content: `**${step.title}**\n\n${step.contentMarkdown}` },
    ];
    if (step.workedExample) {
      const ex = step.workedExample;
      parts.push({
        id: nextChatBubbleId(),
        role: 'assistant',
        kind: 'text',
        content: `**Worked Example**\n\n${ex.problem}\n\n${ex.stepByStepSolution
          .map((line, i) => `${i + 1}. ${line}`)
          .join('\n')}\n\n💡 ${ex.takeaway}`,
      });
    }
    if (step.checkQuestion) {
      parts.push({ id: nextChatBubbleId(), role: 'assistant', kind: 'quiz', stepNumber: step.stepNumber });
    } else {
      parts.push({ id: nextChatBubbleId(), role: 'assistant', kind: 'continue' });
    }
    setBubbles((prev) => [...prev, ...parts]);
  };

  const handleStart = () => {
    setStarted(true);
    setBubbles([{ id: nextChatBubbleId(), role: 'user', kind: 'text', content: `Teach me — ${topicName}` }]);
    saveProgress('in_progress', 0);

    if (!lesson) {
      setBubbles((prev) => [
        ...prev,
        {
          id: nextChatBubbleId(),
          role: 'assistant',
          kind: 'text',
          content: `Structured lessons for **${topicName}** are coming soon! Ask me anything about it in the meantime.`,
        },
      ]);
      return;
    }
    teachStep(0);
  };

  const handleQuizResult = (result: MicroQuizResult) => {
    if (!lesson) return;
    const step = lesson.steps[currentStepIndex];
    const withStep = { ...result, stepNumber: step.stepNumber };
    saveProgress('in_progress', currentStepIndex, withStep);
    if (result.correct) {
      setBubbles((prev) => [...prev, { id: nextChatBubbleId(), role: 'assistant', kind: 'continue' }]);
    }
  };

  const handleContinue = () => {
    if (!lesson) return;
    const isLastStep = currentStepIndex >= lesson.steps.length - 1;
    if (isLastStep) {
      saveProgress('completed', currentStepIndex);
      setBubbles((prev) => [
        ...prev,
        {
          id: nextChatBubbleId(),
          role: 'assistant',
          kind: 'text',
          content: `🎉 Nice work — you've finished **${topicName}**! Ready to put it into practice?`,
        },
      ]);
      return;
    }
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    teachStep(nextIndex);
  };

  const handleSkipToPractice = async () => {
    if (lesson) await saveProgress('tested_out', currentStepIndex);
    router.push(`/practice?exam=${encodeURIComponent(examId)}&topic=${encodeURIComponent(topicId)}`);
  };

  const handleGoToPractice = () => {
    router.push(`/practice?exam=${encodeURIComponent(examId)}&topic=${encodeURIComponent(topicId)}`);
  };

  const sendFreeText = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userBubble: ChatBubble = { id: nextChatBubbleId(), role: 'user', kind: 'text', content: trimmed };
    setBubbles((prev) => [...prev, userBubble]);
    setInput('');
    setIsSending(true);

    const stepContext = lesson
      ? ` They are on step ${currentStepIndex + 1} ("${lesson.steps[currentStepIndex]?.title}").`
      : '';
    try {
      const history = bubbles
        .filter((b): b is Extract<ChatBubble, { kind: 'text' }> => b.kind === 'text')
        .slice(-10)
        .map((b) => ({ role: b.role, content: b.content }));

      const response = await api.post('/assistant/chat', {
        message: trimmed,
        context: `Student is in AI Tutor mode for topic "${topicName}" (${examId.toUpperCase()}).${stepContext}`,
        history,
      });
      setBubbles((prev) => [
        ...prev,
        { id: nextChatBubbleId(), role: 'assistant', kind: 'text', content: response.data.reply },
      ]);
    } catch {
      setBubbles((prev) => [
        ...prev,
        { id: nextChatBubbleId(), role: 'assistant', kind: 'text', content: "Sorry, I couldn't reach the tutor. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const isFinished =
    lesson &&
    currentStepIndex >= lesson.steps.length - 1 &&
    bubbles.some(
      (b) => b.kind === 'text' && b.role === 'assistant' && b.content.includes("Ready to put it into practice")
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '480px' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f9fafb' }}>
        {!started && (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6b7280' }}>
            <p style={{ fontSize: '15px', marginBottom: '16px' }}>
              Ready to learn <strong>{topicName}</strong>?
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={handleStart}
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Teach me — {topicName} →
            </button>
          </div>
        )}

        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            style={{
              display: 'flex',
              justifyContent: bubble.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '14px',
            }}
          >
            {bubble.kind === 'text' && (
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  backgroundColor: bubble.role === 'user' ? '#3A6EA5' : '#ffffff',
                  color: bubble.role === 'user' ? '#ffffff' : '#1a1a1a',
                  border: bubble.role === 'assistant' ? '1px solid #e5e7eb' : 'none',
                }}
              >
                {bubble.role === 'user' ? bubble.content : <MarkdownMessage content={bubble.content} />}
              </div>
            )}

            {bubble.kind === 'quiz' && lesson && (
              <div style={{ maxWidth: '90%', width: '100%' }}>
                <LessonMicroQuiz
                  quiz={lesson.steps[currentStepIndex].checkQuestion!}
                  onResult={handleQuizResult}
                  onAskTutor={() =>
                    setInput(`Can you explain "${lesson.steps[currentStepIndex].title}" a different way?`)
                  }
                />
              </div>
            )}

            {bubble.kind === 'continue' && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleContinue}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Continue →
              </button>
            )}
          </div>
        ))}

        {isFinished && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleGoToPractice}
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              🚀 Go to Practice
            </button>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input + skip-to-practice (soft gate: always reachable) */}
      <div style={{ borderTop: '1px solid #e5e7eb', padding: '12px 16px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendFreeText();
              }
            }}
            placeholder={started ? 'Ask a question...' : `Teach me — ${topicName}`}
            style={{ flex: 1, margin: 0, fontSize: '14px' }}
          />
          <button
            type="button"
            onClick={started ? sendFreeText : handleStart}
            disabled={isSending}
            className="btn-primary"
            style={{ padding: '10px 16px', minHeight: 'auto' }}
            aria-label="Send"
          >
            ↑
          </button>
        </div>
        <button
          type="button"
          onClick={handleSkipToPractice}
          style={{
            marginTop: '8px',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            fontSize: '12px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Skip to practice →
        </button>
      </div>
    </div>
  );
};
