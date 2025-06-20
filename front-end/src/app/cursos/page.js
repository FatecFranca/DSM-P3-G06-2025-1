'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Cursos() {
    const router = useRouter();

    const [cursos, setCursos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isProfessor, setIsProfessor] = useState(false);
    const [userPlanId, setUserPlanId] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    // IDs dos planos (constantes conforme seu backend)
    const PREMIUM_PLAN_ID = '683f8f84d0a514c823a87f60';
    const FREE_PLAN_ID = '683f8f6cd0a514c823a87f5f';

    // Base URL da API; ajuste via variável de ambiente se preferir
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    useEffect(() => {
        // Busca a lista de cursos
        const fetchCursos = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE}/cursos`, {
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

        // Checa se usuário está logado e seu plano no localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setIsLogged(true);
                setIsProfessor(user.tipo === 'professor');
                if (user.plano_id) {
                    setUserPlanId(user.plano_id);
                } else {
                    setUserPlanId(null);
                }
            } catch {
                setIsLogged(false);
                setIsProfessor(false);
                setUserPlanId(null);
            }
        } else {
            setIsLogged(false);
            setIsProfessor(false);
            setUserPlanId(null);
        }
    }, []);

    // Filtra cursos pelo termo de busca
    const filteredCursos = cursos.filter(curso => {
        const termo = searchTerm.toLowerCase();
        const nome = curso.nome?.toLowerCase() || '';
        const desc = curso.descricao?.toLowerCase() || '';
        const profNome = curso.professor?.nome?.toLowerCase() || '';
        return nome.includes(termo) || desc.includes(termo) || profNome.includes(termo);
    });

    // Handler de clique em "Inscrever-se" ou atualização de plano
    const handleEnrollClick = async (curso) => {
        // Se não estiver logado, redireciona para login com redirect para inscrição
        if (!isLogged) {
            const redirectTo = encodeURIComponent(`/inscrever/curso?id=${curso.id}`);
            router.push(`/login?redirect=${redirectTo}`);
            return;
        }

        // Verifica plano
        const userIsPremium = userPlanId === PREMIUM_PLAN_ID;
        const cursoRequiresPremium = curso.plano_id === PREMIUM_PLAN_ID;
        const cursoIsFree = curso.plano_id === FREE_PLAN_ID || !curso.plano_id;

        // Se usuário é premium ou curso é gratuito, segue para inscrição
        if (userIsPremium || cursoIsFree) {
            router.push(`/inscrever/curso?id=${curso.id}`);
            return;
        }

        // Aqui: usuário logado, free, e curso exige premium
        // Pergunta antes de atualizar
        const deseja = window.confirm(
            'Este curso exige Plano Premium. Deseja atualizar seu plano para Premium agora?'
        );
        if (!deseja) {
            // Usuário cancelou: não faz nada
            return;
        }

        // Usuário confirmou: faz PUT para atualizar plano
        try {
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (!userData) {
                // Caso inesperado: usuário não encontrado no localStorage
                setIsLogged(false);
                setUserPlanId(null);
                router.push('/login');
                return;
            }
            const user = JSON.parse(userData);

            // Requisição PUT para atualizar plano do aluno
            const response = await fetch(`${API_BASE}/alunos/${user.id}/plano`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ plano_id: PREMIUM_PLAN_ID })
            });

            if (!response.ok) {
                let msg = 'Erro ao atualizar plano';
                try {
                    const errJson = await response.json();
                    if (errJson?.message) msg = errJson.message;
                } catch {}
                throw new Error(msg);
            }

            // Sucesso: atualiza localStorage e estado
            const updatedUser = { ...JSON.parse(userData), plano_id: PREMIUM_PLAN_ID };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserPlanId(PREMIUM_PLAN_ID);

            // Mensagem de sucesso
            alert('Plano atualizado com sucesso! Agora você pode acessar este e outros cursos premium.');

            // Redireciona para página de inscrição do curso
            router.push(`/inscrever/curso?id=${curso.id}`);
        } catch (err) {
            console.error('Falha ao atualizar plano:', err);
            alert(`Falha ao atualizar plano: ${err.message || 'Tente novamente mais tarde.'}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Carregando cursos...</h1>
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-md h-32 dark:bg-gray-700"></div>
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
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Cursos</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Estude conosco, confira nossos cursos &#128071;
                        </p>
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
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded dark:bg-red-200">
                        <p className="font-bold">Erro ao carregar cursos</p>
                        <p>{error}</p>
                        {error.includes('Failed to fetch') && (
                            <p className="mt-2 text-sm">
                                Verifique se o servidor backend está rodando em {API_BASE}
                            </p>
                        )}
                    </div>
                )}

                {/* Contador de resultados */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {filteredCursos.length} {filteredCursos.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
                </p>

                {/* Lista de cursos */}
                {filteredCursos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCursos.map((curso) => {
                            const userIsPremium = userPlanId === PREMIUM_PLAN_ID;
                            const cursoIsFree = curso.plano_id === FREE_PLAN_ID || !curso.plano_id;
                            const allowAccess = isLogged
                                ? (userIsPremium || cursoIsFree)
                                : false;

                            // Determina texto e classes do botão
                            let buttonText;
                            if (!isLogged) {
                                buttonText = 'Faça login para inscrever';
                            } else if (allowAccess) {
                                buttonText = 'Inscrever-se';
                            } else {
                                buttonText = 'Plano insuficiente';
                            }

                            let buttonClasses = 'w-full font-medium py-2 px-4 rounded-lg transition-colors duration-300 ';
                            if (!isLogged || allowAccess) {
                                buttonClasses += 'bg-blue-600 hover:bg-blue-700 text-white';
                            } else {
                                buttonClasses += 'bg-gray-400 cursor-not-allowed text-white';
                            }

                            return (
                                <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {curso.nome}
                                        </h2>
                                        
                                        <div className="flex justify-between items-start mb-3">
                                            <p className="text-sm text-blue-600 font-medium dark:text-blue-400">
                                                {curso.duracao || 'Duração não informada'}
                                            </p>
                                            {curso.planos?.nome && (
                                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-200">
                                                    {curso.planos.nome}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-gray-600 dark:text-gray-800 mb-4">{curso.descricao}</p>

                                        <button
                                            onClick={() => handleEnrollClick(curso)}
                                            className={buttonClasses}
                                            type="button"
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {cursos.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Nenhum curso disponível no momento
                            </p>
                        ) : (
                            <>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    Nenhum curso encontrado com o termo "{searchTerm}"
                                </p>
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
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
