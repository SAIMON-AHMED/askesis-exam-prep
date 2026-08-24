import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface SubscriptionPlan {
  plan_id: string;
  name: string;
  price: number;
  currency: string;
  questions_per_day: number;
  exams_per_month: number;
  trial_period_days: number;
  features: string[];
}

export interface CurrentSubscription {
  id: string;
  plan_name: string;
  status: string;
}

export interface SubscriptionUsage {
  plan: string;
  status: string;
  limits: {
    questions_per_day: number;
    exams_per_month: number;
  };
  current_usage: {
    questions_today: number;
    exams_this_month: number;
  };
}

// Mirrors backend SUBSCRIPTION_PLANS so the page still renders if the API is unreachable.
const FALLBACK_PLANS: SubscriptionPlan[] = [
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

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/subscription/plans');
        setPlans(response.data);
        setError(null);
      } catch (err) {
        setPlans(FALLBACK_PLANS);
        setError('Failed to load subscription plans');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
}

export function useCurrentSubscription() {
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await api.get('/subscription/me');
        setSubscription(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load subscription');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return { subscription, loading, error };
}

export function useSubscriptionUsage() {
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      const response = await api.get('/subscription/usage');
      setUsage(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load subscription usage');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { usage, loading, error, refetch };
}

export async function upgradePlan(planName: string): Promise<CurrentSubscription> {
  const response = await api.post('/subscription/create', { plan_name: planName });
  return response.data;
}

export async function cancelSubscription(): Promise<void> {
  await api.post('/subscription/cancel');
}

export function useFeatureAvailable(feature: 'unlimited_questions' | 'unlimited_exams' | 'analytics' | 'study_plans') {
  const { subscription } = useCurrentSubscription();

  const featureMap: Record<string, Set<string>> = {
    unlimited_questions: new Set(['pro', 'premium']),
    unlimited_exams: new Set(['pro', 'premium']),
    analytics: new Set(['pro', 'premium']),
    study_plans: new Set(['pro', 'premium']),
  };

  const allowed = featureMap[feature] || new Set();
  return subscription ? allowed.has(subscription.plan_name) : false;
}
