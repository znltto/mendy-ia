// lib/mercadoLivreService.ts
'use server';

const API_URL = 'https://api.mercadolibre.com';

interface AuthHeaders {
  'Authorization': string;
  'Content-Type': string;
  [key: string]: string; // Index signature para compatibilidade
}

export async function getAuthenticatedHeaders(): Promise<AuthHeaders> {
  // Solução definitiva para headers() no Next.js 14+
  const getHeaders = (): { get: (name: string) => string | null } => {
    if (typeof window === 'undefined') {
      const { headers: serverHeaders } = require('next/headers');
      return serverHeaders();
    }
    return new Headers() as unknown as { get: (name: string) => string | null };
  };

  try {
    const headersInstance = getHeaders();
    const cookieHeader = headersInstance.get('cookie') || '';
    
    // Parse de cookies com tipagem explícita
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie: string) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        cookies[key.trim()] = decodeURIComponent(value.trim());
      }
    });

    const accessToken = cookies['ml_access_token'];
    if (!accessToken) {
      throw new Error('Token de acesso não encontrado nos cookies');
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Erro ao obter headers autenticados:', error);
    throw new Error('Falha na autenticação com o Mercado Livre');
  }
}

export async function getMessages(): Promise<any> {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await fetch(`${API_URL}/messages/packs`, {
      headers: new Headers(headers),
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw new Error('Falha ao buscar mensagens do Mercado Livre');
  }
}