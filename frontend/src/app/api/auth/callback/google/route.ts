import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error || 'Google auth was cancelled')}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '690442701733-jo93po46jj8ljffflf1rcb3g97oo7ie2.apps.googleusercontent.com';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/callback/google`;

  try {
    let email = 'student.askesis@gmail.com';
    let name = 'Google User';

    if (clientSecret) {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        if (userInfo.email) email = userInfo.email;
        if (userInfo.name) name = userInfo.name;
      }
    }

    // Update backend store with authenticated user
    mockBackend.user.email = email;
    mockBackend.user.full_name = name;
    mockBackend.user.is_active = true;

    const token = 'google_jwt_token_' + Math.random().toString(36).substring(2) + '_' + Date.now();

    // Redirect to dashboard with token
    const redirectUrl = new URL('/dashboard', origin);
    redirectUrl.searchParams.set('token', token);
    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`);
  }
}
