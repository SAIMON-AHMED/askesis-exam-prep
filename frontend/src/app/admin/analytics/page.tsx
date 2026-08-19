'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNotification } from '@/context/NotificationContext';

interface DailyActiveUsers {
  date: string;
  active_users: number;
}

interface AnalyticsOverview {
  total_events: number;
  total_study_hours: number;
  event_breakdown: Array<{ event_type: string; count: number }>;
}

export default function AdminAnalytics() {
  const { error } = useNotification();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [dailyActiveUsers, setDailyActiveUsers] = useState<DailyActiveUsers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [overviewRes, dailyRes] = await Promise.all([
          axios.get('/api/admin/analytics/overview'),
          axios.get('/api/admin/analytics/daily-active-users?days=30'),
        ]);

        setOverview(overviewRes.data);
        setDailyActiveUsers(dailyRes.data);
      } catch (err) {
        console.error(err);
        error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>
        Platform Analytics
      </h1>

      {/* Overview Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatCard label="Total Events" value={overview?.total_events || 0} color="#3b82f6" />
        <StatCard
          label="Total Study Hours"
          value={overview?.total_study_hours.toFixed(1) || '0'}
          unit="h"
          color="#10b981"
        />
      </div>

      {/* Daily Active Users Chart */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', margin: 0 }}>
          Daily Active Users (Last 30 Days)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyActiveUsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="active_users" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Event Breakdown */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Event Breakdown
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {overview?.event_breakdown.map((event) => (
            <div
              key={event.event_type}
              style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                borderLeft: '4px solid #3b82f6',
              }}
            >
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                {event.event_type}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
                {event.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color: string;
}) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{label}</p>
      <p
        style={{
          margin: '8px 0 0 0',
          fontSize: '32px',
          fontWeight: 'bold',
          color,
        }}
      >
        {value}
        {unit && <span style={{ fontSize: '20px', marginLeft: '4px' }}>{unit}</span>}
      </p>
    </div>
  );
}
