import { NextResponse } from 'next/server';

export async function GET() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = [1.2, 0.8, 1.5, 2.0, 1.0, 2.5, 1.4];
  return NextResponse.json(
    days.map((day, idx) => ({
      date: day,
      study_hours: hours[idx] ?? 1.0,
    }))
  );
}
