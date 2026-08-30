import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { exam_id } = body;
    if (exam_id) {
      mockBackend.purchasedExamIds.add(exam_id.toLowerCase());
    }
    return NextResponse.json({
      success: true,
      message: 'Exam unlocked successfully',
      checkout_url: null,
      exam_id,
    });
  } catch {
    return NextResponse.json({ success: true, message: 'Exam unlocked' });
  }
}
