'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNotification } from '@/context/NotificationContext';

interface AdminStats {
  total_users: number;
  active_users: number;
  active_last_7_days: number;
  average_study_hours: number;
}

interface ContentStats {
  exams: number;
  topics: number;
  curated_questions: number;
  generated_questions: number;
  validated_generated: number;
  validation_rate: number;
}

export default function AdminDashboard() {
  const { success, error } = useNotification();
  const [userStats, setUserStats] = useState<AdminStats | null>(null);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, contentRes] = await Promise.all([
          axios.get('/api/admin/users/stats'),
          axios.get('/api/admin/content/stats'),
        ]);

        setUserStats(usersRes.data);
        setContentStats(contentRes.data);
        success('Admin dashboard loaded');
      } catch (err) {
        console.error(err);
        error('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>
        Admin Dashboard
      </h1>

      {/* User Statistics */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          User Statistics
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          <StatCard
            label="Total Users"
            value={userStats?.total_users || 0}
            color="#3b82f6"
          />
          <StatCard
            label="Active Users"
            value={userStats?.active_users || 0}
            color="#10b981"
          />
          <StatCard
            label="Active (Last 7 Days)"
            value={userStats?.active_last_7_days || 0}
            color="#f59e0b"
          />
          <StatCard
            label="Avg Study Hours"
            value={userStats?.average_study_hours.toFixed(1) || '0'}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Content Statistics */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Content Statistics
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          <StatCard
            label="Exams"
            value={contentStats?.exams || 0}
            color="#3b82f6"
          />
          <StatCard
            label="Topics"
            value={contentStats?.topics || 0}
            color="#10b981"
          />
          <StatCard
            label="Curated Questions"
            value={contentStats?.curated_questions || 0}
            color="#f59e0b"
          />
          <StatCard
            label="Generated Questions"
            value={contentStats?.generated_questions || 0}
            color="#ef4444"
          />
          <StatCard
            label="Validated Questions"
            value={contentStats?.validated_generated || 0}
            color="#06b6d4"
          />
          <StatCard
            label="Validation Rate"
            value={`${contentStats?.validation_rate.toFixed(1) || 0}%`}
            color="#8b5cf6"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
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
      </p>
    </div>
  );
}
