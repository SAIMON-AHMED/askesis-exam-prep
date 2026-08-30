import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });
  return NextResponse.json(
    days.map((date) => ({
      date: date.toISOString().slice(0, 10),
      study_hours: Number(mockBackend.studyLogs
        .filter((log) => log.timestamp.slice(0, 10) === date.toISOString().slice(0, 10))
        .reduce((total, log) => total + log.duration_minutes / 60, 0).toFixed(2)),
    }))
  );
}
