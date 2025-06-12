'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterAluno() {
  const [error, setError] = useState('');
  const [endereco, setEndereco] = useState({ rua: '', bairro: '', uf: '' });
  const [planos, setPlanos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${ApiLink}/planos`)
      .then(res => res.json())
      .then(data => setPlanos(data))
      .catch(() => setPlanos([]));
  }, []);

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
    fetch(`${ApiLink}/auth/register/aluno`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(aluno => {
        if (aluno && aluno.nome) {
          localStorage.setItem('user', JSON.stringify({ nome: aluno.nome, tipo: 'aluno', id: aluno.id }));
          router.push('/');
        } else {
          setError('Erro ao cadastrar aluno');
        }
      })
      .catch(() => setError('Erro ao cadastrar aluno'));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastro de Aluno</h2>
        <input name="nome" placeholder="Nome" required className="mb-2 w-full p-2 border rounded" />
        <input name="cpf" placeholder="CPF" required className="mb-2 w-full p-2 border rounded" />
        <input name="senha" type="password" placeholder="Senha" required className="mb-2 w-full p-2 border rounded" />
        <input name="telefone" placeholder="Telefone" required className="mb-2 w-full p-2 border rounded" />
        <input name="cep" placeholder="CEP" required className="mb-2 w-full p-2 border rounded" onBlur={handleCepBlur} />
        <input name="rua" placeholder="Rua" required className="mb-2 w-full p-2 border rounded" value={endereco.rua} onChange={e => setEndereco({ ...endereco, rua: e.target.value })} />
        <input name="bairro" placeholder="Bairro" required className="mb-2 w-full p-2 border rounded" value={endereco.bairro} onChange={e => setEndereco({ ...endereco, bairro: e.target.value })} />
        <input name="numero" placeholder="Número" required className="mb-2 w-full p-2 border rounded" />
        <input name="uf" placeholder="UF" required className="mb-2 w-full p-2 border rounded" value={endereco.uf} onChange={e => setEndereco({ ...endereco, uf: e.target.value })} />
        <select name="plano_id" required className="mb-2 w-full p-2 border rounded">
          <option value="">Selecione um plano</option>
          {planos.map(plano => (
            <option key={plano.id} value={plano.id}>{plano.nome}</option>
          ))}
        </select>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Cadastrar</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
