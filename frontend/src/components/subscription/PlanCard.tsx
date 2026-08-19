import React from 'react';
import { SubscriptionPlan } from '@/hooks/useSubscription';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSelect: (planId: string) => void;
  isLoading: boolean;
}

export default function PlanCard({ plan, isCurrentPlan, onSelect, isLoading }: PlanCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        border: isCurrentPlan ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
        position: 'relative',
      }}
    >
      {isCurrentPlan && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '16px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          Current Plan
        </div>
      )}

      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700' }}>
        {plan.name}
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '36px', fontWeight: '700' }}>
          ${plan.price}
        </span>
        {plan.price > 0 && (
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
            /month
          </span>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
          <strong>{plan.questions_per_day >= 999 ? 'Unlimited' : plan.questions_per_day}</strong> questions/day
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          <strong>{plan.exams_per_month >= 999 ? 'Unlimited' : plan.exams_per_month}</strong> exams/month
        </p>
      </div>

      <div style={{ marginBottom: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Features
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                fontSize: '14px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onSelect(plan.plan_id)}
        disabled={isLoading || isCurrentPlan}
        className={isCurrentPlan ? 'btn-secondary' : 'btn-primary'}
        style={{
          width: '100%',
          marginTop: 'auto',
          cursor: isCurrentPlan ? 'default' : 'pointer',
          opacity: isCurrentPlan ? 0.6 : 1,
        }}
      >
        {isCurrentPlan ? 'Current Plan' : isLoading ? 'Upgrading...' : 'Select Plan'}
      </button>
    </div>
  );
}
