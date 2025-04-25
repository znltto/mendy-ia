// lib/mercadoLivre.ts
'use server'; // Importante para Server Actions

export class MercadoLivreAPI {
  private readonly baseUrl = 'https://api.mercadolibre.com';
  private readonly authUrl = 'https://auth.mercadolivre.com.br';

  /**
   * Gera URL de autenticação OAuth 2.0
   */
  public getAuthUrl(): string {
    if (!process.env.MERCADO_LIVRE_APP_ID || !process.env.MERCADO_LIVRE_REDIRECT_URI) {
      throw new Error('Variáveis de ambiente não configuradas');
    }

    return `${this.authUrl}/authorization?response_type=code&client_id=${process.env.MERCADO_LIVRE_APP_ID}&redirect_uri=${process.env.MERCADO_LIVRE_REDIRECT_URI}`;
  }

  /**
   * Troca código de autorização por tokens de acesso
   */
  public async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user_id: number;
  }> {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.MERCADO_LIVRE_APP_ID!,
        client_secret: process.env.MERCADO_LIVRE_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.MERCADO_LIVRE_REDIRECT_URI!,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na autenticação: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Registra webhooks para notificações
   */
  public async registerWebhooks(accessToken: string, userId: string): Promise<void> {
    const topics = [
      'messages',
      'questions',
      'orders',
      'items',
      'shipments'
    ];

    await Promise.all(
      topics.map(topic =>
        fetch(`${this.baseUrl}/notifications/webhooks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            topic,
            notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ml/notifications`,
          }),
        })
      )
    );
  }

  /**
   * Processa notificações recebidas
   */
  public async handleNotification(data: {
    resource: string;
    user_id: number;
    topic: string;
    received_at: string;
  }): Promise<{ status: string; action?: string }> {
    console.log(`[ML Notificação] ${data.topic} recebida`, data);

    try {
      switch (data.topic) {
        case 'messages':
          await this.handleNewMessage(data.resource);
          return { status: 'processed', action: 'message_handled' };
        
        case 'questions':
          await this.handleNewQuestion(data.resource);
          return { status: 'processed', action: 'question_handled' };
        
        case 'orders':
          await this.handleNewOrder(data.resource);
          return { status: 'processed', action: 'order_handled' };
        
        default:
          return { status: 'ignored', action: 'unknown_topic' };
      }
    } catch (error) {
      console.error(`[ML Notificação] Erro ao processar ${data.topic}:`, error);
      return { status: 'error', action: 'processing_failed' };
    }
  }

  private async handleNewMessage(resource: string) {
    const messageId = resource.split('/messages/')[1];
    // Implemente sua lógica de mensagens aqui
    console.log(`[ML Mensagem] Nova mensagem ID: ${messageId}`);
  }

  private async handleNewQuestion(resource: string) {
    const questionId = resource.split('/questions/')[1];
    // Implemente sua lógica de perguntas aqui
    console.log(`[ML Pergunta] Nova pergunta ID: ${questionId}`);
  }

  private async handleNewOrder(resource: string) {
    const orderId = resource.split('/orders/')[1];
    // Implemente sua lógica de pedidos aqui
    console.log(`[ML Pedido] Novo pedido ID: ${orderId}`);
  }

  /**
   * Método para buscar mensagens
   */
  public async getMessages(accessToken: string, params?: {
    offset?: number;
    limit?: number;
  }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.offset) query.set('offset', params.offset.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const response = await fetch(`${this.baseUrl}/messages/packs?${query.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar mensagens: ${response.statusText}`);
    }

    return response.json();
  }
}