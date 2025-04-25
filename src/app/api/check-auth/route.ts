import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request: Request) {
  const token = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}