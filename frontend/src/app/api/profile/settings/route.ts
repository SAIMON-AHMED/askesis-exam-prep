import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  return NextResponse.json(mockBackend.settings);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    mockBackend.settings = { ...mockBackend.settings, ...body };
    if (body.exam_date) {
      mockBackend.onboarding.exam_date = body.exam_date;
    }
    if (body.target_score !== undefined) {
      mockBackend.onboarding.target_score = body.target_score;
    }
    if (body.target_exam) {
      mockBackend.onboarding.primary_exam_id = body.target_exam;
    }
    return NextResponse.json(mockBackend.settings);
  } catch {
    return NextResponse.json(mockBackend.settings);
  }
}

export async function PATCH(request: Request) {
  return PUT(request);
}

export async function POST(request: Request) {
  return PUT(request);
}
