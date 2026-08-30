import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { task_key, completed } = body;

    const plan = mockBackend.studyPlans.find((p) => p.id === id) || mockBackend.studyPlans[0];
    if (plan && task_key) {
      if (completed) {
        if (!plan.completed_tasks.includes(task_key)) {
          plan.completed_tasks.push(task_key);
        }
      } else {
        plan.completed_tasks = plan.completed_tasks.filter((k) => k !== task_key);
      }

      // Update days inside plan_json
      plan.plan_json.weeks.forEach((w) => {
        w.days.forEach((d) => {
          if (d.task_key === task_key) {
            d.completed = !!completed;
          }
        });
      });
    }

    return NextResponse.json({ success: true, plan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
