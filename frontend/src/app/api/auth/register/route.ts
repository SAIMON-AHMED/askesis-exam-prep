import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, full_name } = body;
    if (email) mockBackend.user.email = email;
    if (full_name) mockBackend.user.full_name = full_name;
    return NextResponse.json({
      access_token: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
      token_type: 'bearer',
      user: mockBackend.user,
    });
  } catch {
    return NextResponse.json({
      access_token: 'mock_jwt_token_default',
      token_type: 'bearer',
      user: mockBackend.user,
    });
  }
}
