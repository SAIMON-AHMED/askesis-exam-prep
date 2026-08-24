'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanCard from '@/components/subscription/PlanCard';
import { useSubscriptionPlans, useCurrentSubscription, upgradePlan, cancelSubscription } from '@/hooks/useSubscription';
import { useExamAccess } from '@/hooks/useExamAccess';
import { EXAMS } from '@/lib/examConstants';

export default function SubscriptionPage() {
  const router = useRouter();
  const { plans, loading: plansLoading } = useSubscriptionPlans();
  const { subscription } = useCurrentSubscription();
  const { catalog, purchasedExamIds, hasAllAccess, isLoggedIn, buyExam } = useExamAccess();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [buyingExamId, setBuyingExamId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleBuyExam = async (examId: string) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    const item = catalog.find((c) => c.exam_id === examId);
    if (!window.confirm(`Unlock ${item?.name || examId.toUpperCase()} for $${item?.price.toFixed(2)}? Lifetime access to its full curriculum and practice.`)) {
      return;
    }
    setBuyingExamId(examId);
    setMessage('');
    try {
      await buyExam(examId);
      setMessage(`${item?.name || examId.toUpperCase()} unlocked!`);
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || 'Failed to complete purchase');
    } finally {
      setBuyingExamId(null);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (planId === subscription?.plan_name) {
      return; // Already on this plan
    }

    setIsUpgrading(true);
    setMessage('');

    try {
      const result = await upgradePlan(planId);
      if ('checkout_url' in result) {
        window.location.assign(result.checkout_url);
        return;
      }
      setMessage(`Successfully upgraded to ${planId}!`);
      setTimeout(() => setMessage(''), 3000);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Failed to upgrade plan');
      console.error(err);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to downgrade to the free plan?')) {
      return;
    }

    setIsUpgrading(true);
    setMessage('');

    try {
      await cancelSubscription();
      setMessage('Downgraded to free plan');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Failed to cancel subscription');
      console.error(err);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <main style={{ padding: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
          Subscription Plans
        </h1>
        <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)' }}>
          Choose a plan that works for your study needs
        </p>
      </div>

      {/* Current Subscription Info */}
      {subscription && (
        <div className="card" style={{ padding: '16px', marginBottom: 'var(--space-6)', backgroundColor: '#f0f4f8' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>Current Plan:</strong>{' '}
            <span style={{ textTransform: 'capitalize', color: 'var(--primary-color)', fontWeight: '600' }}>
              {subscription.plan_name}
            </span>{' '}
            ({subscription.status})
          </p>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={message.includes('Failed') ? 'alert alert-error' : 'alert alert-success'}
          style={{ marginBottom: 'var(--space-6)' }}
        >
          {message}
        </div>
      )}

      {/* Plans Grid */}
      {plansLoading ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <p>Loading plans...</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.plan_id}
              plan={plan}
              isCurrentPlan={subscription?.plan_name === plan.plan_id}
              onSelect={handleSelectPlan}
              isLoading={isUpgrading}
            />
          ))}
        </div>
      )}

      {/* One-time exam purchases */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          Prefer to buy just one exam?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          One-time payment, lifetime access to that exam's full curriculum, practice questions, and analytics.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {catalog.map((item) => {
            const owned = hasAllAccess || purchasedExamIds.includes(item.exam_id);
            const exam = EXAMS[item.exam_id];
            return (
              <div key={item.exam_id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '32px' }}>{exam?.icon || '📘'}</div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{item.name}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', flexGrow: 1 }}>
                  {exam?.description || 'Full exam curriculum'}
                </p>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>
                  ${item.price.toFixed(2)}
                  <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 4 }}>one-time</span>
                </div>
                <button
                  className={owned ? 'btn-secondary' : 'btn-primary'}
                  disabled={owned || buyingExamId === item.exam_id}
                  onClick={() => handleBuyExam(item.exam_id)}
                  style={{ width: '100%' }}
                >
                  {owned ? 'Owned ✓' : buyingExamId === item.exam_id ? 'Processing...' : `Buy ${item.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: 'var(--space-6)' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '600px' }}>
          <details
            style={{
              padding: '16px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: '600', cursor: 'pointer' }}>
              Can I upgrade or downgrade at any time?
            </summary>
            <p style={{ marginTop: '12px', marginBottom: 0, color: 'var(--text-secondary)' }}>
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </details>

          <details
            style={{
              padding: '16px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: '600', cursor: 'pointer' }}>
              What is a free trial?
            </summary>
            <p style={{ marginTop: '12px', marginBottom: 0, color: 'var(--text-secondary)' }}>
              Pro and Premium plans include a 3-day free trial. A payment method is required to start the trial.
            </p>
          </details>

          <details
            style={{
              padding: '16px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: '600', cursor: 'pointer' }}>
              Can I get a refund?
            </summary>
            <p style={{ marginTop: '12px', marginBottom: 0, color: 'var(--text-secondary)' }}>
              We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a
              full refund.
            </p>
          </details>

          <details
            style={{
              padding: '16px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: '600', cursor: 'pointer' }}>
              Is my payment secure?
            </summary>
            <p style={{ marginTop: '12px', marginBottom: 0, color: 'var(--text-secondary)' }}>
              Yes, we use Stripe for payment processing, which is PCI-DSS compliant and encrypts all payment
              information.
            </p>
          </details>
        </div>
      </section>

      {/* Danger Zone */}
      {subscription?.plan_name !== 'free' && (
        <section
          style={{
            marginTop: 'var(--space-8)',
            padding: '16px',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            backgroundColor: '#fee2e2',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', color: '#991b1b', fontWeight: '700' }}>
            Danger Zone
          </h3>
          <p style={{ margin: '0 0 12px 0', color: '#991b1b' }}>
            Want to go back to the free plan? You'll lose access to premium features.
          </p>
          <button
            onClick={handleCancelSubscription}
            disabled={isUpgrading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isUpgrading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              opacity: isUpgrading ? 0.6 : 1,
            }}
          >
            {isUpgrading ? 'Processing...' : 'Downgrade to Free'}
          </button>
        </section>
      )}
    </main>
  );
}
