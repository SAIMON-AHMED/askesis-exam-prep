import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST() {
  mockBackend.user.is_active = false;
  return NextResponse.json({ message: 'Account deactivated' });
}
