'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  // Buscar planos disponíveis
  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const response = await fetch('http://localhost:8080/planos');
        const data = await response.json();
        setPlanos(data);
      } catch (err) {
        console.error('Erro ao buscar planos:', err);
      }
    };
    fetchPlanos();
  }, []);

  // Obter ID do professor logado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      setFormData((prev) => ({ ...prev, professor_id: user._id }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVideo = () => {
    if (novoVideo.trim()) {
      setFormData((prev) => ({
        ...prev,
        videos: [...prev.videos, novoVideo.trim() + '.mp4'],
      }));
      setNovoVideo('');
    }
  };

  const handleRemoveVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.plano_id) {
        throw new Error('Selecione um plano');
      }

      const response = await fetch('http://localhost:8080/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar curso');
      }

      setSuccess(true);
      setTimeout(() => router.push('/cursos'), 2000);
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Erro ao cadastrar curso');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <p>Curso cadastrado com sucesso.</p>
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plano *
            </label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vídeos (Aulas)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={novoVideo}
                onChange={(e) => setNovoVideo(e.target.value)}
                placeholder="Nome do vídeo (ex: aula-01)"
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
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
