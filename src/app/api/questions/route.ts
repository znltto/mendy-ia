// app/api/questions/route.ts
import { MercadoLivreAPI } from '../../../../lib/mercadoLivre';
import { NextResponse } from 'next/server';

interface Question {
  id: string;
  text: string;
  status: 'ANSWERED' | 'UNANSWERED';
  item_title: string;
  date_created: string;
  answer?: {
    text: string;
  };
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Solução alternativa 100% funcional
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [key, val] = c.trim().split('=');
        return [key, decodeURIComponent(val)];
      }).filter(([k, v]) => k && v)
    );

    const accessToken = cookies['ml_access_token'];

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acesso não encontrado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mlApi = new MercadoLivreAPI();

    const questions = await mlApi.getQuestions(accessToken, {
      status: searchParams.get('status') as 'ANSWERED' | 'UNANSWERED' | undefined,
      limit: Number(searchParams.get('limit')) || 20,
      offset: Number(searchParams.get('offset')) || 0
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Erro na rota de perguntas:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}