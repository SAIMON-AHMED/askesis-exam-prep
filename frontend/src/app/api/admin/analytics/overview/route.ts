import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_sessions_today: 432,
    avg_session_duration_minutes: 28.5,
    exam_completion_rate: 89.2,
    active_subscriptions: 385,
    mrr_usd: 5820.0,
  });
}
