import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, new_password } = body;

    if (!token) {
      return NextResponse.json({ detail: 'Reset token is required' }, { status: 400 });
    }

    if (!new_password || new_password.length < 8) {
      return NextResponse.json({ detail: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Check token validity in store
    const resetEntry = mockBackend.passwordResetTokens.get(token);
    if (!resetEntry && !token.startsWith('rst_') && !token.startsWith('ey')) {
      return NextResponse.json({ detail: 'This password reset link is invalid or has expired.' }, { status: 400 });
    }

    if (resetEntry && resetEntry.expiresAt < Date.now()) {
      mockBackend.passwordResetTokens.delete(token);
      return NextResponse.json({ detail: 'This password reset link has expired. Please request a new one.' }, { status: 400 });
    }

    // Clean up used token
    if (resetEntry) {
      mockBackend.passwordResetTokens.delete(token);
    }

    return NextResponse.json({
      message: 'Password has been successfully reset. You can now log in with your new password.',
    });
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || 'Failed to reset password' }, { status: 500 });
  }
}
