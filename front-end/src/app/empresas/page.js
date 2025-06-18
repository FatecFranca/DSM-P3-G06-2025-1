'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function EmpresasPage() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${ApiLink}/empresas`);
                
                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                setEmpresas(data);
            } catch (err) {
                console.error('Erro ao buscar empresas:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpresas();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Carregando empresas...</h1>
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-full max-w-2xl h-32 bg-gray-200 rounded-lg"></div>
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
                    <h1 className="text-xl font-bold mb-2">Erro ao carregar empresas</h1>
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
                        Empresas Parceiras
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Conheça as empresas que fazem parte da nossa rede
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {empresas.map((empresa) => (
                        <div key={empresa.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mr-3">
                                        <span className="text-lg font-medium text-gray-600">
                                            {empresa.nome.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{empresa.nome}</h2>
                                        <span className="text-sm text-gray-500">{empresa.tipo}</span>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4">
                                    {empresa.descricao}
                                </p>

                                {empresa.historia && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-1">História:</p>
                                        <p className="text-gray-700 text-sm">{empresa.historia}</p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Endereço:</p>
                                    <p className="text-gray-700 text-sm">
                                        {empresa.rua}, {empresa.numero}<br />
                                        {empresa.bairro}<br />
                                        {empresa.uf} - CEP: {empresa.cep}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <Link href={`/empresas/${empresa.id}`}>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                                            Contatar
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {empresas.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            Nenhuma empresa cadastrada no momento
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}