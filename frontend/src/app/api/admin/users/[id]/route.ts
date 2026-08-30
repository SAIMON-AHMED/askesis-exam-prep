import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    id,
    email: 'alex.mercer@gmail.com',
    full_name: 'Alex Mercer',
    role: 'student',
    status: 'active',
    plan: 'pro',
    created_at: '2026-01-15T10:00:00Z',
    study_hours: 24.5,
    exams_completed: 6,
  });
}
