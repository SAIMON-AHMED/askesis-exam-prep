import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  return NextResponse.json(mockBackend.user);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.full_name !== undefined) mockBackend.user.full_name = body.full_name;
    if (body.email !== undefined) mockBackend.user.email = body.email;
    return NextResponse.json(mockBackend.user);
  } catch {
    return NextResponse.json(mockBackend.user);
  }
}

export async function PATCH(request: Request) {
  return PUT(request);
}
