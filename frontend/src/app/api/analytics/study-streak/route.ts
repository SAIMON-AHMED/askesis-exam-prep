import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const studiedDates = new Set(mockBackend.studyLogs.map((log) => log.timestamp.slice(0, 10)));
  let currentStreak = 0;
  const date = new Date();
  while (studiedDates.has(date.toISOString().slice(0, 10))) {
    currentStreak += 1;
    date.setDate(date.getDate() - 1);
  }

  return NextResponse.json({
    current_streak: currentStreak,
    longest_streak: currentStreak,
    streak_unit: 'days',
  });
}
