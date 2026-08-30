"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import { api } from "@/lib/api";
import { EXAMS } from "@/lib/examConstants";

export default function OnboardingPage() {
  const router = useRouter();
  const { success, error: showError } = useNotification();
  const [exam, setExam] = useState("sat");
  const [examDate, setExamDate] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("5");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put("/onboarding", {
        primary_exam_id: exam,
        exam_date: examDate ? new Date(`${examDate}T00:00:00`).toISOString() : null,
        target_score: targetScore ? Number(targetScore) : null,
        weekly_study_hours: Number(weeklyHours),
        weak_topics: [],
      });
      success("Study goal saved! Let's take a quick diagnostic.");
      router.push("/diagnostic");
    } catch {
      const errMsg = "We could not save your study goal. Please try again.";
      setError(errMsg);
      showError(errMsg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="card fade-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1>Welcome to Askesis</h1>
        <p style={{ fontSize: 18, color: "#6b7280" }}>
          Let's personalize your study plan
        </p>
        <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 8 }}>
          Answer a few quick questions so your practice adapts to your goals.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="onboarding-exam" style={{ fontWeight: 600 }}>
          Which exam are you preparing for?
        </label>
        <select id="onboarding-exam" value={exam} onChange={(event) => setExam(event.target.value)}>
          {Object.values(EXAMS).map((definition) => (
            <option key={definition.id} value={definition.id}>{definition.displayName}</option>
          ))}
        </select>

        <label htmlFor="exam-date" style={{ fontWeight: 600, marginTop: 20 }}>
          When is your exam? <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
        </label>
        <input id="exam-date" type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} />

        <label htmlFor="target-score" style={{ fontWeight: 600, marginTop: 20 }}>
          Target score <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
        </label>
        <input id="target-score" type="number" min="1" value={targetScore} onChange={(event) => setTargetScore(event.target.value)} placeholder="e.g., 1500 for SAT" />

        <label htmlFor="weekly-hours" style={{ fontWeight: 600, marginTop: 20 }}>
          How many hours can you study per week?
        </label>
        <input id="weekly-hours" type="number" min="0" max="168" step="0.5" value={weeklyHours} onChange={(event) => setWeeklyHours(event.target.value)} />

        {error && <div className="alert alert-error" role="alert" style={{ marginTop: 16 }}>{error}</div>}
        
        <button className="btn-primary" type="submit" disabled={saving} style={{ width: "100%", marginTop: 24, fontSize: 16, fontWeight: 600, padding: "12px 24px" }}>
          {saving ? "Saving..." : "Continue to diagnostic →"}
        </button>
      </form>

      <button 
        className="btn-link" 
        type="button" 
        onClick={() => router.push("/dashboard")} 
        style={{ width: "100%", marginTop: 12, color: "#6b7280", textDecoration: "underline" }}
      >
        Skip for now
      </button>
    </main>
  );
}
