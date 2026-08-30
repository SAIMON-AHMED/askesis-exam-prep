"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { EXAMS } from "@/lib/examConstants";
import { getCurriculumByExamId } from "@/lib/curriculumData";

interface DiagnosticQuestion {
  id: string;
  question_text: string;
  options: Record<string, string> | null;
  topic: string;
}

interface DiagnosticResult {
  raw_score: number;
  total_questions: number;
  recommended_difficulty: number;
  weak_topics: string[];
  topic_results: { topic: string; correct: number; total: number; accuracy: number }[];
}

export default function DiagnosticPage() {
  const [exam, setExam] = useState("sat");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuestions([]);
    setSessionId(null);
    setAnswers({});
    setResult(null);
  }, [exam]);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const topics = getCurriculumByExamId(exam).sections.flatMap((section) => section.topics.map((topic) => topic.name));
      const response = await api.post("/diagnostic/start", {
        exam_type: EXAMS[exam].displayName,
        topics,
        number_of_questions: count,
      });
      setQuestions(response.data.questions);
      setSessionId(response.data.id);
    } catch {
      setError("We could not start the diagnostic. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!sessionId || Object.keys(answers).length !== questions.length) return;
    setLoading(true);
    try {
      const response = await api.post(`/diagnostic/${sessionId}/submit`, { answers });
      setResult(response.data);
    } catch {
      setError("We could not score the diagnostic. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const accuracyPercentage = Math.round((result.raw_score / result.total_questions) * 100);
    const weakestTopics = result.weak_topics.slice(0, 3);

    return (
      <main className="card fade-in" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: "bold", color: "#2563eb", marginBottom: 8 }}>
            {accuracyPercentage}%
          </h1>
          <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 4 }}>
            You scored {result.raw_score} of {result.total_questions} questions
          </p>
          <p style={{ fontSize: 14, color: "#9ca3af" }}>
            Start with difficulty level <strong>{result.recommended_difficulty}</strong>
          </p>
        </div>

        <div style={{ backgroundColor: "#fffbeb", padding: 16, borderRadius: 8, marginBottom: 24, borderLeft: "4px solid #f59e0b" }}>
          <p style={{ fontWeight: 600, marginBottom: 8, color: "#92400e" }}>
            Focus on these topics first
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {weakestTopics.map((topic) => (
              <span
                key={topic}
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#b45309",
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: "#f0f9ff", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#0c4a6e", lineHeight: 1.5 }}>
            <strong>How it works:</strong> Askesis adapts questions to your skill level and focuses on your weaker topics to get you to your target score faster.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            className="btn-primary"
            type="button"
            onClick={() => router.push("/practice")}
            style={{ width: "100%", fontSize: 16, fontWeight: 600, padding: "12px 24px" }}
          >
            🎯 Start targeted practice
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => router.push("/study-plan")}
            style={{ width: "100%" }}
          >
            View study plan
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="card fade-in">
      <h1>Quick diagnostic</h1>
      <p>Answer a short set of questions so Askesis can tailor your starting point.</p>
      {!sessionId ? (
        <>
          <label htmlFor="diagnostic-exam">Exam</label>
          <select id="diagnostic-exam" value={exam} onChange={(event) => setExam(event.target.value)}>
            {Object.values(EXAMS).map((definition) => <option key={definition.id} value={definition.id}>{definition.displayName}</option>)}
          </select>
          <label htmlFor="diagnostic-count">Questions</label>
          <select id="diagnostic-count" value={count} onChange={(event) => setCount(Number(event.target.value))}>
            <option value={5}>5</option><option value={10}>10</option>
          </select>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <button className="btn-primary" type="button" onClick={start} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Loading questions..." : "Start diagnostic"}
          </button>
        </>
      ) : (
        <>
          {questions.map((question, index) => (
            <fieldset key={question.id} style={{ border: "1px solid var(--border-color)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <legend>Question {index + 1} of {questions.length}</legend>
              <p style={{ whiteSpace: "pre-wrap" }}>{question.question_text}</p>
              {Object.entries(question.options || {}).map(([key, value]) => (
                <label key={key} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <input type="radio" name={question.id} value={key} checked={answers[question.id] === key} onChange={() => setAnswers((current) => ({ ...current, [question.id]: key }))} />
                  <span><strong>{key}.</strong> {value}</span>
                </label>
              ))}
            </fieldset>
          ))}
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <button className="btn-primary" type="button" onClick={submit} disabled={loading || Object.keys(answers).length !== questions.length} style={{ width: "100%" }}>
            {loading ? "Scoring..." : "See my baseline"}
          </button>
        </>
      )}
    </main>
  );
}
