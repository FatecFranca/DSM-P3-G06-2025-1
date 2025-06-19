'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function InscricaoVagasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Obter o ID da vaga da URL
    const vagaId = searchParams.get('id');

    if (!vagaId) {
      setError('ID da vaga não especificado');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verificar se o usuário está logado
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          router.push(`/login?redirect=/inscrever/vaga?id=${vagaId}`);
          return;
        }

        // Buscar dados da vaga
        const response = await fetch(`${ApiLink}/vagas/${vagaId}`);
        if (!response.ok) throw new Error('Vaga não encontrada');
        
        const data = await response.json();
        setVaga(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, searchParams]);

  const handleInscrever = async () => {
    try {
      setLoading(true);
      const vagaId = searchParams.get('id');
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      const response = await fetch(`${ApiLink}/inscricoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          usuario_id: user.id || user._id,
          vaga_id: vagaId
        })
      });

      if (!response.ok) throw new Error('Erro ao realizar inscrição');
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando informações da vaga...</h1>
          <div className="animate-pulse space-y-4">
            <div className="w-64 h-8 bg-gray-200 rounded mx-auto"></div>
            <div className="w-full max-w-md h-32 bg-gray-200 rounded-lg mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg max-w-md">
          <h1 className="text-xl font-bold mb-2">Erro</h1>
          <p className="mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Tentar novamente
            </button>
            <Link
              href="/vagas"
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Voltar para vagas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Inscrição realizada!</h2>
          <p className="mb-6">Você agora está inscrito na vaga: {vaga?.nome}</p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/vagas/${vaga?._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Ver vaga
            </Link>
            <Link
              href="/vagas"
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Explorar mais vagas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Confirmar Inscrição</h1>
          <p className="opacity-90">Confirme os detalhes antes de se inscrever</p>
        </div>
        
        <div className="p-6">
          {vaga && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{vaga.nome}</h2>
              <p className="text-gray-700 mb-4">{vaga.descricao}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                  <p>{vaga.tipo || 'Não informado'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Salário</h3>
                  <p>{vaga.salario ? `R$ ${vaga.salario}` : 'A combinar'}</p>
                </div>
              </div>
              
              {vaga.requisitos && vaga.requisitos.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Requisitos</h3>
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    {Array.isArray(vaga.requisitos) ? (
                      vaga.requisitos.map((requisito, index) => (
                        <li key={index} className="text-sm">
                          {requisito}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm">{vaga.requisitos}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-6">
            <button
              onClick={handleInscrever}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Processando...' : 'Confirmar Inscrição'}
            </button>
            
            <Link
              href={`/vagas`}
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}