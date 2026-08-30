import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const grouped = new Map<string, { total_hours: number; session_count: number }>();
  for (const log of mockBackend.studyLogs) {
    const current = grouped.get(log.exam_type) || { total_hours: 0, session_count: 0 };
    current.total_hours += log.duration_minutes / 60;
    current.session_count += 1;
    grouped.set(log.exam_type, current);
  }

  return NextResponse.json(Array.from(grouped, ([exam_type, value]) => ({
    exam_type,
    total_hours: Number(value.total_hours.toFixed(2)),
    session_count: value.session_count,
  })));
}
