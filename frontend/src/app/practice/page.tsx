"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useExam } from "@/context/ExamContext";
import { getCurriculumByExamId } from "@/lib/curriculumData";
import { getExam, EXAMS } from "@/lib/examConstants";
import { getQuestionsByTopic } from "@/lib/practiceQuestionsData";
import { useExamAccess } from "@/hooks/useExamAccess";
import VisualAid, { VisualAidData } from "@/components/VisualAid";

interface GeneratedQuestion {
  id: string;
  question_text: string;
  options: Record<string, string> | null;
  correct_answer: string;
  explanation: string;
  visual_aid?: VisualAidData | null;
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
  questions: GeneratedQuestion[];
  currentQuestionIndex: number;
  completedQuestions: string[];
  correctCount: number;
  wrongCount: number;
  sessionStartTime: number;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

/** Pick a question from the built-in bank when live generation is unavailable. */
function getLocalQuestion(
  examId: string,
  topicId: string,
  completedIds: string[]
): GeneratedQuestion | null {
  const bank = getQuestionsByTopic(examId, topicId).filter(
    (q) => !q.isEssay && q.options && q.options.length > 0
  );
  if (bank.length === 0) return null;
  const remaining = bank.filter((q) => !completedIds.includes(`local-${q.id}`));
  const pool = remaining.length > 0 ? remaining : bank;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const options: Record<string, string> = {};
  picked.options!.forEach((opt, i) => {
    options[OPTION_LETTERS[i]] = opt;
  });
  return {
    id: `local-${picked.id}`,
    question_text: picked.question,
    options,
    correct_answer: OPTION_LETTERS[picked.correctAnswer ?? 0],
    explanation: picked.explanation,
    visual_aid: null,
  };
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

  const startPracticeSession = () => {
    const allTopics = curriculum.sections.flatMap((s) => s.topics);
    const newSession: PracticeSession = {
      examId: currentExamId,
      topics: allTopics.map((t) => t.name),
      topicIds: allTopics.map((t) => t.id),
      currentTopicIndex: 0,
      questions: [],
      currentQuestionIndex: 0,
      completedQuestions: [],
      correctCount: 0,
      wrongCount: 0,
      sessionStartTime: Date.now(),
    };
    setSession(newSession);
    setSessionActive(true);
    setElapsed(0);
    fetchNextQuestion(newSession);
  };

  const fetchNextQuestion = async (currentSession: PracticeSession) => {
    setLoading(true);
    setFeedback(null);
    setError(null);
    
    try {
      const currentTopic = currentSession.topics[currentSession.currentTopicIndex] || "Algebra";
      
      // Use unlimited endpoint for premium users, regular for free users
      const endpoint = quota?.is_premium ? "/questions/unlimited/next" : "/questions/generate";
      const payload = {
        exam_type: currentExam?.displayName || "SAT",
        topic: currentTopic,
        difficulty,
        question_format: "multiple_choice",
        number_of_questions: 1,
      };
      
      const res = await api.post(endpoint, payload);
      setQuestions(res.data instanceof Array ? res.data : [res.data]);
      setAnswer("");
      setStartTime(Date.now());
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setLimitReached(true);
        setError(err.response.data?.detail || "Daily free practice limit reached. Upgrade to unlimited.");
        return;
      }
      // Live generation unavailable — fall back to the built-in question bank.
      const topicId = currentSession.topicIds[currentSession.currentTopicIndex];
      const localQuestion = getLocalQuestion(
        currentSession.examId,
        topicId,
        currentSession.completedQuestions
      );
      if (localQuestion) {
        setQuestions([localQuestion]);
        setAnswer("");
        setStartTime(Date.now());
      } else {
        setError("Failed to load a question. Please try again.");
      }
    } finally {
      setLoading(false);
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
          topic: session.topics[session.currentTopicIndex] || "Algebra",
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
    
    // Move to next topic if needed
    let nextSession = { ...session };
    if (nextSession.currentTopicIndex < nextSession.topics.length - 1) {
      nextSession.currentTopicIndex += 1;
    }
    
    setSession(nextSession);
    await fetchNextQuestion(nextSession);
  };

  const quitSession = () => {
    setSessionActive(false);
    setSession(null);
    setQuestions([]);
    setAnswer("");
    setFeedback(null);
    setElapsed(0);
  };

  const isSessionComplete = session && session.currentTopicIndex >= session.topics.length - 1;
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
            onChange={(e) => setSelectedExamId(e.target.value)}
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
                You'll practice through all {curriculum.sections.length} sections (
                {curriculum.totalTopics} topics) at your chosen difficulty level.
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
            right: 24,
            zIndex: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span className="timer-badge">{formatElapsed(elapsed)}</span>
          <span className="badge" style={{ background: "var(--color-success-bg)", color: "#245c27" }}>
            ✓ {session?.correctCount || 0}
          </span>
          <span className="badge" style={{ background: "var(--color-error-bg)", color: "#8c1c26" }}>
            ✗ {session?.wrongCount || 0}
          </span>
          <button
            className="btn-secondary btn-sm"
            onClick={quitSession}
            style={{ padding: "6px 12px" }}
          >
            Quit
          </button>
        </div>
      )}

      <h1>Practice Session</h1>
      {session && (
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Topic {session.currentTopicIndex + 1} of {session.topics.length}:{" "}
          <strong>{session.topics[session.currentTopicIndex]}</strong>
        </p>
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
              style={{ marginTop: 16 }}
              role="status"
            >
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
