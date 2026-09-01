import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(mockBackend.getWeeklyStats());
}

