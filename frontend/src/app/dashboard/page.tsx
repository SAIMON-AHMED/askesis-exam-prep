"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { DailyStudyGoalCard } from "@/components/dashboard/DailyStudyGoalCard";
import { TestDayCountdownCard } from "@/components/dashboard/TestDayCountdownCard";

interface Recommendation {
  exam_type: string;
  topic: string;
  action: string;
  reason: string;
  target_difficulty: number;
  estimated_minutes: number;
  destination: string;
}

interface AnalyticsOverview {
  total_study_hours: number;
  exams_completed: number;
  average_score: number;
  last_7_days_study_hours: number;
}

interface TopicPerformance {
  topic: string;
  mastery_score: number;
  accuracy_rate: number;
  average_time_per_question: number;
  predicted_score_low: number;
  predicted_score_high: number;
}

interface StudyPlanTask {
  day: string;
  task_key: string;
  task_title: string;
  topic: string;
  duration_minutes: number;
  completed: boolean;
}

interface StudyPlanWeek {
  week_number: number;
  theme: string;
  days: StudyPlanTask[];
}

interface ActiveStudyPlan {
  id: string;
  exam_id: string;
  target_date: string;
  target_score: number;
  weekly_hours: number;
  is_active: boolean;
  plan_json: {
    title: string;
    description: string;
    weeks: StudyPlanWeek[];
  };
  completed_tasks: string[];
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  total_study_hours: number;
  exams_completed: number;
}

// Helper to determine the best study material link based on task topic and title
function getStudyMaterialLink(task: StudyPlanTask, examId: string = "sat") {
  const text = (task.topic + " " + task.task_title).toLowerCase();

  if (text.includes("mock") || text.includes("diagnostic") || text.includes("full length") || text.includes("simulation")) {
    return "/exams";
  }

  let topicId = "algebra";
  if (text.includes("reading") || text.includes("passage") || text.includes("evidence") || text.includes("inference")) {
    topicId = "reading-comp";
  } else if (text.includes("english") || text.includes("grammar") || text.includes("punctuation") || text.includes("sentence")) {
    topicId = "grammar";
  } else if (text.includes("quadratic") || text.includes("advanced math") || text.includes("nonlinear") || text.includes("polynomial")) {
    topicId = "algebra";
  } else if (text.includes("geometry") || text.includes("circle") || text.includes("triangle")) {
    topicId = "geometry";
  } else if (text.includes("trig") || text.includes("function")) {
    topicId = "trigonometry";
  } else if (text.includes("data") || text.includes("graph") || text.includes("stat") || text.includes("problem solving")) {
    topicId = "statistics";
  } else if (text.includes("rhetoric") || text.includes("expression") || text.includes("transition")) {
    topicId = "rhetoric";
  } else if (text.includes("vocab")) {
    topicId = "vocabulary";
  }

  return `/practice?exam=${encodeURIComponent(examId)}&topic=${encodeURIComponent(topicId)}`;
}

function getTaskGuidance(task: StudyPlanTask): string {
  const text = (task.task_title + " " + task.topic).toLowerCase();
  if (text.includes("quadratic") || text.includes("nonlinear") || text.includes("advanced math")) {
    return "Master vertex form, factoring quadratics, quadratic formula applications, and nonlinear systems under timed conditions.";
  }
  if (text.includes("linear") || text.includes("algebra")) {
    return "Practice isolating variables, solving multi-step equations, inequalities, and interpreting linear models.";
  }
  if (text.includes("reading") || text.includes("evidence") || text.includes("cross-text") || text.includes("inference")) {
    return "Focus on identifying core arguments, citing textual evidence, comparing dual passages, and eliminating wrong answer traps.";
  }
  if (text.includes("punctuation") || text.includes("grammar") || text.includes("standard english")) {
    return "Drill subject-verb agreement, comma splices, apostrophes, semicolon usage, and rhetorical transitions.";
  }
  if (text.includes("data") || text.includes("graph") || text.includes("stat") || text.includes("problem solving")) {
    return "Analyze scatterplots, tables, linear regressions, unit conversions, and probability distributions.";
  }
  if (text.includes("geometry") || text.includes("trig") || text.includes("circle")) {
    return "Review radians, right triangle trigonometry, circle equations, area/volume ratios, and angle theorems.";
  }
  if (text.includes("mock") || text.includes("diagnostic") || text.includes("simulation")) {
    return "Simulate authentic exam conditions with strict section timing, scratchpad usage, and post-test error analysis.";
  }
  return `Targeted mastery of ${task.topic}. Solve practice drills, study detailed answer explanations, and note key concepts.`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [subscription, setSubscription] = useState<{ status?: string; plan_name?: string; trial_ends_at?: string | null } | null>(null);
  const [onboarding, setOnboarding] = useState<{ completed?: boolean; exam_date?: string; target_score?: number } | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);
  const [activePlan, setActivePlan] = useState<ActiveStudyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [completingTaskKey, setCompletingTaskKey] = useState<string | null>(null);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);
  const [isResettingPlan, setIsResettingPlan] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [
        recommendationRes,
        subscriptionRes,
        onboardingRes,
        userRes,
        analyticsRes,
        topicsRes,
        planRes,
      ] = await Promise.allSettled([
        api.get("/recommendations/next"),
        api.get("/subscription/me"),
        api.get("/onboarding"),
        api.get("/auth/me"),
        api.get("/analytics/overview"),
        api.get("/analytics/topic-performance"),
        api.get("/study-plan/active"),
      ]);

      if (recommendationRes.status === "fulfilled" && recommendationRes.value.data) {
        setRecommendation(recommendationRes.value.data);
      }
      if (subscriptionRes.status === "fulfilled" && subscriptionRes.value.data) {
        setSubscription(subscriptionRes.value.data);
      }
      if (onboardingRes.status === "fulfilled" && onboardingRes.value.data) {
        setOnboarding(onboardingRes.value.data);
      }
      if (userRes.status === "fulfilled" && userRes.value.data) {
        setUser(userRes.value.data);
      }
      if (analyticsRes.status === "fulfilled" && analyticsRes.value.data) {
        setAnalytics(analyticsRes.value.data);
      }
      if (topicsRes.status === "fulfilled" && topicsRes.value.data) {
        setTopicPerformance(topicsRes.value.data);
      }
      if (planRes.status === "fulfilled" && planRes.value.data) {
        setActivePlan(planRes.value.data);
      }
    } catch {
      // Continue with current state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleToggleTaskCompletion = async (taskKey: string, currentCompleted: boolean) => {
    if (!activePlan) return;
    setCompletingTaskKey(taskKey);
    try {
      const newCompleted = !currentCompleted;
      await api.patch(`/study-plan/${activePlan.id}/progress`, {
        task_key: taskKey,
        completed: newCompleted,
      });
      
      setCompletionNotice(newCompleted ? "🎉 Task marked complete! Progress updated." : "Task marked incomplete.");
      setTimeout(() => setCompletionNotice(null), 4000);
      await fetchDashboardData();
    } catch {
      // ignore
    } finally {
      setCompletingTaskKey(null);
    }
  };

  const handleResetPlanProgress = async () => {
    if (!activePlan) return;
    setIsResettingPlan(true);
    try {
      await api.patch(`/study-plan/${activePlan.id}/progress`, {
        action: "reset",
      });
      
      setCompletionNotice("🔄 Roadmap progress reset! You're starting fresh from Week 1.");
      setTimeout(() => setCompletionNotice(null), 4000);
      setShowResetModal(false);
      await fetchDashboardData();
    } catch {
      setCompletionNotice("Failed to reset roadmap progress. Please try again.");
      setTimeout(() => setCompletionNotice(null), 4000);
    } finally {
      setIsResettingPlan(false);
    }
  };

  const trialEndsAt = subscription?.trial_ends_at ? new Date(subscription.trial_ends_at) : null;
  const trialRemainingMs = trialEndsAt ? trialEndsAt.getTime() - Date.now() : 0;
  const trialRemainingDays = trialRemainingMs > 0 ? Math.ceil(trialRemainingMs / (1000 * 60 * 60 * 24)) : 0;
  const trialLabel = trialRemainingDays > 1 ? `${trialRemainingDays} days` : trialRemainingDays === 1 ? "1 day" : "today";
  const trialReminder =
    subscription?.status === "trialing" && trialEndsAt && trialRemainingMs > 0
      ? trialRemainingDays <= 1
        ? { title: "Your trial ends today", text: "Upgrade before midnight to keep full access to premium features.", tone: "warning" }
        : trialRemainingDays <= 2
          ? { title: "Your trial is almost over", text: `You have ${trialLabel} left in your trial. Upgrade now to keep your access.`, tone: "info" }
          : { title: "Your trial is still active", text: `You have ${trialLabel} left in your premium trial. Upgrade before it ends to keep full access.`, tone: "info" }
      : subscription && subscription.plan_name !== "free" && subscription.status === "canceled"
        ? { title: "Your trial has expired", text: "Your premium trial ended. Upgrade to keep full access and continue your progress.", tone: "warning" }
        : null;

  // Compute real-time active plan stats & extract immediate next task + upcoming queue
  let totalPlanTasks = 0;
  let completedPlanTasks = 0;
  let nextScheduledTask: (StudyPlanTask & { weekNumber: number; weekTheme: string }) | null = null;
  const upcomingQueue: Array<StudyPlanTask & { weekNumber: number; weekTheme: string }> = [];

  if (activePlan?.plan_json?.weeks) {
    for (const week of activePlan.plan_json.weeks) {
      for (const day of week.days) {
        totalPlanTasks++;
        const isDone = day.completed || activePlan.completed_tasks?.includes(day.task_key);
        if (isDone) {
          completedPlanTasks++;
        } else {
          const taskWithWeek = {
            ...day,
            weekNumber: week.week_number,
            weekTheme: week.theme,
          };
          if (!nextScheduledTask) {
            nextScheduledTask = taskWithWeek;
          } else if (upcomingQueue.length < 2) {
            upcomingQueue.push(taskWithWeek);
          }
        }
      }
    }
  }

  const planProgressPercent = totalPlanTasks > 0 ? Math.round((completedPlanTasks / totalPlanTasks) * 100) : 0;

  // Calculate days remaining until target exam date
  let daysUntilExam: number | null = null;
  const targetDateStr = activePlan?.target_date || onboarding?.exam_date;
  if (targetDateStr) {
    const targetTime = new Date(targetDateStr).getTime();
    const diff = targetTime - Date.now();
    if (diff > 0) {
      daysUntilExam = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
  }

  // Sort topics to find areas needing focus
  const weakTopics = [...topicPerformance]
    .sort((a, b) => a.accuracy_rate - b.accuracy_rate)
    .slice(0, 3);

  const clickableCard = (href: string) => ({
    role: "link" as const,
    tabIndex: 0,
    onClick: () => router.push(href),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push(href);
      }
    },
    style: { cursor: "pointer" },
  });

  const nextStudyLink = nextScheduledTask ? getStudyMaterialLink(nextScheduledTask, activePlan?.exam_id || "sat") : "/practice";

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "48px" }}>
      {/* 1. Header & Live Account Activity Highlights */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ marginBottom: "6px", fontSize: "28px", fontWeight: 700, color: "#0f172a" }}>
              Welcome back, {user?.full_name ? user.full_name.split(" ")[0] : "Scholar"} 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
              Here is your real-time student activity, study consistency, and exam readiness.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              <span style={{ fontSize: "15px" }}>⏱️</span>
              <span>{analytics?.total_study_hours ?? 0}h Logged</span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                fontSize: "13px",
                fontWeight: 600,
                color: "#166534",
              }}
            >
              <span style={{ fontSize: "15px" }}>🎯</span>
              <span>{analytics?.average_score ?? 0}% Avg Accuracy</span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "#eef2ff",
                border: "1px solid #c7d2fe",
                fontSize: "13px",
                fontWeight: 600,
                color: "#3730a3",
              }}
            >
              <span style={{ fontSize: "15px" }}>📝</span>
              <span>{analytics?.exams_completed ?? 0} Completed Tests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Toast Notification */}
      {completionNotice && (
        <div
          className="fade-in"
          style={{
            marginBottom: "20px",
            padding: "12px 18px",
            borderRadius: "10px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{completionNotice}</span>
          <button
            type="button"
            onClick={() => setCompletionNotice(null)}
            style={{ background: "transparent", border: "none", color: "#065f46", cursor: "pointer", fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Trial Expiration / Onboarding Notices */}
      {trialReminder && (
        <div
          className="card fade-in"
          style={{
            borderLeft: `4px solid ${trialReminder.tone === "warning" ? "#f59e0b" : "var(--color-primary)"}`,
            background: trialReminder.tone === "warning" ? "#fff9eb" : "#edf6ff",
            marginBottom: 20,
            padding: 16,
          }}
        >
          <h2 className="card-title" style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>
            {trialReminder.title}
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: "#6b7280" }}>{trialReminder.text}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/subscription" className="btn-primary" style={{ padding: "8px 16px", fontSize: 14 }}>
              Upgrade now
            </Link>
            <Link href="/subscription" className="btn-secondary" style={{ padding: "8px 16px", fontSize: 14 }}>
              View plans
            </Link>
          </div>
        </div>
      )}

      {onboarding && !onboarding.completed && (
        <div className="card fade-in" style={{ borderLeft: "4px solid #f59e0b", background: "#fff9eb", marginBottom: 20, padding: 16 }}>
          <h2 className="card-title" style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>
            📋 Complete your study setup
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: "#6b7280" }}>
            Tell us your exam date and target score so we can build a better plan for you.
          </p>
          <Link href="/onboarding" className="btn-primary" style={{ display: "inline-block", padding: "8px 16px", fontSize: 14 }}>
            Finish onboarding →
          </Link>
        </div>
      )}

      {/* 2. Target Test Day Countdown & Exam Milestones */}
      <div style={{ marginBottom: "24px" }}>
        <TestDayCountdownCard
          initialExamDate={onboarding?.exam_date}
          initialTargetExam={activePlan?.exam_id || "SAT"}
          initialTargetScore={activePlan?.target_score || onboarding?.target_score}
        />
      </div>

      {/* 3. Daily Study Goal Progress Tracker & Time Logger */}
      <div style={{ marginBottom: "24px" }}>
        <DailyStudyGoalCard />
      </div>

      {/* 4. Enhanced Active Study Plan Section & Immediate Next Learning Task */}
      {activePlan ? (
        <section
          className="card fade-in"
          style={{
            marginBottom: "24px",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
          }}
        >
          {/* Plan Meta Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "#e0e7ff",
                    color: "#3730a3",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {activePlan.exam_id?.toUpperCase() || "SAT"} Roadmap
                </span>
                {daysUntilExam !== null && (
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: "#fef3c7",
                      color: "#92400e",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    ⏳ Exam in {daysUntilExam} days
                  </span>
                )}
                {activePlan.target_score && (
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: "#f0fdf4",
                      color: "#166534",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    🎯 Target: {activePlan.target_score}
                  </span>
                )}
                {activePlan.weekly_hours && (
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: "#f1f5f9",
                      color: "#475569",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {activePlan.weekly_hours} hrs/wk
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                {activePlan.plan_json?.title || "Adaptive Study Plan"}
              </h2>
              <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
                {activePlan.plan_json?.description || "Personalized progression designed to maximize your exam score."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                id="reset-study-plan-btn"
                type="button"
                onClick={() => setShowResetModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                title="Reset all completed tasks for this roadmap to start fresh"
              >
                <span>🔄</span>
                <span>Reset Progress</span>
              </button>

              <Link href="/study-plan" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                Full Roadmap Calendar →
              </Link>
            </div>
          </div>

          {/* Dynamic Progress Bar */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#475569", marginBottom: "6px", fontWeight: 500 }}>
              <span>
                Roadmap Completion: <strong>{completedPlanTasks} of {totalPlanTasks} tasks finished</strong>
              </span>
              <span style={{ fontWeight: 700, color: "#2563eb" }}>{planProgressPercent}%</span>
            </div>
            <div style={{ width: "100%", height: "10px", borderRadius: "999px", background: "#f1f5f9", overflow: "hidden" }}>
              <div
                style={{
                  width: `${planProgressPercent}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>

          {/* Highlighted Next Immediate Learning Task Card */}
          {nextScheduledTask ? (
            <div
              style={{
                borderRadius: "14px",
                border: "2px solid #3b82f6",
                background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
                padding: "20px",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.08)",
                marginBottom: upcomingQueue.length > 0 ? "18px" : "0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    🔥 Immediate Next Task
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: "#dbeafe",
                      color: "#1e40af",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Week {nextScheduledTask.weekNumber} • {nextScheduledTask.day}
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: "#f1f5f9",
                      color: "#475569",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    ⏱️ {nextScheduledTask.duration_minutes || 45} mins
                  </span>
                </div>

                {/* Quick Checkoff Button */}
                <button
                  type="button"
                  disabled={completingTaskKey === nextScheduledTask.task_key}
                  onClick={() => handleToggleTaskCompletion(nextScheduledTask!.task_key, false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#334155",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  title="Mark as completed"
                >
                  <span>{completingTaskKey === nextScheduledTask.task_key ? "Updating..." : "✓ Mark Complete"}</span>
                </button>
              </div>

              {/* Task Title & Topic */}
              <div style={{ marginBottom: "10px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                  {nextScheduledTask.task_title}
                </h3>
                <div style={{ fontSize: "13px", color: "#2563eb", fontWeight: 600 }}>
                  Focus Topic: {nextScheduledTask.topic}
                </div>
              </div>

              {/* Learning Guidance / Conceptual Overview */}
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.5, margin: "0 0 18px" }}>
                {getTaskGuidance(nextScheduledTask)}
              </p>

              {/* Direct Study Material Action Links */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <Link
                  href={nextStudyLink}
                  className="btn-primary"
                  style={{
                    padding: "9px 18px",
                    fontSize: "14px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>🚀 Jump In: Practice {nextScheduledTask.topic}</span>
                </Link>

                <Link
                  href="/review"
                  className="btn-secondary"
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>📖 Review Flashcards & Errors</span>
                </Link>

                <Link
                  href="/study-plan"
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    textDecoration: "underline",
                    marginLeft: "4px",
                  }}
                >
                  View in roadmap
                </Link>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#166534", marginBottom: "4px" }}>
                  🎉 All scheduled roadmap tasks are complete!
                </div>
                <div style={{ fontSize: "13px", color: "#15803d" }}>
                  You have fulfilled all milestones in your active study plan. Take a full practice exam to test your readiness.
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    border: "1px solid #86efac",
                    background: "#ffffff",
                    color: "#166534",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>🔄</span>
                  <span>Restart Roadmap</span>
                </button>
                <Link href="/exams" className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                  Take Full Practice Exam
                </Link>
              </div>
            </div>
          )}

          {/* Upcoming Subsequent Tasks Preview */}
          {upcomingQueue.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.05em", marginBottom: "8px" }}>
                Coming Up Next in Your Schedule
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {upcomingQueue.map((item) => (
                  <div
                    key={item.task_key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          background: "#e2e8f0",
                          color: "#334155",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      >
                        {item.day}
                      </span>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                          {item.task_title}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          Week {item.weekNumber} • {item.topic} • {item.duration_minutes || 45} mins
                        </div>
                      </div>
                    </div>

                    <Link
                      href={getStudyMaterialLink(item, activePlan.exam_id || "sat")}
                      className="btn-secondary"
                      style={{ padding: "5px 10px", fontSize: "12px" }}
                    >
                      Study Material →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section
          className="card fade-in"
          style={{
            marginBottom: "24px",
            padding: "24px",
            borderRadius: "16px",
            border: "1px dashed #cbd5e1",
            background: "#f8fafc",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>
            📅 Build Your Personalized Study Plan
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 16px" }}>
            Generate a targeted weekly roadmap tailored to your target exam date, score goal, and weekly availability.
          </p>
          <Link href="/study-plan" className="btn-primary" style={{ padding: "8px 18px", fontSize: "14px" }}>
            Generate Study Plan Now
          </Link>
        </section>
      )}

      {/* 4. AI Recommendation Banner */}
      {recommendation && (
        <section
          className="card fade-in"
          style={{
            borderLeft: "4px solid var(--color-primary)",
            marginBottom: "24px",
            padding: "20px 24px",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span className="badge" style={{ background: "#e0f2fe", color: "#0369a1", fontWeight: 700 }}>
              AI Targeted Practice
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Estimated {recommendation.estimated_minutes} mins
            </span>
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginTop: 4, marginBottom: 6, color: "#0f172a" }}>
            {recommendation.action === "diagnostic" ? "Find your starting diagnostic baseline" : recommendation.topic || "Targeted Skill Revision"}
          </h2>
          <p style={{ color: "#475569", fontSize: "14px", margin: "0 0 14px" }}>
            {recommendation.reason}
          </p>
          <button
            className="btn-primary"
            type="button"
            onClick={() => router.push(recommendation.destination)}
            style={{ padding: "9px 18px", fontSize: "14px", fontWeight: 600 }}
          >
            {recommendation.action === "diagnostic" ? "Take Diagnostic" : `Start ${recommendation.action}`}
          </button>
        </section>
      )}

      {/* 5. Live Skill Mastery & Weak Topics vs Schedule Split */}
      <div className="grid-2" style={{ marginBottom: "24px" }}>
        {/* Weak Topics Real-Time Status */}
        <div className="card card-link" {...clickableCard("/analytics")} style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span className="badge" style={{ background: "#fee2e2", color: "#991b1b", fontWeight: 700 }}>
              Focus Areas
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>From recent drills</span>
          </div>

          <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>
            Skill Mastery & Weak Topics
          </h3>

          {weakTopics.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "12px 0 16px" }}>
              {weakTopics.map((topic) => (
                <div key={topic.topic}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{topic.topic}</span>
                    <span style={{ color: topic.accuracy_rate < 85 ? "#b45309" : "#15803d", fontWeight: 700 }}>
                      {topic.accuracy_rate}% Acc
                    </span>
                  </div>
                  <div style={{ width: "100%", height: "6px", borderRadius: "999px", background: "#f1f5f9", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${topic.accuracy_rate}%`,
                        height: "100%",
                        borderRadius: "999px",
                        background: topic.accuracy_rate < 85 ? "#f59e0b" : "#10b981",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 16px" }}>
              Complete practice questions to analyze your mastery across every exam topic.
            </p>
          )}

          <Link href="/analytics" className="btn-secondary" onClick={(e) => e.stopPropagation()} style={{ fontSize: "13px", padding: "6px 12px" }}>
            View Full Analytics →
          </Link>
        </div>

        {/* Practice Hub Quick Start */}
        <div className="card card-link" {...clickableCard("/practice")} style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span className="badge" style={{ background: "#dcfce7", color: "#15803d", fontWeight: 700 }}>
              Adaptive Practice
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Instant feedback</span>
          </div>

          <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>
            Sharpen Specific Concepts
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 16px" }}>
            Choose specific difficulty levels, filter by subject area, or drill under timed exam conditions.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "auto" }}>
            <Link href="/practice" className="btn-primary" onClick={(e) => e.stopPropagation()} style={{ fontSize: "13px", padding: "7px 14px" }}>
              Start Practice Session
            </Link>
            <Link href="/exams" className="btn-secondary" onClick={(e) => e.stopPropagation()} style={{ fontSize: "13px", padding: "7px 14px" }}>
              Full Practice Exams
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Quick Navigational Grid */}
      <div className="grid-2">
        <div className="card card-link" {...clickableCard("/exams")} style={{ padding: "18px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 4px", color: "#0f172a" }}>📚 My Exams & Curricula</h3>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px" }}>
            Access full-length multi-section tests for SAT, ACT, GRE, GMAT, SHSAT, and Regents.
          </p>
          <Link href="/exams" className="btn-secondary" onClick={(e) => e.stopPropagation()} style={{ fontSize: "12px", padding: "6px 12px" }}>
            Explore All Exams
          </Link>
        </div>

        <div className="card card-link" {...clickableCard("/study-plan")} style={{ padding: "18px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 4px", color: "#0f172a" }}>📅 Full Study Roadmap</h3>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px" }}>
            Review your weekly task breakdown, manage study calendar, and calibrate target score goals.
          </p>
          <Link href="/study-plan" className="btn-secondary" onClick={(e) => e.stopPropagation()} style={{ fontSize: "12px", padding: "6px 12px" }}>
            Open Study Schedule
          </Link>
        </div>
      </div>

      {/* Reset Study Plan Progress Confirmation Modal */}
      {showResetModal && activePlan && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => !isResettingPlan && setShowResetModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              maxWidth: "460px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  flexShrink: 0,
                }}
              >
                🔄
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                  Reset Roadmap Progress?
                </h3>
                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                  {activePlan.exam_id?.toUpperCase() || "Exam"} • {activePlan.plan_json?.title || "Study Plan"}
                </div>
              </div>
            </div>

            <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#475569", lineHeight: 1.5 }}>
              Are you sure you want to reset your progress? This will uncheck all <strong>{completedPlanTasks} completed task{completedPlanTasks === 1 ? "" : "s"}</strong> across all roadmap weeks so you can start fresh from Week 1.
            </p>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "8px",
                padding: "12px 14px",
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              💡 <em>Note: Your past study logs, mock exam scores, and flashcard reviews will remain safely saved in your analytics history.</em>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                disabled={isResettingPlan}
                onClick={() => setShowResetModal(false)}
                style={{
                  padding: "9px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                id="confirm-reset-plan-btn"
                type="button"
                disabled={isResettingPlan}
                onClick={handleResetPlanProgress}
                style={{
                  padding: "9px 18px",
                  fontSize: "13px",
                  fontWeight: 700,
                  borderRadius: "8px",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  border: "none",
                  cursor: isResettingPlan ? "not-allowed" : "pointer",
                  opacity: isResettingPlan ? 0.7 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{isResettingPlan ? "Resetting..." : "Yes, Reset Progress"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

