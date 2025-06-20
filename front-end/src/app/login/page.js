'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ApiLink = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('aluno');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event, userType) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());

      let endpoint = '';
      let identifierField = '';

      // Configura os endpoints e campos de identificação
      switch (userType) {
        case 'empresa':
          endpoint = 'empresa';
          identifierField = 'cnpj';
          break;
        case 'professor':
          endpoint = 'professor';
          identifierField = 'cpf';
          break;
        default: // aluno
          endpoint = 'aluno';
          identifierField = 'cpf';
      }

      const response = await fetch(`${ApiLink}/auth/login/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [identifierField]: data[identifierField],
          senha: data.senha
        }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.user) {
        throw new Error(responseData.message || 'Credenciais inválidas');
      }

      localStorage.setItem('user', JSON.stringify(responseData.user));
      router.push('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'aluno': return 'Aluno';
      case 'empresa': return 'Empresa';
      case 'professor': return 'Professor';
      default: return tab;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cabeçalho com abas */}
        <div className="flex border-b">
          {['aluno', 'empresa', 'professor'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Conteúdo do formulário */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Formulário de Aluno */}
          {activeTab === 'aluno' && (
            <form onSubmit={(e) => handleLogin(e, 'aluno')}>
              <div className="mb-4">
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          {/* Formulário de Empresa */}
          {activeTab === 'empresa' && (
            <form onSubmit={(e) => handleLogin(e, 'empresa')}>
              <div className="mb-4">
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          {/* Formulário de Professor */}
          {activeTab === 'professor' && (
            <form onSubmit={(e) => handleLogin(e, 'professor')}>
              <div className="mb-4">
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          {/* Links de cadastro */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link
                href={`/register/${activeTab}`}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Cadastre-se como {getTabLabel(activeTab)}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}