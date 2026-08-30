'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface TopicItem {
  topic: string;
  accuracy: number;
  total_questions?: number;
  time_per_question?: number;
  exam_type?: string;
}

interface TopicMasteryRadarProps {
  data?: TopicItem[];
}

export const TopicMasteryRadar: React.FC<TopicMasteryRadarProps> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'weak' | 'mastered'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback high-yield topics if data is empty
  const defaultTopics: TopicItem[] = [
    { topic: 'Heart of Algebra & Linear Equations', accuracy: 88, total_questions: 42, time_per_question: 68 },
    { topic: 'Advanced Math & Quadratics', accuracy: 64, total_questions: 35, time_per_question: 94 },
    { topic: 'Problem Solving & Data Analysis', accuracy: 82, total_questions: 30, time_per_question: 72 },
    { topic: 'Geometry & Trigonometry', accuracy: 52, total_questions: 28, time_per_question: 110 },
    { topic: 'Information & Ideas (Reading)', accuracy: 76, total_questions: 45, time_per_question: 65 },
    { topic: 'Craft & Structure (Reading)', accuracy: 58, total_questions: 38, time_per_question: 84 },
    { topic: 'Standard English Conventions', accuracy: 91, total_questions: 50, time_per_question: 45 },
    { topic: 'Expression of Ideas (Writing)', accuracy: 79, total_questions: 32, time_per_question: 58 },
  ];

  const topicsList = data && data.length > 0 ? data : defaultTopics;

  const getMasteryCategory = (accuracy: number) => {
    if (accuracy >= 85) return { label: 'Mastered', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' };
    if (accuracy >= 70) return { label: 'Proficient', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' };
    if (accuracy >= 55) return { label: 'Needs Review', color: '#b45309', bg: '#fffbeb', border: '#fde68a' };
    return { label: 'Critical Gap', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' };
  };

  const filteredTopics = topicsList.filter((item) => {
    const matchesSearch = item.topic.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'weak') return item.accuracy < 70;
    if (filter === 'mastered') return item.accuracy >= 85;
    return true;
  });

  return (
    <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#111827' }}>
            🎯 Topic Mastery & Weakness Matrix
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
            Isolate high-leverage topics to target your highest score return on investment.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f3f4f6', padding: '3px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: filter === 'all' ? '#ffffff' : 'transparent',
              color: filter === 'all' ? '#111827' : '#6b7280',
              cursor: 'pointer',
              boxShadow: filter === 'all' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            All Topics ({topicsList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('weak')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: filter === 'weak' ? '#ffffff' : 'transparent',
              color: filter === 'weak' ? '#dc2626' : '#6b7280',
              cursor: 'pointer',
              boxShadow: filter === 'weak' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            ⚡ Priority Gaps ({topicsList.filter((t) => t.accuracy < 70).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('mastered')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: filter === 'mastered' ? '#ffffff' : 'transparent',
              color: filter === 'mastered' ? '#16a34a' : '#6b7280',
              cursor: 'pointer',
              boxShadow: filter === 'mastered' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            ✓ Mastered ({topicsList.filter((t) => t.accuracy >= 85).length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Filter topic by name (e.g. Algebra, Geometry, Inference)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
          }}
        />
      </div>

      {/* Topic Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {filteredTopics.map((item, idx) => {
          const category = getMasteryCategory(item.accuracy);
          return (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1f2937', flex: 1, paddingRight: '8px' }}>
                    {item.topic}
                  </h4>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      backgroundColor: category.bg,
                      color: category.color,
                      border: `1px solid ${category.border}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {category.label}
                  </span>
                </div>

                {/* Accuracy meter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.accuracy}%`,
                        backgroundColor: category.color,
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: category.color, minWidth: '40px', textAlign: 'right' }}>
                    {Math.round(item.accuracy)}%
                  </span>
                </div>
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {item.time_per_question ? `Avg: ${item.time_per_question}s / q` : 'Standard pacing'}
                </span>
                <Link
                  href="/practice"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#2563eb',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Practice Drill →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
