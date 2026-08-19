"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

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
      <h1>Dashboard</h1>
      <div className="card fade-in">
        <h2 className="card-title">Welcome back</h2>
        <p>Pick up where you left off, or jump straight into a practice session.</p>
      </div>

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
