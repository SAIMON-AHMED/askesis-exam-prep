import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const rating = body.rating || 3;

    const item = mockBackend.reviewItems.find((r) => r.id === id);
    if (item) {
      item.repetition_count += 1;
      item.interval_days = Math.max(1, item.interval_days * (rating >= 3 ? 2 : 1));
      item.next_review = new Date(Date.now() + item.interval_days * 86400000).toISOString();
    }

    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
