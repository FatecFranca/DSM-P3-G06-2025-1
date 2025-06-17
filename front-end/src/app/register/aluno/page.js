'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function RegisterAluno() {
  const [error, setError] = useState('');
  const [endereco, setEndereco] = useState({ rua: '', bairro: '', uf: '' });
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlanos, setLoadingPlanos] = useState(true);
  const router = useRouter();

  // Carrega os planos disponíveis com tratamento de erros
  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        setLoadingPlanos(true);
        const response = await fetch(`${ApiLink}/planos`);
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica se os dados são válidos
        if (!Array.isArray(data)) {
          throw new Error('Formato de dados inválido');
        }
        
        setPlanos(data);
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
        setError('Não foi possível carregar os planos. Tente novamente mais tarde.');
        setPlanos([]);
      } finally {
        setLoadingPlanos(false);
      }
    };
    
    fetchPlanos();
  }, []);

  // Busca endereço pelo CEP
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setEndereco({ 
            rua: data.logradouro || '', 
            bairro: data.bairro || '', 
            uf: data.uf || '' 
          });
        } else {
          setError('CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setError('Erro ao buscar endereço. Verifique o CEP e tente novamente.');
      }
    }
  };

  // Processa o registro do aluno
  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      
      // Validação básica
      if (!data.plano_id) {
        throw new Error('Selecione um plano');
      }
      
      const response = await fetch(`${ApiLink}/auth/register/aluno`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          rua: endereco.rua || data.rua,
          bairro: endereco.bairro || data.bairro,
          uf: endereco.uf || data.uf,
          complemento: data.complemento || ''
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar aluno');
      }
      
      const aluno = await response.json();
      
      if (aluno && aluno.nome) {
        localStorage.setItem('user', JSON.stringify({ 
          nome: aluno.nome, 
          tipo: 'aluno', 
          id: aluno.id 
        }));
        router.push('/');
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao cadastrar aluno. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastro de Aluno</h2>
        
        {/* Campos do formulário */}
        <input name="nome" placeholder="Nome" required className="mb-2 w-full p-2 border rounded" />
        <input name="cpf" placeholder="CPF" required className="mb-2 w-full p-2 border rounded" />
        <input name="senha" type="password" placeholder="Senha" required className="mb-2 w-full p-2 border rounded" />
        <input name="telefone" placeholder="Telefone" required className="mb-2 w-full p-2 border rounded" />
        
        {/* Campos de endereço */}
        <input name="cep" placeholder="CEP" required className="mb-2 w-full p-2 border rounded" onBlur={handleCepBlur} />
        <input name="rua" placeholder="Rua" required className="mb-2 w-full p-2 border rounded" 
               value={endereco.rua} onChange={e => setEndereco({ ...endereco, rua: e.target.value })} />
        <input name="bairro" placeholder="Bairro" required className="mb-2 w-full p-2 border rounded" 
               value={endereco.bairro} onChange={e => setEndereco({ ...endereco, bairro: e.target.value })} />
        <input name="numero" placeholder="Número" required className="mb-2 w-full p-2 border rounded" />
        <input name="complemento" placeholder="Complemento" className="mb-2 w-full p-2 border rounded" />
        <input name="uf" placeholder="UF" required className="mb-2 w-full p-2 border rounded" 
               value={endereco.uf} onChange={e => setEndereco({ ...endereco, uf: e.target.value })} />
        
        {/* Seletor de planos */}
        <select 
          name="plano_id" 
          required 
          className="mb-2 w-full p-2 border rounded"
          disabled={loadingPlanos}
        >
          <option value="">{loadingPlanos ? 'Carregando planos...' : 'Selecione um plano'}</option>
          {planos.map(plano => (
            <option key={plano.id} value={plano.id}>
              {plano.nome}
            </option>
          ))}
        </select>
        
        {/* Botão de submit */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        
        {/* Mensagens de erro */}
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </form>
    </div>
  );
}