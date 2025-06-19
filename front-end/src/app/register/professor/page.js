'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function RegisterProfessor() {
  const [error, setError] = useState('');
  const [endereco, setEndereco] = useState({ rua: '', bairro: '', uf: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleCepBlur(e) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setEndereco({ 
              rua: data.logradouro, 
              bairro: data.bairro, 
              uf: data.uf 
            });
          }
        });
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch(`${ApiLink}/professores`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });

      // Verifica se a resposta é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text.includes('<!DOCTYPE html>') 
          ? 'Erro no servidor. Por favor, tente novamente mais tarde.' 
          : text || 'Resposta inválida do servidor');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao cadastrar professor');
      }

      if (result && result.nome) {
        localStorage.setItem('user', JSON.stringify({ 
          nome: result.nome, 
          tipo: 'professor', 
          id: result.id 
        }));
        router.push('/');
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      
      // Tratamento específico para erros comuns
      if (err.message.includes('CPF já cadastrado')) {
        setError('Este CPF já está cadastrado');
      } else if (err.message.includes('<!DOCTYPE html>')) {
        setError('Erro no servidor. Por favor, tente novamente mais tarde.');
      } else {
        setError(err.message || 'Erro ao cadastrar professor');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastro de Professor</h2>
        
        <input name="nome" placeholder="Nome" required className="mb-2 w-full p-2 border rounded" />
        <input name="cpf" placeholder="CPF" required className="mb-2 w-full p-2 border rounded" />
        <input name="senha" type="password" placeholder="Senha" required className="mb-2 w-full p-2 border rounded" />
        <input name="telefone" placeholder="Telefone" required className="mb-2 w-full p-2 border rounded" />
        <input name="cep" placeholder="CEP" required className="mb-2 w-full p-2 border rounded" onBlur={handleCepBlur} />
        <input name="rua" placeholder="Rua" required className="mb-2 w-full p-2 border rounded" value={endereco.rua} onChange={e => setEndereco({ ...endereco, rua: e.target.value })} />
        <input name="bairro" placeholder="Bairro" required className="mb-2 w-full p-2 border rounded" value={endereco.bairro} onChange={e => setEndereco({ ...endereco, bairro: e.target.value })} />
        <input name="numero" placeholder="Número" required className="mb-2 w-full p-2 border rounded" />
        <input name="uf" placeholder="UF" required className="mb-2 w-full p-2 border rounded" value={endereco.uf} onChange={e => setEndereco({ ...endereco, uf: e.target.value })} />
        <input name="complemento" placeholder="Complemento" className="mb-2 w-full p-2 border rounded" />
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        
        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}