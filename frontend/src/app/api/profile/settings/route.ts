import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  return NextResponse.json(mockBackend.settings);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    mockBackend.settings = { ...mockBackend.settings, ...body };
    return NextResponse.json(mockBackend.settings);
  } catch {
    return NextResponse.json(mockBackend.settings);
  }
}
