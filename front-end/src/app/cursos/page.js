'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ApiLink = process.env.NEXT_PUBLIC_API_URL;

export default function Cursos() {
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        fetch(`${ApiLink}/cursos`)
            .then(response => response.json())
            .then(data => {
                setCursos(data);
                console.log('Cursos:', data);
            })
            .catch(error => {
                console.error('Erro ao buscar cursos:', error);
            });
    }, []);
    return (
        <>
            <div className="divtotal">
                <h1>Tela Inicial</h1>
                <h2>Cursos disponíveis:</h2>
                <ul>
                    {cursos.map((cursos, index) => (
                        <>
                            <li key={index}>
                                <strong>{cursos.nome}</strong> - {cursos.duracao} - {cursos.descricao} - {cursos.planos}
                            </li>
                            <Link href={`/inscrever/${cursos.id}`}>
                                <button>Inscrever-se</button>
                            </Link>
                        </>
                    ))}
                </ul>
            </div>
        </>
    );
}