import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = mockBackend.studyPlans.find((p) => p.id === id) || mockBackend.studyPlans[0];
    if (!plan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    plan.completed_tasks = [];
    if (plan.plan_json?.weeks) {
      plan.plan_json.weeks.forEach((w) => {
        if (w.days) {
          w.days.forEach((d) => {
            d.completed = false;
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Study plan progress has been reset',
      plan,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
