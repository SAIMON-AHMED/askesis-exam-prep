import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const activePlan = mockBackend.studyPlans.find((p) => p.is_active) || mockBackend.studyPlans[0];
  if (!activePlan) {
    return NextResponse.json(null);
  }
  return NextResponse.json(activePlan);
}
