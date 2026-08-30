import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let email = body.email;
    let name = body.name || body.full_name;

    // Handle Google Identity Services JWT credential if provided
    if (body.credential && typeof body.credential === 'string') {
      try {
        const parts = body.credential.split('.');
        if (parts.length === 3) {
          const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
          const payload = JSON.parse(decodedJson);
          if (payload.email) {
            email = payload.email;
          }
          if (payload.name) {
            name = payload.name;
          }
        }
      } catch (err) {
        console.warn('Failed to parse Google JWT credential payload, falling back to body fields', err);
      }
    }

    // Default fallback if no email specified
    const finalEmail = email || 'google.user@example.com';
    const finalName = name || (finalEmail.split('@')[0].replace(/[._]/g, ' ') || 'Google User');

    mockBackend.user.email = finalEmail;
    mockBackend.user.full_name = finalName;
    mockBackend.user.is_active = true;

    const access_token = 'google_jwt_token_' + Math.random().toString(36).substring(2) + '_' + Date.now();

    return NextResponse.json({
      access_token,
      token_type: 'bearer',
      user: mockBackend.user,
      message: 'Google authentication successful',
    });
  } catch (err: any) {
    return NextResponse.json(
      { detail: err?.message || 'Google authentication failed' },
      { status: 500 }
    );
  }
}
