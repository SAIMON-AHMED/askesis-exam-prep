import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function GET() {
  const completedExams = mockBackend.examHistory;
  const averageScore = completedExams.length > 0
    ? completedExams.reduce((total, exam) => total + (exam.accuracy_percentage || 0), 0) / completedExams.length
    : 0;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const lastSevenDaysHours = mockBackend.studyLogs
    .filter((log) => new Date(log.timestamp).getTime() >= sevenDaysAgo)
    .reduce((total, log) => total + log.duration_minutes / 60, 0);

  return NextResponse.json({
    total_study_hours: mockBackend.user.total_study_hours,
    exams_completed: mockBackend.user.exams_completed,
    average_score: Number(averageScore.toFixed(1)),
    last_7_days_study_hours: Number(lastSevenDaysHours.toFixed(2)),
  });
}
