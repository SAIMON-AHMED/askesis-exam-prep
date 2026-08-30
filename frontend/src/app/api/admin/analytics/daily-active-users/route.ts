import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    { date: '2026-02-23', dau: 780, new_users: 32 },
    { date: '2026-02-24', dau: 840, new_users: 41 },
    { date: '2026-02-25', dau: 910, new_users: 38 },
    { date: '2026-02-26', dau: 890, new_users: 29 },
    { date: '2026-02-27', dau: 950, new_users: 45 },
    { date: '2026-02-28', dau: 1020, new_users: 52 },
    { date: '2026-02-29', dau: 1180, new_users: 61 },
  ];
  return NextResponse.json(data);
}
