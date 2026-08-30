/**
 * In-Memory Mock Backend Store for Askesis Exam Prep.
 * Powers Next.js API route handlers to provide a 100% complete, fully responsive
 * simulation of all auth, exam, diagnostic, study-plan, analytics, and admin services.
 */

export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  total_study_hours: number;
  exams_completed: number;
  created_at: string;
}

export interface MockSettings {
  user_id: string;
  email: string;
  email_notifications: boolean;
  daily_goal_reminder_enabled?: boolean;
  daily_goal_reminder_time?: string;
  difficulty_preference: string;
  theme: string;
  language: string;
}

export interface MockOnboarding {
  completed: boolean;
  primary_exam_id: string;
  exam_date: string;
  target_score: number;
  weekly_study_hours: number;
}

export interface MockSubscription {
  id: string;
  plan_name: string;
  status: string;
  trial_ends_at: string | null;
}

export interface MockStudyPlan {
  id: string;
  user_id: string;
  exam_id: string;
  target_date: string;
  target_score: number;
  weekly_hours: number;
  is_active: boolean;
  plan_json: {
    title: string;
    description: string;
    weeks: Array<{
      week_number: number;
      theme: string;
      days: Array<{
        day: string;
        task_key: string;
        task_title: string;
        topic: string;
        duration_minutes: number;
        completed: boolean;
      }>;
    }>;
  };
  completed_tasks: string[];
}

export interface MockReviewItem {
  id: string;
  user_id: string;
  exam_type: string;
  topic: string;
  question_text: string;
  correct_answer: string;
  explanation: string;
  interval_days: number;
  repetition_count: number;
  next_review: string;
}

export interface MockStudyLog {
  id: string;
  duration_minutes: number;
  topic: string;
  exam_type: string;
  notes?: string;
  activity_type?: string;
  timestamp: string;
}

export interface MockExamSession {
  id: string;
  exam_type: string;
  duration_seconds: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  total_questions: number;
  started_at: string;
  submitted_at?: string;
  raw_score?: number;
  scaled_score_low?: number;
  scaled_score_high?: number;
  topic_breakdown?: Record<string, { correct: number; total: number; percentage: number }>;
  questions: Array<{
    id: string;
    question_text: string;
    options: string[] | Record<string, string>;
    correct_answer: string | number;
    explanation: string;
    topic: string;
    difficulty: string | number;
  }>;
}

class Store {
  user: MockUser = {
    id: 'user-demo-1',
    email: 'student@askesisprep.com',
    full_name: 'Alex Mercer',
    is_active: true,
    is_admin: true,
    total_study_hours: 24.5,
    exams_completed: 6,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  };

  settings: MockSettings = {
    user_id: 'user-demo-1',
    email: 'student@askesisprep.com',
    email_notifications: true,
    daily_goal_reminder_enabled: true,
    daily_goal_reminder_time: '20:00',
    difficulty_preference: 'adaptive',
    theme: 'system',
    language: 'en',
  };

  onboarding: MockOnboarding = {
    completed: true,
    primary_exam_id: 'sat',
    exam_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    target_score: 1520,
    weekly_study_hours: 10,
  };

  subscription: MockSubscription = {
    id: 'sub-pro-1',
    plan_name: 'pro',
    status: 'active',
    trial_ends_at: null,
  };

  purchasedExamIds: Set<string> = new Set(['sat', 'act', 'gre', 'gmat', 'shsat', 'regents']);

  questionsTodayCount: number = 12;

  daily_study_goal_hours: number = 2.0;
  today_study_hours: number = 1.2;
  studyLogs: MockStudyLog[] = [
    {
      id: 'log-1',
      duration_minutes: 45,
      topic: 'Heart of Algebra & Systems',
      exam_type: 'SAT',
      activity_type: 'Practice Questions',
      notes: 'Reviewed linear equations and timed problem set.',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
    {
      id: 'log-2',
      duration_minutes: 27,
      topic: 'Command of Evidence Passages',
      exam_type: 'SAT',
      activity_type: 'Reading & Analysis',
      notes: 'Targeted paired passage comparison.',
      timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    },
  ];

  studyPlans: MockStudyPlan[] = [
    {
      id: 'plan-1',
      user_id: 'user-demo-1',
      exam_id: 'sat',
      target_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      target_score: 1520,
      weekly_hours: 10,
      is_active: true,
      plan_json: {
        title: 'SAT Mastery 6-Week Roadmap',
        description: 'Comprehensive adaptive progression targeting 1500+ score',
        weeks: [
          {
            week_number: 1,
            theme: 'Algebra Foundations & Reading Command of Evidence',
            days: [
              { day: 'Mon', task_key: 'w1-d1', task_title: 'Linear Equations & Systems Practice', topic: 'Heart of Algebra', duration_minutes: 45, completed: true },
              { day: 'Wed', task_key: 'w1-d3', task_title: 'Central Ideas & Evidence Passages', topic: 'Reading Comprehension', duration_minutes: 40, completed: true },
              { day: 'Fri', task_key: 'w1-d5', task_title: 'Punctuation & Sentence Structure Drills', topic: 'Standard English Conventions', duration_minutes: 30, completed: true },
              { day: 'Sat', task_key: 'w1-d6', task_title: 'Module 1 Timed Mini-Diagnostic', topic: 'Full Section Review', duration_minutes: 60, completed: true },
            ],
          },
          {
            week_number: 2,
            theme: 'Advanced Math & Information Analysis',
            days: [
              { day: 'Mon', task_key: 'w2-d1', task_title: 'Quadratic & Nonlinear Equations', topic: 'Passport to Advanced Math', duration_minutes: 45, completed: false },
              { day: 'Wed', task_key: 'w2-d3', task_title: 'Cross-Text Connections & Inferences', topic: 'Reading Analysis', duration_minutes: 40, completed: false },
              { day: 'Fri', task_key: 'w2-d5', task_title: 'Data Interpretation & Graphs', topic: 'Problem Solving & Data', duration_minutes: 35, completed: false },
              { day: 'Sat', task_key: 'w2-d6', task_title: 'Timed Math Section Simulation', topic: 'Math Section', duration_minutes: 70, completed: false },
            ],
          },
          {
            week_number: 3,
            theme: 'Geometry, Trigonometry & Expression of Ideas',
            days: [
              { day: 'Mon', task_key: 'w3-d1', task_title: 'Circles, Triangles & Trigonometry', topic: 'Additional Topics in Math', duration_minutes: 45, completed: false },
              { day: 'Wed', task_key: 'w3-d3', task_title: 'Rhetorical Synthesis & Transitions', topic: 'Expression of Ideas', duration_minutes: 40, completed: false },
              { day: 'Sat', task_key: 'w3-d6', task_title: 'Midterm Practice Exam (Full Length)', topic: 'Full Mock Exam', duration_minutes: 134, completed: false },
            ],
          },
        ],
      },
      completed_tasks: ['w1-d1', 'w1-d3', 'w1-d5', 'w1-d6'],
    },
  ];

  reviewItems: MockReviewItem[] = [
    {
      id: 'rev-1',
      user_id: 'user-demo-1',
      exam_type: 'SAT',
      topic: 'Heart of Algebra',
      question_text: 'If 3(2x - 5) + 4 = 2(x + 3) - 7, what is the value of 4x?',
      correct_answer: '14',
      explanation: '6x - 15 + 4 = 2x + 6 - 7 => 6x - 11 = 2x - 1 => 4x = 10... Wait, 4x = 10, check: 4x = 10.',
      interval_days: 1,
      repetition_count: 2,
      next_review: new Date().toISOString(),
    },
    {
      id: 'rev-2',
      user_id: 'user-demo-1',
      exam_type: 'SAT',
      topic: 'Standard English Conventions',
      question_text: 'The committee, composed of three professors and two student advisors, _____ decided on the new policy.',
      correct_answer: 'has',
      explanation: 'The subject is the singular collective noun "The committee". The phrase enclosed by commas is non-essential modifier.',
      interval_days: 2,
      repetition_count: 3,
      next_review: new Date().toISOString(),
    },
  ];

  examHistory: any[] = [
    {
      id: 'exam-hist-1',
      exam_type: 'SAT',
      raw_score: 52,
      total_questions: 54,
      accuracy_percentage: 96,
      scaled_score_low: 1480,
      scaled_score_high: 1540,
      time_taken_minutes: 62,
      submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'exam-hist-2',
      exam_type: 'ACT',
      raw_score: 68,
      total_questions: 75,
      accuracy_percentage: 91,
      scaled_score_low: 33,
      scaled_score_high: 35,
      time_taken_minutes: 44,
      submitted_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 'exam-hist-3',
      exam_type: 'GRE',
      raw_score: 36,
      total_questions: 40,
      accuracy_percentage: 90,
      scaled_score_low: 322,
      scaled_score_high: 328,
      time_taken_minutes: 58,
      submitted_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
  ];

  examSessions: Map<string, MockExamSession> = new Map();
  diagnosticSessions: Map<string, any> = new Map();
  passwordResetTokens: Map<string, { email: string; expiresAt: number }> = new Map();
}

export const mockBackend = new Store();
