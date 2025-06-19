'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Cursos() {
    const [cursos, setCursos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProfessor, setIsProfessor] = useState(false);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('http://localhost:8080/cursos', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setCursos(data);
            } catch (err) {
                console.error('Erro ao buscar cursos:', err);
                setError(err.message);
                setCursos([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCursos();

        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setIsProfessor(user.tipo === 'professor');
        }
    }, []);

    const filteredCursos = cursos.filter(curso =>
        curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (curso.professor?.nome && curso.professor.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Carregando cursos...</h1>
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
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cursos</h1>
                        <p className="text-gray-600">Estude conosco, cheque nossos cursos &#128071;</p>
                    </div>
                    
                    {/* Botão de cadastro visível apenas para professores */}
                    {isProfessor && (
                        <Link href="/cursos/cadastrar">
                            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                                Cadastrar Novo Curso
                            </button>
                        </Link>
                    )}
                </div>

                {/* Barra de pesquisa */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Pesquisar cursos por nome, descrição ou professor..."
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        <p className="font-bold">Erro ao carregar cursos</p>
                        <p>{error}</p>
                        {error.includes('Failed to fetch') && (
                            <p className="mt-2 text-sm">Verifique se o servidor backend está rodando em http://localhost:8080</p>
                        )}
                    </div>
                )}

                {/* Contador de resultados */}
                <p className="text-sm text-gray-500 mb-4">
                    {filteredCursos.length} {filteredCursos.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
                </p>

                {/* Lista de cursos */}
                {filteredCursos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCursos.map((curso) => (
                            <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">{curso.nome}</h2>
                                    
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="text-sm text-blue-600 font-medium">{curso.duracao || 'Duração não informada'}</p>
                                        {curso.planos && (
                                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                {curso.planos.nome || 'Plano não especificado'}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4">{curso.descricao}</p>
                                    
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Professor:</p>
                                        <p className="text-gray-700">{curso.professor?.nome || "Não especificado"}</p>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Conteúdo:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {curso.videos?.length > 0 ? (
                                                curso.videos.map((video, i) => (
                                                    <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                        {typeof video === 'string' ? video.replace('.mp4', '') : `Aula ${i + 1}`}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">Nenhum vídeo disponível</span>
                                            )}
                                        </div>
                                    </div>

                                    <Link href={`/inscrever/curso?id=${curso.id}`}>
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                                            Inscrever-se
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {cursos.length === 0 ? (
                            <p className="text-gray-500 text-lg">
                                Nenhum curso disponível no momento
                            </p>
                        ) : (
                            <>
                                <p className="text-gray-500 text-lg">
                                    Nenhum curso encontrado com o termo "{searchTerm}"
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