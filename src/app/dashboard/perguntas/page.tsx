// app/dashboard/perguntas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

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

export default function PerguntasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const status = searchParams.get('status') || 'ALL';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError('');
        
        const res = await fetch(
          `/api/questions?status=${status}&limit=50`,
          {
            credentials: 'include', // Inclui cookies na requisição
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (res.status === 401) {
          router.push(''); // Redireciona se não autenticado
          return;
        }
        
        if (!res.ok) {
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [status, router]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Carregando perguntas...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">Erro</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">Perguntas dos Clientes</h1>
        
        <div className="flex gap-4 mb-8">
          <a
            href="/dashboard/perguntas?status=ALL"
            className={`px-4 py-2 rounded-lg transition-colors ${
              status === 'ALL' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Todas
          </a>
          <a
            href="/dashboard/perguntas?status=UNANSWERED"
            className={`px-4 py-2 rounded-lg transition-colors ${
              status === 'UNANSWERED' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Não Respondidas
          </a>
          <a
            href="/dashboard/perguntas?status=ANSWERED"
            className={`px-4 py-2 rounded-lg transition-colors ${
              status === 'ANSWERED' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Respondidas
          </a>
        </div>

        {questions.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-300">Nenhuma pergunta encontrada</h3>
              <p className="mt-2 text-gray-400">
                {status === 'ALL' 
                  ? 'Não há perguntas no momento.' 
                  : status === 'ANSWERED' 
                    ? 'Nenhuma pergunta respondida ainda.'
                    : 'Todas as perguntas foram respondidas!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div 
                key={question.id} 
                className={`border rounded-xl p-6 transition-all hover:border-blue-500/50 ${
                  question.status === 'ANSWERED' 
                    ? 'border-green-500/30 bg-gray-800/30' 
                    : 'border-red-500/30 bg-gray-800/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{question.item_title}</h3>
                    <p className="text-gray-300 mt-1">{question.text}</p>
                    {question.answer && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-sm text-gray-400">Resposta:</p>
                        <p className="text-gray-300 mt-1">{question.answer.text}</p>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    question.status === 'ANSWERED' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {question.status === 'ANSWERED' ? 'Respondida' : 'Não respondida'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(question.date_created).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}