'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function RegisterEmpresa() {
  const [error, setError] = useState('');
  const [endereco, setEndereco] = useState({ rua: '', bairro: '', uf: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());

      // Validação dos campos obrigatórios
      const requiredFields = ['cnpj', 'nome', 'senha', 'tipo', 'descricao', 'cep', 'numero'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Preencha todos os campos obrigatórios: ${missingFields.join(', ')}`);
      }

      // Preparar os dados para enviar
      const empresaData = {
        nome: data.nome,
        tipo: data.tipo,
        cnpj: data.cnpj.replace(/\D/g, ''),
        senha: data.senha,
        descricao: data.descricao,
        historia: data.historia || null,
        cep: data.cep.replace(/\D/g, ''),
        rua: endereco.rua || data.rua,
        bairro: endereco.bairro || data.bairro,
        numero: data.numero,
        uf: endereco.uf || data.uf
      };

      const response = await fetch(`${ApiLink}/empresas`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empresaData),
      });

      if (!response.ok) {
        // Tenta ler como JSON, se falhar lê como texto
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao cadastrar empresa');
        } catch {
          const errorText = await response.text();
          throw new Error(errorText || 'Erro ao cadastrar empresa');
        }
      }

      // Tenta parsear como JSON, mas não falha se não for possível
      let result;
      try {
        result = await response.json();
      } catch {
        result = { nome: data.nome, cnpj: data.cnpj };
      }

      // Armazena os dados básicos no localStorage e redireciona
      localStorage.setItem('user', JSON.stringify({ 
        nome: result.nome || data.nome, 
        tipo: 'empresa', 
        id: result.id || data.cnpj // Usa CNPJ como fallback para ID
      }));
      
      router.push('/');

    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao processar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastro de Empresa</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Dados da Empresa</label>
          <input name="nome" placeholder="Nome da Empresa*" required 
                 className="mb-2 w-full p-2 border rounded" />
          <input name="cnpj" placeholder="CNPJ* (somente números)" required 
                 className="mb-2 w-full p-2 border rounded" />
          <input name="tipo" placeholder="Tipo de empresa* (ex: Tecnologia)" required 
                 className="mb-2 w-full p-2 border rounded" />
          <input name="senha" type="password" placeholder="Senha*" required 
                 className="mb-2 w-full p-2 border rounded" />
          <textarea name="descricao" placeholder="Descrição da empresa*" required 
                    className="mb-2 w-full p-2 border rounded" rows="3"></textarea>
          <textarea name="historia" placeholder="História da empresa (opcional)" 
                    className="mb-2 w-full p-2 border rounded" rows="2"></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Endereço</label>
          <input name="cep" placeholder="CEP* (somente números)" required 
                 className="mb-2 w-full p-2 border rounded" onBlur={handleCepBlur} />
          <input name="rua" placeholder="Rua*" required 
                 className="mb-2 w-full p-2 border rounded" value={endereco.rua} 
                 onChange={e => setEndereco({ ...endereco, rua: e.target.value })} />
          <input name="bairro" placeholder="Bairro*" required 
                 className="mb-2 w-full p-2 border rounded" value={endereco.bairro} 
                 onChange={e => setEndereco({ ...endereco, bairro: e.target.value })} />
          <input name="numero" placeholder="Número*" required 
                 className="mb-2 w-full p-2 border rounded" />
          <input name="uf" placeholder="UF*" required 
                 className="mb-2 w-full p-2 border rounded" value={endereco.uf} 
                 onChange={e => setEndereco({ ...endereco, uf: e.target.value })} />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
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