'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function CadastrarVaga() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.tipo === 'empresa') {
          setEmpresa(parsed);
        } else {
          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.empresa_id = empresa.id;
    data.qtd_vagas = parseInt(data.qtd_vagas);
    data.salario = parseFloat(data.salario);
    try {
      const res = await fetch(`${ApiLink}/vagas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao cadastrar vaga');
      }
      setSuccess('Vaga cadastrada com sucesso!');
      e.target.reset();
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar vaga');
    } finally {
      setLoading(false);
    }
  };

  if (!empresa) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastrar Vaga</h2>
        <input name="nome" placeholder="Nome da vaga" required className="mb-2 w-full p-2 border rounded" />
        <select name="tipo" required className="mb-2 w-full p-2 border rounded">
          <option value="">Tipo de vaga</option>
          <option value="Estágio">Estágio</option>
          <option value="CLT">CLT</option>
          <option value="PJ">PJ</option>
        </select>
        <input name="requisitos" placeholder="Requisitos" required className="mb-2 w-full p-2 border rounded" />
        <textarea name="descricao" placeholder="Descrição" required className="mb-2 w-full p-2 border rounded" />
        <input name="qtd_vagas" type="number" min="1" placeholder="Quantidade de vagas" required className="mb-2 w-full p-2 border rounded" />
        <input name="salario" type="number" step="0.01" min="0" placeholder="Salário" required className="mb-4 w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400">
          {loading ? 'Cadastrando...' : 'Cadastrar Vaga'}
        </button>
        {success && <p className="text-green-600 mt-2">{success}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}