import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { task_key, completed, action, reset } = body;

    const plan = mockBackend.studyPlans.find((p) => p.id === id) || mockBackend.studyPlans[0];
    if (!plan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    // Reset progress action
    if (reset === true || action === 'reset') {
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
      return NextResponse.json({ success: true, message: 'Progress reset successfully', plan });
    }

    if (task_key) {
      let matchedTaskTitle = 'Study Plan Task';
      let matchedTopic = 'Standard Practice';
      let durationMinutes = 45;

      if (completed) {
        if (!plan.completed_tasks.includes(task_key)) {
          plan.completed_tasks.push(task_key);
        }
      } else {
        plan.completed_tasks = plan.completed_tasks.filter((k) => k !== task_key);
      }

      // Update days inside plan_json
      plan.plan_json?.weeks?.forEach((w) => {
        w.days?.forEach((d) => {
          if (d.task_key === task_key) {
            d.completed = !!completed;
            matchedTaskTitle = d.task_title;
            matchedTopic = d.topic;
            durationMinutes = d.duration_minutes || 45;
          }
        });
      });

      if (completed) {
        mockBackend.studyLogs.unshift({
          id: `log-task-${Date.now()}`,
          duration_minutes: durationMinutes,
          topic: matchedTopic,
          exam_type: (plan.exam_id || 'SAT').toUpperCase(),
          activity_type: 'Study Plan Task',
          notes: `Completed "${matchedTaskTitle}".`,
          timestamp: new Date().toISOString(),
        });
        mockBackend.recalculateTotals();
      }
    }

    return NextResponse.json({ success: true, plan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = mockBackend.studyPlans.find((p) => p.id === id) || mockBackend.studyPlans[0];
    if (plan) {
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
    }
    return NextResponse.json({ success: true, message: 'Progress reset successfully', plan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

