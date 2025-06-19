'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function CadastrarCurso() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    duracao: '',
    plano_id: '',
    professor_id: '',
    videos: [],
  });
  const [planos, setPlanos] = useState([]);
  const [novoVideo, setNovoVideo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);
  const [loadingPlanos, setLoadingPlanos] = useState(true);

  useEffect(() => {
    const checkUserAndFetchPlanos = async () => {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        router.replace('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        const professor = user.tipo === 'professor';
        setIsProfessor(professor);

        if (!professor) {
          setUserChecked(true);
          return;
        }

        setLoadingPlanos(true);
        const response = await fetch(`${ApiLink}/planos`);
        if (!response.ok) throw new Error('Falha ao buscar planos');
        
        const data = await response.json();
        setPlanos(data);
        setFormData(prev => ({ ...prev, professor_id: user.id || user._id }));
      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setUserChecked(true);
        setLoadingPlanos(false);
      }
    };

    checkUserAndFetchPlanos();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVideo = () => {
    if (!novoVideo.trim()) {
      setError('Digite um nome para o vídeo');
      return;
    }

    const videoFormatado = novoVideo.trim().endsWith('.mp4') 
      ? novoVideo.trim() 
      : `${novoVideo.trim()}.mp4`;

    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, videoFormatado],
    }));
    setNovoVideo('');
    setError(null);
  };

  const handleRemoveVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validações básicas
      if (!formData.nome.trim() || !formData.descricao.trim()) {
        throw new Error('Nome e descrição são obrigatórios');
      }

      if (!formData.plano_id) {
        throw new Error('Selecione um plano para o curso');
      }

      if (formData.videos.length === 0) {
        throw new Error('Adicione pelo menos um vídeo/aula');
      }

      const response = await fetch(`${ApiLink}/cursos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          duracao: formData.duracao || 'Não especificado'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar curso');
      }

      setSuccess(true);
      setTimeout(() => router.push('/cursos'), 2000);
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aguarda verificação do usuário
  if (!userChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isProfessor) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Apenas professores podem cadastrar novos cursos.</p>
          <Link href="/cursos">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
              Voltar para a lista de cursos
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cadastrar Novo Curso</h1>
          <button
            onClick={() => router.push('/cursos')}
            className="text-gray-600 hover:text-gray-800"
          >
            Voltar
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-bold">Erro:</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p className="font-bold">Sucesso!</p>
            <p>Curso cadastrado com sucesso. Redirecionando...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Curso *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Introdução ao React"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração
              </label>
              <input
                type="text"
                name="duracao"
                value={formData.duracao}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 40 horas"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o conteúdo do curso..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plano *
            </label>
            {loadingPlanos ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            ) : (
              <select
                name="plano_id"
                value={formData.plano_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um plano</option>
                {planos.map((plano) => (
                  <option key={plano._id || plano.id} value={plano._id || plano.id}>
                    {plano.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vídeos (Aulas) *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={novoVideo}
                onChange={(e) => setNovoVideo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVideo())}
                placeholder="Link dos vídeos das aulas"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Adicionar
              </button>
            </div>

            {formData.videos.length > 0 ? (
              <ul className="space-y-2">
                {formData.videos.map((video, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                  >
                    <span>{video}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum vídeo adicionado</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </span>
              ) : 'Cadastrar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}