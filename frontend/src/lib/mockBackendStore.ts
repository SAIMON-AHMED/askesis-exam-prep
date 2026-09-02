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
  exam_date?: string;
  target_exam?: string;
  target_score?: number;
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
    total_study_hours: 0,
    exams_completed: 0,
    created_at: new Date().toISOString(),
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
    target_score: 1500,
    target_exam: 'sat',
    exam_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
  };

  onboarding: MockOnboarding = {
    completed: true,
    primary_exam_id: 'sat',
    exam_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    target_score: 1500,
    weekly_study_hours: 10,
  };

  subscription: MockSubscription = {
    id: 'sub-pro-1',
    plan_name: 'pro',
    status: 'active',
    trial_ends_at: null,
  };

  purchasedExamIds: Set<string> = new Set(['sat', 'act', 'gre', 'gmat', 'shsat', 'regents']);

  questionsTodayCount: number = 0;

  daily_study_goal_hours: number = 2.0;
  today_study_hours: number = 0;
  studyLogs: MockStudyLog[] = [];

  constructor() {
    this.recalculateTotals();
  }

  seedHistoricalLogs() {
    // Optional seeding method if ever requested by demo triggers
    this.recalculateTotals();
  }

  recalculateTotals() {
    const totalMinutes = this.studyLogs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
    this.user.total_study_hours = Number((totalMinutes / 60).toFixed(1));
    this.user.exams_completed = this.examHistory ? this.examHistory.length : 0;

    // Calculate today's study hours dynamically
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMinutes = this.studyLogs
      .filter((l) => l.timestamp.startsWith(todayStr))
      .reduce((sum, l) => sum + (l.duration_minutes || 0), 0);
    this.today_study_hours = Number((todayMinutes / 60).toFixed(2));
  }

  // --- Dynamic Stats Engine Methods ---

  getAnalyticsOverview() {
    this.recalculateTotals();
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 86400000;

    const last7DaysMinutes = this.studyLogs
      .filter((l) => new Date(l.timestamp).getTime() >= sevenDaysAgo)
      .reduce((sum, l) => sum + (l.duration_minutes || 0), 0);

    let avgScore = 0;
    if (this.examHistory && this.examHistory.length > 0) {
      const totalAcc = this.examHistory.reduce((acc, e) => {
        if (typeof e.accuracy_percentage === 'number') return acc + e.accuracy_percentage;
        if (e.total_questions > 0) return acc + Math.round((e.raw_score / e.total_questions) * 100);
        return acc;
      }, 0);
      avgScore = Math.round(totalAcc / this.examHistory.length);
    }

    return {
      total_study_hours: this.user.total_study_hours,
      exams_completed: this.examHistory ? this.examHistory.length : 0,
      average_score: avgScore,
      last_7_days_study_hours: Number((last7DaysMinutes / 60).toFixed(1)),
    };
  }

  getWeeklyConsistency(dailyGoalHours = 2.0) {
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fullDayNames: Record<string, string> = {
      Sun: 'Sunday',
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
    };

    // Calculate intensity helper
    const calculateIntensity = (hours: number): 0 | 1 | 2 | 3 | 4 => {
      if (hours <= 0) return 0;
      if (hours < 1.0) return 1;
      if (hours < 2.0) return 2;
      if (hours <= 3.0) return 3;
      return 4;
    };

    // Group logs by YYYY-MM-DD
    const logsByDate = new Map<string, { totalHours: number; questions: number; topics: Set<string>; notes: string[] }>();
    this.studyLogs.forEach((log) => {
      const dateStr = log.timestamp.split('T')[0];
      const existing = logsByDate.get(dateStr) || { totalHours: 0, questions: 0, topics: new Set<string>(), notes: [] };
      existing.totalHours += (log.duration_minutes || 0) / 60;
      existing.questions += Math.max(10, Math.round((log.duration_minutes || 0) * 0.7));
      if (log.topic) existing.topics.add(log.topic);
      if (log.notes) existing.notes.push(log.notes);
      logsByDate.set(dateStr, existing);
    });

    const weeks: Array<{
      week_number: number;
      week_label: string;
      days: Array<any>;
      total_hours: number;
      completion_rate: number;
    }> = [];

    let totalMonthHours = 0;
    let totalActiveDays = 0;
    const dayOfWeekHours: Record<string, { total: number; count: number }> = {
      Monday: { total: 0, count: 0 },
      Tuesday: { total: 0, count: 0 },
      Wednesday: { total: 0, count: 0 },
      Thursday: { total: 0, count: 0 },
      Friday: { total: 0, count: 0 },
      Saturday: { total: 0, count: 0 },
      Sunday: { total: 0, count: 0 },
    };

    // Build 4 weeks (each week starts Mon -> Sun)
    // Find current week Monday
    const currentDayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
    const distToMon = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const currentWeekMon = new Date(today);
    currentWeekMon.setDate(today.getDate() - distToMon);

    for (let w = 3; w >= 0; w--) {
      const weekNumber = 4 - w;
      const weekLabel = w === 0 ? 'Current Week' : w === 1 ? 'Last Week' : `${w + 1} Weeks Ago`;
      const days: any[] = [];
      let weekTotalHours = 0;
      let weekGoalsMet = 0;

      for (let d = 0; d < 7; d++) {
        const targetDate = new Date(currentWeekMon);
        targetDate.setDate(currentWeekMon.getDate() - w * 7 + d);
        const dateStr = targetDate.toISOString().split('T')[0];
        const dayShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d];
        const dayFull = fullDayNames[dayShort] || dayShort;
        const isToday = dateStr === today.toISOString().split('T')[0];

        const logData = logsByDate.get(dateStr);
        const hours = logData ? Number(logData.totalHours.toFixed(1)) : 0;
        const questions = logData ? logData.questions : 0;
        const topics = logData && logData.topics.size > 0 ? Array.from(logData.topics) : ['Self Study Drill'];
        const notes = logData && logData.notes.length > 0 ? logData.notes.join('; ') : hours > 0 ? 'Completed daily study goal.' : 'Rest day';

        const intensity = calculateIntensity(hours);
        const isGoalMet = hours >= dailyGoalHours;

        if (hours > 0) {
          totalActiveDays++;
          dayOfWeekHours[dayFull].total += hours;
          dayOfWeekHours[dayFull].count += 1;
        }
        if (isGoalMet) weekGoalsMet++;
        weekTotalHours += hours;
        totalMonthHours += hours;

        days.push({
          date: dateStr,
          day_name: dayShort,
          day_full: dayFull,
          study_hours: hours,
          intensity_level: intensity,
          is_goal_met: isGoalMet,
          daily_goal_hours: dailyGoalHours,
          questions_answered: questions,
          topics,
          notes,
          is_today: isToday,
        });
      }

      weeks.push({
        week_number: weekNumber,
        week_label: weekLabel,
        days,
        total_hours: Number(weekTotalHours.toFixed(1)),
        completion_rate: Math.round((weekGoalsMet / 7) * 100),
      });
    }

    // Determine best day of week
    let bestDay = 'None yet';
    let maxAvg = 0;
    Object.entries(dayOfWeekHours).forEach(([day, data]) => {
      const avg = data.count > 0 ? data.total / data.count : 0;
      if (avg > maxAvg && avg > 0) {
        maxAvg = avg;
        bestDay = `${day} (${avg.toFixed(1)}h avg)`;
      }
    });

    const streakData = this.getStudyStreak();

    return {
      current_streak: streakData.current_streak,
      longest_streak: streakData.longest_streak,
      weekly_adherence_rate:
        totalMonthHours > 0
          ? Math.round(weeks.reduce((sum, w) => sum + w.completion_rate, 0) / (weeks.length || 1))
          : 0,
      total_active_days: totalActiveDays,
      total_study_hours_month: Number(totalMonthHours.toFixed(1)),
      best_day_of_week: bestDay,
      weeks,
      current_week_days: weeks[weeks.length - 1]?.days || [],
    };
  }

  getStudyStreak() {
    const activeDates = new Set<string>();

    // Collect dates with active study logs
    this.studyLogs.forEach((log) => {
      if ((log.duration_minutes || 0) > 0 && log.timestamp) {
        const dateStr = log.timestamp.includes('T')
          ? log.timestamp.split('T')[0]
          : new Date(log.timestamp).toISOString().split('T')[0];
        activeDates.add(dateStr);
      }
    });

    // Collect dates with submitted exams
    this.examHistory.forEach((ex) => {
      if (ex.submitted_at) {
        const dateStr = ex.submitted_at.includes('T')
          ? ex.submitted_at.split('T')[0]
          : new Date(ex.submitted_at).toISOString().split('T')[0];
        activeDates.add(dateStr);
      }
    });

    // Strictly reset to 0 if there is no study or exam history
    if (activeDates.size === 0) {
      return {
        current_streak: 0,
        longest_streak: 0,
        streak_unit: 'days',
      };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 0;

    // Check if the user studied today or yesterday to anchor the streak
    if (activeDates.has(todayStr)) {
      let checkDate = new Date(today);
      while (activeDates.has(checkDate.toISOString().split('T')[0])) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else if (activeDates.has(yesterdayStr)) {
      // User hasn't logged today yet, but streak is maintained from consecutive days ending yesterday
      let checkDate = new Date(yesterday);
      while (activeDates.has(checkDate.toISOString().split('T')[0])) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else {
      // Neither today nor yesterday had activity -> streak resets strictly to 0
      currentStreak = 0;
    }

    // Calculate maximum historical consecutive days
    const sortedDates = Array.from(activeDates).sort();
    let maxStreak = currentStreak;
    if (sortedDates.length > 0) {
      let runningStreak = 1;
      let recordStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          runningStreak++;
          if (runningStreak > recordStreak) {
            recordStreak = runningStreak;
          }
        } else if (diffDays > 1) {
          runningStreak = 1;
        }
      }
      maxStreak = Math.max(currentStreak, recordStreak);
    }

    return {
      current_streak: currentStreak,
      longest_streak: maxStreak,
      streak_unit: 'days',
    };
  }

  getStudyTimeBreakdown() {
    const examMap = new Map<string, { total_hours: number; session_count: number }>();
    this.studyLogs.forEach((l) => {
      const exam = (l.exam_type || 'SAT').toUpperCase();
      const current = examMap.get(exam) || { total_hours: 0, session_count: 0 };
      current.total_hours += (l.duration_minutes || 0) / 60;
      current.session_count += 1;
      examMap.set(exam, current);
    });

    if (examMap.size === 0) {
      return [];
    }

    return Array.from(examMap.entries()).map(([exam_type, data]) => ({
      exam_type,
      total_hours: Number(data.total_hours.toFixed(1)),
      session_count: data.session_count,
    }));
  }

  getTopicPerformance() {
    // Dynamic calculation from exam sessions, study logs, and question logs
    const topicStats: Record<string, { correct: number; total: number; totalSeconds: number }> = {};

    // Incorporate dynamic examHistory topic breakdowns
    this.examHistory.forEach((ex) => {
      if (ex.topic_breakdown) {
        Object.entries(ex.topic_breakdown).forEach(([topic, stats]: [string, any]) => {
          if (!topicStats[topic]) {
            topicStats[topic] = { correct: 0, total: 0, totalSeconds: 0 };
          }
          topicStats[topic].correct += stats.correct || 0;
          topicStats[topic].total += stats.total || 0;
          topicStats[topic].totalSeconds += (stats.total || 0) * 55;
        });
      }
    });

    if (Object.keys(topicStats).length === 0) {
      return [];
    }

    return Object.entries(topicStats).map(([topic, stats]) => {
      const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      const mastery = Math.min(100, Math.round(accuracy * 0.95 + 5));
      const avgTime = stats.total > 0 ? Math.round(stats.totalSeconds / stats.total) : 0;
      const predLow = Math.round(650 + accuracy * 1.5);
      const predHigh = Math.min(800, predLow + 40);

      return {
        topic,
        mastery_score: mastery,
        accuracy_rate: accuracy,
        average_time_per_question: avgTime,
        predicted_score_low: predLow,
        predicted_score_high: predHigh,
      };
    });
  }

  getWeeklyStats() {
    const today = new Date();
    const result: Array<{ date: string; study_hours: number }> = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];

      const hours = this.studyLogs
        .filter((l) => l.timestamp.startsWith(dateStr))
        .reduce((sum, l) => sum + (l.duration_minutes || 0) / 60, 0);

      result.push({
        date: dayName,
        study_hours: Number(hours.toFixed(1)),
      });
    }

    return result;
  }

  studyPlans: MockStudyPlan[] = [
    {
      id: 'plan-1',
      user_id: 'user-demo-1',
      exam_id: 'sat',
      target_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      target_score: 1500,
      weekly_hours: 10,
      is_active: true,
      plan_json: {
        title: 'SAT Mastery 6-Week Roadmap',
        description: 'Comprehensive adaptive progression targeting score goals',
        weeks: [
          {
            week_number: 1,
            theme: 'Algebra Foundations & Reading Command of Evidence',
            days: [
              { day: 'Mon', task_key: 'w1-d1', task_title: 'Linear Equations & Systems Practice', topic: 'Heart of Algebra', duration_minutes: 45, completed: false },
              { day: 'Wed', task_key: 'w1-d3', task_title: 'Central Ideas & Evidence Passages', topic: 'Reading Comprehension', duration_minutes: 40, completed: false },
              { day: 'Fri', task_key: 'w1-d5', task_title: 'Punctuation & Sentence Structure Drills', topic: 'Standard English Conventions', duration_minutes: 30, completed: false },
              { day: 'Sat', task_key: 'w1-d6', task_title: 'Module 1 Timed Mini-Diagnostic', topic: 'Full Section Review', duration_minutes: 60, completed: false },
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
      completed_tasks: [],
    },
    {
      id: 'plan-2',
      user_id: 'user-demo-1',
      exam_id: 'gre',
      target_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      target_score: 325,
      weekly_hours: 10,
      is_active: false,
      plan_json: {
        title: 'GRE General Test 6-Week Roadmap',
        description: 'Comprehensive preparation for Verbal & Quantitative reasoning',
        weeks: [
          {
            week_number: 1,
            theme: 'Quantitative Foundations & Vocabulary Building',
            days: [
              { day: 'Mon', task_key: 'w1-d1', task_title: 'Arithmetic & Basic Algebra Review', topic: 'Quantitative Reasoning', duration_minutes: 50, completed: false },
              { day: 'Wed', task_key: 'w1-d3', task_title: 'Essential GRE Vocabulary (300 words)', topic: 'Verbal Reasoning', duration_minutes: 45, completed: false },
              { day: 'Fri', task_key: 'w1-d5', task_title: 'Text Completion Practice Drills', topic: 'Verbal Reasoning', duration_minutes: 40, completed: false },
              { day: 'Sat', task_key: 'w1-d6', task_title: 'Diagnostic Mini-Test (Verbal & Quant)', topic: 'Full Review', duration_minutes: 90, completed: false },
            ],
          },
          {
            week_number: 2,
            theme: 'Advanced Algebra & Reading Comprehension',
            days: [
              { day: 'Mon', task_key: 'w2-d1', task_title: 'Quadratic Equations & Functions', topic: 'Quantitative Reasoning', duration_minutes: 50, completed: false },
              { day: 'Wed', task_key: 'w2-d3', task_title: 'Reading Comprehension Strategies', topic: 'Verbal Reasoning', duration_minutes: 45, completed: false },
              { day: 'Fri', task_key: 'w2-d5', task_title: 'Sentence Equivalence Drills', topic: 'Verbal Reasoning', duration_minutes: 40, completed: false },
              { day: 'Sat', task_key: 'w2-d6', task_title: 'Timed Quantitative Section', topic: 'Quant Practice', duration_minutes: 75, completed: false },
            ],
          },
          {
            week_number: 3,
            theme: 'Geometry, Statistics & Verbal Mastery',
            days: [
              { day: 'Mon', task_key: 'w3-d1', task_title: 'Geometry & Data Analysis', topic: 'Quantitative Reasoning', duration_minutes: 50, completed: false },
              { day: 'Wed', task_key: 'w3-d3', task_title: 'Advanced Vocabulary & Essays', topic: 'Verbal + AW', duration_minutes: 50, completed: false },
              { day: 'Sat', task_key: 'w3-d6', task_title: 'Full-Length Practice Test (GRE)', topic: 'Mock Exam', duration_minutes: 170, completed: false },
            ],
          },
        ],
      },
      completed_tasks: [],
    },
    {
      id: 'plan-3',
      user_id: 'user-demo-1',
      exam_id: 'act',
      target_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      target_score: 35,
      weekly_hours: 10,
      is_active: false,
      plan_json: {
        title: 'ACT Composite 6-Week Roadmap',
        description: 'Comprehensive preparation targeting your composite score',
        weeks: [
          {
            week_number: 1,
            theme: 'English & Reading Fundamentals',
            days: [
              { day: 'Mon', task_key: 'w1-d1', task_title: 'Grammar & Punctuation Basics', topic: 'English', duration_minutes: 45, completed: false },
              { day: 'Wed', task_key: 'w1-d3', task_title: 'Reading Comprehension Passages', topic: 'Reading', duration_minutes: 45, completed: false },
              { day: 'Fri', task_key: 'w1-d5', task_title: 'Pre-Algebra & Number Sense', topic: 'Math', duration_minutes: 45, completed: false },
              { day: 'Sat', task_key: 'w1-d6', task_title: 'ACT Diagnostic Test (All Sections)', topic: 'Full Review', duration_minutes: 180, completed: false },
            ],
          },
          {
            week_number: 2,
            theme: 'Math Skills & Advanced Reading',
            days: [
              { day: 'Mon', task_key: 'w2-d1', task_title: 'Algebra & Functions', topic: 'Math', duration_minutes: 50, completed: false },
              { day: 'Wed', task_key: 'w2-d3', task_title: 'Complex Passages & Inferences', topic: 'Reading', duration_minutes: 45, completed: false },
              { day: 'Fri', task_key: 'w2-d5', task_title: 'Rhetorical Skills & Style', topic: 'English', duration_minutes: 40, completed: false },
              { day: 'Sat', task_key: 'w2-d6', task_title: 'Science Reasoning Introduction', topic: 'Science (Optional)', duration_minutes: 60, completed: false },
            ],
          },
          {
            week_number: 3,
            theme: 'Geometry & Timed Practice',
            days: [
              { day: 'Mon', task_key: 'w3-d1', task_title: 'Geometry & Trigonometry', topic: 'Math', duration_minutes: 50, completed: false },
              { day: 'Wed', task_key: 'w3-d3', task_title: 'Paired Passages Strategy', topic: 'Reading', duration_minutes: 45, completed: false },
              { day: 'Sat', task_key: 'w3-d6', task_title: 'Full ACT Practice Exam', topic: 'Mock Exam', duration_minutes: 180, completed: false },
            ],
          },
        ],
      },
      completed_tasks: [],
    },
    {
      id: 'plan-4',
      user_id: 'user-demo-1',
      exam_id: 'gmat',
      target_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      target_score: 700,
      weekly_hours: 10,
      is_active: false,
      plan_json: {
        title: 'GMAT Executive Assessment 6-Week Roadmap',
        description: 'MBA entrance exam preparation with business analytics focus',
        weeks: [
          {
            week_number: 1,
            theme: 'Quantitative Foundations & Reading Strategy',
            days: [
              { day: 'Mon', task_key: 'w1-d1', task_title: 'Arithmetic & Number Properties', topic: 'Quantitative', duration_minutes: 55, completed: false },
              { day: 'Wed', task_key: 'w1-d3', task_title: 'Critical Reasoning Basics', topic: 'Verbal', duration_minutes: 50, completed: false },
              { day: 'Fri', task_key: 'w1-d5', task_title: 'Reading Comprehension (Business)', topic: 'Verbal', duration_minutes: 45, completed: false },
              { day: 'Sat', task_key: 'w1-d6', task_title: 'GMAT Diagnostic Assessment', topic: 'Full Review', duration_minutes: 120, completed: false },
            ],
          },
          {
            week_number: 2,
            theme: 'Algebra, Geometry & Advanced Reasoning',
            days: [
              { day: 'Mon', task_key: 'w2-d1', task_title: 'Algebra & Inequalities', topic: 'Quantitative', duration_minutes: 55, completed: false },
              { day: 'Wed', task_key: 'w2-d3', task_title: 'Sentence Correction Mastery', topic: 'Verbal', duration_minutes: 50, completed: false },
              { day: 'Fri', task_key: 'w2-d5', task_title: 'Data Sufficiency Training', topic: 'Quantitative', duration_minutes: 45, completed: false },
              { day: 'Sat', task_key: 'w2-d6', task_title: 'Integrated Reasoning Module', topic: 'Integrated Reasoning', duration_minutes: 90, completed: false },
            ],
          },
          {
            week_number: 3,
            theme: 'Statistics, Advanced Verbal & Essays',
            days: [
              { day: 'Mon', task_key: 'w3-d1', task_title: 'Statistics & Probability', topic: 'Quantitative', duration_minutes: 55, completed: false },
              { day: 'Wed', task_key: 'w3-d3', task_title: 'Analytical Writing (AWA)', topic: 'Verbal + AW', duration_minutes: 60, completed: false },
              { day: 'Sat', task_key: 'w3-d6', task_title: 'Full-Length GMAT Practice Exam', topic: 'Mock Exam', duration_minutes: 180, completed: false },
            ],
          },
        ],
      },
      completed_tasks: [],
    },
    {
      id: 'plan-5',
      user_id: 'user-demo-1',
      exam_id: 'shsat',
      target_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      target_score: 560,
      weekly_hours: 8,
      is_active: false,
      plan_json: {
        title: 'SHSAT 6-Week Roadmap',
        description: 'Selective High School Admissions Test preparation',
        weeks: [
          {
            week_number: 1,
            theme: 'Verbal & Math Fundamentals',
            days: [
              { day: 'Mon', task_key: 'w1-d1', task_title: 'Analogies & Logical Reasoning', topic: 'Verbal', duration_minutes: 45, completed: false },
              { day: 'Wed', task_key: 'w1-d3', task_title: 'Number Sense & Operations', topic: 'Math', duration_minutes: 45, completed: false },
              { day: 'Fri', task_key: 'w1-d5', task_title: 'Reading Comprehension Basics', topic: 'Verbal', duration_minutes: 40, completed: false },
              { day: 'Sat', task_key: 'w1-d6', task_title: 'SHSAT Diagnostic Assessment', topic: 'Full Review', duration_minutes: 120, completed: false },
            ],
          },
          {
            week_number: 2,
            theme: 'Advanced Verbal & Algebra',
            days: [
              { day: 'Mon', task_key: 'w2-d1', task_title: 'Sentence Completions & Word Problems', topic: 'Verbal', duration_minutes: 45, completed: false },
              { day: 'Wed', task_key: 'w2-d3', task_title: 'Algebra & Equations', topic: 'Math', duration_minutes: 50, completed: false },
              { day: 'Fri', task_key: 'w2-d5', task_title: 'Logic Games & Sequences', topic: 'Math', duration_minutes: 40, completed: false },
              { day: 'Sat', task_key: 'w2-d6', task_title: 'Timed Verbal Section Practice', topic: 'Verbal', duration_minutes: 90, completed: false },
            ],
          },
          {
            week_number: 3,
            theme: 'Geometry, Statistics & Integration',
            days: [
              { day: 'Mon', task_key: 'w3-d1', task_title: 'Geometry & Spatial Reasoning', topic: 'Math', duration_minutes: 50, completed: false },
              { day: 'Wed', task_key: 'w3-d3', task_title: 'Data Interpretation & Graphs', topic: 'Math', duration_minutes: 45, completed: false },
              { day: 'Sat', task_key: 'w3-d6', task_title: 'Full SHSAT Practice Exam', topic: 'Mock Exam', duration_minutes: 170, completed: false },
            ],
          },
        ],
      },
      completed_tasks: [],
    },
  ];

  reviewItems: MockReviewItem[] = [];

  examHistory: any[] = [];

  examSessions: Map<string, MockExamSession> = new Map();
  diagnosticSessions: Map<string, any> = new Map();
  passwordResetTokens: Map<string, { email: string; expiresAt: number }> = new Map();
}

export const mockBackend = new Store();
