import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  return NextResponse.json(mockBackend.onboarding);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    mockBackend.onboarding = {
      ...mockBackend.onboarding,
      ...body,
      completed: true,
    };
    return NextResponse.json(mockBackend.onboarding);
  } catch {
    return NextResponse.json(mockBackend.onboarding);
  }
}
