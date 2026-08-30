import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface AnalyticsOverview {
  total_study_hours: number;
  exams_completed: number;
  average_score: number;
  last_7_days_study_hours: number;
}

export interface StudyTimeBreakdown {
  exam_type: string;
  total_hours: number;
  session_count: number;
}

export interface TopicPerformance {
  topic: string;
  mastery_score: number;
  accuracy_rate: number;
  average_time_per_question: number;
  predicted_score_low?: number;
  predicted_score_high?: number;
}

export interface ExamHistory {
  id: string;
  exam_type: string;
  raw_score: number;
  total_questions: number;
  accuracy_percentage?: number;
  scaled_score_low?: number;
  scaled_score_high?: number;
  time_taken_minutes?: number;
  submitted_at?: string;
}

export interface WeeklyStats {
  date: string;
  study_hours: number;
}

export interface Streak {
  current_streak: number;
  streak_unit: string;
}

export function useAnalyticsOverview() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/analytics/overview');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics overview');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useStudyTimeBreakdown() {
  const [data, setData] = useState<StudyTimeBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/analytics/study-time');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load study time breakdown');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useTopicPerformance() {
  const [data, setData] = useState<TopicPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/analytics/topic-performance');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load topic performance');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useExamHistory(limit: number = 10) {
  const [data, setData] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/analytics/exam-history?limit=${limit}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load exam history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, loading, error };
}

export function useWeeklyStats() {
  const [data, setData] = useState<WeeklyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/analytics/weekly-stats');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load weekly stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useStudyStreak() {
  const [data, setData] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/analytics/streak');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load study streak');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export interface HeatmapDay {
  date: string;
  day_name: string;
  day_full: string;
  study_hours: number;
  intensity_level: 0 | 1 | 2 | 3 | 4;
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
  completion_rate: number;
}

export interface WeeklyConsistencyResponse {
  current_streak: number;
  longest_streak: number;
  weekly_adherence_rate: number;
  total_active_days: number;
  total_study_hours_month: number;
  best_day_of_week: string;
  weeks: ConsistencyWeek[];
  current_week_days: HeatmapDay[];
}

export function useWeeklyConsistency() {
  const [data, setData] = useState<WeeklyConsistencyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/weekly-consistency');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load weekly consistency heatmap');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
}

export async function logAnalyticsEvent(
  eventType: string,
  eventData?: Record<string, any>
): Promise<void> {
  try {
    await api.post('/analytics/event', {
      event_type: eventType,
      event_data: eventData,
    });
  } catch (err) {
    console.error('Failed to log analytics event:', err);
  }
}
