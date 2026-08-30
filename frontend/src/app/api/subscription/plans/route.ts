import { NextResponse } from 'next/server';

const PLANS = [
  {
    plan_id: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    questions_per_day: 5,
    exams_per_month: 1,
    trial_period_days: 0,
    features: ['Basic practice questions', 'Limited exams', 'Basic progress tracking'],
  },
  {
    plan_id: 'pro',
    name: 'Pro',
    price: 9.99,
    currency: 'usd',
    questions_per_day: 50,
    exams_per_month: 10,
    trial_period_days: 3,
    features: [
      'Unlimited practice questions',
      'Unlimited exams',
      'Advanced analytics',
      'Personalized study plans',
      'Priority support',
    ],
  },
  {
    plan_id: 'premium',
    name: 'Premium',
    price: 19.99,
    currency: 'usd',
    questions_per_day: 999,
    exams_per_month: 999,
    trial_period_days: 3,
    features: [
      'Everything in Pro',
      '1-on-1 tutoring sessions',
      'Custom learning paths',
      'Advanced progress tracking',
      'Offline access',
      'VIP email support',
    ],
  },
];

export async function GET() {
  return NextResponse.json(PLANS);
}
