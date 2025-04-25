// lib/mercadoLivreAuth.ts
const BASE_URL = 'https://api.mercadolibre.com';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function getAuthToken(code: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.MERCADO_LIVRE_APP_ID!,
    client_secret: process.env.MERCADO_LIVRE_SECRET!,
    code,
    redirect_uri: process.env.MERCADO_LIVRE_REDIRECT_URI!
  });

  const response = await fetch(`${BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Failed to get auth token');
  }

  return response.json();
}