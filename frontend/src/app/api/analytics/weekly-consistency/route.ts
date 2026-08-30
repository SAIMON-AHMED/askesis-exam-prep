import { NextResponse } from 'next/server';

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
  const today = new Date();
  
  // Generate realistic data for the last 4 weeks leading up to today
  const weeksData: ConsistencyWeek[] = [];

  // Data patterns for 4 weeks (Week 1 is 3 weeks ago, Week 4 is current week)
  const historicalPatterns = [
    // Week 1 (3 weeks ago)
    [
      { day: 'Mon', hours: 1.5, questions: 25, topics: ['Algebra & Functions'], notes: 'Diagnostic review' },
      { day: 'Tue', hours: 2.0, questions: 35, topics: ['Reading Comprehension'], notes: 'Passage speed practice' },
      { day: 'Wed', hours: 1.0, questions: 20, topics: ['Grammar & Conventions'], notes: 'Standard conventions drill' },
      { day: 'Thu', hours: 2.5, questions: 45, topics: ['Advanced Math & Quadratics'], notes: 'Heart of Algebra & quadratics' },
      { day: 'Fri', hours: 0.8, questions: 15, topics: ['Vocabulary in Context'], notes: 'Flashcard drill' },
      { day: 'Sat', hours: 3.2, questions: 55, topics: ['Full Math Section Drill'], notes: 'Timed section test' },
      { day: 'Sun', hours: 1.8, questions: 30, topics: ['Error Log Review'], notes: 'Analyzed missed questions' },
    ],
    // Week 2 (2 weeks ago)
    [
      { day: 'Mon', hours: 2.2, questions: 40, topics: ['Geometry & Trig'], notes: 'Circle equations & triangles' },
      { day: 'Tue', hours: 2.0, questions: 35, topics: ['Craft & Structure'], notes: 'Rhetorical analysis drills' },
      { day: 'Wed', hours: 2.5, questions: 48, topics: ['Passport to Advanced Math'], notes: 'Polynomial division' },
      { day: 'Thu', hours: 1.8, questions: 30, topics: ['Data Analysis & Statistics'], notes: 'Probability & scatterplots' },
      { day: 'Fri', hours: 2.0, questions: 32, topics: ['Transitions & Syntax'], notes: 'Sentence boundaries' },
      { day: 'Sat', hours: 3.5, questions: 60, topics: ['Full Practice Exam Module 1 & 2'], notes: 'Simulated test environment' },
      { day: 'Sun', hours: 1.5, questions: 22, topics: ['Weak Area Review'], notes: 'Pacing adjustments' },
    ],
    // Week 3 (Last week)
    [
      { day: 'Mon', hours: 2.0, questions: 35, topics: ['Reading Evidence Questions'], notes: 'Command of evidence focus' },
      { day: 'Tue', hours: 2.4, questions: 42, topics: ['Linear Equations & Systems'], notes: 'No-calculator efficiency' },
      { day: 'Wed', hours: 2.2, questions: 38, topics: ['Standard English Conventions'], notes: 'Punctuation rules masterclass' },
      { day: 'Thu', hours: 2.0, questions: 36, topics: ['Exponents & Radicals'], notes: 'Rules of exponents' },
      { day: 'Fri', hours: 1.5, questions: 28, topics: ['Expression of Ideas'], notes: 'Information synthesis' },
      { day: 'Sat', hours: 3.0, questions: 52, topics: ['Timed Math Module'], notes: 'Speed & accuracy' },
      { day: 'Sun', hours: 2.0, questions: 34, topics: ['Vocabulary & Context'], notes: 'High-frequency root words' },
    ],
    // Week 4 (Current week)
    [
      { day: 'Mon', hours: 2.2, questions: 40, topics: ['Quadratic Formula & Vertex'], notes: 'Parabola geometry' },
      { day: 'Tue', hours: 2.0, questions: 36, topics: ['Cross-Text Connections'], notes: 'Dual-passage comparison' },
      { day: 'Wed', hours: 2.5, questions: 45, topics: ['Functions & Transformations'], notes: 'Graph reflections' },
      { day: 'Thu', hours: 2.1, questions: 38, topics: ['Rhetorical Synthesis'], notes: 'Bullet-point integration' },
      { day: 'Fri', hours: 1.8, questions: 30, topics: ['Problem Solving & Data'], notes: 'Percentages and unit rates' },
      { day: 'Sat', hours: 3.2, questions: 58, topics: ['Diagnostic Test Simulation'], notes: 'Full section with timer' },
      { day: 'Sun', hours: 1.6, questions: 26, topics: ['Flashcard & Error Log Review'], notes: 'Daily practice session' },
    ],
  ];

  const dayFullNames: Record<string, string> = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday',
  };

  const calculateIntensity = (hours: number): 0 | 1 | 2 | 3 | 4 => {
    if (hours <= 0) return 0;
    if (hours < 1.0) return 1;
    if (hours < 2.0) return 2;
    if (hours <= 3.0) return 3;
    return 4;
  };

  let totalMonthHours = 0;
  let activeDaysCount = 0;

  historicalPatterns.forEach((weekPattern, wIdx) => {
    const weekNumber = wIdx + 1;
    const weekLabel =
      wIdx === 3
        ? 'Current Week'
        : wIdx === 2
        ? 'Last Week'
        : `${4 - wIdx} Weeks Ago`;

    let weekTotalHours = 0;
    let weekGoalMetCount = 0;

    const days: HeatmapDay[] = weekPattern.map((p, dIdx) => {
      // Calculate date relative to current week
      const dayOffset = (3 - wIdx) * 7 + (6 - dIdx);
      const dateObj = new Date(today);
      dateObj.setDate(dateObj.getDate() - dayOffset);
      const dateStr = dateObj.toISOString().split('T')[0];

      const intensity = calculateIntensity(p.hours);
      const isGoalMet = p.hours >= 2.0;

      if (p.hours > 0) activeDaysCount++;
      if (isGoalMet) weekGoalMetCount++;
      weekTotalHours += p.hours;
      totalMonthHours += p.hours;

      return {
        date: dateStr,
        day_name: p.day,
        day_full: dayFullNames[p.day] || p.day,
        study_hours: p.hours,
        intensity_level: intensity,
        is_goal_met: isGoalMet,
        daily_goal_hours: 2.0,
        questions_answered: p.questions,
        topics: p.topics,
        notes: p.notes,
        is_today: wIdx === 3 && dIdx === 6,
      };
    });

    weeksData.push({
      week_number: weekNumber,
      week_label: weekLabel,
      days,
      total_hours: Number(weekTotalHours.toFixed(1)),
      completion_rate: Math.round((weekGoalMetCount / days.length) * 100),
    });
  });

  const response: WeeklyConsistencyResponse = {
    current_streak: 12,
    longest_streak: 21,
    weekly_adherence_rate: 94,
    total_active_days: activeDaysCount,
    total_study_hours_month: Number(totalMonthHours.toFixed(1)),
    best_day_of_week: 'Saturday (3.2h avg)',
    weeks: weeksData,
    current_week_days: weeksData[weeksData.length - 1].days,
  };

  return NextResponse.json(response);
}
