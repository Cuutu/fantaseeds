'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black shadow-lg' : 'bg-black/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://i.imgur.com/RHbv7QS.png"
              alt="FANTASEEDS"
              width={120}
              height={40}
              className="w-auto h-8"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#about" 
              className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider">
              Nosotros
            </Link>
            <Link href="/#reprocann"
              className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider">
              Reprocann
            </Link>
            <Link href="/geneticas"
              className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider">
              Genéticas
            </Link>
            
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider flex items-center"
                >
                  <span>Mi Cuenta</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <Link href="/perfil"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-gray-900"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Perfil
                      </Link>
                      
                      {session.user.role === 'admin' && (
                        <Link href="/admin"
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-gray-900"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Panel Administrador
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-gray-900"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/#contact"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider">
                  Contacto
                </Link>
                <Link href="/login"
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg 
                           transition-all duration-200 text-sm uppercase tracking-wider">
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-sm rounded-lg mt-2">
              <Link href="/#about"
                className="block px-3 py-2 text-gray-300 hover:text-green-400"
                onClick={() => setIsMenuOpen(false)}>
                Nosotros
              </Link>
              <Link href="/#reprocann"
                className="block px-3 py-2 text-gray-300 hover:text-green-400"
                onClick={() => setIsMenuOpen(false)}>
                Reprocann
              </Link>
              <Link href="/geneticas"
                className="block px-3 py-2 text-gray-300 hover:text-green-400"
                onClick={() => setIsMenuOpen(false)}>
                Genéticas
              </Link>
              
              {session ? (
                <>
                  <Link href="/perfil"
                    className="block px-3 py-2 text-gray-300 hover:text-green-400"
                    onClick={() => setIsMenuOpen(false)}>
                    Perfil
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link href="/admin"
                      className="block px-3 py-2 text-gray-300 hover:text-green-400"
                      onClick={() => setIsMenuOpen(false)}>
                      Panel Administrador
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-400">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/#contact"
                    className="block px-3 py-2 text-gray-300 hover:text-green-400"
                    onClick={() => setIsMenuOpen(false)}>
                    Contacto
                  </Link>
                  <Link href="/login"
                    className="block px-3 py-2 text-green-400 hover:text-green-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}>
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 