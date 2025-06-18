'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function EmpresaInfoPage() {
  const params = useParams();
  const { id } = params;
  const [empresa, setEmpresa] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`${ApiLink}/empresas/${id}`).then(res => {
        if (!res.ok) throw new Error('Empresa não encontrada');
        return res.json();
      }),
      fetch(`${ApiLink}/vagas`).then(res => {
        if (!res.ok) throw new Error('Erro ao buscar vagas');
        return res.json();
      })
    ])
      .then(([empresaData, vagasData]) => {
        setEmpresa(empresaData);
        setVagas(vagasData.filter(v => v.empresa_id === id));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  if (!empresa) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full mb-8">
        <h1 className="text-3xl font-bold mb-2">{empresa.nome}</h1>
        <p className="text-sm text-gray-500 mb-4">{empresa.tipo}</p>
        <p className="mb-4 text-gray-700">{empresa.descricao}</p>
        {empresa.historia && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">História</h2>
            <p className="text-gray-700 text-sm">{empresa.historia}</p>
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Endereço</h2>
          <p className="text-gray-700 text-sm">
            {empresa.rua}, {empresa.numero}<br />
            {empresa.bairro}<br />
            {empresa.uf} - CEP: {empresa.cep}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Vagas da empresa</h2>
        {vagas.length === 0 ? (
          <p className="text-gray-500">Nenhuma vaga cadastrada para esta empresa.</p>
        ) : (
          <ul className="space-y-6">
            {vagas.map((vaga) => (
              <li key={vaga.id} className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800">{vaga.nome}</h3>
                <p className="text-sm text-gray-500 mb-1">Tipo: {vaga.tipo}</p>
                <p className="text-gray-700 mb-1">{vaga.descricao}</p>
                <p className="text-gray-600 text-sm mb-1">Requisitos: {vaga.requisitos}</p>
                <p className="text-gray-600 text-sm">Salário: R$ {vaga.salario?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-gray-600 text-sm">Quantidade de vagas: {vaga.qtd_vagas}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
