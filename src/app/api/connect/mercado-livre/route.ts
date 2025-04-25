import { getAuthToken } from '../../../../../lib/mercadoLivreAuth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // Debug inicial
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    APP_ID: process.env.MERCADO_LIVRE_APP_ID ? 'exists' : 'missing',
    REDIRECT_URI: process.env.MERCADO_LIVRE_REDIRECT_URI
  });

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) throw new Error('Código não fornecido');

    // 1. Obter tokens
    const { access_token, refresh_token } = await getAuthToken(code);

    // 2. Armazenar cookies - FORMA CORRETA Next.js 14.2+
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    response.cookies.set({
      name: 'ml_access_token',
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 6 * 60 * 60, // 6 horas
      path: '/'
    });

    response.cookies.set({
      name: 'ml_refresh_token',
      value: refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.redirect(new URL('/dashboard?error=auth_failed', request.url));
  }
}