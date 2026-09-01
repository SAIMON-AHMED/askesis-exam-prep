export interface StudyPlanTask {
  day: string;
  task_key: string;
  task_title: string;
  topic: string;
  duration_minutes: number;
  completed: boolean;
}

export interface StudyPlanWeek {
  week_number: number;
  theme: string;
  days: StudyPlanTask[];
}

export interface ActiveStudyPlan {
  id: string;
  exam_id: string;
  target_date: string;
  target_score: number;
  weekly_hours: number;
  is_active: boolean;
  plan_json: {
    title: string;
    description: string;
    weeks: StudyPlanWeek[];
  };
  completed_tasks: string[];
}

function normalizeCompletedTasks(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((key): key is string => typeof key === 'string');
  if (!value || typeof value !== 'object') return [];

  return Object.entries(value)
    .filter(([, completed]) => Boolean(completed))
    .map(([key]) => key);
}

function normalizeWeek(value: unknown, fallbackWeekNumber: number): StudyPlanWeek | null {
  if (!value || typeof value !== 'object') return null;
  const week = value as Record<string, unknown>;
  const weekNumber = Number(week.week_number) || fallbackWeekNumber;
  const focusTopics = Array.isArray(week.focus_topics)
    ? week.focus_topics.filter((topic): topic is string => typeof topic === 'string')
    : [];
  const theme = typeof week.theme === 'string'
    ? week.theme
    : focusTopics.join(', ') || `Week ${weekNumber}`;

  let days: StudyPlanTask[] = [];
  if (Array.isArray(week.days)) {
    days = week.days
      .filter((task): task is Record<string, unknown> => Boolean(task) && typeof task === 'object')
      .map((task, taskIndex) => ({
        day: typeof task.day === 'string' ? task.day : `Day ${taskIndex + 1}`,
        task_key: typeof task.task_key === 'string' ? task.task_key : `${weekNumber}-day-${taskIndex}`,
        task_title: typeof task.task_title === 'string' ? task.task_title : 'Study session',
        topic: typeof task.topic === 'string' ? task.topic : focusTopics[0] || 'General Review',
        duration_minutes: Number(task.duration_minutes) || 30,
        completed: Boolean(task.completed),
      }));
  } else if (Array.isArray(week.daily_tasks)) {
    days = week.daily_tasks.flatMap((dayValue, dayIndex) => {
      if (!dayValue || typeof dayValue !== 'object') return [];
      const day = dayValue as Record<string, unknown>;
      const dayName = typeof day.day === 'string' ? day.day : `Day ${dayIndex + 1}`;
      const tasks = Array.isArray(day.tasks) ? day.tasks : [];

      return tasks
        .filter((task): task is string => typeof task === 'string')
        .map((task, taskIndex) => ({
          day: dayName,
          task_key: `${weekNumber}-${dayName}-${taskIndex}`,
          task_title: task,
          topic: focusTopics[0] || 'General Review',
          duration_minutes: 30,
          completed: false,
        }));
    });
  }

  return { week_number: weekNumber, theme, days };
}

export function normalizeActiveStudyPlan(value: unknown): ActiveStudyPlan | null {
  if (!value || typeof value !== 'object') return null;
  const plan = value as Record<string, unknown>;
  const planJson = plan.plan_json && typeof plan.plan_json === 'object'
    ? plan.plan_json as Record<string, unknown>
    : {};
  const rawWeeks = Array.isArray(planJson.weeks) ? planJson.weeks : [];
  const weeks = rawWeeks
    .map((week, index) => normalizeWeek(week, index + 1))
    .filter((week): week is StudyPlanWeek => week !== null);

  return {
    id: typeof plan.id === 'string' ? plan.id : '',
    exam_id: typeof plan.exam_id === 'string' ? plan.exam_id : '',
    target_date: typeof plan.target_date === 'string'
      ? plan.target_date
      : typeof plan.exam_date === 'string' ? plan.exam_date : '',
    target_score: Number(plan.target_score) || 0,
    weekly_hours: Number(plan.weekly_hours) || 0,
    is_active: Boolean(plan.is_active),
    plan_json: {
      title: typeof planJson.title === 'string' ? planJson.title : 'Study Plan',
      description: typeof planJson.description === 'string' ? planJson.description : '',
      weeks,
    },
    completed_tasks: normalizeCompletedTasks(plan.completed_tasks),
  };
}
