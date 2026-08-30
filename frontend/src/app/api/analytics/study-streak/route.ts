import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    current_streak: 12,
    longest_streak: 21,
    streak_unit: 'days',
  });
}
