import { NextResponse } from 'next/server';

const USERS = [
  { id: 'usr-1', email: 'alex.mercer@gmail.com', full_name: 'Alex Mercer', role: 'student', status: 'active', plan: 'pro', created_at: '2026-01-15T10:00:00Z' },
  { id: 'usr-2', email: 'sophia.chen@mit.edu', full_name: 'Sophia Chen', role: 'student', status: 'active', plan: 'premium', created_at: '2026-01-18T14:30:00Z' },
  { id: 'usr-3', email: 'marcus.vance@yahoo.com', full_name: 'Marcus Vance', role: 'student', status: 'active', plan: 'free', created_at: '2026-02-01T09:15:00Z' },
  { id: 'usr-4', email: 'elena.rostova@outlook.com', full_name: 'Elena Rostova', role: 'tutor', status: 'active', plan: 'pro', created_at: '2026-02-05T16:45:00Z' },
];

export async function GET() {
  return NextResponse.json({ users: USERS, total: USERS.length });
}
