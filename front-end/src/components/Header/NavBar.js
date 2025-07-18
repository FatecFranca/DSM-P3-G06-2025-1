'use client'; // se você usar Next 13+ com App Router

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const pathname = usePathname(); // Hook para obter o path atual

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // Função auxiliar que retorna classes conforme se for ativo ou não
    const linkClass = (href) => {
        // Se desejar combinação exata:
        const isActive = pathname === href;
        // Se quiser ativar também para subrotas, podia usar startsWith:
        // const isActive = pathname.startsWith(href);
        if (isActive) {
            // classes para link ativo
            return "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500 md:p-0";
        } else {
            // classes para link inativo
            return "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700";
        }
    };

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    {/* <Image src="LOGO STUDY+" alt="Logo" width={32} height={32} /> */}
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Study+</span>
                </Link>

                {/* User menu e mobile toggle */}
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {/* Avatar e Dropdown */}
                    <div className="relative">
                        {user ? (
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                id="user-menu-button"
                            >
                                <div className="relative inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                                    <span className="text-sm font-medium text-white">
                                        {user.nome.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="hidden md:inline-flex text-gray-800 dark:text-white font-medium">
                                    {user.nome.split(' ')[0]} {/* Mostra apenas o primeiro nome */}
                                </span>
                            </button>
                        ) : (
                            <Link 
                                href="/login" 
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-colors"
                            >
                                Login
                            </Link>
                        )}

                        {dropdownOpen && user && (
                            <div className="absolute right-0 mt-2 w-48 z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white font-medium">{user.nome}</span>
                                    <span className="block text-xs text-gray-500 truncate dark:text-gray-400 capitalize">{user.tipo}</span>
                                </div>
                                <ul className="py-2" aria-labelledby="user-menu-button">
                                    <li>
                                        <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            Conta
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            Sair
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Menu toggle mobile */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>

                {/* Menu principal */}
                <div className={`${menuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link href="/" className={linkClass('/') } aria-current={pathname === '/' ? 'page' : undefined}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/vagas" className={linkClass('/vagas')}>
                                Vagas
                            </Link>
                        </li>
                        <li>
                            <Link href="/cursos" className={linkClass('/cursos')}>
                                Cursos
                            </Link>
                        </li>
                        <li>
                            <Link href="/empresas" className={linkClass('/empresas')}>
                                Empresas
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;