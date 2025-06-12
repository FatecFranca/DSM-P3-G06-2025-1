'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterEmpresa() {
  const [error, setError] = useState('');
  const [endereco, setEndereco] = useState({ rua: '', bairro: '', uf: '' });
  const router = useRouter();

  function handleCepBlur(e) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setEndereco({ rua: data.logradouro, bairro: data.bairro, uf: data.uf });
          }
        });
    }
  }

  function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    fetch(`${ApiLink}/auth/register/empresa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(empresa => {
        if (empresa && empresa.nome) {
          localStorage.setItem('user', JSON.stringify({ nome: empresa.nome, tipo: 'empresa', id: empresa.id }));
          router.push('/');
        } else {
          setError('Erro ao cadastrar empresa');
        }
      })
      .catch(() => setError('Erro ao cadastrar empresa'));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastro de Empresa</h2>
        <input name="nome" placeholder="Nome" required className="mb-2 w-full p-2 border rounded" />
        <input name="tipo" placeholder="Tipo" required className="mb-2 w-full p-2 border rounded" />
        <input name="cnpj" placeholder="CNPJ" required className="mb-2 w-full p-2 border rounded" />
        <input name="senha" type="password" placeholder="Senha" required className="mb-2 w-full p-2 border rounded" />
        <input name="descricao" placeholder="Descrição" required className="mb-2 w-full p-2 border rounded" />
        <input name="historia" placeholder="História" className="mb-2 w-full p-2 border rounded" />
        <input name="cep" placeholder="CEP" required className="mb-2 w-full p-2 border rounded" onBlur={handleCepBlur} />
        <input name="rua" placeholder="Rua" required className="mb-2 w-full p-2 border rounded" value={endereco.rua} onChange={e => setEndereco({ ...endereco, rua: e.target.value })} />
        <input name="bairro" placeholder="Bairro" required className="mb-2 w-full p-2 border rounded" value={endereco.bairro} onChange={e => setEndereco({ ...endereco, bairro: e.target.value })} />
        <input name="numero" placeholder="Número" required className="mb-2 w-full p-2 border rounded" />
        <input name="uf" placeholder="UF" required className="mb-2 w-full p-2 border rounded" value={endereco.uf} onChange={e => setEndereco({ ...endereco, uf: e.target.value })} />
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Cadastrar</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
