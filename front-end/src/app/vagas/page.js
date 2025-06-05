'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ApiLink = process.env.NEXT_PUBLIC_API_URL;

export default function vagas() {
    const [vagas, setVagas] = useState([]);

    useEffect(() => {
        fetch(`${ApiLink}/vagas`)
            .then(response => response.json())
            .then(data => {
                setVagas(data);
                console.log('vagas:', data);
            })
            .catch(error => {
                console.error('Erro ao buscar vagas:', error);
            });
    }, []);
    return (
        <>
            <div className="divtotal">
                <h1>Tela Inicial</h1>
                <h2>Vagas disponíveis:</h2>
                <ul>
                    {vagas.map((vagas, index) => (
                        <>
                            <li key={index}>
                                <strong>{vagas.nome}</strong> - {vagas.tipo} - {vagas.requisitos} - {vagas.descricao} - {vagas.qtd_vagas}
                            </li>
                            <Link href={`/inscrever/${vagas.id}`}>
                                <button>Inscrever-se</button>
                            </Link>
                        </>
                    ))}
                </ul>
            </div>
        </>
    );
}