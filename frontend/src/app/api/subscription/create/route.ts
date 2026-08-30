import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { plan_name } = body;
    if (plan_name) {
      mockBackend.subscription.plan_name = plan_name;
      mockBackend.subscription.status = 'active';
    }
    return NextResponse.json(mockBackend.subscription);
  } catch {
    return NextResponse.json(mockBackend.subscription);
  }
}
