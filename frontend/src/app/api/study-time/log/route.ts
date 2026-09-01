import { NextResponse } from 'next/server';
import { mockBackend, MockStudyLog } from '@/lib/mockBackendStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const durationMinutes = Number(body.duration_minutes) || 0;

    if (durationMinutes <= 0) {
      return NextResponse.json(
        { error: 'Duration must be greater than 0 minutes.' },
        { status: 400 }
      );
    }

    const newLog: MockStudyLog = {
      id: `log-${Date.now()}`,
      duration_minutes: durationMinutes,
      topic: body.topic || 'General Practice',
      exam_type: (body.exam_type || 'SAT').toUpperCase(),
      activity_type: body.activity_type || 'Self Study',
      notes: body.notes || '',
      timestamp: new Date().toISOString(),
    };

    mockBackend.studyLogs.unshift(newLog);
    mockBackend.recalculateTotals();

    const goalHours = mockBackend.daily_study_goal_hours;
    const todayHours = mockBackend.today_study_hours;
    const percentage = goalHours > 0 ? Math.min(100, Math.round((todayHours / goalHours) * 100)) : 0;
    const streak = mockBackend.getStudyStreak();

    return NextResponse.json({
      success: true,
      message: `Successfully logged ${durationMinutes} minutes!`,
      logged_item: newLog,
      today_study_hours: todayHours,
      daily_study_goal_hours: goalHours,
      progress_percentage: percentage,
      is_goal_reached: todayHours >= goalHours,
      remaining_hours: Number(Math.max(0, goalHours - todayHours).toFixed(2)),
      logs: mockBackend.studyLogs,
      current_streak: streak.current_streak,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse study log data' },
      { status: 400 }
    );
  }
}

