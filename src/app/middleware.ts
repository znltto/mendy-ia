// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../lib/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  console.log('Middleware - Token:', token);

  if (!token || !verifyToken(token)) {
    console.log('Middleware - Redirecionando para /');
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};