'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function PlanosPage() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${ApiLink}/planos`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPlanos(data);
      } catch (err) {
        console.error('Erro ao buscar planos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanos();
  }, []);

  const handlePlanoClick = (planoId) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/assinar/${planoId}`);
    } else {
      router.push(`/assinar/${planoId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando planos...</h1>
          <div className="flex justify-center gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-96 h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-100 rounded-lg max-w-md">
          <h1 className="text-xl font-bold mb-2">Erro ao carregar planos</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Nossos Planos
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Escolha o plano que melhor atende às suas necessidades
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          {planos.map((plano) => (
            <div 
              key={plano.id}
              className={`w-full md:w-1/2 lg:w-96 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                plano.tipo === 'Pago' ? 'border-4 border-blue-500' : 'border-2 border-gray-200'
              }`}
            >
              <div className={`p-8 ${
                plano.tipo === 'Pago' ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white' : 'bg-white'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{plano.nome}</h2>
                    <p className="text-sm uppercase font-semibold tracking-wider mt-1">
                      {plano.tipo}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className={`text-5xl font-extrabold ${
                    plano.tipo === 'Pago' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plano.preco === 0 ? 'Grátis' : `R$ ${plano.preco.toFixed(2)}`}
                  </p>
                  {plano.tipo === 'Pago' && (
                    <p className="text-blue-200 mt-1">por mês</p>
                  )}
                </div>

                <p className="mt-6 text-lg">
                  {plano.descricao}
                </p>

                <div className="mt-8">
                  <button 
                    onClick={() => handlePlanoClick(plano.id)}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg ${
                      plano.tipo === 'Pago' 
                        ? 'bg-white text-blue-600 hover:bg-gray-100' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plano.tipo === 'Pago' ? 'Assinar agora' : 'Começar grátis'}
                  </button>
                </div>
              </div>

              {plano.tipo === 'Pago' && (
                <div className="bg-blue-50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Inclui:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Acesso ilimitado a todos os cursos</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Certificados reconhecidos</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Suporte prioritário</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Precisa de ajuda para escolher? <Link href="/contato" className="text-blue-600 hover:text-blue-800 font-medium">Fale conosco</Link>
          </p>
        </div>
      </div>
    </div>
  );
}