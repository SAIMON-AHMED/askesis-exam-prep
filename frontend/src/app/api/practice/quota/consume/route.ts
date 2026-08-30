import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST() {
  mockBackend.questionsTodayCount += 1;
  const isPro = mockBackend.subscription.plan_name === 'pro' || mockBackend.subscription.plan_name === 'premium';
  return NextResponse.json({
    questions_today: mockBackend.questionsTodayCount,
    remaining: isPro ? null : Math.max(0, 20 - mockBackend.questionsTodayCount),
  });
}
