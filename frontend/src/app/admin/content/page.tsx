'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNotification } from '@/context/NotificationContext';

interface GeneratedQuestion {
  id: string;
  exam_type: string;
  topic: string;
  difficulty: string;
  question_text: string;
  options: string[];
  created_at: string;
}

export default function ContentManagement() {
  const { success, error } = useNotification();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestionsForReview();
  }, []);

  const fetchQuestionsForReview = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/content/questions/review');
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      error('Failed to load questions for review');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (questionId: string, approved: boolean) => {
    try {
      setValidating(questionId);
      await axios.post(`/api/admin/content/questions/${questionId}/validate`, {
        approved,
      });

      success(approved ? 'Question approved' : 'Question rejected');
      setQuestions(questions.filter((q) => q.id !== questionId));
    } catch (err) {
      console.error(err);
      error('Failed to validate question');
    } finally {
      setValidating(null);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        Content Management
      </h1>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>
            Questions Pending Review
          </h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            {questions.length} questions awaiting validation
          </p>
        </div>

        {questions.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#6b7280' }}>
            ✓ All questions have been reviewed!
          </div>
        ) : (
          <div>
            {questions.map((question, index) => (
              <div
                key={question.id}
                style={{
                  padding: '24px',
                  borderBottom: index === questions.length - 1 ? 'none' : '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                      <span
                        style={{
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {question.exam_type}
                      </span>
                      <span
                        style={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {question.topic}
                      </span>
                      <span
                        style={{
                          backgroundColor:
                            question.difficulty === 'easy'
                              ? '#dcfce7'
                              : question.difficulty === 'medium'
                                ? '#fef3c7'
                                : '#fee2e2',
                          color:
                            question.difficulty === 'easy'
                              ? '#166534'
                              : question.difficulty === 'medium'
                                ? '#92400e'
                                : '#991b1b',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}
                      >
                        {question.difficulty}
                      </span>
                    </div>

                    <div style={{ color: '#6b7280', fontSize: '12px' }}>
                      Created: {new Date(question.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: '500', marginBottom: '12px' }}>
                    {question.question_text}
                  </p>

                  <div style={{ marginTop: '12px' }}>
                    {question.options.map((option, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          marginBottom: '4px',
                          fontSize: '14px',
                        }}
                      >
                        <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    onClick={() => handleValidate(question.id, true)}
                    disabled={validating === question.id}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600',
                      cursor: validating === question.id ? 'not-allowed' : 'pointer',
                      opacity: validating === question.id ? 0.6 : 1,
                    }}
                  >
                    ✓ Approve
                  </button>

                  <button
                    onClick={() => handleValidate(question.id, false)}
                    disabled={validating === question.id}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600',
                      cursor: validating === question.id ? 'not-allowed' : 'pointer',
                      opacity: validating === question.id ? 0.6 : 1,
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
