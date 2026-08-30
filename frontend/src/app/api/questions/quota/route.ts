import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const isPro = mockBackend.subscription.plan_name === 'pro' || mockBackend.subscription.plan_name === 'premium';
  return NextResponse.json({
    is_premium: isPro,
    questions_today: mockBackend.questionsTodayCount,
    daily_limit: isPro ? null : 20,
    remaining: isPro ? null : Math.max(0, 20 - mockBackend.questionsTodayCount),
  });
}
