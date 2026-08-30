"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useExam } from "@/context/ExamContext";
import { getCurriculumByExamId } from "@/lib/curriculumData";
import { getExam, EXAMS } from "@/lib/examConstants";
import { useExamAccess } from "@/hooks/useExamAccess";
import VisualAid, { VisualAidData } from "@/components/VisualAid";

interface GeneratedQuestion {
  id: string;
  question_text: string;
  passage?: string | null;
  options: Record<string, string> | null;
  correct_answer: string;
  explanation: string;
  visual_aid?: VisualAidData | null;
  topic?: string;
  topicIndex?: number;
}

interface Quota {
  is_premium: boolean;
  questions_today: number;
  daily_limit: number | null;
  remaining: number | null;
}

interface PracticeSession {
  examId: string;
  topics: string[];
  topicIds: string[];
  currentTopicIndex: number;
  completedQuestions: string[];
  correctCount: number;
  wrongCount: number;
  sessionStartTime: number;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

// A small first batch reaches the student fastest; the buffer is then topped up in the
// background so later questions are served from memory with no visible wait.
const FIRST_BATCH_SIZE = 3;
const REFILL_SIZE = 5;
/** Start refilling while this many questions are still queued, so the fetch overlaps reading. */
const LOW_WATER_MARK = 4;
/** Caps how far ahead we generate, so a student who quits early hasn't burned tokens. */
const MAX_BUFFER = 12;

/**
 * Build a batch from the offline question bank when live generation is unavailable.
 * The bank is imported dynamically because it is ~1 MB and most sessions never need it.
 */
async function getLocalQuestions(
  examId: string,
  topicId: string,
  completedIds: string[],
  count: number
): Promise<GeneratedQuestion[]> {
  const { getQuestionsByTopic } = await import("@/lib/practiceQuestionsData");
  const bank = getQuestionsByTopic(examId, topicId).filter(
    (q) => !q.isEssay && q.options && q.options.length > 0
  );
  if (bank.length === 0) return [];

  const unseen = bank.filter((q) => !completedIds.includes(`local-${q.id}`));
  const pool = [...(unseen.length > 0 ? unseen : bank)];
  const picked: GeneratedQuestion[] = [];

  while (picked.length < count && pool.length > 0) {
    const [q] = pool.splice(Math.floor(Math.random() * pool.length), 1);
    const options: Record<string, string> = {};
    q.options!.forEach((opt, i) => {
      options[OPTION_LETTERS[i]] = opt;
    });
    picked.push({
      id: `local-${q.id}`,
      question_text: q.question,
      passage: q.passage ?? null,
      options,
      correct_answer: OPTION_LETTERS[q.correctAnswer ?? 0],
      explanation: q.explanation,
      visual_aid: null,
    });
  }
  return picked;
}

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function PracticePage() {
  const params = useParams();
  const { selectedExam } = useExam();
  const { hasAccess, loading: accessLoading } = useExamAccess();
  const examIdFromUrl = params.examId as string | undefined;
  
  // Allow user to select exam independently
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const currentExamId = selectedExamId || examIdFromUrl || selectedExam?.id || "";
  const currentExam = getExam(currentExamId) || EXAMS[0];
  const curriculum = getCurriculumByExamId(currentExamId);

  const [difficulty, setDifficulty] = useState(2);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [quota, setQuota] = useState<Quota | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [session, setSession] = useState<PracticeSession | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Questions already generated and waiting to be shown. Ref is the source of truth so the
  // background refill never reads stale state; bufferCount mirrors it for rendering.
  const queueRef = useRef<GeneratedQuestion[]>([]);
  const [bufferCount, setBufferCount] = useState(0);
  const refillingRef = useRef(false);
  /** Next topic to generate from; advances ahead of the topic the student is currently on. */
  const prefetchCursorRef = useRef(0);
  const [exhausted, setExhausted] = useState(false);

  const syncBuffer = () => setBufferCount(queueRef.current.length);

  const selectedTopicName =
    curriculum.sections
      .flatMap((s) => s.topics)
      .find((t) => t.id === selectedTopicId)?.name ?? "";

  function loadQuota() {
    api
      .get("/practice/quota")
      .then((res) => {
        setQuota(res.data);
        if (!res.data.is_premium && res.data.remaining <= 0) {
          setLimitReached(true);
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    loadQuota();
  }, []);

  useEffect(() => {
    if (!sessionActive) return;
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - (session?.sessionStartTime || Date.now())) / 1000);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionActive, session?.sessionStartTime]);

  const startPracticeSession = async () => {
    const allTopics = curriculum.sections.flatMap((s) => s.topics);
    const chosen = allTopics.filter((t) => !selectedTopicId || t.id === selectedTopicId);
    const sessionTopics = chosen.length > 0 ? chosen : allTopics;
    const newSession: PracticeSession = {
      examId: currentExamId,
      topics: sessionTopics.map((t) => t.name),
      topicIds: sessionTopics.map((t) => t.id),
      currentTopicIndex: 0,
      completedQuestions: [],
      correctCount: 0,
      wrongCount: 0,
      sessionStartTime: Date.now(),
    };

    queueRef.current = [];
    prefetchCursorRef.current = 0;
    refillingRef.current = false;
    syncBuffer();
    setExhausted(false);
    setSession(newSession);
    setSessionActive(true);
    setElapsed(0);
    setFeedback(null);
    setError(null);

    setLoading(true);
    const first = await fetchBatch(newSession, FIRST_BATCH_SIZE);
    setLoading(false);

    if (first.length === 0) {
      setError("Failed to load questions. Please try again.");
      return;
    }

    const [head, ...rest] = first;
    queueRef.current = rest;
    syncBuffer();
    showQuestion(head, newSession);
    void ensureBuffer(newSession);
  };

  /**
   * Generate one batch for the next unused topic. Falls back to the offline bank so a
   * background refill failure is never surfaced to the student mid-session.
   */
  const fetchBatch = async (
    currentSession: PracticeSession,
    count: number
  ): Promise<GeneratedQuestion[]> => {
    // A single-topic session keeps drawing from that topic instead of running out.
    const singleTopic = currentSession.topics.length <= 1;
    const topicIndex = singleTopic
      ? 0
      : Math.min(prefetchCursorRef.current, currentSession.topics.length - 1);
    const topicName = currentSession.topics[topicIndex] || "Algebra";
    if (!singleTopic) prefetchCursorRef.current = topicIndex + 1;

    const tag = (items: GeneratedQuestion[]) =>
      items.map((q) => ({ ...q, topic: topicName, topicIndex }));

    try {
      const endpoint = quota?.is_premium ? "/questions/unlimited/next" : "/questions/generate";
      const res = await api.post(endpoint, {
        exam_type: currentExam?.displayName || "SAT",
        topic: topicName,
        difficulty,
        question_format: "multiple_choice",
        number_of_questions: count,
      });
      return tag(res.data instanceof Array ? res.data : [res.data]);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setLimitReached(true);
        setError(
          err.response.data?.detail || "Daily free practice limit reached. Upgrade to unlimited."
        );
        return [];
      }
      const served = [...currentSession.completedQuestions, ...queueRef.current.map((q) => q.id)];
      return tag(
        await getLocalQuestions(
          currentSession.examId,
          currentSession.topicIds[topicIndex],
          served,
          count
        )
      );
    }
  };

  /** Top up the queue in the background. Single-flight so rapid advances can't stack fetches. */
  const ensureBuffer = async (currentSession: PracticeSession) => {
    if (refillingRef.current || limitReached) return;
    if (queueRef.current.length > LOW_WATER_MARK) return;
    if (prefetchCursorRef.current >= currentSession.topics.length) {
      setExhausted(true);
      return;
    }

    refillingRef.current = true;
    try {
      while (
        queueRef.current.length < MAX_BUFFER &&
        prefetchCursorRef.current < currentSession.topics.length
      ) {
        const batch = await fetchBatch(currentSession, REFILL_SIZE);
        if (batch.length === 0) break;
        queueRef.current = [...queueRef.current, ...batch];
        syncBuffer();
      }
      if (prefetchCursorRef.current >= currentSession.topics.length) setExhausted(true);
    } finally {
      refillingRef.current = false;
    }
  };

  const showQuestion = (q: GeneratedQuestion, currentSession: PracticeSession) => {
    setQuestions([q]);
    setAnswer("");
    setFeedback(null);
    setStartTime(Date.now());
    if (q.topicIndex !== undefined && q.topicIndex !== currentSession.currentTopicIndex) {
      setSession({ ...currentSession, currentTopicIndex: q.topicIndex });
    }
  };

  async function submitAnswer() {
    if (questions.length === 0 || submitting || !session) return;
    setSubmitting(true);
    try {
      const q = questions[0];
      let isCorrect: boolean;
      let explanationText: string;
      let correctAnswerText: string;

      if (q.id.startsWith("local-")) {
        // Built-in bank question — grade locally.
        isCorrect = answer === q.correct_answer;
        explanationText = q.explanation;
        correctAnswerText = q.correct_answer;
      } else {
        const timeTaken = (Date.now() - startTime) / 1000;
        const res = await api.post("/practice/submit", {
          generated_question_id: q.id,
          submitted_answer: answer,
          time_taken_seconds: timeTaken,
          difficulty,
          topic: q.topic || session.topics[session.currentTopicIndex] || "Algebra",
        });
        isCorrect = res.data.is_correct;
        explanationText = res.data.explanation;
        correctAnswerText = res.data.correct_answer;
        loadQuota();
      }

      const updatedSession = {
        ...session,
        completedQuestions: [...session.completedQuestions, q.id],
        correctCount: session.correctCount + (isCorrect ? 1 : 0),
        wrongCount: session.wrongCount + (isCorrect ? 0 : 1),
      };
      setSession(updatedSession);

      setFeedback(
        isCorrect
          ? `Correct! ${explanationText}`
          : `Incorrect. Correct answer: ${correctAnswerText}. ${explanationText}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  const continueToNextQuestion = async () => {
    if (!session) return;

    const next = queueRef.current.shift();
    syncBuffer();

    if (next) {
      showQuestion(next, session);
      void ensureBuffer(session);
      return;
    }

    // Buffer ran dry (slow network or a very fast student) — wait for one batch.
    if (prefetchCursorRef.current >= session.topics.length) {
      setExhausted(true);
      return;
    }

    setLoading(true);
    const batch = await fetchBatch(session, REFILL_SIZE);
    setLoading(false);

    if (batch.length === 0) {
      setExhausted(true);
      return;
    }
    const [head, ...rest] = batch;
    queueRef.current = rest;
    syncBuffer();
    showQuestion(head, session);
    void ensureBuffer(session);
  };

  const quitSession = () => {
    setSessionActive(false);
    setSession(null);
    setQuestions([]);
    setAnswer("");
    setFeedback(null);
    setElapsed(0);
    queueRef.current = [];
    prefetchCursorRef.current = 0;
    refillingRef.current = false;
    syncBuffer();
    setExhausted(false);
  };

  const isSessionComplete = Boolean(session) && exhausted && bufferCount === 0;
  const question = questions[0];
  const showHud = sessionActive;

  if (!sessionActive) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        <h1>Practice Mode</h1>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Select an exam and start practicing with fresh, adaptive questions.
        </p>

        <div className="card" style={{ marginBottom: "24px" }}>
          <h2 className="card-title">Session Setup</h2>
          
          <label
            htmlFor="practice-exam"
            style={{ marginBottom: "8px", display: "block", fontWeight: "500" }}
          >
            Select Exam
          </label>
          <select
            id="practice-exam"
            value={selectedExamId}
            onChange={(e) => {
              setSelectedExamId(e.target.value);
              setSelectedTopicId("");
            }}
            style={{ marginBottom: "24px" }}
          >
            <option value="">Choose an exam...</option>
            {Object.values(EXAMS).map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.displayName}
                {!accessLoading && !hasAccess(exam.id) ? " — 5 free questions/day" : ""}
              </option>
            ))}
          </select>

          {selectedExamId && !accessLoading && !hasAccess(selectedExamId) && (
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
              You're on the free tier for this exam (5 questions/day).{" "}
              <Link href="/exams" style={{ fontWeight: 600 }}>
                Unlock it
              </Link>{" "}
              for unlimited practice.
            </p>
          )}

          {selectedExamId && (
            <>
              <label
                htmlFor="practice-topic"
                style={{ marginBottom: "8px", display: "block", fontWeight: "500" }}
              >
                Select Topic
              </label>
              <select
                id="practice-topic"
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                style={{ marginBottom: "24px" }}
              >
                <option value="">All topics ({curriculum.totalTopics})</option>
                {curriculum.sections.map((section) => (
                  <optgroup key={section.id} label={section.name}>
                    {section.topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <label
                htmlFor="practice-difficulty"
                style={{ marginBottom: "8px", display: "block", fontWeight: "500" }}
              >
                Difficulty Level
              </label>
              <select
                id="practice-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                style={{ marginBottom: "24px" }}
              >
                {[1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    Level {d}
                  </option>
                ))}
              </select>

              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
                {selectedTopicId ? (
                  <>
                    You'll keep practicing <strong>{selectedTopicName}</strong> at your chosen
                    difficulty until you quit.
                  </>
                ) : (
                  <>
                    You'll practice through all {curriculum.sections.length} sections (
                    {curriculum.totalTopics} topics) at your chosen difficulty level.
                  </>
                )}
              </p>

              <button
                className="btn-primary"
                onClick={startPracticeSession}
                style={{ padding: "12px 24px" }}
              >
                Start Practice Session
              </button>
            </>
          )}

          {limitReached && (
            <div
              className="alert alert-warning fade-in"
              style={{ marginTop: "16px" }}
            >
              You've reached your daily free practice limit. Upgrade to Premium
              for unlimited practice.
              <Link
                href="/subscription"
                className="btn-secondary btn-sm"
                style={{ marginLeft: "8px" }}
              >
                Upgrade
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {showHud && (
        <div
          style={{
            position: "fixed",
            top: 76,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            gap: 16,
            alignItems: "center",
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.95)",
            borderBottom: "1px solid var(--border-color)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              Progress
            </div>
            <div style={{ 
              height: 4, 
              background: "#e5e7eb", 
              borderRadius: 2,
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                width: `${((session?.correctCount || 0) / Math.max((session?.correctCount || 0) + (session?.wrongCount || 0) + 5, 10)) * 100}%`,
                transition: "width 0.3s ease-out"
              }} />
            </div>
          </div>

          <span className="badge" style={{ background: "var(--color-success-bg)", color: "#245c27", fontWeight: 600 }}>
            ✓ {session?.correctCount || 0}
          </span>
          <span className="badge" style={{ background: "var(--color-error-bg)", color: "#8c1c26", fontWeight: 600 }}>
            ✗ {session?.wrongCount || 0}
          </span>
          <span className="timer-badge" style={{ fontWeight: 600 }}>{formatElapsed(elapsed)}</span>
          {bufferCount > 0 && (
            <span
              className="badge"
              title={`${bufferCount} question${bufferCount === 1 ? "" : "s"} ready to go`}
              style={{ background: "#dbeafe", color: "#1e40af" }}
            >
              ⚡ {bufferCount}
            </span>
          )}
          <button
            className="btn-secondary btn-sm"
            onClick={quitSession}
            style={{ padding: "6px 12px" }}
          >
            Quit
          </button>
        </div>
      )}

      <div style={{ marginTop: showHud ? 60 : 0 }}>
        <h1>Practice Session</h1>
        {session && (
          <div style={{ marginBottom: "24px" }}>
            <p style={{ color: "#6b7280", marginBottom: 8, fontSize: 14 }}>
              {session.topics.length > 1 && (
                <>Topic {session.currentTopicIndex + 1} of {session.topics.length}</>
              )}
            </p>
            <h2 style={{ margin: 0, color: "#1f2937" }}>
              {session.topics[session.currentTopicIndex]}
            </h2>
          </div>
        )}





      {error && !limitReached && (
        <div className="alert alert-error fade-in" role="alert">
          {error}
        </div>
      )}

      {question && (
        <div className="card fade-in">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="badge badge-topic">
              {session?.topics[session.currentTopicIndex] || "Algebra"}
            </span>
            <span className="badge">Difficulty {difficulty}</span>
          </div>
          {question.passage && (
            <blockquote
              style={{
                marginTop: 12,
                padding: "12px 16px",
                borderLeft: "4px solid var(--color-primary, #3A6EA5)",
                background: "#f8fafc",
                borderRadius: 6,
                color: "var(--color-text)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {question.passage}
            </blockquote>
          )}
          <p style={{ fontSize: "1.05rem", color: "var(--color-text)", marginTop: 12 }}>
            {question.question_text}
          </p>
          <VisualAid data={question.visual_aid} />
          {question.options && (
            <div className="option-list" role="radiogroup" aria-label="Answer options">
              {Object.entries(question.options).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  className="option-card"
                  role="radio"
                  aria-pressed={answer === key}
                  aria-checked={answer === key}
                  onClick={() => !feedback && setAnswer(key)}
                  disabled={!!feedback}
                >
                  <span className="option-key">{key}</span>
                  <span>{val}</span>
                </button>
              ))}
            </div>
          )}
          {!question.options && (
            <>
              <label htmlFor="practice-answer">Your answer</label>
              <input
                id="practice-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                disabled={!!feedback}
              />
            </>
          )}
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              className="btn-primary"
              onClick={() =>
                feedback
                  ? isSessionComplete
                    ? quitSession()
                    : continueToNextQuestion()
                  : submitAnswer()
              }
              disabled={!answer || submitting || loading}
              style={{ flex: 1 }}
            >
              {submitting
                ? "Submitting..."
                : !feedback
                ? "Submit Answer"
                : isSessionComplete
                ? "Complete Session"
                : "Next Question"}
            </button>
            {feedback && !isSessionComplete && (
              <button
                className="btn-secondary"
                onClick={quitSession}
                style={{ padding: "8px 16px" }}
              >
                Quit
              </button>
            )}
          </div>
          {feedback && (
            <div
              className={`alert fade-in ${feedback.startsWith("Correct") ? "alert-success" : "alert-error"}`}
              style={{ 
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 15,
                fontWeight: 500
              }}
              role="status"
            >
              <span style={{ fontSize: 20 }}>
                {feedback.startsWith("Correct") ? "✓" : "✗"}
              </span>
              <div>
                <div>{feedback}</div>
                {!feedback.startsWith("Correct") && question.explanation && (
                  <div style={{ fontSize: 13, fontWeight: 400, marginTop: 8, opacity: 0.9 }}>
                    <strong>Why:</strong> {question.explanation}
                  </div>
                )}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              className="btn-primary"
              onClick={() =>
                feedback
                  ? isSessionComplete
                    ? quitSession()
                    : continueToNextQuestion()
                  : submitAnswer()
              }
              disabled={!answer || submitting || loading}
              style={{ flex: 1, fontWeight: 600 }}
            >
              {submitting
                ? "Submitting..."
                : !feedback
                ? "Submit Answer"
                : isSessionComplete
                ? "Complete Session ✓"
                : "Next Question →"}
            </button>
            {feedback && !isSessionComplete && (
              <button
                className="btn-secondary"
                onClick={quitSession}
                style={{ padding: "8px 16px" }}
              >
                Quit
              </button>
            )}
          </div>
