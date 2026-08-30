"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface ReviewItem {
  id: string;
  question_key: string;
  exam_type: string;
  topic: string;
  due_at: string;
  interval_days: number;
  repetitions: number;
  last_is_correct: boolean | null;
  question_text: string | null;
  options: Record<string, string> | null;
  correct_answer: string | null;
  explanation: string | null;
}

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadReviews() {
    try {
      const response = await api.get("/review/due");
      setItems(response.data);
    } catch {
      setError("We could not load your review queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadReviews(); }, []);

  async function rate(itemId: string, rating: string) {
    await api.post(`/review/${itemId}/answer`, { rating });
    await loadReviews();
  }

  return (
    <main>
      <h1>Review queue</h1>
      <p>Revisit questions that are ready for another pass.</p>
      {loading && <div className="card">Loading your review queue...</div>}
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <section className="card"><h2>Nothing is due</h2><p>Keep practicing and your next review will appear here.</p><Link className="btn-primary" href="/practice">Practice now</Link></section>
      )}
      <div style={{ display: "grid", gap: 16 }}>
        {items.map((item) => (
          <section className="card" key={item.id}>
            <span className="badge">{item.exam_type}</span>
            <h2 style={{ marginTop: 8 }}>{item.topic}</h2>
            {item.question_text && <p style={{ whiteSpace: "pre-wrap" }}>{item.question_text}</p>}
            {item.options && Object.entries(item.options).map(([key, value]) => <p key={key}><strong>{key}.</strong> {value}</p>)}
            <p>Review item {item.question_key.slice(0, 12)}... · {item.repetitions} repetitions</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["again", "hard", "good", "easy"] as const).map((rating) => (
                <button className={rating === "again" ? "btn-secondary" : "btn-primary"} key={rating} type="button" onClick={() => void rate(item.id, rating)}>{rating[0].toUpperCase() + rating.slice(1)}</button>
              ))}
            </div>
            {item.explanation && <p style={{ marginTop: 12 }}>Explanation: {item.explanation}</p>}
          </section>
        ))}
      </div>
    </main>
  );
}