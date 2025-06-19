'use client';
import { useState } from 'react';

export default function SuportePage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Obrigado pelo contato, ${nome}! Responderemos em breve.`);
    setNome('');
    setEmail('');
    setMensagem('');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Suporte ao Cliente</h1>
      
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Formulário de Contato</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Mensagem:</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows="4"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Enviar
          </button>
        </form>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Contatos</h2>
        <p><strong>E-mail:</strong> suporte@study+.com</p>
        <p className="mt-2"><strong>Telefone:</strong> (16) 997391181</p>
        <p className="mt-2"><strong>Atendimento:</strong> Segunda a Sexta, 9h às 19h</p>
      </div>
    </div>
  );
}