// lib/mercadoLivreAuth.ts
'use server'; // Adicionando para Server Components

const BASE_URL = 'https://api.mercadolibre.com';
const AUTH_URL = 'https://auth.mercadolivre.com.br';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
}

interface ErrorResponse {
  error: string;
  message: string;
  status: number;
  cause?: string[];
}

export async function getAuthToken(code: string): Promise<TokenResponse> {
  // Validação das variáveis de ambiente
  if (!process.env.MERCADO_LIVRE_APP_ID || 
      !process.env.MERCADO_LIVRE_SECRET || 
      !process.env.MERCADO_LIVRE_REDIRECT_URI) {
    throw new Error('Configurações do Mercado Livre não encontradas');
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.MERCADO_LIVRE_APP_ID,
    client_secret: process.env.MERCADO_LIVRE_SECRET,
    code,
    redirect_uri: process.env.MERCADO_LIVRE_REDIRECT_URI
  });

  try {
    const response = await fetch(`${AUTH_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params,
      cache: 'no-store' // Importante para fluxos de autenticação
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new Error(`Erro na autenticação: ${errorData.error} - ${errorData.message}`);
    }

    return {
      ...data as TokenResponse,
      // Garantindo os valores mínimos necessários
      expires_in: data.expires_in || 21600, // 6 horas padrão se não informado
      user_id: data.user_id || 0 // ID do usuário é crítico para outras operações
    };

  } catch (error) {
    console.error('Erro no processo de autenticação:', error);
    throw new Error('Falha na comunicação com o Mercado Livre');
  }
}

// Novo método para refresh token
export async function refreshAuthToken(refreshToken: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.MERCADO_LIVRE_APP_ID!,
    client_secret: process.env.MERCADO_LIVRE_SECRET!,
    refresh_token: refreshToken
  });

  const response = await fetch(`${AUTH_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}