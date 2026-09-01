import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const newGoal = Number(body.daily_study_goal_hours);

    if (!newGoal || newGoal <= 0 || newGoal > 24) {
      return NextResponse.json(
        { error: 'Daily study goal must be between 0.25 and 24 hours.' },
        { status: 400 }
      );
    }

    mockBackend.daily_study_goal_hours = Number(newGoal.toFixed(2));
    const todayHours = mockBackend.today_study_hours;
    const percentage = newGoal > 0 ? Math.min(100, Math.round((todayHours / newGoal) * 100)) : 0;

    return NextResponse.json({
      success: true,
      daily_study_goal_hours: mockBackend.daily_study_goal_hours,
      today_study_hours: todayHours,
      progress_percentage: percentage,
      is_goal_reached: todayHours >= mockBackend.daily_study_goal_hours,
      remaining_hours: Number(Math.max(0, mockBackend.daily_study_goal_hours - todayHours).toFixed(2)),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update daily study goal.' },
      { status: 400 }
    );
  }
}
