import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { exam_type: 'SAT', total_hours: 14.5, session_count: 18 },
    { exam_type: 'ACT', total_hours: 6.0, session_count: 8 },
    { exam_type: 'GRE', total_hours: 4.0, session_count: 5 },
  ]);
}
