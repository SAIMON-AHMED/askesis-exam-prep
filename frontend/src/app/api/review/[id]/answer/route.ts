import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const rating = body.rating || 'good';
    const quality = typeof rating === 'number'
      ? rating
      : ({ again: 1, hard: 2, good: 3, easy: 4 } as Record<string, number>)[rating] ?? 3;

    const item = mockBackend.reviewItems.find((r) => r.id === id);
    if (item) {
      item.repetition_count += 1;
      item.interval_days = Math.max(1, item.interval_days * (quality >= 3 ? 2 : 1));
      item.next_review = new Date(Date.now() + item.interval_days * 86400000).toISOString();
    }

    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
