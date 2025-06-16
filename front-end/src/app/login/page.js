'use client';
import { useState } from 'react';
import Link from 'next/link';

const ApiLink = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState('aluno');
    const [error, setError] = useState(null);

    const handleSubmit = async (event, type) => {
        event.preventDefault();
        setError(null);
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${ApiLink}/auth/login/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success && result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/';
            } else {
                setError(result.message || 'Credenciais inválidas');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Erro ao conectar com o servidor');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
                {/* Abas de seleção */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-4 text-center font-medium transition-colors ${
                            activeTab === 'aluno'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('aluno')}
                    >
                        Aluno
                    </button>
                    <button
                        className={`flex-1 py-4 text-center font-medium transition-colors ${
                            activeTab === 'empresa'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('empresa')}
                    >
                        Empresa
                    </button>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                    
                    {/* Mensagem de erro */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Formulário de Aluno */}
                    {activeTab === 'aluno' && (
                        <form onSubmit={(e) => handleSubmit(e, 'aluno')}>
                            <div className="mb-4">
                                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    placeholder="000.000.000-00"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Entrar
                            </button>
                        </form>
                    )}

                    {/* Formulário de Empresa */}
                    {activeTab === 'empresa' && (
                        <form onSubmit={(e) => handleSubmit(e, 'empresa')}>
                            <div className="mb-4">
                                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                                    CNPJ
                                </label>
                                <input
                                    type="text"
                                    id="cnpj"
                                    name="cnpj"
                                    placeholder="00.000.000/0000-00"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Entrar
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Não tem uma conta?{' '}
                        <Link 
                            href={activeTab === 'aluno' ? "/register/aluno" : "/register/empresa"} 
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Cadastre-se como {activeTab === 'aluno' ? 'Aluno' : 'Empresa'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}