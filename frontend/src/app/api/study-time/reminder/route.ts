import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  return NextResponse.json({
    daily_goal_reminder_enabled: mockBackend.settings.daily_goal_reminder_enabled ?? true,
    daily_goal_reminder_time: mockBackend.settings.daily_goal_reminder_time || '20:00',
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const enabled = Boolean(body.daily_goal_reminder_enabled);
    const reminderTime = body.daily_goal_reminder_time || '20:00';

    mockBackend.settings.daily_goal_reminder_enabled = enabled;
    mockBackend.settings.daily_goal_reminder_time = reminderTime;

    return NextResponse.json({
      success: true,
      daily_goal_reminder_enabled: enabled,
      daily_goal_reminder_time: reminderTime,
      message: enabled
        ? 'Daily study goal push notifications enabled for 8:00 PM.'
        : 'Daily study goal push notifications disabled.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update reminder settings' },
      { status: 400 }
    );
  }
}
