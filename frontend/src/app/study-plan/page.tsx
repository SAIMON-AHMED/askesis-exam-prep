"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useExam } from "@/context/ExamContext";

function taskKey(weekNumber: number, day: string, taskIndex: number) {
  return `${weekNumber}-${day}-${taskIndex}`;
}

function countTasks(plan: any): number {
  let total = 0;
  for (const week of plan?.weeks || []) {
    for (const day of week.daily_tasks || []) {
      total += (day.tasks || []).length;
    }
  }
  return total;
}

export default function StudyPlanPage() {
  const { selectedExam } = useExam();
  const [examDate, setExamDate] = useState("");
  const [targetScore, setTargetScore] = useState(1400);
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [plan, setPlan] = useState<any | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const examIdQuery = selectedExam?.id ? `?exam_id=${encodeURIComponent(selectedExam.id)}` : '';
    api
      .get(`/study-plan/active${examIdQuery}`)
      .then((res) => {
        setPlan(res.data.plan_json);
        setPlanId(res.data.id);
        setIsSaved(true);
        setCompletedTasks(res.data.completed_tasks || {});
      })
      .catch(() => {
        // no saved plan yet, that's fine
      });
  }, [selectedExam?.id]);

  async function generatePlan() {
    setLoading(true);
    setError(null);
    setSaveStatus(null);
    try {
      const res = await api.post("/study-plan/generate", {
        exam_date: examDate ? new Date(examDate).toISOString() : null,
        target_score: targetScore,
        weak_topics: [],
        available_weekly_hours: weeklyHours,
      });
      setPlan(res.data.plan_json);
      setPlanId(res.data.id);
      setIsSaved(false);
      setCompletedTasks({});
    } catch (err: any) {
      setPlan(null);
      setPlanId(null);
      setError(err?.response?.data?.detail || "Failed to generate study plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function savePlan() {
    if (!planId) return;
    try {
      await api.post(`/study-plan/${planId}/activate`);
      setIsSaved(true);
      setSaveStatus("Plan saved to your profile. Your progress will be tracked here.");
    } catch {
      setSaveStatus("Failed to save the plan. Please try again.");
    }
  }

  async function toggleTask(key: string, completed: boolean) {
    if (!planId) return;
    setCompletedTasks((prev) => {
      const next = { ...prev };
      if (completed) next[key] = true;
      else delete next[key];
      return next;
    });
    try {
      await api.patch(`/study-plan/${planId}/progress`, { task_key: key, completed });
    } catch {
      // revert on failure
      setCompletedTasks((prev) => {
        const next = { ...prev };
        if (completed) delete next[key];
        else next[key] = true;
        return next;
      });
    }
  }

  const totalTasks = countTasks(plan);
  const completedCount = Object.keys(completedTasks).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div>
      <h1>Study Plan</h1>
      <div className="card">
        <label htmlFor="plan-exam-date">Exam date</label>
        <input
          id="plan-exam-date"
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />
        <label htmlFor="plan-target-score">Target score</label>
        <input
          id="plan-target-score"
          type="number"
          value={targetScore}
          onChange={(e) => setTargetScore(Number(e.target.value))}
        />
        <label htmlFor="plan-weekly-hours">Available weekly hours</label>
        <input
          id="plan-weekly-hours"
          type="number"
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(Number(e.target.value))}
        />
        <button className="btn-primary" onClick={generatePlan} disabled={loading}>
          {loading ? "Generating..." : "Generate plan"}
        </button>
      </div>

      {error && (
        <div className="alert alert-error fade-in" role="alert">
          {error}
        </div>
      )}

      {saveStatus && (
        <div className="alert alert-success fade-in" role="status">
          {saveStatus}
        </div>
      )}

      {plan && (
        <div className="fade-in">
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h2 className="card-title">
                  {isSaved ? "Your saved plan" : "Preview"}
                </h2>
                {totalTasks > 0 && (
                  <>
                    <p>
                      Progress: {completedCount} / {totalTasks} tasks complete ({progressPercent}%)
                    </p>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </>
                )}
              </div>
              {!isSaved && (
                <button className="btn-primary" onClick={savePlan}>
                  Save this plan
                </button>
              )}
            </div>
          </div>

          {(plan.weeks || []).map((week: any) => (
            <div className="card" key={week.week_number}>
              <span className="badge">Week {week.week_number}</span>
              <h2 className="card-title" style={{ marginTop: 8 }}>
                Focus: {(week.focus_topics || []).join(", ")}
              </h2>

              {(week.daily_tasks || []).length > 0 && (
                <div style={{ marginBottom: "var(--space-3)" }}>
                  <h3>Daily tasks</h3>
                  {week.daily_tasks.map((day: any) => (
                    <div key={day.day} style={{ marginBottom: "var(--space-2)" }}>
                      <strong>{day.day}</strong>
                      {(day.tasks || []).map((task: string, idx: number) => {
                        const key = taskKey(week.week_number, day.day, idx);
                        const checked = !!completedTasks[key];
                        return (
                          <label
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                              marginTop: 4,
                              cursor: isSaved ? "pointer" : "default",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={!isSaved}
                              onChange={(e) => toggleTask(key, e.target.checked)}
                              style={{ marginTop: 4 }}
                            />
                            <span
                              style={{
                                textDecoration: checked ? "line-through" : "none",
                                color: checked ? "var(--color-text-secondary)" : "var(--color-text)",
                              }}
                            >
                              {task}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {(week.recommended_question_sets || []).length > 0 && (
                <p>
                  <strong>Recommended question sets:</strong>{" "}
                  {week.recommended_question_sets.join(", ")}
                </p>
              )}

              {(week.recommended_mock_exams || []).length > 0 && (
                <p>
                  <strong>Recommended mock exams:</strong> {week.recommended_mock_exams.join(", ")}
                </p>
              )}

              {(week.review_sessions || []).length > 0 && (
                <p>
                  <strong>Review sessions:</strong> {week.review_sessions.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
