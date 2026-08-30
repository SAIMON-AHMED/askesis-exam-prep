import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_questions: 4850,
    pending_review: 14,
    validated_questions: 4836,
    flagged_questions: 3,
  });
}
