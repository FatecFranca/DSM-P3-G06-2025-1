'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ApiLink = process.env.NEXT_PUBLIC_API_URL;

export default function empresas() {
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        fetch(`${ApiLink}/empresas`)
            .then(response => response.json())
            .then(data => {
                setEmpresas(data);
                console.log('empresas:', data);
            })
            .catch(error => {
                console.error('Erro ao buscar empresas:', error);
            });
    }, []);
    return (
        <>
            <div className="divtotal">
                <h1>Tela Inicial</h1>
                <h2>empresas disponíveis:</h2>
                <ul>
                    {empresas.map((empresas, index) => (
                        <>
                            <li key={index}>
                                <strong>{empresas.nome}</strong> - {empresas.tipo} - {empresas.descricao}
                            </li>
                            <Link href={`empresas/contato/${empresas.id}`}>
                                <button>Contatar</button>
                            </Link>
                        </>
                    ))}
                </ul>
            </div>
        </>
    );
}