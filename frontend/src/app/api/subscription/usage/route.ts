import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const isPro = mockBackend.subscription.plan_name === 'pro' || mockBackend.subscription.plan_name === 'premium';
  return NextResponse.json({
    plan: mockBackend.subscription.plan_name,
    status: mockBackend.subscription.status,
    limits: {
      questions_per_day: isPro ? 999 : 5,
      exams_per_month: isPro ? 999 : 1,
    },
    current_usage: {
      questions_today: mockBackend.questionsTodayCount,
      exams_this_month: mockBackend.user.exams_completed,
    },
  });
}
