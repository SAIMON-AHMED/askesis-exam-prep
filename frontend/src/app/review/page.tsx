"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { FlashReviewDeck, ReviewItem } from "@/components/review/FlashReviewDeck";
import { EXAMS } from "@/lib/examConstants";

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"flashcard" | "list" | "import">("flashcard");
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>("all");
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  async function loadReviews() {
    try {
      setLoading(true);
      const response = await api.get("/review/due");
      setItems(response.data);
    } catch {
      setError("We could not load your review queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();
  }, []);

  async function rate(itemId: string, rating: string) {
    try {
      await api.post(`/review/${itemId}/answer`, { rating });
      // update item locally
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (e) {
      console.error("Failed to submit rating", e);
    }
  }

  // Import questions into review queue
  async function handleImportSampleQuestions(examId: string) {
    setImporting(true);
    setImportSuccess(null);
    try {
      const { getQuestionsByExamId } = await import("@/lib/practiceQuestionsData");
      const examTopics = getQuestionsByExamId(examId);
      const allExamQuestions: any[] = Object.values(examTopics).flatMap((topicGroup: any) => topicGroup.questions || []);
      const questions = allExamQuestions.slice(0, 5);

      if (questions.length === 0) {
        setImportSuccess("No questions found for this exam.");
        return;
      }

      // Add to local items state with full review item interface
      const newItems: ReviewItem[] = questions.map((q: any, idx: number) => {
        const optionsMap: Record<string, string> = {};
        const letters = ["A", "B", "C", "D", "E"];
        q.options?.forEach((opt: string, i: number) => {
          optionsMap[letters[i]] = opt;
        });

        return {
          id: `queue-${examId}-${q.id}-${Date.now()}-${idx}`,
          question_key: q.id,
          exam_type: examId.toUpperCase(),
          topic: q.topic || "General",
          due_at: new Date().toISOString(),
          interval_days: 1,
          repetitions: 0,
          last_is_correct: null,
          question_text: q.question,
          options: optionsMap,
          correct_answer: letters[q.correctAnswer ?? 0] || "A",
          explanation: q.explanation || "Review key concept and principles.",
        };
      });

      setItems((prev) => [...newItems, ...prev]);
      setImportSuccess(`Successfully queued ${newItems.length} ${examId.toUpperCase()} questions for spaced review!`);
      setActiveTab("flashcard");
    } catch (err) {
      console.error(err);
      setImportSuccess("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  }

  const filteredItems = items.filter((item) => {
    if (selectedExamFilter === "all") return true;
    return item.exam_type?.toLowerCase() === selectedExamFilter.toLowerCase();
  });

  return (
    <main style={{ padding: "32px 24px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: 700, color: "#111827" }}>
              Spaced Repetition & Review Queue
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "#6b7280" }}>
              Optimized flash recall intervals to lock high-yield concepts into long-term memory.
            </p>
          </div>

          {/* Quick Practice Link */}
          <Link
            href="/practice"
            className="btn-primary"
            style={{
              padding: "10px 18px",
              fontSize: "14px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>⚡ Practice Mode</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <div className="card" style={{ padding: "16px 20px", backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" }}>
            <div style={{ fontSize: "12px", color: "#0369a1", fontWeight: 600, textTransform: "uppercase" }}>
              Cards Due Today
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#0c4a6e", marginTop: "4px" }}>
              {items.length}
            </div>
          </div>

          <div className="card" style={{ padding: "16px 20px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div style={{ fontSize: "12px", color: "#15803d", fontWeight: 600, textTransform: "uppercase" }}>
              Optimal Interval Algorithm
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#14532d", marginTop: "4px" }}>
              SM-2 Active
            </div>
          </div>

          <div className="card" style={{ padding: "16px 20px", backgroundColor: "#faf5ff", border: "1px solid #e9d5ff" }}>
            <div style={{ fontSize: "12px", color: "#7e22ce", fontWeight: 600, textTransform: "uppercase" }}>
              Retention Projection
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#581c87", marginTop: "4px" }}>
              ~92% Exam Day
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "24px",
          gap: "8px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("flashcard")}
          style={{
            padding: "10px 16px",
            fontWeight: 600,
            fontSize: "14px",
            border: "none",
            borderBottom: activeTab === "flashcard" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "flashcard" ? "#2563eb" : "#6b7280",
            cursor: "pointer",
          }}
        >
          📇 Flash Review ({filteredItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("list")}
          style={{
            padding: "10px 16px",
            fontWeight: 600,
            fontSize: "14px",
            border: "none",
            borderBottom: activeTab === "list" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "list" ? "#2563eb" : "#6b7280",
            cursor: "pointer",
          }}
        >
          📋 Queue List
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("import")}
          style={{
            padding: "10px 16px",
            fontWeight: 600,
            fontSize: "14px",
            border: "none",
            borderBottom: activeTab === "import" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "import" ? "#2563eb" : "#6b7280",
            cursor: "pointer",
          }}
        >
          ➕ Load Question Deck
        </button>
      </div>

      {loading && <div className="card" style={{ padding: "32px", textAlign: "center" }}>Loading your review queue...</div>}
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: "20px" }}>{error}</div>}

      {/* Tab 1: Flashcard / Spaced Repetition Mode */}
      {!loading && activeTab === "flashcard" && (
        <div>
          {filteredItems.length > 0 ? (
            <FlashReviewDeck
              items={filteredItems}
              onRate={async (id, rating) => {
                await rate(id, rating);
              }}
              onFinish={() => {
                setActiveTab("list");
              }}
            />
          ) : (
            <section className="card" style={{ padding: "40px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌿</div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Your review queue is clear!</h2>
              <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                All spaced repetition cards have been reviewed for today. You can load new questions from the question bank below.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setActiveTab("import")}
                style={{ padding: "10px 20px" }}
              >
                Load Questions into Queue
              </button>
            </section>
          )}
        </div>
      )}

      {/* Tab 2: Queue List */}
      {!loading && activeTab === "list" && (
        <div>
          {/* Exam Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <label htmlFor="filter-exam" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
              Filter by Exam:
            </label>
            <select
              id="filter-exam"
              value={selectedExamFilter}
              onChange={(e) => setSelectedExamFilter(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
            >
              <option value="all">All Exams</option>
              {Object.values(EXAMS).map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.displayName}</option>
              ))}
            </select>
          </div>

          {filteredItems.length === 0 ? (
            <div className="card" style={{ padding: "32px", textAlign: "center" }}>
              <p style={{ color: "#6b7280" }}>No questions match this filter in your review queue.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {filteredItems.map((item) => (
                <section className="card" key={item.id} style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className="badge" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", fontWeight: 600 }}>
                        {item.exam_type}
                      </span>
                      <strong style={{ fontSize: "15px", color: "#111827" }}>{item.topic}</strong>
                    </div>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      Repetitions: {item.repetitions} · Interval: {item.interval_days}d
                    </span>
                  </div>

                  {item.question_text && (
                    <p style={{ fontSize: "15px", fontWeight: 500, color: "#374151", margin: "12px 0", whiteSpace: "pre-wrap" }}>
                      {item.question_text}
                    </p>
                  )}

                  {item.options && (
                    <div style={{ display: "grid", gap: "6px", margin: "12px 0" }}>
                      {Object.entries(item.options).map(([k, val]) => (
                        <div
                          key={k}
                          style={{
                            padding: "8px 12px",
                            backgroundColor: k === item.correct_answer ? "#f0fdf4" : "#f9fafb",
                            border: `1px solid ${k === item.correct_answer ? "#86efac" : "#e5e7eb"}`,
                            borderRadius: "6px",
                            fontSize: "14px",
                            color: k === item.correct_answer ? "#166534" : "#374151",
                          }}
                        >
                          <strong>{k}.</strong> {val}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.explanation && (
                    <p style={{ fontSize: "13px", color: "#4b5563", marginTop: "10px", backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                      <strong>Key Concept:</strong> {item.explanation}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                    {(["again", "hard", "good", "easy"] as const).map((rating) => (
                      <button
                        key={rating}
                        className={rating === "again" ? "btn-secondary" : "btn-primary"}
                        type="button"
                        onClick={() => void rate(item.id, rating)}
                        style={{ padding: "6px 14px", fontSize: "13px" }}
                      >
                        {rating[0].toUpperCase() + rating.slice(1)}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Import Deck from Bank */}
      {!loading && activeTab === "import" && (
        <div>
          <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
              Queue Questions for Spaced Repetition
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
              Select an exam below to load high-yield curriculum questions into your spaced repetition queue.
            </p>

            {importSuccess && (
              <div className="alert alert-success" style={{ marginBottom: "16px", backgroundColor: "#f0fdf4", color: "#166534", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                {importSuccess}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {Object.values(EXAMS).map((ex) => (
                <div
                  key={ex.id}
                  style={{
                    padding: "16px",
                    border: `1px solid ${ex.borderColor}`,
                    borderRadius: "10px",
                    backgroundColor: ex.lightColor,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "24px", marginBottom: "6px" }}>{ex.icon}</div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>
                      {ex.displayName}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 12px 0" }}>
                      {ex.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={importing}
                    onClick={() => void handleImportSampleQuestions(ex.id)}
                    style={{
                      padding: "8px 12px",
                      fontSize: "13px",
                      backgroundColor: ex.primaryColor,
                      borderColor: ex.primaryColor,
                      width: "100%",
                    }}
                  >
                    {importing ? "Loading..." : `+ Queue ${ex.displayName} Cards`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
