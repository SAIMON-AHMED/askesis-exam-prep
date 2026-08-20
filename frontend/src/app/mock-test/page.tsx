"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { getExam } from "@/lib/examConstants";
import { getCurriculumByExamId } from "@/lib/curriculumData";
import VisualAid, { VisualAidData } from "@/components/VisualAid";

interface ExamQuestion {
  id: string;
  question_text: string;
  options: Record<string, string> | null;
  topic: string;
  difficulty: number;
  visual_aid?: VisualAidData | null;
}

interface ExamSession {
  id: string;
  exam_type: string;
  duration_seconds: number;
  status: string;
  total_questions: number;
  started_at: string;
  questions: ExamQuestion[];
}

interface TopicBreakdown {
  topic: string;
  correct: number;
  total: number;
}

interface ExamResult {
  id: string;
  raw_score: number;
  total_questions: number;
  scaled_score_low: number | null;
  scaled_score_high: number | null;
  topic_breakdown: TopicBreakdown[];
  status: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ExamPageInner() {
  const searchParams = useSearchParams();
  const examParam = searchParams.get("exam") || "";
  const mockNumber = searchParams.get("mock");
  const examDef = getExam(examParam);
  const examType = examDef?.displayName || "SAT";
  const pageTitle = mockNumber
    ? `${examType} Mock Test ${mockNumber}`
    : examDef
    ? `${examType} Timed Exam`
    : "Timed Exam";

  const [numQuestions, setNumQuestions] = useState(() =>
    clamp(Number(searchParams.get("questions")) || 10, 5, 60)
  );
  const [durationMinutes, setDurationMinutes] = useState(() =>
    clamp(Number(searchParams.get("duration")) || 15, 5, 240)
  );
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || session.status !== "in_progress") return;
    const startedAtMs = new Date(session.started_at).getTime();
    const tick = () => {
      const elapsed = (Date.now() - startedAtMs) / 1000;
      const remaining = Math.max(0, session.duration_seconds - elapsed);
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        handleSubmit();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function startExam() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const topics = examDef
        ? getCurriculumByExamId(examDef.id).sections.flatMap((s) => s.topics.map((t) => t.name))
        : [];
      const res = await api.post("/exam/start", {
        exam_type: examType,
        topics,
        number_of_questions: numQuestions,
        duration_minutes: durationMinutes,
      });
      setSession(res.data);
      setAnswers({});
      setCurrentIndex(0);
    } catch (err) {
      setError("Could not start exam. Make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!session || session.status !== "in_progress") return;
    setLoading(true);
    try {
      const res = await api.post(`/exam/${session.id}/submit`, { answers });
      setResult(res.data);
      setSession({ ...session, status: "submitted" });
    } catch (err) {
      setError("Could not submit exam.");
    } finally {
      setLoading(false);
    }
  }

  const formattedTime = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = Math.floor(secondsLeft % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  if (result) {
    return (
      <div>
        <h1>Exam Results</h1>
        <div className="card fade-in">
          <span className="badge">Complete</span>
          <p style={{ marginTop: 12 }}>
            Score: <strong style={{ color: "var(--color-text)" }}>{result.raw_score}</strong> / {result.total_questions}
          </p>
          {result.scaled_score_low !== null && (
            <p>
              Estimated scaled score range:{" "}
              <strong style={{ color: "var(--color-text)" }}>{result.scaled_score_low}</strong>–
              <strong style={{ color: "var(--color-text)" }}>{result.scaled_score_high}</strong>
            </p>
          )}
        </div>
        <div className="card fade-in">
          <h2>Topic breakdown</h2>
          {result.topic_breakdown.map((t) => {
            const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
            return (
              <div key={t.topic} style={{ marginBottom: 12 }}>
                <p style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>{t.topic}</span>
                  <span>
                    {t.correct} / {t.total}
                  </span>
                </p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn-primary" onClick={() => setSession(null)}>
          Take another exam
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h1>{pageTitle}</h1>
        {mockNumber && (
          <p style={{ color: "#6b7280", marginBottom: 16 }}>
            Exam-style test across the full {examType} curriculum. Questions are drawn from our
            reviewed question bank and reshuffled for every attempt — you'll get a scored topic
            breakdown at the end.
          </p>
        )}
        <div className="card">
          <label htmlFor="exam-num-questions">Number of questions</label>
          <input
            id="exam-num-questions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            min={5}
            max={60}
          />
          <label htmlFor="exam-duration">Duration (minutes)</label>
          <input
            id="exam-duration"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            min={5}
            max={240}
          />
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}
          <button className="btn-primary" onClick={startExam} disabled={loading}>
            {loading
              ? "Preparing exam..."
              : mockNumber
              ? `Start ${examType} Mock Test ${mockNumber}`
              : "Start timed exam"}
          </button>
        </div>
      </div>
    );
  }

  const question = session.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / session.questions.length) * 100);
  const isUrgent = secondsLeft <= 60;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <h1 style={{ marginBottom: 0 }}>{pageTitle}</h1>
        <span className="timer-badge" data-urgent={isUrgent} role="timer" aria-live="polite">
          ⏱ {formattedTime}
        </span>
      </div>

      <div className="progress-track" style={{ marginBottom: 16 }}>
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span className="badge">
            Question {currentIndex + 1} of {session.questions.length}
          </span>
          <span className="badge badge-topic">{question.topic}</span>
          <span className="badge">Difficulty {question.difficulty}</span>
        </div>
        <p style={{ fontSize: "1.05rem", color: "var(--color-text)", marginTop: 12 }}>{question.question_text}</p>
        <VisualAid data={question.visual_aid} />
        {question.options && (
          <div className="option-list" role="radiogroup" aria-label="Answer options">
            {Object.entries(question.options).map(([key, val]) => (
              <button
                key={key}
                type="button"
                className="option-card"
                role="radio"
                aria-pressed={answers[question.id] === key}
                aria-checked={answers[question.id] === key}
                onClick={() => setAnswers({ ...answers, [question.id]: key })}
              >
                <span className="option-key">{key}</span>
                <span>{val}</span>
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            className="btn-secondary"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          {currentIndex < session.questions.length - 1 ? (
            <button className="btn-primary" onClick={() => setCurrentIndex((i) => i + 1)}>
              Next
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit exam"}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <p>Question navigator:</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {session.questions.map((q, idx) => (
            <button
              key={q.id}
              className="nav-pill"
              data-state={idx === currentIndex ? "current" : answers[q.id] ? "answered" : undefined}
              aria-label={`Go to question ${idx + 1}${answers[q.id] ? " (answered)" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ExamPageInner />
    </Suspense>
  );
}
