import { normalizeWeeklyConsistency } from './useAnalytics';

describe('normalizeWeeklyConsistency', () => {
  it('handles legacy weeks whose days value is not iterable', () => {
    const normalized = normalizeWeeklyConsistency({
      current_streak: 3,
      weeks: [
        {
          week_number: 1,
          week_label: 'Current Week',
          days: { monday: { study_hours: 1 } },
          total_hours: 1,
          completion_rate: 0,
        },
      ],
      current_week_days: null,
    });

    expect(normalized.current_streak).toBe(3);
    expect(normalized.weeks).toHaveLength(1);
    expect(normalized.weeks[0].days).toEqual([]);
    expect(normalized.current_week_days).toEqual([]);
  });

  it('normalizes missing topic collections on otherwise valid days', () => {
    const normalized = normalizeWeeklyConsistency({
      weeks: [],
      current_week_days: [{ date: '2026-09-01', topics: null }],
    });

    expect(normalized.current_week_days[0].topics).toEqual([]);
  });
});
