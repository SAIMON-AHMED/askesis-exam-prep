import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  return NextResponse.json({
    purchased_exam_ids: Array.from(mockBackend.purchasedExamIds),
    has_all_access: true,
  });
}
