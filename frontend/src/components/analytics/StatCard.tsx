import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: number; // percentage change
  className?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  className = '',
}: StatCardProps) {
  return (
    <div className={`card ${className}`} style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}
          >
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <p
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '700',
                color: 'var(--text-primary)',
              }}
            >
              {value}
            </p>
            {unit && (
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                }}
              >
                {unit}
              </span>
            )}
          </div>
          {trend !== undefined && (
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '12px',
                color: trend >= 0 ? '#10b981' : '#ef4444',
              }}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        {icon && (
          <div
            style={{
              fontSize: '32px',
              opacity: 0.6,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
