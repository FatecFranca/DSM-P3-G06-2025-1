'use client';
import { useState } from 'react';
import Link from 'next/link';
import dotenv from 'dotenv';

dotenv.config();
const ApiLink = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
    function handleLoginAluno(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        fetch(`${ApiLink}/auth/login/aluno`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirecionar ou mostrar mensagem de sucesso
                console.log('Login successful:', data);
            } else {
                // Mostrar mensagem de erro
                console.error('Login failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    function handleLoginEmpresa(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        fetch(`${ApiLink}/auth/login/empresa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirecionar ou mostrar mensagem de sucesso
                console.log('Login successful:', data);
            } else {
                // Mostrar mensagem de erro
                console.error('Login failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleLoginAluno}>
                    <div className="mb-4">
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">cpf</label>
                        <input
                            type="cpf"
                            id="cpf"
                            name="cpf"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>
                <form onSubmit={handleLoginEmpresa}>
                    <div className="mb-4">
                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">cnpj</label>
                        <input
                            type="cnpj"
                            id="cnpj"
                            name="cnpj"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem uma conta? <Link href="/register" className="text-blue-600 hover:underline">Cadastrar</Link>
                </p>
            </div>
        </div>
    );

}