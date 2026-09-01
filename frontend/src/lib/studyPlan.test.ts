import { normalizeActiveStudyPlan } from './studyPlan';

describe('normalizeActiveStudyPlan', () => {
  it('converts the backend daily_tasks schema into dashboard tasks', () => {
    const plan = normalizeActiveStudyPlan({
      id: 'plan-1',
      exam_date: '2026-11-01T00:00:00Z',
      completed_tasks: { '1-Monday-0': true },
      plan_json: {
        weeks: [{
          week_number: 1,
          focus_topics: ['Algebra'],
          daily_tasks: [{ day: 'Monday', tasks: ['Linear equations', 'Inequalities'] }],
        }],
      },
    });

    expect(plan?.target_date).toBe('2026-11-01T00:00:00Z');
    expect(plan?.completed_tasks).toEqual(['1-Monday-0']);
    expect(plan?.plan_json.weeks[0].theme).toBe('Algebra');
    expect(plan?.plan_json.weeks[0].days).toHaveLength(2);
    expect(plan?.plan_json.weeks[0].days[0].task_title).toBe('Linear equations');
  });

  it('keeps the dashboard days schema and tolerates missing days', () => {
    const plan = normalizeActiveStudyPlan({
      id: 'plan-2',
      completed_tasks: [],
      plan_json: {
        weeks: [
          { week_number: 1, theme: 'Legacy', days: [{ day: 'Mon', task_key: 'a', task_title: 'Review' }] },
          { week_number: 2, theme: 'Malformed', days: null },
        ],
      },
    });

    expect(plan?.plan_json.weeks[0].days).toHaveLength(1);
    expect(plan?.plan_json.weeks[1].days).toEqual([]);
  });
});
