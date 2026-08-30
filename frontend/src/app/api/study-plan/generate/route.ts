import { NextResponse } from 'next/server';
import { mockBackend, MockStudyPlan } from '@/lib/mockBackendStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const examDate = body.exam_date || new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0];
    const targetScore = body.target_score || 1500;
    const weeklyHours = body.available_weekly_hours || 10;
    const weakTopics = body.weak_topics || ['Algebra', 'Reading Comprehension'];

    const newPlan: MockStudyPlan = {
      id: 'plan-' + Math.random().toString(36).substring(2, 9),
      user_id: mockBackend.user.id,
      exam_id: mockBackend.onboarding.primary_exam_id || 'sat',
      target_date: examDate,
      target_score: targetScore,
      weekly_hours: weeklyHours,
      is_active: true,
      plan_json: {
        title: `Targeted ${targetScore}+ Study Blueprint`,
        description: `Custom AI-calibrated schedule focusing on ${weakTopics.join(', ')}`,
        weeks: [
          {
            week_number: 1,
            theme: 'Foundations & Diagnostic Review',
            days: [
              { day: 'Mon', task_key: 'w1-d1', task_title: `${weakTopics[0] || 'Algebra'} Core Drills`, topic: weakTopics[0] || 'Algebra', duration_minutes: 45, completed: false },
              { day: 'Wed', task_key: 'w1-d3', task_title: 'Speed & Accuracy Timed Set', topic: 'Mixed Topics', duration_minutes: 40, completed: false },
              { day: 'Fri', task_key: 'w1-d5', task_title: 'Error Log & Spaced Repetition', topic: 'Review Queue', duration_minutes: 30, completed: false },
              { day: 'Sat', task_key: 'w1-d6', task_title: 'Section Benchmark Test', topic: 'Section Simulation', duration_minutes: 60, completed: false },
            ],
          },
          {
            week_number: 2,
            theme: 'Advanced Problem Solving',
            days: [
              { day: 'Mon', task_key: 'w2-d1', task_title: `${weakTopics[1] || 'Reading'} Masterclass Drills`, topic: weakTopics[1] || 'Reading', duration_minutes: 45, completed: false },
              { day: 'Wed', task_key: 'w2-d3', task_title: 'Difficult Trap-Answer Elimination', topic: 'Critical Reasoning', duration_minutes: 40, completed: false },
              { day: 'Sat', task_key: 'w2-d6', task_title: 'Full Length Timed Exam', topic: 'Full Simulation', duration_minutes: 134, completed: false },
            ],
          },
        ],
      },
      completed_tasks: [],
    };

    mockBackend.studyPlans.forEach((p) => (p.is_active = false));
    mockBackend.studyPlans.unshift(newPlan);

    return NextResponse.json(newPlan);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
