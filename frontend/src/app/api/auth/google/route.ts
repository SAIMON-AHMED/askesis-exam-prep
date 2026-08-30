import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const credential = body.credential;
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId || typeof credential !== 'string') {
      return NextResponse.json(
        { detail: 'Google authentication is not configured.' },
        { status: 503 },
      );
    }

    const tokenResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { cache: 'no-store' },
    );
    if (!tokenResponse.ok) {
      return NextResponse.json({ detail: 'Invalid Google credential.' }, { status: 401 });
    }

    const token = await tokenResponse.json();
    if (token.aud !== clientId || token.email_verified !== 'true' || !token.email) {
      return NextResponse.json({ detail: 'Google credential verification failed.' }, { status: 401 });
    }

    const finalEmail = token.email;
    const finalName = token.name || finalEmail.split('@')[0].replace(/[._]/g, ' ') || 'Google User';

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
