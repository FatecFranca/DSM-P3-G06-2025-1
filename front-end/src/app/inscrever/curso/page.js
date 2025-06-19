'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function CursoDetalhe() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [curso, setCurso] = useState(null);
  const [inscrito, setInscrito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aulaAtual, setAulaAtual] = useState(0);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verifica se o usuário está logado
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          router.push('/login');
          return;
        }

        // Busca os dados do curso e verifica inscrição em paralelo
        const [cursoRes, inscricaoRes] = await Promise.all([
          fetch(`${ApiLink}/cursos/${id}`),
          fetch(`${ApiLink}/inscricoes/verificar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              usuario_id: user.id || user._id,
              curso_id: id
            })
          })
        ]);

        if (!cursoRes.ok) throw new Error('Curso não encontrado');
        if (!inscricaoRes.ok) throw new Error('Erro ao verificar inscrição');

        const cursoData = await cursoRes.json();
        setCurso(cursoData);
        setInscrito(inscricaoRes.status === 200);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleInscrever = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${ApiLink}/inscricoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          usuario_id: user.id || user._id,
          curso_id: id
        })
      });

      if (!res.ok) throw new Error('Erro ao se inscrever no curso');
      
      setInscrito(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="mb-4">{error}</p>
          <Link href="/cursos" className="text-blue-600 hover:underline">
            Voltar para a lista de cursos
          </Link>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Curso não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabeçalho do curso */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{curso.nome}</h1>
          <p className="text-gray-600 mb-4">{curso.descricao}</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Duração: {curso.duracao || 'Não especificada'}
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {curso.videos?.length || 0} aulas
            </div>
          </div>

          {!inscrito ? (
            <button
              onClick={handleInscrever}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Inscrever-se no Curso
            </button>
          ) : (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Você está inscrito neste curso
            </div>
          )}
        </div>

        {/* Conteúdo do curso */}
        {inscrito && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player de vídeo */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-black">
                {curso.videos?.length > 0 ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extrairIdYoutube(curso.videos[aulaAtual])}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Nenhum vídeo disponível
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {curso.videos?.length > 0 ? `Aula ${aulaAtual + 1}: ${curso.videos[aulaAtual]}` : 'Nenhuma aula disponível'}
                </h2>
                
                <div className="flex space-x-4 mt-4">
                  {aulaAtual > 0 && (
                    <button
                      onClick={() => setAulaAtual(aulaAtual - 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Aula anterior
                    </button>
                  )}
                  
                  {aulaAtual < curso.videos?.length - 1 && (
                    <button
                      onClick={() => setAulaAtual(aulaAtual + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Próxima aula
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de aulas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Aulas do Curso</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {curso.videos?.length > 0 ? (
                  curso.videos.map((video, index) => (
                    <button
                      key={index}
                      onClick={() => setAulaAtual(index)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200 ${aulaAtual === index ? 'bg-blue-50 text-blue-600' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${aulaAtual === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                          {index + 1}
                        </div>
                        <span className="truncate">{video}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">Nenhuma aula cadastrada</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Função auxiliar para extrair ID do YouTube
function extrairIdYoutube(url) {
  if (!url) return '';
  
  if (!url.includes('/') && !url.includes('=') && !url.includes('.')) {
    return url;
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : url;
}