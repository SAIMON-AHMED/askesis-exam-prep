import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST() {
  mockBackend.subscription.plan_name = 'free';
  mockBackend.subscription.status = 'active';
  return NextResponse.json({ message: 'Subscription cancelled successfully' });
}
