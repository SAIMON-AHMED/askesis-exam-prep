import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const examId = url.searchParams.get('exam_id');

  let activePlan;
  if (examId) {
    // If exam_id is provided, return the plan for that exam (regardless of active status)
    activePlan = mockBackend.studyPlans.find((p) => p.exam_id === examId.toLowerCase());
  } else {
    // If no exam_id provided, return the currently active plan
    activePlan = mockBackend.studyPlans.find((p) => p.is_active) || mockBackend.studyPlans[0];
  }
  
  if (!activePlan) {
    return NextResponse.json(null);
  }
  return NextResponse.json(activePlan);
}
