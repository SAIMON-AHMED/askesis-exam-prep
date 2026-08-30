import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const enabled = !!body.enabled;
  return NextResponse.json({
    maintenance_mode: enabled,
    message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}.`,
  });
}
