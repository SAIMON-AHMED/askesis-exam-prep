import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export const dynamic = 'force-dynamic';

export interface HeatmapDay {
  date: string; // ISO or YYYY-MM-DD
  day_name: string; // 'Mon', 'Tue', etc.
  day_full: string; // 'Monday', etc.
  study_hours: number;
  intensity_level: 0 | 1 | 2 | 3 | 4; // 0 = 0h, 1 = <1h, 2 = 1-2h, 3 = 2-3h (goal met), 4 = 3h+
  is_goal_met: boolean;
  daily_goal_hours: number;
  questions_answered: number;
  topics: string[];
  notes?: string;
  is_today?: boolean;
}

export interface ConsistencyWeek {
  week_number: number;
  week_label: string;
  days: HeatmapDay[];
  total_hours: number;
  completion_rate: number; // percentage of days goal met
}

export interface WeeklyConsistencyResponse {
  current_streak: number;
  longest_streak: number;
  weekly_adherence_rate: number; // e.g. 92%
  total_active_days: number;
  total_study_hours_month: number;
  best_day_of_week: string;
  weeks: ConsistencyWeek[];
  current_week_days: HeatmapDay[];
}

export async function GET() {
  const goalHours = mockBackend.daily_study_goal_hours || 2.0;
  const consistencyData = mockBackend.getWeeklyConsistency(goalHours);
  return NextResponse.json(consistencyData);
}

