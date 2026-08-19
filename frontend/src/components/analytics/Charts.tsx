import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface WeeklyChartProps {
  data: Array<{ date: string; study_hours: number }>;
  title?: string;
}

export function WeeklyStudyChart({ data, title = 'Weekly Study Time' }: WeeklyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No data available</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-secondary)',
              border: `1px solid var(--border-color)`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
          <Bar dataKey="study_hours" fill="var(--primary-color)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface StudyTimeBreakdownChartProps {
  data: Array<{ exam_type: string; total_hours: number }>;
  title?: string;
}

export function StudyTimeBreakdownChart({
  data,
  title = 'Study Time by Exam',
}: StudyTimeBreakdownChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No data available</p>
      </div>
    );
  }

  const COLORS = [
    '#3A6EA5', // SAT - Indigo
    '#00B4D8', // ACT - Cyan
    '#7C3AED', // GRE - Violet
    '#10B981', // GMAT - Emerald
    '#F97316', // SHSAT - Orange
    '#EF4444', // Regents - Red
  ];

  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total_hours"
            nameKey="exam_type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ exam_type, total_hours }) => `${exam_type}: ${total_hours}h`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-secondary)',
              border: `1px solid var(--border-color)`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TopicPerformanceChartProps {
  data: Array<{ topic: string; mastery_score: number }>;
  title?: string;
}

export function TopicPerformanceChart({
  data,
  title = 'Topic Mastery Scores',
}: TopicPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No data available</p>
      </div>
    );
  }

  // Sort by mastery score and take top 10
  const topTopics = data.sort((a, b) => b.mastery_score - a.mastery_score).slice(0, 10);

  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topTopics}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 250, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="topic"
            width={240}
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-secondary)',
              border: `1px solid var(--border-color)`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
          <Bar dataKey="mastery_score" fill="var(--accent-color)" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
