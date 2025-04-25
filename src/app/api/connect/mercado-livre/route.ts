import { getAuthToken } from '../../../../../lib/mercadoLivreAuth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // Debug melhorado
  console.log('[ML Auth] Iniciando processo de autenticação');
  console.debug('Variáveis de ambiente:', {
    NODE_ENV: process.env.NODE_ENV,
    APP_ID: process.env.MERCADO_LIVRE_APP_ID ? '***' + process.env.MERCADO_LIVRE_APP_ID.slice(-4) : 'missing',
    REDIRECT_URI: process.env.MERCADO_LIVRE_REDIRECT_URI
  });

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      throw new Error(`Erro do Mercado Livre: ${error}`);
    }

    if (!code) {
      throw new Error('Código de autorização não fornecido');
    }

    console.log('[ML Auth] Token de autorização recebido');

    // 1. Obter tokens
    const { access_token, refresh_token, expires_in } = await getAuthToken(code);
    
    if (!access_token || !refresh_token) {
      throw new Error('Tokens não recebidos do Mercado Livre');
    }

    console.log('[ML Auth] Tokens obtidos com sucesso');

    // 2. Armazenar tokens de forma segura
    const redirectUrl = new URL('/dashboard', request.url);
    const response = NextResponse.redirect(redirectUrl);
    
    // Configuração de cookies otimizada
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
    };

    response.cookies.set({
      name: 'ml_access_token',
      value: access_token,
      ...cookieOptions,
      maxAge: expires_in || 6 * 60 * 60, // 6 horas padrão
    });

    response.cookies.set({
      name: 'ml_refresh_token',
      value: refresh_token,
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // 30 dias
    });

    // Cookie adicional para controle de sessão
    response.cookies.set({
      name: 'ml_auth_status',
      value: 'authenticated',
      ...cookieOptions,
      maxAge: 60 * 60, // 1 hora
    });

    console.log('[ML Auth] Autenticação concluída com sucesso');
    return response;

  } catch (error) {
    console.error('[ML Auth] Erro no processo de autenticação:', error);
    
    const redirectUrl = new URL('/dashboard', request.url);
    redirectUrl.searchParams.set('auth_error', (error as Error).message);
    
    // Limpa cookies em caso de erro
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete('ml_access_token');
    response.cookies.delete('ml_refresh_token');
    response.cookies.delete('ml_auth_status');

    return response;
  }
}

// Adicione isso se precisar de outros métodos HTTP
export async function POST() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  );
}