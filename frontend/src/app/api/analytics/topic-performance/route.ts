import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const grouped = new Map<string, { totalHours: number; sessions: number }>();
  for (const log of mockBackend.studyLogs) {
    const current = grouped.get(log.topic) || { totalHours: 0, sessions: 0 };
    current.totalHours += log.duration_minutes / 60;
    current.sessions += 1;
    grouped.set(log.topic, current);
  }

  return NextResponse.json(Array.from(grouped, ([topic, value]) => ({
    topic,
    accuracy: 0,
    total_questions: value.sessions,
    time_per_question: undefined,
    study_hours: Number(value.totalHours.toFixed(2)),
  })));
}
