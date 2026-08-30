import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  return NextResponse.json({
    total_study_hours: mockBackend.user.total_study_hours,
    exams_completed: mockBackend.user.exams_completed,
    average_score: 1510,
    last_7_days_study_hours: 8.4,
  });
}
