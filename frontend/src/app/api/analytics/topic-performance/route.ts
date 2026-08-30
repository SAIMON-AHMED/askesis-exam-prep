import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { topic: 'Heart of Algebra', mastery_score: 92, accuracy_rate: 94, average_time_per_question: 48, predicted_score_low: 760, predicted_score_high: 800 },
    { topic: 'Passport to Advanced Math', mastery_score: 85, accuracy_rate: 88, average_time_per_question: 62, predicted_score_low: 740, predicted_score_high: 780 },
    { topic: 'Reading Comprehension', mastery_score: 88, accuracy_rate: 89, average_time_per_question: 55, predicted_score_low: 730, predicted_score_high: 770 },
    { topic: 'Standard English Conventions', mastery_score: 78, accuracy_rate: 81, average_time_per_question: 38, predicted_score_low: 710, predicted_score_high: 750 },
    { topic: 'Data & Statistics', mastery_score: 94, accuracy_rate: 96, average_time_per_question: 42, predicted_score_low: 770, predicted_score_high: 800 },
  ]);
}
