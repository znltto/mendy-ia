import { MercadoLivreAPI } from '../../../../../lib/mercadoLivre';
import { NextResponse } from 'next/server';

const mlApi = new MercadoLivreAPI();

export async function POST(request: Request) {
  try {
    // Verifica o header de autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Notificação recebida:', data);

    // Processa a notificação
    const result = await mlApi.handleNotification(data);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}