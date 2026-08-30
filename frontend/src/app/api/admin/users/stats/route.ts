import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_users: 1420,
    active_users: 1180,
    pro_users: 385,
    new_users_today: 28,
  });
}
