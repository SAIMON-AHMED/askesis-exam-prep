'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNotification } from '@/context/NotificationContext';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

interface UserDetail extends User {
  stats: {
    exams_completed: number;
    average_score: number;
    total_study_hours: number;
  };
  subscription: {
    plan: string;
    status: string;
  };
}

export default function UserManagement() {
  const { success, error } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users?limit=100');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetail = async (userId: string) => {
    try {
      setSelectedUserId(userId);
      const res = await axios.get(`/api/admin/users/${userId}`);
      setUserDetail(res.data);
    } catch (err) {
      console.error(err);
      error('Failed to load user details');
    }
  };

  const handleDeactivate = async (userId: string) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;

    try {
      await axios.post(`/api/admin/users/${userId}/deactivate`);
      success('User deactivated');
      fetchUsers();
      setSelectedUserId(null);
      setUserDetail(null);
    } catch (err) {
      console.error(err);
      error('Failed to deactivate user');
    }
  };

  const handleReactivate = async (userId: string) => {
    try {
      await axios.post(`/api/admin/users/${userId}/reactivate`);
      success('User reactivated');
      fetchUsers();
      setSelectedUserId(null);
      setUserDetail(null);
    } catch (err) {
      console.error(err);
      error('Failed to reactivate user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        User Management
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* User List */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              maxHeight: '600px',
              overflowY: 'auto',
            }}
          >
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => fetchUserDetail(user.id)}
                style={{
                  width: '100%',
                  padding: '16px',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: selectedUserId === user.id ? '#f3f4f6' : 'white',
                  cursor: 'pointer',
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.2s',
                }}
              >
                <div style={{ fontWeight: '600' }}>{user.full_name}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>{user.email}</div>
                <div
                  style={{
                    fontSize: '12px',
                    color: user.is_active ? '#10b981' : '#ef4444',
                    marginTop: '4px',
                  }}
                >
                  {user.is_active ? '✓ Active' : '✕ Inactive'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Details */}
        <div>
          {userDetail ? (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '24px',
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                {userDetail.full_name}
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>Email</div>
                <div style={{ fontWeight: '500' }}>{userDetail.email}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>Status</div>
                <div
                  style={{
                    fontWeight: '500',
                    color: userDetail.is_active ? '#10b981' : '#ef4444',
                  }}
                >
                  {userDetail.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>Joined</div>
                <div style={{ fontWeight: '500' }}>
                  {new Date(userDetail.created_at).toLocaleDateString()}
                </div>
              </div>

              <hr style={{ borderColor: '#e5e7eb', margin: '16px 0' }} />

              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Study Statistics
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Exams Completed</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                      {userDetail.stats.exams_completed}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Avg Score</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      {userDetail.stats.average_score.toFixed(1)}%
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Total Study Hours</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                      {userDetail.stats.total_study_hours.toFixed(1)}h
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Subscription
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Plan</div>
                    <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {userDetail.subscription.plan}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Status</div>
                    <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {userDetail.subscription.status}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {userDetail.is_active ? (
                  <button
                    onClick={() => handleDeactivate(userDetail.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Deactivate User
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(userDetail.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Reactivate User
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                color: '#6b7280',
              }}
            >
              Select a user to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
