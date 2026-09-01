import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  mockBackend.recalculateTotals();
  const todayHours = mockBackend.today_study_hours;
  const goalHours = mockBackend.daily_study_goal_hours;
  const weeklyHours = mockBackend.onboarding.weekly_study_hours || 10;
  const percentage = goalHours > 0 ? Math.min(100, Math.round((todayHours / goalHours) * 100)) : 0;
  const streak = mockBackend.getStudyStreak();

  return NextResponse.json({
    today_study_hours: Number(todayHours.toFixed(2)),
    daily_study_goal_hours: Number(goalHours.toFixed(2)),
    weekly_target_hours: weeklyHours,
    progress_percentage: percentage,
    is_goal_reached: todayHours >= goalHours,
    remaining_hours: Number(Math.max(0, goalHours - todayHours).toFixed(2)),
    daily_goal_reminder_enabled: mockBackend.settings.daily_goal_reminder_enabled ?? true,
    daily_goal_reminder_time: mockBackend.settings.daily_goal_reminder_time || '20:00',
    logs: mockBackend.studyLogs,
    current_streak: streak.current_streak,
  });
}

