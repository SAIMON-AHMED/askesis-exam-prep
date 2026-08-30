"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Recommendation {
  exam_type: string;
  topic: string;
  action: string;
  reason: string;
  target_difficulty: number;
  estimated_minutes: number;
  destination: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [subscription, setSubscription] = useState<{ status?: string; trial_ends_at?: string | null } | null>(null);
  const [onboarding, setOnboarding] = useState<{ completed?: boolean } | null>(null);

  useEffect(() => {
    Promise.allSettled([
      api.get("/recommendations/next"),
      api.get("/subscription/me"),
      api.get("/onboarding"),
    ]).then(([recommendationResult, subscriptionResult, onboardingResult]) => {
      if (recommendationResult.status === "fulfilled") {
        setRecommendation(recommendationResult.value.data);
      }
      if (subscriptionResult.status === "fulfilled") {
        setSubscription(subscriptionResult.value.data);
      }
      if (onboardingResult.status === "fulfilled") {
        setOnboarding(onboardingResult.value.data);
      }
    }).catch(() => {});
  }, []);

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

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 8 }}>Welcome back 👋</h1>
        <p style={{ color: "#6b7280", fontSize: 16 }}>Continue where you left off</p>
      </div>

      {trialReminder && (
        <div
          className="card fade-in"
          style={{
            borderLeft: `4px solid ${trialReminder.tone === "warning" ? "#f59e0b" : "var(--color-primary)"}`,
            background: trialReminder.tone === "warning" ? "#fff9eb" : "#edf6ff",
            marginBottom: 16,
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
        <div className="card fade-in" style={{ borderLeft: "4px solid #f59e0b", background: "#fff9eb", marginBottom: 16, padding: 16 }}>
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

      <div className="card fade-in">
        <h2 className="card-title">Welcome back</h2>
        <p>Pick up where you left off, or jump straight into a practice session.</p>
      </div>

      {recommendation && (
        <section className="card fade-in" style={{ borderLeft: "4px solid var(--color-primary)" }}>
          <span className="badge">Recommended next</span>
          <h2 style={{ marginTop: 8 }}>{recommendation.action === "diagnostic" ? "Find your starting point" : recommendation.topic || "Review your progress"}</h2>
          <p>{recommendation.reason} About {recommendation.estimated_minutes} minutes.</p>
          <button className="btn-primary" type="button" onClick={() => router.push(recommendation.destination)}>
            {recommendation.action === "diagnostic" ? "Take diagnostic" : `Start ${recommendation.action}`}
          </button>
        </section>
      )}

      <div className="grid-2">
        <div className="card card-link" {...clickableCard("/analytics")}>
          <span className="badge">Progress</span>
          <h3 style={{ marginTop: 8 }}>Weak topics</h3>
          <p>See the topics that need the most attention in your analytics.</p>
          <Link href="/analytics" className="btn-secondary" onClick={(e) => e.stopPropagation()}>
            View analytics
          </Link>
        </div>
        <div className="card card-link" {...clickableCard("/study-plan")}>
          <span className="badge">This week</span>
          <h3 style={{ marginTop: 8 }}>Upcoming study tasks</h3>
          <p>Your scheduled study sessions from your study plan show up here.</p>
          <Link href="/study-plan" className="btn-secondary" onClick={(e) => e.stopPropagation()}>
            Open study plan
          </Link>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-link" {...clickableCard("/practice")}>
          <h3>Practice</h3>
          <p>Sharpen a specific topic with adaptive practice questions.</p>
          <Link href="/practice" className="btn-primary" onClick={(e) => e.stopPropagation()}>
            Start a practice session
          </Link>
        </div>
        <div className="card card-link" {...clickableCard("/exams")}>
          <h3>My Exams</h3>
          <p>Browse your exams, unlock new ones, and dive into the curriculum.</p>
          <Link href="/exams" className="btn-primary" onClick={(e) => e.stopPropagation()}>
            Go to exams
          </Link>
        </div>
      </div>
    </div>
  );
}
