"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ApiLink = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    fetch(`${ApiLink}/planos`)
      .then(response => response.json())
      .then(data => {
        setPlanos(data);
        console.log('Planos:', data);
      })
      .catch(error => {
        console.error('Erro ao buscar planos:', error);
      });
  }, []);

  return (
    <>
      <div className="divtotal">
        <h1>Tela Inicial</h1>
        <h2>Planos disponíveis:</h2>
        <ul>
          {planos.map((plano, index) => (
            <>
              <li key={index}>
                <strong>{plano.nome}</strong> - {plano.preco} - {plano.descricao}
              </li>
              <Link href={`/assinar/${plano.id}`}>
                <button>Assinar</button>
              </Link>
            </>
          ))}
        </ul>
      </div>
    </>
  );
}
