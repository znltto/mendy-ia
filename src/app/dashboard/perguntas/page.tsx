// app/dashboard/perguntas/page.tsx
'use client'; // Adicionando para usar hooks

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const status = searchParams.get('status') || 'ALL';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/questions?status=${status}&limit=50`
        );
        
        if (!res.ok) {
          throw new Error('Falha ao carregar perguntas');
        }
        
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [status]);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Perguntas dos Clientes</h1>
      
      <div className="flex gap-4 mb-6">
        <a
          href="/dashboard/perguntas?status=ALL"
          className={`px-4 py-2 rounded ${
            status === 'ALL' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Todas
        </a>
        <a
          href="/dashboard/perguntas?status=UNANSWERED"
          className={`px-4 py-2 rounded ${
            status === 'UNANSWERED' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Não Respondidas
        </a>
        <a
          href="/dashboard/perguntas?status=ANSWERED"
          className={`px-4 py-2 rounded ${
            status === 'ANSWERED' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Respondidas
        </a>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="border p-4 rounded-lg">
            {/* ... renderização das perguntas ... */}
          </div>
        ))}
      </div>
    </div>
  );
}