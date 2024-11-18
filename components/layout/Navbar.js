'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Cart from '@/components/Cart';
import { FiShoppingCart, FiX, FiMenu } from 'react-icons/fi';

export default function Navbar() {
  const { data: session } = useSession();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();

  const cartItemsCount = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <nav className="fixed w-full bg-green-800 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-bold text-xl">
              FANTASEEDS
            </Link>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            {session && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-white hover:text-green-200 transition-colors relative"
              >
                <FiShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-green-200 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
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
                  className="text-white hover:text-green-200 transition-colors relative"
                >
                  <FiShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
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