'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Vagas() {
    const [vagas, setVagas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVagas = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Busca as vagas incluindo os dados da empresa relacionada
                const response = await fetch('http://localhost:8080/vagas?include=empresas', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                setVagas(data);
            } catch (err) {
                console.error('Erro ao buscar vagas:', err);
                setError(err.message);
                setVagas([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVagas();
    }, []);

    const filteredVagas = vagas.filter(vaga =>
        vaga.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vaga.descricao && vaga.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vaga.requisitos && vaga.requisitos.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vaga.empresas?.nome && vaga.empresas.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Carregando vagas...</h1>
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-md h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Mercado de Trabalho</h1>
                <p className="text-gray-600 mb-6">Encontre aqui a sua oportunidade para dar o START numa carreira &#129520; </p>
                
                {/* Barra de pesquisa */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Pesquisar vagas por nome, descrição, requisitos ou empresa..."
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        <p className="font-bold">Erro ao carregar vagas</p>
                        <p>{error}</p>
                        {error.includes('Failed to fetch') && (
                            <p className="mt-2 text-sm">Verifique se o servidor backend está rodando em http://localhost:8080</p>
                        )}
                    </div>
                )}

                {/* Contador de resultados */}
                <p className="text-sm text-gray-500 mb-4">
                    {filteredVagas.length} {filteredVagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
                </p>

                {/* Lista de vagas */}
                {filteredVagas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVagas.map((vaga) => (
                            <div key={vaga.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-gray-800">{vaga.nome}</h2>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            vaga.tipo === 'Estágio' ? 'bg-green-100 text-green-800' :
                                            vaga.tipo === 'CLT' ? 'bg-blue-100 text-blue-800' :
                                            vaga.tipo === 'PJ' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {vaga.tipo || 'Tipo não especificado'}
                                        </span>
                                    </div>
                                    
                                    {/* Informações da empresa */}
                                    {vaga.empresas && (
                                        <div className="flex items-center mb-3">
                                            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                                                <span className="text-xs font-medium text-gray-600">
                                                    {vaga.empresas.nome.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 font-medium">{vaga.empresas.nome}</p>
                                        </div>
                                    )}
                                    
                                    {/* Salário e quantidade de vagas */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-700">
                                            {vaga.salario ? `R$ ${vaga.salario.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Salário a combinar'}
                                        </span>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                            {vaga.qtd_vagas} {vaga.qtd_vagas === 1 ? 'vaga' : 'vagas'}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Descrição:</p>
                                        <p className="text-gray-700">{vaga.descricao || 'Descrição não disponível'}</p>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Requisitos:</p>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {vaga.requisitos ? (
                                                vaga.requisitos.split('\n').map((req, i) => (
                                                    <li key={i}>{req}</li>
                                                ))
                                            ) : (
                                                <li>Não especificado</li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <Link href={`/empresas/${vaga.empresa_id}`}>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                Ver empresa
                                            </button>
                                        </Link>
                                        <Link href={`/inscrever/${vaga.id}`}>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                                                Candidatar-se
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {vagas.length === 0 ? (
                            <p className="text-gray-500 text-lg">
                                Nenhuma vaga disponível no momento
                            </p>
                        ) : (
                            <>
                                <p className="text-gray-500 text-lg">
                                    Nenhuma vaga encontrada com o termo "{searchTerm}"
                                </p>
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Limpar busca
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}