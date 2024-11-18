'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Cart from '@/components/Cart';

export default function Navbar() {
  const { data: session } = useSession();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <nav className="bg-green-800 text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              FANTASEEDS
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/#contact" className="hover:bg-green-700 px-3 py-2 rounded-md">
              Contacto
            </Link>
            {session && (
              <>
                <Link href="/geneticas" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Genéticas
                </Link>
                <Link href="/perfil" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md">
                  Mi Perfil
                </Link>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative hover:bg-green-700 px-3 py-2 rounded-md"
                >
                  <span className="sr-only">Carrito</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.length}
                    </span>
                  )}
                </button>
              </>
            )}
            {session?.user?.rol === 'administrador' && (
              <Link href="/admin" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md">
                Panel Admin
              </Link>
            )}
            {session ? (
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md"
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link href="/login" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md">
                Iniciar Sesión
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-green-700"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/#contact"
                className="block hover:bg-green-700 px-3 py-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              {session && (
                <>
                  <Link
                    href="/geneticas"
                    className="block hover:bg-green-700 px-3 py-2 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Genéticas
                  </Link>
                  <Link
                    href="/perfil"
                    className="block hover:bg-green-700 px-3 py-2 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left hover:bg-green-700 px-3 py-2 rounded-md"
                  >
                    Carrito {cart.length > 0 && `(${cart.length})`}
                  </button>
                </>
              )}
              {session?.user?.rol === 'administrador' && (
                <Link
                  href="/admin"
                  className="block hover:bg-green-700 px-3 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Panel Admin
                </Link>
              )}
              {session ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left hover:bg-green-700 px-3 py-2 rounded-md text-red-400"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block hover:bg-green-700 px-3 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      {isCartOpen && (
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
      )}
    </nav>
  );
} 