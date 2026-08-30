import { NextResponse } from 'next/server';
import { mockBackend, MockStudyLog } from '@/lib/mockBackendStore';

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

    const durationHours = durationMinutes / 60;
    mockBackend.today_study_hours = Number((mockBackend.today_study_hours + durationHours).toFixed(2));
    mockBackend.user.total_study_hours = Number((mockBackend.user.total_study_hours + durationHours).toFixed(2));

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

    const goalHours = mockBackend.daily_study_goal_hours;
    const todayHours = mockBackend.today_study_hours;
    const percentage = goalHours > 0 ? Math.min(100, Math.round((todayHours / goalHours) * 100)) : 0;

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
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse study log data' },
      { status: 400 }
    );
  }
}
