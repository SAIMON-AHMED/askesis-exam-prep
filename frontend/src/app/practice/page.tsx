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
import { CustomTestBuilder, CustomTestConfig } from "@/components/practice/CustomTestBuilder";
import { ScratchpadDrawer } from "@/components/practice/ScratchpadDrawer";

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
  totalTargetQuestions?: number;
  isTimed?: boolean;
  timeLimitSeconds?: number;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];
const FIRST_BATCH_SIZE = 3;
const REFILL_SIZE = 5;
const LOW_WATER_MARK = 4;
const MAX_BUFFER = 12;

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
  const m = Math.floor(Math.max(0, seconds) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(Math.max(0, seconds) % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function PracticePage() {
  const params = useParams();
  const { selectedExam } = useExam();
  const { hasAccess, loading: accessLoading } = useExamAccess();
  const examIdFromUrl = params.examId as string | undefined;

  const [activeTab, setActiveTab] = useState<"quick" | "builder">("quick");
  // Exam is driven by the navbar selection; no in-page exam switcher.
  const currentExamId = examIdFromUrl || selectedExam?.id || "sat";
  const currentExam = getExam(currentExamId) || EXAMS.sat;
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

  // Scratchpad & Elimination states
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, boolean>>({});
  const [isHighlighted, setIsHighlighted] = useState(false);

  const [session, setSession] = useState<PracticeSession | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const queueRef = useRef<GeneratedQuestion[]>([]);
  const [bufferCount, setBufferCount] = useState(0);
  const refillingRef = useRef(false);
  const prefetchCursorRef = useRef(0);
  const [exhausted, setExhausted] = useState(false);
  const prevExamIdRef = useRef(currentExamId);

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
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const topicParam = sp.get("topic");
      if (topicParam) setSelectedTopicId(topicParam);
    }
  }, []);

  // Reset topic selection whenever the navbar's exam actually changes (not on initial mount)
  useEffect(() => {
    if (prevExamIdRef.current !== currentExamId) {
      prevExamIdRef.current = currentExamId;
      setSelectedTopicId("");
    }
  }, [currentExamId]);

  useEffect(() => {
    if (!sessionActive) return;
    timerRef.current = setInterval(() => {
      if (session?.isTimed && session.timeLimitSeconds) {
        const spent = (Date.now() - session.sessionStartTime) / 1000;
        const remaining = Math.max(0, session.timeLimitSeconds - spent);
        setElapsed(remaining);
        if (remaining <= 0) {
          setFeedback("Time is up! Your timed practice drill has completed.");
        }
      } else {
        setElapsed((Date.now() - (session?.sessionStartTime || Date.now())) / 1000);
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionActive, session?.sessionStartTime, session?.isTimed, session?.timeLimitSeconds]);

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

    await initSession(newSession, difficulty);
  };

  const handleStartCustomTest = async (config: CustomTestConfig) => {
    const newSession: PracticeSession = {
      examId: config.examId,
      topics: config.topicNames,
      topicIds: config.topicIds,
      currentTopicIndex: 0,
      completedQuestions: [],
      correctCount: 0,
      wrongCount: 0,
      sessionStartTime: Date.now(),
      totalTargetQuestions: config.questionCount,
      isTimed: config.mode === "timed",
      timeLimitSeconds: config.timeLimitMinutes > 0 ? config.timeLimitMinutes * 60 : undefined,
    };

    await initSession(newSession, config.difficulty || 2);
  };

  const initSession = async (newSession: PracticeSession, diff: number) => {
    queueRef.current = [];
    prefetchCursorRef.current = 0;
    refillingRef.current = false;
    syncBuffer();
    setExhausted(false);
    setSession(newSession);
    setSessionActive(true);
    setElapsed(newSession.isTimed && newSession.timeLimitSeconds ? newSession.timeLimitSeconds : 0);
    setFeedback(null);
    setError(null);
    setEliminatedOptions({});
    setIsHighlighted(false);

    setLoading(true);
    const first = await fetchBatch(newSession, FIRST_BATCH_SIZE, diff);
    setLoading(false);

    if (first.length === 0) {
      setError("Failed to load questions. Please try again.");
      return;
    }

    const [head, ...rest] = first;
    queueRef.current = rest;
    syncBuffer();
    showQuestion(head, newSession);
    void ensureBuffer(newSession, diff);
  };

  const fetchBatch = async (
    currentSession: PracticeSession,
    count: number,
    diffLevel = difficulty
  ): Promise<GeneratedQuestion[]> => {
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
        exam_type: getExam(currentSession.examId)?.displayName || "SAT",
        topic: topicName,
        difficulty: diffLevel,
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
          currentSession.topicIds[topicIndex] || "algebra",
          served,
          count
        )
      );
    }
  };

  const ensureBuffer = async (currentSession: PracticeSession, diffLevel = difficulty) => {
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
        const batch = await fetchBatch(currentSession, REFILL_SIZE, diffLevel);
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
    setEliminatedOptions({});
    setIsHighlighted(false);
    setStartTime(Date.now());
    if (q.topicIndex !== undefined && q.topicIndex !== currentSession.currentTopicIndex) {
      setSession({ ...currentSession, currentTopicIndex: q.topicIndex });
    }
  };

  const toggleElimination = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (feedback) return;
    setEliminatedOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    if (answer === key) setAnswer("");
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
          : `Incorrect. Correct answer: Option ${correctAnswerText}. ${explanationText}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  const continueToNextQuestion = async () => {
    if (!session) return;

    if (
      session.totalTargetQuestions &&
      session.completedQuestions.length >= session.totalTargetQuestions
    ) {
      setExhausted(true);
      return;
    }

    const next = queueRef.current.shift();
    syncBuffer();

    if (next) {
      showQuestion(next, session);
      void ensureBuffer(session);
      return;
    }

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
    setShowScratchpad(false);
  };

  const isSessionComplete =
    Boolean(session) &&
    (exhausted || (session?.totalTargetQuestions && session.completedQuestions.length >= session.totalTargetQuestions)) &&
    bufferCount === 0;

  const question = questions[0];

  if (!sessionActive) {
    return (
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "36px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ margin: "0 0 6px 0", fontSize: "28px", fontWeight: 700 }}>Practice & Exam Simulator</h1>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>
                Reinforce test-taking strategies with adaptive drills, strike-through elimination, and scratchpad tools.
              </p>
            </div>
            <Link href="/review" className="btn-secondary" style={{ padding: "8px 14px", fontSize: "14px" }}>
              📇 Flash Review Queue
            </Link>
          </div>

          {/* Tab switches */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("quick")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: activeTab === "quick" ? "#eff6ff" : "transparent",
                color: activeTab === "quick" ? "#1d4ed8" : "#6b7280",
                cursor: "pointer",
              }}
            >
              ⚡ Quick Topic Practice
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("builder")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: activeTab === "builder" ? "#eff6ff" : "transparent",
                color: activeTab === "builder" ? "#1d4ed8" : "#6b7280",
                cursor: "pointer",
              }}
            >
              🛠️ Custom Drill Builder
            </button>
          </div>
        </div>

        {activeTab === "builder" ? (
          <CustomTestBuilder initialExamId={currentExamId} onStartTest={handleStartCustomTest} />
        ) : (
          <div className="card" style={{ padding: "28px", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 16px 0" }}>Quick Practice Setup</h2>

            <label style={{ marginBottom: "8px", display: "block", fontWeight: "600", fontSize: "14px" }}>
              Exam
            </label>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: `2px solid ${currentExam.primaryColor}`,
                backgroundColor: currentExam.lightColor,
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: "18px" }}>{currentExam.icon}</span>
              <span style={{ fontWeight: 600, fontSize: "14px", color: currentExam.primaryColor }}>
                {currentExam.displayName}
              </span>
              {!accessLoading && !hasAccess(currentExamId) && (
                <span style={{ fontSize: "12px", color: "#6b7280" }}> — 5 free questions/day</span>
              )}
            </div>

            <label htmlFor="practice-topic" style={{ marginBottom: "8px", display: "block", fontWeight: "600", fontSize: "14px" }}>
              Select Topic
            </label>
            <select
              id="practice-topic"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              style={{ marginBottom: "20px", padding: "10px 12px", borderRadius: "8px" }}
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

            <label htmlFor="practice-difficulty" style={{ marginBottom: "8px", display: "block", fontWeight: "600", fontSize: "14px" }}>
              Difficulty Level
            </label>
            <select
              id="practice-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              style={{ marginBottom: "24px", padding: "10px 12px", borderRadius: "8px" }}
            >
              <option value={1}>Level 1 - Foundational</option>
              <option value={2}>Level 2 - Standard Test Day</option>
              <option value={3}>Level 3 - Advanced & Traps</option>
            </select>

            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
              {selectedTopicId ? (
                <>You will practice questions specifically for <strong>{selectedTopicName}</strong>.</>
              ) : (
                <>You will practice across all {curriculum.totalTopics} curriculum topics.</>
              )}
            </p>

            <button
              className="btn-primary"
              onClick={startPracticeSession}
              style={{ padding: "12px 24px", width: "100%", fontWeight: 600, fontSize: "15px", borderRadius: "8px" }}
            >
              🚀 Start Practice Session
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "840px", margin: "0 auto", padding: "24px" }}>
      {/* Scratchpad Drawer */}
      <ScratchpadDrawer isOpen={showScratchpad} onClose={() => setShowScratchpad(false)} />

      {/* Floating HUD */}
      <div
        style={{
          position: "sticky",
          top: "16px",
          zIndex: 40,
          display: "flex",
          gap: "12px",
          alignItems: "center",
          padding: "10px 20px",
          background: "rgba(255, 255, 255, 0.96)",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "120px" }}>
          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>
            {session?.isTimed ? "Time Remaining" : "Elapsed Time"}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: session?.isTimed && elapsed < 60 ? "#dc2626" : "#111827" }}>
            ⏱️ {formatElapsed(elapsed)}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>
            ✓ {session?.correctCount || 0}
          </span>
          <span className="badge" style={{ background: "#fee2e2", color: "#991b1b", fontWeight: 700 }}>
            ✗ {session?.wrongCount || 0}
          </span>

          <button
            type="button"
            onClick={() => setShowScratchpad(!showScratchpad)}
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "6px",
              border: "1px solid #93c5fd",
              backgroundColor: showScratchpad ? "#eff6ff" : "#ffffff",
              color: "#1d4ed8",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ✏️ Scratchpad
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={quitSession}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            Quit
          </button>
        </div>
      </div>

      {/* Session Title */}
      {session && (
        <div style={{ marginBottom: "20px" }}>
          <span className="badge" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", fontWeight: 600 }}>
            {getExam(session.examId)?.displayName} Practice
          </span>
          <h2 style={{ margin: "6px 0 0 0", fontSize: "20px", color: "#111827" }}>
            {session.topics[session.currentTopicIndex]}
          </h2>
        </div>
      )}

      {error && !limitReached && (
        <div className="alert alert-error" role="alert" style={{ marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {question && (
        <div className="card" style={{ padding: "28px", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span className="badge badge-topic">{question.topic || "Topic Drill"}</span>
            <button
              type="button"
              onClick={() => setIsHighlighted(!isHighlighted)}
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                backgroundColor: isHighlighted ? "#fef08a" : "#ffffff",
                color: isHighlighted ? "#854d0e" : "#4b5563",
                cursor: "pointer",
              }}
            >
              🖍️ {isHighlighted ? "Highlighted" : "Highlight Stem"}
            </button>
          </div>

          {question.passage && (
            <blockquote
              style={{
                marginTop: 12,
                padding: "14px 18px",
                borderLeft: "4px solid #3b82f6",
                background: isHighlighted ? "#fef9c3" : "#f8fafc",
                borderRadius: 6,
                color: "#334155",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                fontSize: "15px",
              }}
            >
              {question.passage}
            </blockquote>
          )}

          <p
            style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#111827",
              marginTop: 12,
              lineHeight: 1.5,
              backgroundColor: isHighlighted ? "#fef9c3" : "transparent",
              padding: isHighlighted ? "8px" : "0",
              borderRadius: "4px",
            }}
          >
            {question.question_text}
          </p>

          <VisualAid data={question.visual_aid} />

          {/* Options with Option Strike-Through Elimination */}
          {question.options && (
            <div style={{ display: "grid", gap: "10px", margin: "20px 0" }}>
              {Object.entries(question.options).map(([key, val]) => {
                const isSelected = answer === key;
                const isEliminated = eliminatedOptions[key];
                return (
                  <div key={key} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => !feedback && !isEliminated && setAnswer(key)}
                      disabled={!!feedback}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: `2px solid ${isSelected ? "#3b82f6" : "#e5e7eb"}`,
                        backgroundColor: isSelected ? "#eff6ff" : isEliminated ? "#f9fafb" : "#ffffff",
                        color: isSelected ? "#1e40af" : "#1f2937",
                        cursor: feedback ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        textAlign: "left",
                        opacity: isEliminated ? 0.45 : 1,
                        textDecoration: isEliminated ? "line-through" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <strong
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: isSelected ? "#3b82f6" : "#f3f4f6",
                          color: isSelected ? "#ffffff" : "#374151",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          flexShrink: 0,
                        }}
                      >
                        {key}
                      </strong>
                      <span style={{ fontSize: "15px" }}>{val}</span>
                    </button>

                    {!feedback && (
                      <button
                        type="button"
                        onClick={(e) => toggleElimination(e, key)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: isEliminated ? "#fee2e2" : "#ffffff",
                          color: isEliminated ? "#dc2626" : "#9ca3af",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                        title={isEliminated ? "Restore option" : "Eliminate option (Cross out)"}
                      >
                        {isEliminated ? "Undo" : "<s>✕</s>"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
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
              style={{ flex: 1, padding: "12px 20px", fontWeight: 600, fontSize: "15px" }}
            >
              {submitting
                ? "Submitting..."
                : !feedback
                ? "Submit Answer"
                : isSessionComplete
                ? "Complete Practice ✓"
                : "Next Question →"}
            </button>
          </div>

          {/* Feedback & AI Explanation */}
          {feedback && (
            <div
              style={{
                marginTop: 20,
                padding: "16px 20px",
                borderRadius: "10px",
                backgroundColor: feedback.startsWith("Correct") ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${feedback.startsWith("Correct") ? "#86efac" : "#fca5a5"}`,
                color: feedback.startsWith("Correct") ? "#166534" : "#991b1b",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>
                {feedback.startsWith("Correct") ? "✓ Correct! Great job." : "✗ Incorrect."}
              </div>
              <div style={{ fontSize: "14px", lineHeight: "1.5" }}>{feedback}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
